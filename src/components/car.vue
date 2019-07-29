<template>

  <div>
    <header class="mui-bar mui-bar-nav">
      <a class="mui-icon mui-pull-left" href="javascript:history.back(-1)">
        <</a> <h1 class="mui-title">购物车</h1>
    </header>

    <ul class="carProList">
      <li v-for="item in shoppingProdList" class="carProduct mui-table-view-cell">

        <div @click="removeCarProductById(item.id)" class="mui-slider-right mui-disabled">
          <a class="mui-btn mui-btn-red">删除</a>
        </div>

        <div class="mui-slider-handle">
          <input @change="calTotalPrice()" type="checkbox" v-model="checkedProdList" :value="item.id" />
          <img :src="item.productImg" />
          <div class="proInfoAndOption">
            <ul>
              <li class="name">{{item.productName}}</li>
              <li style="overflow: hidden;" :title="item.describe" class="miaoshu">{{item.describe}}</li>
              <li class="opt">
                <span v-if="item.isInDiscount==1 && item.isInKill==1" class="left">￥{{item.normalPrice}}</span>
                <span v-if="item.isInDiscount!=1 && item.isInKill!=1" class="left">￥{{item.normalPrice-item.killDiscount-item.discount}}</span>
                <span v-if="item.isInDiscount!=1 && item.isInKill==1" class="left">￥{{item.normalPrice-item.discount}}</span>
                <span v-if="item.isInDiscount==1 && item.isInKill!=1" class="left">￥{{item.normalPrice-item.killDiscount}}</span>
                <span class="right">
                  <span @click="minus(item)">-</span>
                  <span>{{item.productNum}}</span>
                  <span @click="plus(item)">+</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </li>

      <!-- 购物车为空 -->
      <div v-if="shoppingProdList.length==0" class="carEmpty" style="margin-top: 50%;">
        <p>购物车竟然是空的</p>
        <p>在忙，也要记得买点什么犒赏自己~</p>
        <span @click="$router.push('/category')" style="border: 1px solid gray;padding: 7px;border-radius: 5px;">去逛逛</span>
      </div>
    </ul>


    <!-- 推荐商品 -->
    <h5 v-show="shoppingProdList.length==0" style="background-color:#efeff4;color: orangered;margin-top: 20%;">>>你可能喜欢<<</h5>
        <ul v-show="shoppingProdList.length==0" id="tuijian" class="mui-table-view mui-grid-view tuijian" style="margin-bottom: 20%;">
        <li @click="toProductDetail(item.id)" v-for="item in productListByOrderCount" id="tuijianPro" class="mui-table-view-cell mui-media mui-col-xs-6">
          <a>
            <img class="mui-media-object" :src="item.productImg">
            <div align="left" class="mui-media-body">{{item.productName}}</div>
            <div align="left" class="mui-media-body">{{item.describe}}</div>
            <div align="left" class="mui-media-body"><span style="color: orangered;">￥{{item.normalPrice}}</span>&nbsp&nbsp&nbsp销量:{{item.orderCount}}</div>
          </a></li>
        </ul>

        </ul>


        <div class="calBanner">
          <span class="left">
            <input type="checkbox" @change="checkAll" /><span>全选</span>
          </span>
          <span @click="toPay" class="right2">
            结算({{checkedProdList.length}})
          </span>
          <span class="right1">
            合计：<span style="color: orangered;font-weight: bold;">￥{{totalPrice}}</span>
          </span>

        </div>

  </div>

</template>

<script>
  export default {
    name: '',
    data() {
      return {
        shoppingProdList: [], // 购物车商品列表
        checkedProdList: [], // 复选框列表
        totalPrice: 0, // 总计
        productListByOrderCount: [] // 热销商品
      }
    },
    methods: {
      toProductDetail: function(productId) { // 跳转到商品详情页面
        console.log('productId:' + productId)
        this.$router.push({
          path: '/productDetail',
          query: {
            id: productId
          }
        })
      },
      getProductByOrderCount: function() { // 拿到热销商品
        console.log('execute order count')
        var that = this
        //获取热销商品
        this.$http({
          url: "/product/getAllProduct",
          method: 'put',
          data: {
            model: {

            },
            orderParams: [
              'orderCount desc'
            ],
            pageNum: 0,
            pageSize: 8
          }

        }).then(function(res) {
          console.log(res)
          that.productListByOrderCount = res.data.content.list
        }).catch(function(err) {
          that.$mui.toast('获取商品列表信息失败')
          console.log(err)
        })
      },
      getShoppingProdListByUserId: function(userid) { // 根据用户id拿到用户的购物车信息
        var that = this
        this.$http({
            method: 'put',
            url: '/shoppingCar/getAllShoppingCar',
            data: {
              model: {
                userId: userid
              },
              orderParams: [
                'createTime desc'
              ],
              pageNum: 0,
              pageSize: 5
            }
          }).then(function(res) {
            console.log(res);
            if (res.data.code == 200) {
              that.shoppingProdList = res.data.content.list
              console.log(that.shoppingProdList)
              if (that.shoppingProdList.length == 0) { // 如果查询到的购物车为空，显示热销商品
                that.getProductByOrderCount()
              }
            } else {
              that.$mui.toast('获取购物车信息失败')
            }
          })
          .catch(function(error) {
            console.log(error)
          });
      },
      checkAll: function() { // 实现全选
        var that = this

        if (this.checkedProdList.length == this.shoppingProdList.length) { // 当已全选时（已选复选框个数==商品个数）
          that.checkedProdList = [] // 实现反选，将复选框列表致空
        } else { // 当没有全选时
          that.checkedProdList = [] // 先将复选框列表致空
          // 再将所有的复选框选中，将所有商品的id加到复选框列表中
          that.shoppingProdList.forEach(function(item) { // 遍历商品列表
            that.checkedProdList.push(item.id) // 添加商品id到复选框列表
          })
        }
        this.calTotalPrice() // 计算总价
      },
      minus: function(item) {
        if (item.productNum > 1) { // 商品数量不能小于1，当商品大于一时减一
          item.productNum--
        }
        // 判断商品是否被选中，被选中时加到总计
        var that = this // 将函数的this保存，foreach会影响this
        // 判断商品是否被选中，被选中时加到总计
        this.checkedProdList.forEach(function(i) { // 遍历复选框列表
          if (i == item.id) { // 当在复选框列表中找到传入的商品id时，计算到总计
            that.calTotalPrice()
          }
        })
      },
      plus: function(item) {
        if (item.productNum < item.deserveNum) { // 商品数量不能大于库存量，当商品数量小于库存量时加一
          item.productNum++
        }
        var that = this // 将函数的this保存，foreach会影响this
        // 判断商品是否被选中，被选中时加到总计
        this.checkedProdList.forEach(function(i) { // 遍历复选框列表
          if (i == item.id) { // 当在复选框列表中找到传入的商品id时，计算到总计
            that.calTotalPrice()
          }
        })
      },
      calTotalPrice: function() { // 计算总价格
        this.totalPrice = 0 // 每次变动都会调用该方法，先将总价致为0，再重新计算，否则会累加
        var that = this // 将函数的this保存，foreach会影响this
        // 只有被选中的商品才会计入总价，遍历复选框列表
        this.checkedProdList.forEach(function(i) { // i为遍历checkedProdList时存入复选框列表的id
          // 遍历购物车中的所有商品，判断哪些被选中
          that.shoppingProdList.forEach(function(j) { // j为遍历shoppingProdList时的商品对象
            if (j.id == i) { // 当商品id在复选框列表中时（被选中），才会被计入总价
              var normal = j.normalPrice // 定价（正常价格）
              var discount = j.discount // 折扣的价格
              var kill = j.killDiscount // 秒杀的价格
              // 计算总价，要先判断商品是否有折扣或有加入秒杀活动，用三元运算符实现，当参与时减去活动价格，未参与时减0
              // 总价=（定价 - 折扣 - 秒杀）* 数量
              that.totalPrice += (j.normalPrice - (j.isInDiscount == 2 ? discount : 0) - (j.isInKill == 2 ?
                kill : 0)) * j.productNum
            }
          })
        })
      },
      removeCarProductById: function(productId) { // 从购物车中删除商品
        var that = this
        this.$http.put('/shoppingCar/deleteShoppingCarById/' + productId)
          .then(res => {
            console.log(res)
            if (res.data.code == 200) { // 删除成功时，移除购物车列表中的商品
              // for (var i = 0; i < that.shoppingProdList.length; i++) {
              //   if (i == productId) {
              //     that.shoppingProdList.splice(i, 1); // 将使后面的元素依次前移，列表长度减1
              //     i--; // 循环次数减一，如果不减，将漏掉一个元素
              //   }
              // }
              // 删除成功后再查询一遍购物车信息
              this.getShoppingProdListByUserId(this.$userInfo.id)
            } else {
              this.$mui.toast('删除失败')
            }
          })
          .catch(function(error) {
            console.log(error)
          });
      },
      toPay: function() { // 预支付， 只有被选中（复选框列表中的）商品，才会被结算
        // 新建一个结算商品对象的集合，用于存储要被结算商品的信息
        var settleProducts = []
        // 循环遍历找到所有要结算的商品，并添加到settleProducts中去
        this.shoppingProdList.forEach(i => { // i为当前的商品对象
          this.checkedProdList.forEach(j => { // j为当前被选中的商品id
            if (i.id == j) { // 当该商品为被选中时
              delete i.createTime // 将该购物车商品的时间删除掉
              settleProducts.push(i) // 将该商品对象加入到settleProducts
            }
          })
        })
        // 存储完所有要结算的商品后，将整个集合执行支付操作
        this.pay(settleProducts)
      },
      pay: function(arr) { // 支付，arr为要执行支付的商品集合
        this.$http({
          method: 'post',
          url: '/orderHead/pay',
          data: arr
        }).then(res => {
          if (res.data.code == 200) {
            console.log(res.data.content)
            //
            this.$router.push({
              path: '/pay',
              query: {
                orderHeadId: res.data.content.id
              }
            })
          }
        }).catch(function(error) {
          console.log(error)
        })
      }
    },
    mounted: function() {
      if (this.$getCookie('username') != null && this.$getCookie('username') != '' && this.$getCookie('username').length !=
        0) {
        this.getShoppingProdListByUserId(this.$userInfo.id)
      } else {
        this.$router.push('/user/login')
      }
    }

  }
</script>

<style scoped="scoped">
  @import url("../assets/css/mui.min.css");
  @import url("../assets/css/app.css");


  /* 购物车样式 */
  .carProList {
    padding: 0px;
  }

  .carProduct {
    list-style: none;
    width: 100%;
    height: 100px;
    margin-top: 10px;
    background-color: white;
  }

  .carProduct img {
    float: left;
    height: 100%;
    width: 30%;
    margin-top: -10px;
    vertical-align: middle;
  }

  .carProduct .proInfoAndOption {
    float: right;
    width: 60%;
    height: 100%;
    /* border: 1px solid red; */
  }

  .proInfoAndOption ul {
    list-style: none;
    padding: 0px;
    height: 100%;
    width: 100%;
    margin: 0px;

  }

  .proInfoAndOption ul li {
    width: 100%;
    height: 33%;
    margin-top: -10px;
    /* border: 1px solid red; */
  }

  .carProduct input {
    float: left;
    height: 20px;
    width: 20px;
    border-radius: 15px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 18px;
    position: relative;
    margin-top: 30px;
    margin-left: 3%;
  }

  .name {
    font-weight: bold;
    text-align: left;
    font-size: 15px;
    line-height: 30px;
  }

  .miaoshu {
    text-align: left;
    font-size: 10px;
    line-height: 30px;
  }

  .opt span {
    font-size: 17px;
    line-height: 33px;
  }

  .opt .left {
    float: left;
    color: orangered;
    font-weight: bold;
  }

  .opt .right {
    float: right;
    margin-right: 10px;
  }

  .opt .right span {
    margin-right: 10px;
  }


  /* 计算样式 */
  .calBanner {
    width: 100%;
    height: 50px;
    position: fixed;
    bottom: 0px;
    background-color: white;
    /* border: 1px solid red; */
  }

  .calBanner span {
    height: 100%;
  }

  .calBanner span.left {
    float: left;
    width: 20%;
    /* border: 1px solid red; */
  }

  .calBanner span.right2 {
    float: right;
    width: 35%;
    /* border: 1px solid red; */
    font-size: 16px;
    line-height: 50px;
    background-color: orangered;
    color: white;
  }

  .calBanner span.right1 {
    float: right;
    width: 40%;
    /* border: 1px solid red; */
    font-size: 15px;
    line-height: 50px;
  }

  .calBanner span.left input {
    margin-top: 15px;
    width: 20px;
    height: 20px;
  }

  .calBanner span.left span {
    font-size: 16px;
    line-height: 20px;
    margin-left: 10px;
    font-weight: bold;
  }

  /* 推荐商品 */

  /* #tuijianPro {
		background-color: white;
		padding: 0px;
	} */
</style>
