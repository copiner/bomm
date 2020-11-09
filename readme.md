### 移动端布局方法

### vw+rem进行移动端布局  

设计图以6s为标准，2倍尺寸，宽度750px

1、

<meta name="viewport" content="width=device-width, initial-scale=2.0, maximum-scale=2.0, minimum-scale=2.0, user-scalable=no">

2、

html {
    font-size: 13.3333333333333vw // 100px  1rem
}


### 13.3333333333333vw怎么来

vw : 相对于视口的宽度，视口被均分为100单位的vw

设计图以6s为标准，2倍尺寸，宽度750px

如果 100vw  相当于 750px  那么 100px 相当于多少vw

100vw/750px = x/100px  得出x = 13.3333333333333vw

得出100px  相当于 13.3333333333333vw

然后设置根元素font-size 为 13.3333333333333vw

最终于得出 100px = 1rem

通过这样子换算我们利用vw把rem转换成了以100px为基准


### 使用
```css
div {

     // width: 100px;
     width: 1rem;
}

span {
   // height: 12px
    height: .12rem
}
```


###  工具
postcss-pxtorem  直接换算px为rem

或者借助 sass 换算px为rem


#### 或者通过media进行移动端布局
