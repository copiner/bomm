
  //滚动时，div内容变成false，说明scroll事件默认不可冒泡
  var box = document.getElementById('bubblebox');
  box.onscroll = function(e){
      test.innerHTML = e.bubbles;//false
  }
