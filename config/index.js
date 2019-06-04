const process=require('process');
const mode=process.env.OS==='Windows_NT'?'env':'prod';
// console.log(process.env.OS);

module.exports={
  mode,
  // 这里我很疑惑非iterable接口的对象不是不能...解构吗，下面这个为什么能行？
  ...(mode === 'env' ? require('./config.dev') : require('./config.prod')) 
}