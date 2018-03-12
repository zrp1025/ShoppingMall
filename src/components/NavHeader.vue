<template>
	<div>
		<header class="header">
  <div class="navbar">
    <div class="navbar-left-container">
      <a href="/">
        <img class="navbar-brand-logo" src="static/xiaomi.jpg" style="width:100px;height:45px"></a>
    </div>
    <div class="navbar-right-container" style="display: flex;">
      <div class="navbar-menu-container">
        <!--<a href="/" class="navbar-link">我的账户</a>-->
        <span>{{loginName}}</span>
        <span class="navbar-link" v-if="islogin">{{userName}}</span>
        <a href="javascript:void(0)" class="navbar-link" v-if="!islogin" @click="loginFlag=true">Login</a>
        <a href="javascript:void(0)" class="navbar-link" v-if="islogin" @click="logout">Logout</a>
        <span class="navbar-cart-count" v-if="ifcartcount">{{cartCount}}</span>
        <a class="navbar-link navbar-cart-link" href="/cart">
          <i class="iconfont icon-cart" style="font-size:25px"></i>
        </a>
        
      </div>
    </div>
  </div>
<transition name="dialog">
<div class="modal-center" v-if="loginFlag">
  <div>
    <ul>
      <li>
        <input class="login-s" type="text" v-model="userName" name="loginname" placeholder="User Name">
        <input class="login-s" type="password" v-model="userPwd" name="password" placeholder="Password" @keyup.enter="login">
        <a class="login-s login-button" @click="login" href="javascript:;">登录</a>
        <span class="login-s longin-error" v-show="errorTip">User or passwor is wrong</span>
      </li>
    </ul>
  </div>
</div>
</transition>
  <div class="md-overlay" v-if="loginFlag" @click="loginFlag=false"></div>
</header>
	</div>
</template>
<script>
import "./../assets/css/login.css"
import axios from 'axios'
	export default{
		components:{
			
		},
		data(){
			return{
        userName:'',
        userPwd:'',
        errorTip:false,
        loginFlag:false,
        islogin:false,
        loginName:'',
        ifcartcount:false
			}
		},
    mounted(){
      this.checkLogin();
    },
    computed:{
      cartCount(){
        return this.$store.state.cartCount
      }
    },
    methods:{
      login(){
        if (this.userName=="" || this.userPwd=="") {
          this.errorTip = true;
        }else{
          this.errorTip = false;
          axios.post('/users/login',{
            userName:this.userName,
            userPwd:this.userPwd
          }).then((response)=>{
            let res = response.data;
            if (res.status == 0) {
              this.errorTip = false;
              this.loginFlag = false;
              this.islogin = true;
            }else{
              this.errorTip = true;
            }
          });
          
        }

      },
      logout(){
        axios.post('/users/logout').then((response)=>{
          let res = response.data;
          if (res.status=="0") {
            this.islogin=false;
          }
        })
      },
      checkLogin(){
        axios.get('/users/checklogin').then((response)=>{
          let res = response.data;
          this.loginName = res.result;
        });
        this.getCartCount()
      },
      getCartCount(){
        axios.get('/users/getCartCount').then((response)=>{
            let res = response.data;
            if (!isNaN(res.result.cartCount)) {
              this.ifcartcount=true
              this.$store.commit('updateCartCount',res.result.cartCount)
            }else{
              this.ifcartcount=false
            }
        })
      }
    }
	}
	
</script>
<style scoped>
    .dialog-leave-active{
      transition: all 1s; 
      transform: translateX(-600px);
      opacity: 0;
    }
    .dialog-enter{
      transform: translateX(600px);
      opacity: 0;
    }
    .dialog-enter-active{
      transition: all 1s;

    }
	  .modal-center{
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 500px;
      height: 250px;
      background: #fff;
      z-index: 201
    }
    .modal-center .login-s{
      display: block;
      width: 80%;
      margin:20px auto;
      text-align: center;
    }
    .login-button{
      font-size: 25px;
      color: green;
    }
    .longin-error{
      background: pink;
      line-height: 25px;
      color: red;
    }

</style>