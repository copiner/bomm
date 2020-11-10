const Util = {

  /**
   * 获取url的参数值
   * @parm key url的参数key值
   * @date 2018/05/10
   */
  getUrlSearch : function (key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },

  /**
   * @author wds
   * 获取32位uuid
   */
  getUuid : function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23];
    var uuid = s.join("");
    return uuid;
  },

  url2url : function(url){
    if(url.indexOf('?') > 0){
      url+='&random='+Math.random();
    } else {
      url+='?random='+Math.random();
    }
    window.location.href = url;
  },

  // 提示信息
  timer:null,
  showMessage:function(message){
    if(Util.timer){
        clearTimeout(Util.timer)
    }
    $("body").attr("data-msg",message).addClass("error-tip");
    Util.timer = setTimeout(function(){
        $("body").removeClass("error-tip")
    },5000)
  },

};

module.exports = Util;
