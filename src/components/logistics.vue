<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-pull-left" href="javascript:history.back(-1)">
        <</a> <h1 class="mui-title">物流信息</h1>
    </header>
    <ul class="mui-table-view">
      <li v-for="item in logisticsList" class="mui-table-view-cell mui-media">
        <a @click="toLogistics(item)">
          <img class="mui-media-object mui-pull-left" :src="item.productImg">
          <div class="mui-media-body">
            {{item.productName}}
            <p class="mui-ellipsis">
              发货地址：{{item.deliveryAddress}}
              收货地址：{{item.shippingAddress}}
            </p>
          </div>
        </a>
      </li>
      <li style="background-color: red;" class="mui-table-view-cell mui-media">
        清空物流信息
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
        logisticsList: []
      }
    },
    methods: {
      toLogin: function() {
        this.$router.push({
          path: '/login'
        })
      },
      toLogistics:function(logistics){
        this.$router.push({
          path: '/logisticsDetail',
          query: {
            logistics: logistics
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
          that.getLogisticsListByUserId(that.userInfo.id)
        }).catch(function(err) {
          that.$mui.toast('获取用户信息失败')
          console.log(err)
        })
      },
      getLogisticsListByUserId: function(userId) { // 根据用户id拿到用户的物流信息
        var that = this
        this.$http('/logistics/getLogisticsByReceiverId/' + userId).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            this.logisticsList = res.data.content
          }
        }).catch(function(err) {
          console.log(err)
        })
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
            this.getLogisticsListByUserId(this.userInfo.id)
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
