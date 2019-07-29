<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-pull-left" href="javascript:history.back(-1)">
        <</a> <h1 class="mui-title">订单详情</h1>
    </header>
    <ul class="mui-table-view">
      <li v-for="item in orderDetailList" class="mui-table-view-cell mui-media">
        <a href="javascript:;">
          <img class="mui-media-object mui-pull-left" :src="item.productImg">
          <div class="mui-media-body">
            {{item.productName}}
            <p class="mui-ellipsis">商品单价:{{item.paymentPrice}}</p>
            <p class="mui-ellipsis">商品数量:{{item.productNum}}</p>
          </div>
        </a>
      </li>
    </ul>


  </div>

</template>

<script>
  export default {
    name: '',
    data() {
      return {
        orderDetailList:[]
      }
    },
    methods: {
      toLogin: function() {
        this.$router.push({
          path: '/login'
        })
      },
      getOrderDeatilsByOrderHeadId: function(orderHeadId) {
        this.$http({
          method: 'put',
          url: '/orderDetail/getAllOrderDetail',
          data: {
            model: {
              orderHeadId: orderHeadId
            },
            orderParams: [
              'createTime desc'
            ],
            pageNum: 0,
            pageSize: 5
          }
        }).then(res=>{
          console.log(res)
          if(res.data.code==200){
            this.orderDetailList = res.data.content.list
          }
        })
      }
    },
    mounted: function() {
      console.log(this.$route.query.orderHeadId)
      this.getOrderDeatilsByOrderHeadId(this.$route.query.orderHeadId)
    }

  }
</script>

<style scoped="scoped">
  @import url("../assets/css/mui.min.css");
  @import url("../assets/css/app.css");
</style>
