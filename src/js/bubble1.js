//点击按钮时，按钮内容为true，说明click事件默认可冒泡
var test = document.getElementById('bubbleTest');
test.onclick = function(e){
    test.innerHTML = e.bubbles;//true
}
