<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-pull-left" href="javascript:history.back(-1)"><</a>
      <h1 class="mui-title">物流详情</h1>
    </header>
    <ul class="mui-table-view">
      <li class="mui-table-view-cell mui-media">
        <a @click="toProductDetail(logistics.productId)">
          <img v-if="logistics.productImg==''" class="mui-media-object mui-pull-left" src="../../build/logo.png">
          <img v-if="logistics.productImg!=''" width="80%" height="80%" :src="logistics.productImg">
          <div class="mui-media-body">{{logistics.productName}}
          </div>
        </a>
      </li>
    </ul>
    <ul class="mui-table-view">
      <li class="mui-table-view-cell">
        <a class="">
          商品名：{{logistics.productName}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          订单号：{{logistics.orderId}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          发货地址：{{logistics.deliveryAddress}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          收货地址：{{logistics.shippingAddress}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          收货人：{{logistics.receiverName}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          发货时间：{{logistics.deliveryTime | dateTrans}}
        </a>
      </li>
      <li class="mui-table-view-cell">
        <a class="">
          商品数量：{{logistics.productNum}}
        </a>
      </li>
    </ul>
    <!-- <button type="button" class="mui-btn-block mui-btn mui-btn-blue">安全退出</button> -->

  </div>

</template>

<script>
  export default {
    name: '',
    data() {
      return {
        logistics: {}
      }
    },
    methods: {
      toProductDetail: function(productId) {
        this.$router.push({
          path: '/productDetail',
          query: {
            id: productId
          }
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
      console.log(this.$route.query.logistics)
      this.logistics = this.$route.query.logistics
      console.log(this.logistics.productId)
    }

  }
</script>

<style scoped="scoped">
  @import url("../assets/css/mui.min.css");
  @import url("../assets/css/app.css");
</style>
