var box = document.querySelector('.j_box');
var content = document.querySelector('.j_box_con');
document.addEventListener('click', function(e) {
  console.log('document');
}, false);
document.body.addEventListener('click', function(e) {
  console.log('body');
}, false);


box.addEventListener('click', function(e) {
  console.log('box');
}, false);
content.addEventListener('click', function(e) {
  console.log('content');
}, false);

var abc = document.querySelector('.j_abc');

abc.addEventListener('click', function(e) {
  console.log('a');
  e.stopPropagation();//阻止事件冒泡
  e.preventDefault();//阻止默认事件
}, false);

// $(".j_box_con a").on('click',function(e){
//   return false;
// })


/*----------------事件捕获------------------------*/

// document.addEventListener('click', function(e) {
//   console.log('document');
// }, true);
// document.body.addEventListener('click', function(e) {
//   console.log('body');
// }, true);
// box.addEventListener('click', function(e) {
//   console.log('box');
// }, true);
// content.addEventListener('click', function(e) {
//   console.log('content');
// }, true);


var grandFather = document.getElementById('grandFather'),
    father1 = document.getElementById('father1'),
    son1 = document.getElementById('son1'),
    father2 = document.getElementById('father2');

//grandFather.addEventListener('click', function(event){console.log('I am grandFather')},false);
// father1.addEventListener('click', function(event){console.log('I am father1')},false);
// son1.addEventListener('click', function(event){console.log('I am son1')},false);
// father2.addEventListener('click', function(event){console.log('I am father2')},false);

/*
如果在需要有多个DOM事件需要监听的情况下（比如几百条微博点击事件注册），
给每一个DOM都绑定监听函数，对性能会有极大的影响，因此，有一解决方案为事件委托。
*/

grandFather.addEventListener('click', function(e){
    e = e || event;
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
   console.log('I am ' + e.target.getAttribute('data-name'));
},false);
