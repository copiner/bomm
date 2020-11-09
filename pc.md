### 做一个PC端的网页,设计图是1920X1080的. 要在常见屏上显示正常(比例正确可) 1280X720 1366X768 1440X900 1920X1080

当浏览器窗口变化时,内容的大小以及相对位置也会相应变化,这个依靠JS修改HTML的FONT-SIZE值实现.如下:
```javascript
$(window).resize(function (){// 绑定到窗口的这个事件中

  let designSize = 1920; // 设计图尺寸

  let html = document.documentElement;

  let wW = html.clientWidth;// 窗口宽度
  let rem = wW * 100 / designSize;

  document.documentElement.style.fontSize = rem + 'px';
});


```

计算font-size的逻辑是

```
当设计图是1920时,规定HTML的FONT-SIZE的值是100.
也就是,当浏览器窗口调整到1920PX时,1REM=100PX,如果要设定一个160PX(1920设计图时)的margin-top,那么REM设置值是1.6rem.

当窗口调整到非设计图的宽度如winWidth时,HTML的FONT-SIZE值是:(100/1920)*winWidth.也就是说,1920下FONT-SIZE是100px.那么winWidth下,按比例计算.

 或者可以这样:窗口宽1920时,FONT-SIZE是100PX,那么winWidth时,相当于窗口变化为1920时的 (winWidth / 1920).根据比例公式,winWidth时的FONT-SIZE就是(winWidth/1920)*100

winWidth / 1920 = FONT-SIZE(PX) / 100

100 / 1920 = FONT-SIZE(PX) / winWidth 这个公式容易理解

如果调整窗口大小,会发现HTML的FONT-SIZE值在变化,同时,使用REM设置的DOM也在变化.因为REM正是参考HTML的FONT-SIZE值来计算的
```

### 关于字体大小

平板和PC针对不同的屏幕做媒体查询
```

@media (max-width: 320px)

{
    font-size: 12px;
}

@media (min-width: 321px)

{
    font-size: 14px;
}
```

### css设置小于12像素的字体

```

.class{

transform: scale(0.5);//并不是真的小于12像素，只是在原来的基础上进行缩小了

}
```
