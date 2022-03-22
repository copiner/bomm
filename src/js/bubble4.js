var btn = document.getElementById('bubblebtn1');
btn.onclick = function (e){
    e = e || event;
    e.cancelBubble = true;
    this.innerText = '阻止冒泡';
}
document.body.onclick = function (e){
    alert('冒泡');
}
