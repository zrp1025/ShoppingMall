<template>
  <div>
    <nav-header></nav-header>

    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(item,index) in cartList">
                <div class="cart-tab-1">
                  <div class="cart-item-check" >
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" @click="editcheck(item)" :class="{'checked':item.checked=='1'}">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-lazy="'static/'+item.productImage">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice | currency('$')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="changeNum('minu',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="changeNum('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.productNum*item.salePrice | currency('$')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:;" class="item-edit-btn" @click="checkDele(index)">
                      <i class="iconfont icon-delete"></i>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascipt:;" @click="toggleCheckAll">
                  <span class="checkbox-btn item-check-btn" :class="{'checked':checkAllFlag}">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class="total-price">{{AllPrice | currency('$')}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" :class="{'btn--dis':checkCount==0}" @click="checkOut">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <nav-footer></nav-footer>
    <modal :modalShow="mdshow" @mdClose="mdclose" @mdDele="deleCartList(sindex)" :showclose="false" :showdele="true">
      <div slot="modalMsg">
        是否确认删除？
      </div>
      <div slot="modalBtn"></div>
      <div slot="modalDele">
        <div >确认删除</div>
      </div>

    </modal>
  </div>
</template>
<style scoped>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
<script>          
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
        data(){
            return{
              cartList:[],
              mdshow:false,
              sindex:100

            }
        },
        computed:{
            checkAllFlag(){
              return this.checkCount==this.cartList.length;
            },
            checkCount(){
              let countNum = 0;
              this.cartList.forEach((item)=>{
                if (item.checked==1) {
                  countNum++;
                }
              });
              return countNum;
            },
            AllPrice(){
              let price = 0;
              this.cartList.forEach((item)=>{
                if (item.checked==1) {
                  price+=item.salePrice*item.productNum;
                }
              });
              return price;
            }
        },
        mounted(){
          this.getCartList()
        },
        methods:{
          getCartList(){
            axios.get('/users/cartList').then((responet)=>{
              let res = responet.data;
              this.cartList = res.result;
            });
          },
          deleCartList(pid){
            axios.post('/users/cartDele',{
              index:pid,
            }).then((responet)=>{
              let res = responet.data;
            });
            this.getCartList();
          },
          mdclose(){
            this.mdshow = false;
          },
          checkDele(x){
            this.sindex=x;
            this.mdshow = true;
          },
          changeNum(flag,item){
            if (flag=="add") {
              item.productNum++;
            }else{
              if (item.productNum<=1) {
                return;
              }else{
                item.productNum--;
              }
            }
            axios.post('/users/addNum',{
              productId:item.productId,
              productNum:item.productNum
            }).then((respones)=>{
              let res = respones.data;  
            });
            this.getCartCount();
          },
          editcheck(item){
            if (item.checked=="1") {
              item.checked="0"
            }else{
              item.checked="1"
            }
            axios.post('/users/editCheck',{
              checked:item.checked,
              productId:item.productId
            }).then((respones)=>{
              let res = respones.data;
            })

          },
          toggleCheckAll(){
            let flag= !this.checkAllFlag;
            this.cartList.forEach((item)=>{
              item.checked = flag;
            })
            let check = flag?1:0;
            axios.post('/users/toggleCheckAll',{
              checkAllFlag:check
            }).then((respones)=>{
              let res = respones.data;
              console.log(res.result);
            })
          },
          checkOut(){
            if (this.checkCount!=0) {
              this.$router.push({
                path:'/address'
              });
            }
          },
          getCartCount(num){
            axios.get('/users/getCartCount').then((response)=>{
                let res = response.data;
                this.$store.commit('updateCartListCount',res.result.cartCount)
            })
      }
        }
    }
</script>
