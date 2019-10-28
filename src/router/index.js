import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import login from '@/components/login'
import reg from '@/components/reg'
import forget from '@/components/forget'
import category from '@/components/category'
import shopList from '@/components/shopList'
import car from '@/components/car'
import logistics from '@/components/logistics'
import userCenter from '@/components/userCenter'
import userEdit from '@/components/userEdit'
import order from '@/components/order'
import orderDetail from '@/components/orderDetail'
import productDetail from '@/components/productDetail'
import pay from '@/components/pay'
import logisticsDetail from '@/components/logisticsDetail'
import resetPW from '@/components/resetPW'
import authentication from '@/components/authentication'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/user/login',
      name: 'login',
      component: login
    },
    {
      path: '/reg',
      name: 'reg',
      component: reg
    },
    {
      path: '/forget',
      name: 'forget',
      component: forget
    },
    {
      path: '/category',
      name: 'category',
      component: category
    },
    {
      path: '/shopList',
      name: 'shopList',
      component: shopList
    },
    {
      path: '/car',
      name: 'car',
      component: car
    },
    {
      path: '/logistics',
      name: 'logistics',
      component: logistics
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter
    },
    {
      path: '/userEdit',
      name: 'userEdit',
      component: userEdit
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: productDetail
    },
		{
		  path: '/pay',
		  name: 'pay',
		  component: pay
		},
		{
		  path: '/logisticsDetail',
		  name: 'logisticsDetail',
		  component: logisticsDetail
		},
		{
		  path: '/user/resetPW',
		  name: 'resetPW',
		  component: resetPW
		},
		{
		  path: '/user/authentication',
		  name: 'authentication',
		  component: authentication
		}


  ]
})
