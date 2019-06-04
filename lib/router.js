//创建路由表
let router={
  get:{},
  post:{}
}

function addRouter(method,url,callback){
  method=method.toLowerCase();
  url=url.toLowerCase();
  router[method][url]=callback;
}

function findRouter(method,url){
  method=method.toLowerCase();
  url=url.toLowerCase();

  const callback=router[method][url]||null;
  return callback;
}

module.exports={addRouter,findRouter};