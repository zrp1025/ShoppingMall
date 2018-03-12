// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {currency} from './utils/currency'
import GoodsList from '@/views/GoodsList'
import Vuex from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import VueLazyLoad from 'vue-lazyload'
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(infiniteScroll)
Vue.filter('currency',currency);
Vue.use(VueLazyLoad,{
	loading:'/static/loading-svg/loading-bars.svg'
})
const store = new Vuex.Store({
	state:{
		nickName:'jake',
		cartCount:0
	},
	mutations:{
		updateUserInfo(state,nickName){
			state.nickName = nickName;
		},
		updateCartCount(state,cartCount){
			state.cartCount += cartCount;
		},
		updateCartListCount(state,cartCount){
			state.cartCount = cartCount;
		}
	}
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<app/>'
})
