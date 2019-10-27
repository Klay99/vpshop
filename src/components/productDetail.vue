<template>

  <div style="">
    <!-- <header class="mui-bar mui-bar-nav">
		  <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">商品详情</h1>
		</header> -->
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-pull-left" href="javascript:history.back(-1)">
        <</a> <h1 class="mui-title">商品详情</h1>
    </header>
    <div class="mui-card">
      <img :src="product.productImg" />
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <p align="left" style="color: #000000;" class="realPrice">
            {{product.productName}}
          </p>
          <p align="left" class="realPrice">￥{{product.normalPrice - product.discount - product.killDiscount}}
            <span v-if="product.isInDiscount==2" class="discountLogo">折扣商品</span>
            <span v-if="product.isInKill==2" class="discountLogo">秒杀商品</span>
          </p>
          <p align="left" class="huaxian normalPrice">￥{{product.normalPrice}}</p>
          <p align="left" style="color: #333;">
            {{product.describe}}
          </p>
        </div>
      </div>
      <div class="mui-card-footer">
        <a class="mui-card-link">运费：{{product.freight}}</a>
        <a class="mui-card-link">销量：{{product.orderCount}}</a>
        <a class="mui-card-link">{{product.deliveryAddress}}</a>
      </div>
      <div class="mui-card-footer">
        <a class="mui-card-link">宝贝评论(1999)</a>
        <a class="mui-card-link">></a>
      </div>
    </div>

    <!-- 宝贝评论 -->

    <!-- 按钮组 -->
    <div class="carAndOrder">
      <div @click="addProductToCar" align="center" class="car">加入购物车</div>
      <div @click="updateCreateTime" align="center" class="order">添加到收藏栏</div>
    </div>

  </div>

</template>

<script>
  export default {
    name: 'productDetail',
    data() {
      return {
        product: {},
        proId: '',
        userInfo: {}
      }
    },
    methods: {
      updateCreateTime:function(id){
        var date = new Date()
        this.$http({
          url: "/product/updateProduct",
          method: 'put',
          data: {
            "id": 10,
            "createTime": date
          }
        }).then(res=>{
          console.log(res)
        })
      },
      getProductById: function(id) {
        this.$http('/product/getProductById/' + id).then(res => { // 用=>运算符可以在内部使用this
          console.log(res)
          this.product = res.data.content
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
          console.log(res)
          that.userInfo = res.data.content.list[0]
          console.log(that.userInfo)

        }).catch(function(err) {
          that.$mui.toast('获取用户信息失败')
          console.log(err)
        })
      },
      addProductToCar: function() {

        var productId = this.product.id // 将商品id保存，下面删除shoppingCarData对象id时会影响到product对象
        var shoppingCarData = this.product // 新建一个商品对象
        console.log(productId)
        // 删除id和创建时间，添加时数据库会自动生成
        delete shoppingCarData.id
        delete shoppingCarData.createTime
        // 加上用户id和商品id
        console.log('$userInfo.id:' + this.$userInfo.id)
        console.log('$userInfo:' + this.$userInfo)

        console.log('userId:' + this.userInfo.id)
        shoppingCarData.userId = this.userInfo.id
        shoppingCarData.productId = this.proId
        console.log(shoppingCarData)
        this.$http.post('/shoppingCar/addShoppingCar', shoppingCarData).then(res => {
          console.log(res)
          if (res.data.code == 200) {
            this.$mui.toast('购车添加成功')
          } else {
            this.$mui.toast('添加失败')
          }

        })
      }
    },
    mounted: function() {
      if (typeof(this.$userInfo.id) == 'undefined') { // 当用户信息为空时，再查询一遍用户
        this.getUserInfo()
      } else {
        this.userInfo = this.$userInfo
      }
      this.getProductById(this.$route.query.id)
      this.proId = this.$route.query.id
    }

  }
</script>

<style scoped="scoped">
  @import url("../assets/css/mui.min.css");
  @import url("../assets/css/app.css");

  .huaxian {
    text-decoration: line-through;
  }

  .normalPrice {
    color: darkgray;
  }

  .realPrice {
    color: orangered;
    font-size: 20px;
    font-weight: bold;
  }

  .discountLogo {
    font-size: 10px;
    padding-left: 10px;
    padding-right: 10px;
    /* border: 2px solid inherit; */
    border-radius: 14px;
    background-color: moccasin;
  }

  .mui-card {
    margin: 0px;
    background-color: inherit;
    border: 0px solid;
    box-shadow: none;
  }

  .mui-card img {
    width: 100%;
  }

  .mui-card-footer a {
    color: darkgray;
  }

  /* 按钮组样式  */
  .carAndOrder {
    width: 100%;
    position: fixed;
    bottom: 0px;
    height: 50px;
    font-size: 17px;
    color: white;
    line-height: 47px;
    /* border: 1px solid #888888; */
    /* border-radius: 30px; */
  }

  .car {
    height: 100%;
    width: 50%;
    background-color: orange;
    float: left;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }

  .order {
    height: 100%;
    width: 50%;
    background-color: orangered;
    float: right;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  }
</style>
