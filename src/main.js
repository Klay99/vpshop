// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import mui from '../static/mui/js/mui.min.js'
import '../static/mui/css/mui.min.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:9090'
Vue.prototype.$http = axios
Vue.prototype.$mui = mui
// 添加全局用户信息
Vue.prototype.$userInfo = {}

Vue.prototype.$getCookie = function(name) {
  //console.log(name)
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  //console.log(arr)
  if (arr != null) return unescape(arr[2]);
  return null;
}
Vue.prototype.$setCookie = function(name, value) {
  //此 cookie 将被保存 1 小时
  var hour = 1;
  var exp = new Date();
  exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";expires=" + exp.toGMTString();
}
Vue.prototype.$deleteCookie = function(name) {
  //console.log(document.cookie.length)
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = this.$getCookie(name); // 这是cookie的值
  // var adss = this.$getCookie(address);
  if (cval != null) {
    // 这里删除操作其实是将expires过期时间设置为当前时间，使cookie立即过期
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    // document.cookie = address + "=" + adss + ";expires=" + exp.toGMTString();
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
