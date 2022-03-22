var btn = document.getElementById('bubblebtn2');
// 可以阻止冒泡,但无法阻止同一事件的其他监听函数被调用
btn.addEventListener('click',function (e){
   e = e || event;
   e.stopPropagation()
   this.innerHTML = '修改了';
})
btn.addEventListener('click',function (e){
   e = e || event;
   this.style.backgroundColor = 'lightblue';　　　　//使用stopIPropagation()，该函数还会执行
})
document.body.addEventListener('click',function (){
   alert('body');　　　　　　　　　　　　　　　　　　　　　　//使用stopIPropagation()，该函数不执行
})
