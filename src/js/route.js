class HashRouter{
  constructor(){
    //用于存储不同hash值对应的回调函数
    this.routers = {};
    window.addEventListener('hashchange',this.load.bind(this),false)
  }
  //用于注册每个视图
  register(hash,callback = function(){}){
    this.routers[hash] = callback;
  }
  //用于注册首页
  registerIndex(callback = function(){}){
    this.routers['index'] = callback;
  }
  //用于处理视图未找到的情况
  registerNotFound(callback = function(){}){
    this.routers['404'] = callback;
  }
  //用于处理异常情况
  registerError(callback = function(){}){
    this.routers['error'] = callback;
  }
  //用于调用不同视图的回调函数
  load(){

    let hash = location.hash.slice(1).split("?")[0],
        handler;
    //没有hash 默认为首页
    if(!hash){
      handler = this.routers.index;
    }
    //未找到对应hash值
    else if(!this.routers.hasOwnProperty(hash)){
      handler = this.routers['404'] || function(){};
    }
    else{
      handler = this.routers[hash]
    }
    //执行注册的回调函数
    try{
      handler.apply(this);
    }catch(e){
      //console.error(e);
      (this.routers['error'] || function(){}).call(this,e);
    }
  }
}

//HistoryRouter
class HistoryRouter{
  constructor(){
    //用于存储不同path值对应的回调函数
    this.routers = {};
    this.listenPopState();
    this.listenLink();
  }
  //监听popstate
  listenPopState(){
    window.addEventListener('popstate',(e)=>{
      console.log(e)
      let state = e.state || {},
          path = state.path || '';
      this.dealPathHandler(path)
    },false)
  }
  //全局监听A链接
  listenLink(){
    window.addEventListener('click',(e)=>{
      console.log(e.target)
      let dom = e.target;
      if(dom.tagName.toUpperCase() === 'A' && dom.getAttribute('href')){
        e.preventDefault()
        this.assign(dom.getAttribute('href'));
      }
    },false)
  }
  //用于首次进入页面时调用
  load(){
    let path = location.pathname;
    console.log(path)
    this.dealPathHandler(path)
  }
  //用于注册每个视图
  register(path,callback = function(){}){
    this.routers[path] = callback;
  }
  //用于注册首页
  registerIndex(callback = function(){}){
    this.routers['/'] = callback;
  }
  //用于处理视图未找到的情况
  registerNotFound(callback = function(){}){
    this.routers['404'] = callback;
  }
  //用于处理异常情况
  registerError(callback = function(){}){
    this.routers['error'] = callback;
  }
  //跳转到path
  push(path){
    history.pushState({path},null,path);
    this.dealPathHandler(path)
  }
  //替换为path
  replace(path){
    history.replaceState({path},null,path);
    this.dealPathHandler(path)
  }
  //通用处理 path 调用回调函数
  dealPathHandler(path){
     path = path.split("?")[0]

    let handler;
    //没有对应path
    if(!this.routers.hasOwnProperty(path)){
      handler = this.routers['404'] || function(){};
    }
    //有对应path
    else{
      handler = this.routers[path];
    }
    try{
      handler.call(this)
    }catch(e){
      console.error(e);
      (this.routers['error'] || function(){}).call(this,e);
    }
  }
}


