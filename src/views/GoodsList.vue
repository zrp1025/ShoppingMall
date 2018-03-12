<template>
	<div id="app">
		<nav-header></nav-header>
		<nav-bread>
			<span>Goods</span>
		</nav-bread>

		<div class="accessory-result-page accessory-page">
		  <div class="container">
		    <div class="filter-nav">
		      <span class="sortby">Sort by:</span>
		      <a href="javascript:void(0)" class="default cur">Default</a>
		      <a href="javascript:void(0)" @click="sortGoods" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
		      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
		    </div>
		    <div class="accessory-result">
		      <!-- filter -->
		      <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
		        <dl class="filter-price">
		          <dt>Price:</dt>
		          <dd><a href="javascript:void(0)" @click="setPrice('all')" :class="{cur:checkPrice=='all'}">All</a></dd>
		          <dd v-for="(item,index) in priceFulit" >
		            <a href="javascript:void(0)" @click="setPrice(index)" :class="{cur:checkPrice==index}">{{item.startPrice}} - {{item.endPrice}}</a>
		          </dd>
		        </dl>
		      </div>

		      <!-- search result accessories list -->
		      <div class="accessory-list-wrap">
		        <div class="accessory-list col-4">
		          <ul>
		            <li v-for="item in goodsList">
		              <div class="pic">
		                <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
		              </div>
		              <div class="main">
		                <div class="name">{{item.productName}}</div>
		                <div class="price">{{item.salePrice}}</div>
		                <div class="btn-area">
		                  <a href="javascript:;" @click="addcart(item.productId)" class="btn btn--m">加入购物车</a>
		                </div>
		              </div>
		            </li>
		          </ul>
		          <ul>
			          <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
	  					<img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
					  </div>
				  </ul>
		        </div>
		      </div>
		    </div>
		  </div>
		</div>
		<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
		<modal :modalShow="mdshow" @mdClose="mdclose" :showclose="true" :showdele="false">
			<div slot="modalMsg">
				未登录，请重新登录
			</div>
			<div slot="modalBtn">
				关闭
			</div>
		</modal>
		<modal :modalShow="scmdshow" @mdClose="mdclose" :showclose="true" :showdele="false">
			<div slot="modalMsg">
				<svg class="navbar-cart-logo">
              	<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
           		</svg>加入购物车成功!
			</div>
			<div slot="modalBtn">
            	<router-link href="javascript:;" to="/cart">
            		查看购物车
            	</router-link>
			</div>
		</modal>
		<nav-footer></nav-footer>	
	</div>
</template>
<script>
import '../assets/css/base.css'
import '../assets/css/checkout.css'
import '../assets/css/login.css'
import '../assets/css/product.css'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import NavBread from '@/components/NavBread'
import Modal from '@/components/Modal'
import axios from 'axios'

	export default{
		components:{
			NavHeader,
			NavFooter,
			NavBread,
			Modal
		},
		mounted:function(){
			this.getGoodList(false);
		},
		methods:{
			getGoodList(flag){
				var param = {
					page:this.page,
					pageSize:this.pageSize,
					sort:this.sortFlag?1:-1,
					priceLevel:this.checkPrice
				}
				this.loading = true;
				axios.get("/goods",{params:param}).then((res)=>{
					var res = res.data;
					this.loading=false;
					if (flag) {
						this.goodsList=this.goodsList.concat(res.result.list);
						if (res.result.count==0) {
							this.busy = true;
						}else{
							this.busy = false;
						}
					}else{
						this.goodsList = res.result.list;
						this.busy = false;
					}
				});
			},
			sortGoods(){
					this.sortFlag = !this.sortFlag;
					this.page=1;
					this.getGoodList(false);
			},
			showFilterPop(){
				this.filterBy=true;
				this.overLayFlag=true;
			},
			setPrice(index){
				this.checkPrice=index;
				this.closePop();
				this.page=1;
				this.getGoodList(false);
			},
			closePop(){
				this.filterBy=false;
				this.overLayFlag=false;
			},
			loadMore(){

				this.busy = true;
				setTimeout(() => {
					this.page++;
					this.getGoodList(true);
        			}, 1000);
			},
			addcart(productId){
				axios.post("/goods/addcart",{productId:productId}).then((res)=>{
					if (res.data.status=="0") {
						this.scmdshow=true;
						this.$store.commit('updateCartCount',1)
					}else{
						// alert("msg:"+res.data.msg);
						this.mdshow=true;
					}
				})
			},
			mdclose(){
				this.mdshow=false;
				this.scmdshow=false;
			}
		},
		data(){
			return{
				goodsList:[],
				priceFulit:[
					{
						startPrice:"0",
						endPrice:"100"
					},
					{
						startPrice:"100",
						endPrice:"500"
					},
					{
						startPrice:"500",
						endPrice:"1000"
					},
					{
						startPrice:"1000",
						endPrice:"2000"
					},
				],
				checkPrice:"all",
				filterBy:false,
				overLayFlag:false,
				sortFlag:false,
				page:1,
				pageSize:8,
				busy:true,
				loading:false,
				mdshow:false,
				scmdshow:false
			}
		}
	}
	
</script>
<style>
	#app {
	  font-family: 'Avenir', Helvetica, Arial, sans-serif;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	  margin: 0;
	  padding: 0;
	}
</style>