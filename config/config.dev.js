const path = require('path')

module.exports = {
  // 数据库配置
  DB_HOST: '127.0.0.1',
  DB_PORT: 3306,
  DB_USER: 'root',
  DB_PASS: 'root',
  DB_NAME: 'test',

  // HTTP端口
  HTTP_PORT: 8080,
  // 静态文件绝对路径
  HTTP_ROOT: path.resolve(__dirname, '../static/'),
  HTTP_UPLOAD: path.resolve(__dirname, '../static/upload')
}