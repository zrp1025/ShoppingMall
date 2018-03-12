var express = require('express');
var router = express.Router();
var User = require('./../models/users')
require('./../util/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',(req,res,next)=>{
	var param = {
		userName:req.body.userName,
		userPwd:req.body.userPwd
	}
	User.findOne(param,(err,doc)=>{
		if (err) {
			res.json({
				status:"1",
				msg:err.message
			});
		}else{
			res.cookie("userId",doc.userId,{
				path:'/',
				maxAge:1000*60*60
			});
			res.cookie("userName",doc.userName,{
				path:'/',
				maxAge:1000*60*60
			});
			// res.session.user = doc;
			res.json({
				status:"0",
				msg:"",
				result:{
					userName:doc.userName
				}
			});
		}
	})
});
router.post('/logout',(req,res,next)=>{
	res.cookie("userId","",{
		path:"/",
		maxAge:-1
	});
	res.cookie("userName","",{
		path:"/",
		maxAge:-1
	});
	res.json({
		status:"0",
		msg:"",
		result:"登出成功"
	})
});
router.get('/checklogin',(req,res,next)=>{
	if (req.cookies.userId) {
		res.json({
			status:"0",
			msg:"",
			result:req.cookies.userName||''
		});
	}else{
		res.json({
			status:'1',
			msg:res.message,
			result:''
		});
	}
});
//查询当前用户购物车信息
router.get('/cartList',(req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({userId:userId},(err,doc)=>{
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:doc.cartList
			})

		}
	});
});

//删除购物车信息
router.post('/cartDele',(req,res,next)=>{
	var index=req.body.index;
	let userId = req.cookies.userId;
	User.findOne({userId:userId},(err,doc)=>{
		if (err) {
			res.json({
				status:"1",
				msg:err.message,
				result:""
			});
		}else{
			doc.cartList.splice(index,1);
			doc.save((err1,doc1)=>{
                if (err1) {
                    res.json({
                        status:"1",
                        msg:err1.message
                    })
                }else{
                    res.json({
                        status:"0",
                        msg:'',
                        result:'删除成功'
                    })
                }  
			})
		}
	})
});

//修改商品数量
router.post('/addNum',(req,res,next)=>{
	let userId = req.cookies.userId,
	    productId = req.body.productId,
	    productNum = req.body.productNum;
	User.update({"userId":userId,"cartList.productId":productId},{"cartList.$.productNum":productNum},(err,doc)=>{
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:'suc'
			})
		}
	})
});
//商品选取
router.post('/editCheck',(req,res,next)=>{
	let productId = req.body.productId,
		checked = req.body.checked,
		userId = req.cookies.userId;
	User.update({"userId":userId,"cartList.productId":productId},{"cartList.$.checked":checked},(err,doc)=>{
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:'suc'
			})
		}
	})
});
//全选功能
router.post('/toggleCheckAll',(req,res,next)=>{
	let checkAllFlag=req.body.checkAllFlag,
		userId = req.cookies.userId;
	User.findOne({"userId":userId},(err,doc)=>{
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			doc.cartList.forEach((item)=>{
				item.checked = checkAllFlag;
			});
			doc.save((err1,doc1)=>{
                if (err1) {
                    res.json({
                        status:"1",
                        msg:err1.message
                    })
                }else{
                    res.json({
                        status:"0",
                        msg:'',
                        result:'suc'
                    })
                } 				
			})
		}		
	})
});
//获取地址
router.get("/address",(req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({userId:userId},(err,doc)=>{
		if (err) {
			res.json({
				status:"1",
				msg:err.message,
				result:''
			});
		}else{
			res.json({
				status:'0',
				msg:'',
				result:doc.addressList
			})
		}
	})
});
//设置默认地址
router.post('/setDefault',(req,res,next)=>{
	let userId = req.cookies.userId,
		addressId = req.body.addId;
	User.findOne({userId:userId},(err,doc)=>{
		if (err) {
			res.json({
				status:"1",
				msg:err.message,
				result:''
			});
		}else{
			doc.addressList.forEach((item)=>{
				if (item.addressId==addressId) {
					item.isDefault = true;
				}else{
					item.isDefault = false;
				}
			});
			doc.save((err1,doc1)=>{
                if (err1) {
                    res.json({
                        status:"1",
                        msg:err1.message
                    })
                }else{
                    res.json({
                        status:"0",
                        msg:'',
                        result:'suc'
                    })
                } 			
			})
		}
	})
});
//地址的删除功能
router.post('/deleAddress',(req,res,next)=>{
	let userId = req.cookies.userId,
		index = req.body.index;
	User.findOne({userId:userId},(err,doc)=>{
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			doc.addressList.splice(index,1);
			doc.save((err1,doc1)=>{
                if (err1) {
                    res.json({
                        status:"1",
                        msg:err1.message
                    })
                }else{
                    res.json({
                        status:"0",
                        msg:'',
                        result:'删除成功'
                    })
                }  				
			})
		}
	})
});
//添加送货地址
router.post('/addAddress',(req,res,next)=>{
	let userId = req.cookies.userId,
		newAddress = {
			addressId : req.body.addressId,
	        userName : req.body.userName,
	        streetName : req.body.streetName,
	        postCode : req.body.postCode,
	        tel : req.body.tel,
	        isDefault : req.body.isDefault			
		};
    User.findOne({userId:userId},(err,doc)=>{
		if (err) {
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			doc.addressList.push(newAddress);
			doc.save((err1,doc1)=>{
                if (err1) {
                    res.json({
                        status:"1",
                        msg:err1.message
                    })
                }else{
                    res.json({
                        status:"0",
                        msg:'',
                        result:'添加成功'
                    })
                }  				
			})
		}    	
    })
});

router.post('/payMent',(req,res,next)=>{
	let userId = req.cookies.userId,
		addressId = req.body.addressId,
		orderTotal = req.body.orderTotal;
	User.findOne({userId:userId},(err,doc)=>{
		if (err) {
			res.json({
				status:1,
				msg:err.message,
				result:''
			})
		}else{
			let address = '';
			//获取订单地址
			doc.addressList.forEach((item)=>{
				if (item.addressId==addressId) {
					address = item;
				};
			});
			let goodsList = [];
			//获取购物车商品信息
			doc.cartList.forEach((item)=>{
				if (item.checked==1) {
					goodsList.push(item);
				}
			});
			var platform = '622';
			var r1 = Math.floor(Math.random()*10),
				r2 = Math.floor(Math.random()*10);
			var sysDate = new Date().Format('yyyyMMddhhmmss');
			var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
 			var orderId = platform+r1+sysDate+r2
			var order = {
				orderId:orderId,
				orderTotal:orderTotal,
				addressInfo:address,
				goodsList:goodsList,
				orderStatus:'1',
				createDate:createDate
			};
			doc.orderList.push(order);

			doc.save((err1,doc1)=>{
				if (err1) {
					res.json({
						status:1,
						msg:err1.message,
						result:''
					})
				}else{
					res.json({
						status:0,
						msg:'',
						result:{
							orderId:order.orderId,
							orderTotal:order.orderTotal
						}
					})
				}
			});
		}
	})
});
router.get('/getCartCount',(req,res,next)=>{
	var userId = req.cookies.userId;
	User.findOne({userId:userId},(err,doc)=>{
		if (err) {
			res.json({
				status:1,
				msg:err.message,
				result:''
			})
		}else{
			let allCount = 0;
			doc.cartList.forEach((item)=>{
				allCount += parseInt(item.productNum)
			})
			res.json({
				status:0,
				msg:'',
				result:{
					cartCount:allCount
				}
			})
		}
	})
})


module.exports = router;
