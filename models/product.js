//11.2
const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Product = sequelize.define('product', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull:false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price:{
    type: Sequelize.DATE,
    allowNull:false
  },
  imageUrl:{
    type:Sequelize.STRING,
    allowNull:false
  },
  description:{
    type:Sequelize.STRING,
    allowNull:false
  }
});

module.exports = Product


// // const fs = require('fs');
// // const path = require('path');

// const db =require('../util/database')     //10.3

// const Cart = require('./cart');

// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   'data',
// //   'products.json'
// // );

// // const getProductsFromFile = cb => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute('INSERT INTO products (title,price,imageUrl,description) VALUES (?,?,?,?)',      //10.5
//     [this.title,this.price,this.imageUrl,this.description])
//     // getProductsFromFile(products => {
//     //   if (this.id) {
//     //     const existingProductIndex = products.findIndex(
//     //       prod => prod.id === this.id
//     //     );
//     //     const updatedProducts = [...products];
//     //     updatedProducts[existingProductIndex] = this;
//     //     fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//     //       console.log(err);
//     //     });
//     //   } else {
//     //     this.id = Math.random().toString();
//     //     products.push(this);
//     //     fs.writeFile(p, JSON.stringify(products), err => {
//     //       console.log(err);
//     //     });
//     //   }
//     // });
//   }

//   static deleteById(id) {
//     // getProductsFromFile(products => {
//     //   const product = products.find(prod => prod.id === id);
//     //   const updatedProducts = products.filter(prod => prod.id !== id);
//     //   fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//     //     if (!err) {
//     //       Cart.deleteProduct(id, product.price);
//     //     }
//     //   });
//     // });
//   }

//   static fetchAll() {
//     return db.execute('SELECT * FROM products')    //10.3 Select everything na dneed to return the promise to gt the value in controller where we use this mthod
//     // getProductsFromFile(cb);
//   }

//   static findById(id) {
//     return db.execute('SELECT * FROM products WHERE products.id = ?',[id])      //10.6
//   //   getProductsFromFile(products => {
//   //     const product = products.find(p => p.id === id);
//   //     cb(product);
//   //   });
//   // }
//   };
// }
