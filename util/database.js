// //10.1 Connecting mysql data base

// const mysql =require('mysql2')

// const pool = mysql.createPool({         //10.1 Create pool of connections
//     host:'localhost'
//     , user: 'root',
//     database:'node-complete',
//     password:'darsh123'
// })       

// module.exports=pool.promise()   //10.1 exported database


//11.1 Setting up sequelize
const Sequelize = require('sequelize')      //Created a constructor function 

const sequelize = new Sequelize('node-complete','root','darsh123',{     //created a sequelize enviroment that includes database pool connection
    dialect:'mysql',
    host:'localhost'
    })

module.exports = sequelize