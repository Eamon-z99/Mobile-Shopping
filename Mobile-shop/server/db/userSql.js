//在数据库中验证用户的信息
const user = {
	//查询手机号
	queryUserTel(option){
		return 'select * from user where tel = '+option.userTel+''
	},
	//查询密码
	queryUserPwd(option){
		return 'select * from user where (tel='+option.userTel+') and pwd = '+option.userPwd+''
	},
    //新增用户
	inserData(option) {
		let userTel = option.userTel;
		let userPwd = option.userPwd || '123456';
		//引入token包
		let jwt = require('jsonwebtoken');
		//用户信息
		let payload = {tel:userTel};
		//口令
		let secret = 'dezhi';
		//生成token
		let token = jwt.sign(payload,secret);

		return 'insert into user (tel,pwd,nickName,imgUrl,token) values ("' + userTel + '","' + userPwd +'","默认","/images/地址管理.png","'+token+'")';
	}
}

exports = module.exports = user