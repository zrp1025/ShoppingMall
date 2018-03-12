var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Goods = require('../models/goods');
var User = require('../models/users')

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mydb');
mongoose.connection.on("connected",()=>{
    console.log('连接成功');
});
mongoose.connection.on("error",()=>{
    console.log('连接失败');
});
mongoose.connection.on('disconnected',()=>{
    console.log('断开连接');
});
/* GET home page. */
router.get('/', function(req, res, next) {
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let sort = req.param("sort");
    let skip = (page-1)*pageSize;
    var priceLevel = req.param("priceLevel");
    var priceGt='',priceLte = '';
    let params = {};
    if (priceLevel != 'all') {
        switch(priceLevel){
            case '0':priceGt =0;priceLte=100;break;
            case '1':priceGt =100;priceLte=500;break;
            case '2':priceGt =500;priceLte=1000;break;
            case '3':priceGt =1000;priceLte=5000;break;
        }
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }else{
        params = {}
    }
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec((err,doc)=>{
        if(err){
            res.json({
                status:"1",
                msg:err.message
            });
        }else{
            // res.send(doc[0].productName);
            res.json({
                status:"0",
                msg:"",
                result:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
});
router.post("/addcart",(req,res,next)=>{
    var userId = req.cookies.userId,productId = req.body.productId;
    User.findOne({userId:userId},(err,userDoc)=>{
        if (err) {
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            if (userDoc) {
                let goodsItem ="";
                userDoc.cartList.forEach((item)=>{
                    if (item.productId==productId) {
                        goodsItem=item;
                        item.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save((err2,doc)=>{
                        if (err2) {
                            res.json({
                                status:"1",
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:"0",
                                msg:'',
                                result:'suc'
                            })
                        }                          
                    })
                }else{
                    Goods.findOne({productId:productId},(err1,goodDoc)=>{
                    if (err1) {
                        res.json({
                        status:"1",
                        msg:err1.message
                        })
                    }else{
                        if (goodDoc) {
                            goodDoc.productNum = 1;
                            goodDoc.checked = 1;
                            userDoc.cartList.push(goodDoc);
                            userDoc.save((err2,doc)=>{
                                if (err2) {
                                    res.json({
                                        status:"1",
                                        msg:err2.message
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
                    }
                    })    
                }

            }
        }
    })
});

module.exports = router;
