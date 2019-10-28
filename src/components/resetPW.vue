<template>
  <div>

    <header class="mui-bar mui-bar-nav">
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
      <h1 class="mui-title">设置新密码</h1>
    </header>
    <div class="mui-content">
      <form class="mui-input-group">
        <div class="mui-input-row">
          <label>密码</label>
          <input id='password' @change="checkPassword" v-model="password" type="password" class="mui-input-clear mui-input"
            placeholder="请输入密码">
        </div>
        <div class="mui-input-row">
          <label>确认</label>
          <input id='password_confirm' @change="pwIsSame" v-model="password_confirm" type="password" class="mui-input-clear mui-input"
            placeholder="请确认密码">
        </div>
      </form>
      <div class="mui-content-padded">
        <button id='reset' @click="resetPW" class="mui-btn mui-btn-block mui-btn-primary">确定</button>
      </div>
    </div>


  </div>


</template>

<script>
  export default {
    name: 'resetPW',
    data() {
      return {
        password: '',
        password_confirm: '',
        userInfo: {},
        email: ''
      }
    },
    methods: {
      getUserInfo: function() {
          var that = this
          this.$http({
            url: "/user/getAllUser",
            method: 'put',
            data: {
              model: {
                "email": that.email
              },
              orderParams: [],
              pageNum: 0,
              pageSize: 5
            }
            // headers: {
            //   "ticket": that.$getCookie('token')
            // }
          }).then(function(res) {
            console.log(res.data.content.list[0])
            that.userInfo = res.data.content.list[0]
          }).catch(function(err) {
            that.$mui.toast('获取用户信息失败')
            console.log(err)
          })
      },
      checkPassword: function() {
        // 判断密码格式是否正确，密码必须是包含数字和字母的8到16位
        var checkpw = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$/
        if (!checkpw.test(this.password)) {
          this.$mui.alert('密码必须是包含数字和字母的8到16位')
          return false
        }
        return true
      },
      pwIsSame: function() {
        if (this.password != this.password_confirm) {
          this.$mui.alert('两次密码不相同')
          this.password_confirm = ''
          return false // 不符合时不执行下面操作
        }
        return true
      },
      resetPW: function() {

        // 点击确定时判断是否有空值
        if(this.password==null || this.password==='' || this.password.length==0){
          this.$mui.alert('密码不能为空')
          return
        }
        if(this.password_confirm==null || this.password_confirm==='' || this.password_confirm.length==0){
          this.$mui.alert('请确认密码')
          return
        }

        // 注册时判断密码是否符合，只有符合时才发送ajax请求执行重置密码
        if (this.checkPassword() && this.pwIsSame()) {
          var that = this
          this.$http({
              method: 'put',
              url: '/user/updateUser',
              data: {
                password: that.password,
                id: that.userInfo.id
              }
            }).then(function(res) {
              console.log(res);
              if (res.data.code == 200) {
                that.$mui.toast('修改成功，请登录')
                that.$router.push('/user/login')
              } else {
                that.$mui.alert('修改失败，原因：' + res.data.msg)
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      }
    },
    mounted: function() {
      this.email = this.$route.query.email
      this.getUserInfo()
    }


  }
</script>

<style scoped="scoped">
  @import url("../assets/css/mui.min.css");
  @import url("../assets/css/style.css");
  @import url("../assets/css/reg.css");
</style>
