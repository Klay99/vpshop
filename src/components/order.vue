<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-pull-left" href="javascript:history.back(-1)">
        <</a> <h1 class="mui-title">你的订单</h1>
    </header>
    <ul class="mui-table-view">
      <li v-for="item in orderHeadList" class="mui-table-view-cell mui-media">
        <a @click="toOrderDetail(item.id)">
          <img class="mui-media-object mui-pull-left" :src="item.firstProductImg">
          <div class="mui-media-body mui-pull-left">
            下单时间
            <p class="mui-ellipsis">{{item.createTime | dateTrans}}</p>
          </div>
          <div class="mui-media-body mui-pull-right">
            <p v-if="item.status=='waitForPay'" class="mui-ellipsis">待支付</p>
            <a v-if="item.status=='waitForPay'">去支付</a>
          </div>
        </a>
      </li>
      <li style="background-color: red;" class="mui-table-view-cell mui-media">
        清空订单
      </li>
    </ul>


  </div>

</template>

<script>
  export default {
    name: '',
    data() {
      return {
        userInfo: {},
        orderHeadList: []
      }
    },
    methods: {
      toOrderDetail: function(orderHeadId) {
        this.$router.push({
          path: '/orderDetail',
          query: {
            orderHeadId: orderHeadId
          }
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
            orderParams: [

            ],
            pageNum: 0,
            pageSize: 5
          }
        }).then(function(res) {
          console.log(res.data.content.list[0])
          that.userInfo = res.data.content.list[0]
          that.getOrderHeadsByUserId(that.userInfo.id)
        }).catch(function(err) {
          that.$mui.toast('获取用户信息失败')
          console.log(err)
        })
      },
      getOrderHeadsByUserId: function(userId) {
        this.$http({
          method: 'put',
          url: '/orderHead/getAllOrderHead',
          data: {
            model: {
              userId: userId
            },
            orderParams: [
              'createTime desc'
            ],
            pageNum: 0,
            pageSize: 10
          }
        }).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            this.orderHeadList = res.data.content.list
          } else {

          }
        }).catch(function(err) {
          console.log(err)
        })
      }
    },
    filters: { // 过滤器
      dateTrans: function(val) {
        var date = new Date(val)
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '  ' + date.getHours() + ':' +
          date.getMinutes() + ':' + date.getSeconds()
      }
    },
    mounted: function() {
      if (this.$getCookie('username') != null && this.$getCookie('username') != '' && this.$getCookie('username').length !=
        0) {
        if (typeof(this.$userInfo.id) == 'undefined') { // 当用户信息为空时，再查询一遍用户
          this.getUserInfo()
        } else {
          this.userInfo = this.$userInfo
          console.log(this.userInfo)
          this.getOrderHeadsByUserId(this.userInfo.id)
        }
      } else {
        this.$router.push('/user/login')
      }
    }
  }
</script>

<style scoped="scoped">
  @import url("../assets/css/mui.min.css");
  @import url("../assets/css/app.css");
</style>
