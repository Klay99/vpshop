<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">身份认证</h1>
    </header>
    <div class="mui-content">
      <form class="mui-input-group">
        <div class="mui-input-row">
          <label>校验码</label>
          <input id='authCode' v-model="authCode" type="text" class="mui-input-clear mui-input"
            placeholder="请输入校验码">
        </div>
      </form>
      <div class="mui-content-padded">
        <button id='authentication' @click="authentication" class="mui-btn mui-btn-block mui-btn-primary">确定</button>
      </div>
    </div>


  </div>


</template>

<script>
  export default {
    name: 'authentication',
    data() {
      return {
        authCode: ''
      }
    },
    methods: {
      authentication: function() {
        var that = this
        if(that.authCode == that.$route.query.authCode) {
          that.$router.push({
            path: '/user/resetPW',
            query: {
              authCode: that.$route.query.authCode,
              email: that.$route.query.email
            }
          })
          that.$mui.toast('验证通过')
        } else {
          that.$mui.toast('验证失败！')
        }
      }
    }


  }
</script>

<style scoped="scoped">
  @import url("../assets/css/mui.min.css");
  @import url("../assets/css/style.css");
  @import url("../assets/css/reg.css");
</style>
