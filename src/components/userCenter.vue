<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-pull-left" href="javascript:history.back(-1)">
        <</a> <a style="font-size: 0.9375rem;line-height: 1.5625rem;" class="mui-icon mui-pull-right" @click="toEditUser()">编辑
      </a>
      <h1 class="mui-title">个人中心</h1>
    </header>
    <ul class="mui-table-view">
      <li class="mui-table-view-cell mui-media">
        <a href="javascript:;">
          <img v-if="userInfo.headImg==''" class="mui-media-object mui-pull-left" src="../../build/logo.png">
          <img v-if="userInfo.headImg!=''" class="mui-media-object mui-pull-left" :src="userInfo.headImg">
          <div class="mui-media-body">

            <p class='mui-ellipsis'>{{userInfo.username}}</p>
          </div>
        </a>
      </li>
    </ul>
    <ul class="mui-table-view">
      <li class="mui-table-view-cell">
        <a class="">
          用户名：{{userInfo.username}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          密码：{{userInfo.password | castToPass}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          邮箱：{{userInfo.email}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          收货地址：{{userInfo.deliveryAddress}}
        </a>
      </li>
      <li @click="toOrder" class="mui-table-view-cell">
        <a class="">
          你的订单
        </a>
      </li>
    </ul>
    <button @click="logout" type="button" class="mui-btn-block mui-btn mui-btn-blue">安全退出</button>

  </div>

</template>

<script>
  export default {
    name: '',
    data() {
      return {
        userInfo: {}
      }
    },
    methods: {
      toEditUser: function() {
        this.$router.push({
          name: 'userEdit',
          params: {
            "userInfo": this.userInfo
          }
        })
      },
      toOrder: function() {
        this.$router.push({
          path: '/order'
        })
      },
      getUserInfo: function() {
        var that = this
        this.$http({
          url: "/user/getAllUser",
          method: 'put',
          data: {
            model: {
              "username": that.$getCookie('username')
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
      getUserById: function(id) {
        this.$http('/user/getUserById/' + id).then(res => {
          this.userInfo = res.data.content
        }).catch(err =>{
          this.$mui.toast('获取用户信息失败')
          console.log(err)
        })
      },
      logout: function() {
        // this.$deleteCookie('token')
        this.$deleteCookie('username')
        this.$mui.toast('安全退出')
        this.$router.push('/')
      }
    },
    filters: {
      castToPass: function(value) {
        var len = value.length
        var res = ''
        for (var i = 0; i < len; i++) {
          res += '*'
        }
        return res
      }
    },
    mounted: function() {
      console.log(this.$getCookie('username'))
      if (this.$getCookie('username') != null && this.$getCookie('username') != '' && this.$getCookie('username').length !=
        0) {
        this.getUserInfo()
      } else {
        var id = this.$route.params.id
        var username = this.$route.params.username
        if(id != null && username != null) {
          this.getUserById(id)
          this.$setCookie('username', username)
        } else{
          this.$router.push('/user/login')
        }
      }
    }

  }
</script>

<style scoped="scoped">
  @import url("../assets/css/mui.min.css");
  @import url("../assets/css/app.css");
</style>
