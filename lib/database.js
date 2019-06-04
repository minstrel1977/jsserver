// 引入mysql和co-mysql，用于连接数据库
const mysql = require('mysql')
// const conf1=require('../config')
// console.log(conf1);
// 引入数据库配置
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME
} = require('../config');

// 1. 创建服务器连接池
// console.log(DB_HOST,  DB_PORT,  DB_USER,  DB_PASS,  DB_NAME);
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
})

let query = function( sql, values ) {
  return new Promise((resolve,reject)=>{
    pool.getConnection(function(err,connection){
      if(err){
        return reject(err);
      }else{
        connection.query(sql,values,(err2,rows)=>{
          connection.release();
          if(err2){
            return reject(err2);
          }else{
            return resolve(rows);
          }          
        })
      }
    })
  });
}

module.exports =  query