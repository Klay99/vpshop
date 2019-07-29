<template>

  <div>

    <div class="jd_layout">
      <!-- 底部通栏-->
      <header class="jd_topBar">
        <a href="javascript:history.back(-1)" class="icon_back"></a>
        <form action="#">
          <input type="search" placeholder="顶部通栏" />
        </form>
        <a href="#" class="icon_menu"></a>
      </header>

      <!-- 分类主体-->
      <div class="jd_main">
        <div class="jd_cateLeft">
          <ul class="clearFix">
            <li v-for="(item,index) in productTypeList" @click="changeProductType(item,index)" :class="{'now':position==index}"><a>{{item.productTypeName}}</a></li>
          </ul>
        </div>
        <div class="jd_cateRight">
          <div class="jd_cateRight_box">
            <a class="banner"><img class="banner" :src="bannerImg" alt="" /></a>
            <div class="hot">
              <h3>新品推荐</h3>
              <ul class="clearFix">
                <li v-for="item in productListByCreateTime"><a @click="toProductDetail(item.id)"><img :src="item.productImg" alt="" />
                    <p>{{item.productName}}</p>
                  </a>
                </li>
                <p v-show="productListByCreateTime.length==0" class="noProduct">暂无商品</p>
              </ul>
            </div>

            <div class="hot">
              <h3>热门商品</h3>
              <ul class="clearFix">
                <li v-for="item in productListByViewNum"><a @click="toProductDetail(item.id)"><img :src="item.productImg" alt="" />
                    <p>{{item.productName}}</p>
                  </a>
                </li>
              </ul>
              <p v-show="productListByViewNum.length==0" class="noProduct">暂无商品</p>
            </div>

            <div class="hot">
              <h3>热销商品</h3>
              <ul class="clearFix">
                <li v-for="item in productListByOrderCount"><a @click="toProductDetail(item.id)"><img :src="item.productImg" alt="" />
                    <p>{{item.productName}}</p>
                  </a>
                </li>
              </ul>
              <p v-show="productListByOrderCount.length==0" class="noProduct">暂无商品</p>
            </div>

          </div>
        </div>

      </div>


    </div>


  </div>

</template>

<script>
  export default {
    name: 'category',
    data() {
      return {
        productTypeList: [], // 商品分类列表
        productList: [], // 商品列表
        position: 0, // 显示样式的分类索引
        bannerImg: '', // 分类的图片
        productListByCreateTime: [], // 新品列表
        productListByViewNum: [], // 热门列表
        productListByOrderCount: [], // 热销列表
      }
    },
    methods: {
      toProductDetail:function(id){
        this.addProductViewNum(id)
        this.$router.push({
          path:'/productDetail',
          query:{
            'id': id
            }
        })
      },
      getAllProductType: function() {
        var that = this
        this.$http({
          url: "/productType/getAllProductType",
          method: 'put',
          data: {
            model: {

            },
            orderParams: ['viewNum desc'],
            pageNum: 0,
            pageSize: 1000
          }
        }).then(function(res) {
          console.log(res)
          console.log(res.data.content.list)
          that.productTypeList = res.data.content.list
          that.bannerImg = res.data.content.list[0].typeImg
          that.getProductListByTypeId(that.productTypeList[0].id, 'createTime desc') // 默认展示第一个商品分类的商品
        }).catch(function(err) {
          that.$mui.toast('获取商品分类列表信息失败')
          console.log(err)
        })
      },

      getProductListByTypeId: function(typeId) {
        var that = this

        // 获取新品推荐商品
        this.$http({
          url: "/product/getAllProduct",
          method: 'put',
          data: {
            model: {
              'typeId': typeId
            },
            orderParams: [
              'createTime desc'
            ],
            pageNum: 0,
            pageSize: 6
          }
        }).then(function(res) {
          console.log(res)
          that.productListByCreateTime = res.data.content.list
        }).catch(function(err) {
          that.$mui.toast('获取新品商品列表信息失败')
          console.log(err)
        })

        //获取热门商品
        this.$http({
          url: "/product/getAllProduct",
          method: 'put',
          data: {
            model: {
              'typeId': typeId
            },
            orderParams: [
              'viewNum desc'
            ],
            pageNum: 0,
            pageSize: 6
          }
        }).then(function(res) {
          console.log(res)
          that.productListByViewNum = res.data.content.list
        }).catch(function(err) {
          that.$mui.toast('获取热门商品列表信息失败')
          console.log(err)
        })

        //获取热销商品
        this.$http({
          url: "/product/getAllProduct",
          method: 'put',
          data: {
            model: {
              'typeId': typeId
            },
            orderParams: [
              'orderCount desc'
            ],
            pageNum: 0,
            pageSize: 6
          }
        }).then(function(res) {
          console.log(res)
          that.productListByOrderCount = res.data.content.list
        }).catch(function(err) {
          that.$mui.toast('获取热销商品列表信息失败')
          console.log(err)
        })

      },
      changeProductType: function(item, index) {
        this.addProductTypeViewNum(item.id)
        this.bannerImg = item.typeImg
        this.position = index
        this.getProductListByTypeId(item.id)
      },
      addProductTypeViewNum:function(typeId){
        this.$http('/productType/addProductTypeViewNum/' + typeId) // 默认为GET请求
      },
      addProductViewNum:function(id){
        this.$http('/product/addProductViewNum/' + id) // 默认为GET请求
      }
    },
    mounted: function() {
      this.getAllProductType()
    }

  }
</script>

<style scoped="scoped">
  @import url("../assets/css/base.css");
  @import url("../assets/css/category.css");
</style>
