const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize = require('./util/database')       //10.1/11.3 imported database

const Product = require('./models/product')      //11.11 Imported User and product model

const User = require('./models/user')           //11.11 Imported User and product model

const Cart = require('./models/cart')           //11.14

const CartItem = require('./models/cart-tems')  //11.14

const Order = require('./models/order')         //11.17

const OrderItem =require('./models/order-item')     //11.17

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// db.execute('SELECT * FROM products')        //10.2 write sql query to fetch data from a products table created by us
// .then((result)=>{console.log(result[0])})      //10.2 we imported a promise, which return an array of our data and meta data, so we fetch data present at index 0
// .catch(err=>console.log(err))     


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{           //11.11 For incoming request will only trigger this middleware, i.e. after app.listen, so we can use it above before app.listen in file
    User.findByPk(1)
    .then(user=>{
        req.user=user
        next()
    })
    .catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'})             //11.11 Associations and Relations
User.hasMany(Product)                                 //11.11 Associations and Relations in Sequelize using userid as foriegn key of products table

User.hasOne(Cart)                               //11.14
Cart.belongsTo(User)                            //11.14

Cart.belongsToMany(Product, {through:CartItem})     //11.14  Many to Many relations
Product.belongsToMany(Cart, {through:CartItem})     //11.14

Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product,{through:OrderItem})

// sequelize.sync({force:true})      //11.11 force will ovrwrite existing table        //11.3 look at all models we defined and create tables, if not already exists, and relations for them 
sequelize.sync() 
.then(result=>{
    // console.log(result);
    // console.log('Created product')
    return User.findByPk(1)             //Implementing user model
    // app.listen(3000);       //11.3 WE only want to start the server if theres no error
})
.then(user=>{
    if(!user){
      return  User.create({name:'Max',email:'test@test.com'})
    }
    return Promise.resolve(user)
})
.then(user=>{
    // console.log(user)
    return user.createCart()
    
})
.then(app.listen(3000))
.catch(err=>console.log(err))

// app.listen(3000);


//Steps:
// npm init on terminal
// added "start":"node app.js" script to package.json file
// "npm start" on terminal, if other than "start" script, then e.g."npm run start-server" on terminal
// npm install nodemon --save-dev on terminal
// Note: just running npm install will install all packages in package.json file
// Note: package-lock.json shows the current version of all packages running the program
// changed "start":"nodemon app.js" script to package.json file
// npm install --save express, installed express
// npm install --save body-parser 

//npm install --save mysql2
//npm install --save sequelize