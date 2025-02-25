var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var user = require('../db/userSql.js')
let jwt = require('jsonwebtoken')
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' }); 
});

//修改购物车数量
router.post('/api/updateNum', function(req, res, next) {
  let id = req.body.id
  let changeNum = req.body.num

  connection.query(`UPDATE goods_cart SET goods_num = ${changeNum} WHERE id = ${id}`, function(error, results) {
    if (error) {
      console.error('数据库更新失败', error)
      res.status(500).send({
        data: {
          code: 500,
          success: false,
          message: '数据库更新失败'
        }
      })
    } else {
      res.send({
        data: {
          code: 200,
          success: true
        }
      })
    }
  })
})

//查询购物车数据
router.post('/api/selectCart', function(req, res, next) {
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);

  //查询用户
  connection.query(`SELECT * FROM user WHERE tel = ${tokenObj.tel}`, function(error, results) {
      if (error) {
          console.error('查询用户失败', error);
          return res.status(500).send({
              data: {
                  code: 500,
                  success: false,
                  message: '查询用户失败'
              }
          });
      }

      //用户id
      let uId = results[0].id;

      //查询当前用户的购物车数据
      connection.query(`SELECT * FROM goods_cart WHERE uId = ${uId}`, function(error, results) {
          if (error) {
              console.error('数据库查询失败', error);
              return res.status(500).send({
                  data: {
                      code: 500,
                      success: false,
                      message: '数据库查询失败'
                  }
              });
          }

          res.send({
              data: {
                  code: 200,
                  success: true,
                  data: results
              }
          });
      });
  });
});

//添加购物车数据
router.post('/api/addCart', function(req, res, next) {
  //后端接收前端的参数
  let goodsId = req.body.goodsId;
  //token
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  console.log(tokenObj);

  //查询用户
  connection.query(`SELECT * FROM user WHERE tel = ${tokenObj.tel}`, function(error, results) {
      if (error) {
          console.error('查询用户失败', error);
          return res.status(500).send({
              data: {
                  code: 500,
                  success: false,
                  message: '查询用户失败'
              }
          });
      }

      //用户id
      let uId = results[0].id;

      //检查商品是否已经存在于购物车中
      connection.query(`SELECT * FROM goods_cart WHERE uId = ${uId} AND goods_id = ${goodsId}`, function(err, cartResults) {
          if (err) {
              console.error('查询购物车失败', err);
              return res.status(500).send({
                  data: {
                      code: 500,
                      success: false,
                      message: '查询购物车失败'
                  }
              });
          }

          //如果商品已经存在于购物车中
          if (cartResults.length > 0) {
              return res.send({
                  data: {
                      code: 200,
                      success: false,
                      msg: '该商品已加入购物车'
                  }
              });
          }

          //查询商品信息
          connection.query(`SELECT * FROM goodslist WHERE id = ${goodsId}`, function(err, result) {
              if (err) {
                  console.error('查询商品失败', err);
                  return res.status(500).send({
                      data: {
                          code: 500,
                          success: false,
                          message: '查询商品失败'
                      }
                  });
              }

              let goodsName = result[0].name;
              let goodsPrice = result[0].price;
              let goodsImgUrl = result[0].imgUrl;

              //插入购物车数据
              connection.query(`INSERT INTO goods_cart (uId, goods_id, goods_name, goods_price, goods_num, goods_imgUrl) VALUES ("${uId}", "${goodsId}", "${goodsName}", "${goodsPrice}", "1", "${goodsImgUrl}")`, function(e, r) {
                  if (e) {
                      console.error('插入购物车失败', e);
                      return res.status(500).send({
                          data: {
                              code: 500,
                              success: false,
                              message: '插入购物车失败'
                          }
                      });
                  }

                  res.send({
                      data: {
                          code: 200,
                          success: true,
                          msg: '添加成功'
                      }
                  });
              });
          });
      });
  });
});

//修改密码
router.post('/api/modify',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		//某一条记录数id
		let id = results[0].id;
		let pwd = results[0].pwd;
		connection.query(`update user set pwd = replace(pwd,'${pwd}','${params.userPwd}') where id = ${id}`,function(err,result){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'修改成功'
				}
			})
		})
	})
})

//注册
router.post('/api/register',function(req,res,next){
	let params = {
		userTel : req.body.phone,
		userPwd : req.body.pwd
	}
	//查询用户是否存在
	connection.query( user.queryUserTel( params ) ,function(error,results){
		if(error) throw error;
		//用户存在
		if( results.length > 0 ){
			res.send({
				code:200,
				data:{
					success:true,
					msg:'用户已存在，请登录！',
					data:results[0]
				}
			})
		}else{
			//不存在，新增一条数据
			connection.query( user.inserData ( params ),function(err,result){
				connection.query( user.queryUserTel( params ) , function(e,r){
					res.send({
						code:200,
						data:{
							success:true,
							msg:'注册成功！登录成功',
							data:r[0]
						}
					})
				})
			})
		}
	})
	
})

//手机号密码登录
router.post('/api/login',function(req,res,next){
	//接收用户传递的手机号和密码
	let params = {
		userTel : req.body.userTel,
		userPwd : req.body.userPwd
	}
	//查询用户手机号
	connection.query( user.queryUserTel(params),function(error,results){
		//手机号存在
		if( results.length > 0 ){
			connection.query(user.queryUserPwd(params),function(err,result){
				if(result.length > 0){
					//手机号密码正确
					res.send({
						code:200,
						data:{
							msg:'登录成功',
							success:true,
							data:result[0]
						}
					})
				}else{
					//密码不对
					res.send({
						code:302,
						data:{
							msg:'密码不对',
							success:false
						}
					})
				}
			})
		}else{
			//手机号不存在
			res.send({
				code:301,
				data:{
					msg:'手机号不存在',
					success:false
				}
			})
		}
	} )
})

//通过商品id查询
router.get('/api/goods/id', function(req, res, next) {
  let id = req.query.id;
  connection.query('SELECT * FROM goodslist WHERE id = ?', [id], function(error, results) {
    if (error) {
      console.error('数据库查询错误:', error);
      return res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
    if (results.length === 0) {
      return res.status(404).json({ code: 404, message: '商品未找到' });
    }
    res.json({
      code: 0,
      data: results[0]
    });
  });
});

//分类的接口
router.get('/api/goods/list',function(req,res,next){
	res.send({
		code:0,
		data:[{
			//一级数据(左侧)
			id:0,
			name:'鞋子',
			data:[{
				//二级数据(右侧)
				id:0,
				name:'Nike',
				imgUrl:'/images/耐克.png'
			},
			{
				id:1,
				name:'Adidas',
				imgUrl:'/images/阿迪达斯.png'
			},
			{
				id:2,
				name:'Li-Ning',
				imgUrl:'/images/李宁logo.png'
			}
      ]
		},
		{
			//一级数据(左侧)
			id:1,
			name:'上衣',
			data:[{
				//二级数据(右侧)
				id:0,
				name:'防晒衣',
				imgUrl:'/images/防晒衣.png'
			},
			{
				id:1,
				name:'西装',
				imgUrl:'/images/西装.png'
			},
			{
				id:2,
				name:'冲锋衣',
				imgUrl:'/images/冲锋衣.png'
			}]
		}]
	})
})

//搜索数据库接口
router.get('/api/goods/shopList', function (req, res, next) {
  const searchName = req.query.searchName;
  console.log(searchName)
  connection.query(
    'SELECT * FROM goodslist WHERE name LIKE ?',
    ['%' + searchName + '%'],
    function (error, results) {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).send({
          code: 0,
          message: '服务器内部错误',
        });
      }
      res.send({
        code: 1,
        data: results,
      });
    }
  );
});

// 首页数据接口
router.get('/api/index', function (req, res, next) {
  res.json({
    code: 0,
    data: {
      sortList: [
        { id: 1, title: '女装', imgUrl: '/images/女装.png' },
        { id: 2, title: '女鞋', imgUrl: '/images/高跟鞋.png' },
        { id: 3, title: '上衣', imgUrl: '/images/上衣.png' },
        { id: 4, title: '美妆/护肤', imgUrl: '/images/美妆类目.png' },
        { id: 5, title: '裤子', imgUrl: '/images/裤子.png' },
        { id: 6, title: '母婴/童装', imgUrl: '/images/母婴.png' },
        { id: 7, title: '裙子', imgUrl: '/images/裙子.png' },
        { id: 8, title: '男装男鞋', imgUrl: '/images/男装.png' },
        { id: 9, title: '套装', imgUrl: '/images/套装.png' },
        { id: 10, title: '配饰', imgUrl: '/images/珠宝配饰.png' }
      ],
      goodsList: [
        {
          id: 1,
          name: 'BJHG不计后果极简高级灰棉服男款冬季外套棉袄防寒加厚情侣款棉衣',
          actor: './images/1.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '299',
          sales: 21,
          imgUrl: './images/1.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 2,
          name: 'Jeep spirit 秋冬连帽三合一羽绒冲锋衣男款户外防风水夹克外套女',
          actor: './images/2.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '226',
          sales: 5,
          imgUrl: './images/2.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 3,
          name: '骆驼3514幻影黑冲锋衣女三合一羽绒服冬外套男户外暴雨防水登山服',
          actor: './images/3.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '439',
          sales: 11,
          imgUrl: './images/3.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 4,
          name: '美式假两件棉衣男冬季新款加厚连帽棉袄外套潮流宽松情侣保暖棉服',
          actor: './images/4.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '109',
          sales: 7,
          imgUrl: './images/4.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 5,
          name: '日系复古超好看夹克棉服女2024冬季新款小个子宽松休闲翻领棉衣潮',
          actor: './images/5.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '119',
          sales: 13,
          imgUrl: './images/5.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 6,
          name: '【坐吃山空】秋季新款杏色立领工装夹克女中性风宽松休闲运动外套',
          actor: './images/6.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '158',
          sales: 49,
          imgUrl: './images/6.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 7,
          name: '男道冬季新款纯色工装连帽棉衣男潮牌宽松潮流保暖加厚冲锋衣棉服',
          actor: './images/7.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '205',
          sales: 17,
          imgUrl: './images/7.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 8,
          name: 'Peterwoo座山雕2024秋冬新款棉袄服水洗帆布cleanfit外套棉衣宽松',
          actor: './images/8.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '205',
          sales: 18,
          imgUrl: './images/8.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 9,
          name: 'City Hipster美式复古牛仔裤男冬季潮牌重磅加绒裤子宽松直筒长裤',
          actor: './images/9.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '128',
          sales: 78,
          imgUrl: './images/9.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 10,
          name: '冲锋工装裤男士2024秋冬加绒加厚美式宽松直筒阔腿伞兵休闲长裤子',
          actor: './images/10.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '88',
          sales: 46,
          imgUrl: './images/10.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 11,
          name: '阔腿牛仔裤女秋冬款2024新款小个子慵懒高腰复古宽松加绒直筒裤子',
          actor: './images/11.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '89',
          sales: 32,
          imgUrl: './images/11.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 12,
          name: '美式黑灰色高腰阔腿牛仔裤女2024秋冬款加绒小个子宽松垂感拖地裤',
          actor: './images/12.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '77',
          sales: 87,
          imgUrl: './images/12.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 13,
          name: '开叉牛仔半身裙女2024秋季新款小个子a字辣妹中长款显瘦包臀裙子',
          actor: './images/13.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '54',
          sales: 36,
          imgUrl: './images/13.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        },
        {
          id: 14,
          name: '毛呢格纹半身裙女高腰秋冬大码胖mm遮肚显瘦梨形身材中长款a字裙',
          actor: './images/14.jpg',
          actorname: '用户a',
          actortag: '爆单',
          price: '68',
          sales: 50,
          imgUrl: './images/14.jpg',
          leftUrl: './images/zhibotongjia.png',
          rightUrl: './images/zhibo.png',
          byUrl: './images/baoyou.png'
        }
        
      ]
    }
  });
});

module.exports = router;