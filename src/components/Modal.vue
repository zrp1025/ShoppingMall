<template>
	<div>
		<transition name="modal">
			<div class="modal" v-show="modalShow">
				<div class="modal-msg">
					<span class="x" @click="mdzClose">X</span>
					<slot name="modalMsg"></slot>
				</div>
				<div class="modal-btn">
					<button  @click="mdzClose" v-show="showclose">
						<slot name="modalBtn"></slot>	
					</button>
					<button @click="mdzDele" v-show="showdele">
						<slot name="modalDele"></slot>
					</button>
				</div>

			</div>
		</transition>
		<div class="md-overlay" v-show="modalShow" @click="mdzClose"></div>
	</div>
</template>
<script>
	export default{
		props:["modalShow","showclose","showdele"],
		components:{
			
		},
		data(){
			return{

			}
		},
		methods:{
			mdzClose(){
				this.$emit('mdClose');
			},
			mdzDele(){
				this.$emit('mdDele');
				this.mdzClose();
			}
		}
	}
	
</script>
<style scoped>
	.x{
		position: absolute;
		right: 5px;
		top: 5px;
		cursor: pointer;
	}
	.modal-enter{
		transform: scale(0.8,0.8);
		opacity: 0;
	}
	.modal-enter-active{
		transition: all 0.7s ease-out;
	}
	.modal-leave-active{
		transition: all 0.7s ease-out;
		transform: scale(1.3,1.3);
		opacity: 0;
	}
	.modal{
		position: fixed;
		margin: auto;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 500px;
		height: 250px;
		background: #fff;
		z-index: 201;
	}
	.modal-msg{
		width: 100%;
		height: 65%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
	}
	.modal-btn{
		width: 100%;
		height: 35%;
		display: flex;
		justify-content: space-around;
	}
	.modal-btn button{
		width: 40%;
		height: 40px;
		color: #f50;
		border: 2px solid orange;
	}
	.modal-btn button:hover{
		background: #ffe1e2;
	}
</style>