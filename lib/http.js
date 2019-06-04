const http=require('http');
const url=require('url');
const querystring=require('querystring');
const fs=require('fs');
const {Form}=require('multiparty');

const {
  HTTP_PORT,
  HTTP_ROOT,
  HTTP_UPLOAD
}=require('../config')

const {findRouter}=require('./router');
const server=http.createServer((req,res)=>{
  const method=req.method
  const {pathname,query}=url.parse(req.url,true)

  if (method==='POST'){
    if(req.headers['content-type'].startsWith('application/x-www-form-urlencoded')){
      let arr=[]
      req.on('data',(buffer)=>{
        arr.push(buffer)
      })
      req.on('end',()=>{
        querystring.parse(arr.split().toString())//将接受到的数据转换为JSON
        processData(method,pathname,query.post,{})
      })
    }else{ //请求文件
      const form=new Form({
        uploadDir:HTTP_UPLOAD
      })
      form.parse(req)
      let post={};
      let files={};
      form.on('field',(name,value)=>{post[name]=value});
      form.on('file',(name,file)=>{files[name]=file});
      form.on('error',error=>console.error(error));
      form.on('close',()=>processData(method,pathname,query,post,files));
    }
  }else{//处理get请求
    processData(method,pathname,query,{},{})
  }

  async function processData(method,pathname,query,post,files){
    const callback=findRouter(method,pathname)

    if(callback){
      try{
        await callback(res,query,post,files)
      }catch(error){
        res.writeHead(500);
        res.write('Internal Server Error');
        res.end();
      }
    }else{
      const filePath=HTTP_ROOT+pathname;
      fs.stat(filePath,(error,stat)=>{
        if(error){
          res.writeHead(404);
          res.write('Not Found');
          res.end();
        }else{
          const readStream=fs.createReadStream(filePath);
          const gz=zlib.createGzip();
          res.setHeader('content-encoding','gzip');
          readStream.pipe(gz).pipe(res);
          readStream.on('error',error=>console.error(error));
        }
      })
    }
  }
})

server.listen(HTTP_PORT);
console.log(`Server started at ${HTTP_PORT}`);