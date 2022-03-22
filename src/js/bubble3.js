var btn = document.getElementById('bubblebtn');
btn.onclick = function (e){
    e = e || event;
    e.stopPropagation();
    this.innerText = '阻止冒泡';
}
document.body.onclick = function (e){
    alert('冒泡');//使用stopIPropagation()，该函数不执行
}
