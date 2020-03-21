var express = require('express')
var md5 = require('blueimp-md5')
var router_xcx = express.Router()
var Department = require('./models/department')
var Customer = require('./models/customer')
var Yuyue = require('./models/yuyue')
var Keshi = require('./models/keshi')

router_xcx.post('/getAllDepartment', function (req, res) {
  Department.find(function (err, data) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(data))
  })
})

router_xcx.post('/CustomerLoginCheck', (req, res, next) => {
  var body = req.body
  Customer.findOne({
    phone: body.phone,
    // password: md5(md5(body.password))
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      return next(err)
    }
    // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid.'
      })
    }
    // 用户存在，登陆成功，通过 Session 记录登陆状态
    req.session.user = user
    res.status(200).json({
      err_code: 0,
      message: 'ok!',
      session: user
    })
  })
});

router_xcx.post('/getxcxSession', function (req, res, next) {
  //console.log(req.session);
  res.send(req.session.user)
})

router_xcx.post('/updateCustomerInformation', function (req, res) {
  console.log(req.body);

  Customer.findByIdAndUpdate(req.body._id, {
    phone: req.body.phone,
    idcard: req.body.idcard,
    gender: req.body.gender,
    name: req.body.name

  }, function (err) {
    if (err)
      return res.status(500).send("server errorrrrr")
    res.status(200).json({
      err_code: 0,
      message: 'ok!idcard'
    })
  })
})

//检查身份证+姓名是否认证↓
router_xcx.post('/checkidcard', function (req, res, next) {  
  var CryptoJS = require("crypto-js");
  var request = require('request');
  var querystring = require('querystring')
  // 云市场分配的密钥Id
  var secretId = "AKIDlVjEbE41F1NOUBH5CkJAtootq9PIMpafNnPu";
  // 云市场分配的密钥Key
  var secretKey = "2P65X98ph55c3EvQq3C3CniOwTWD3L01hsh762M";
  var source = "market";
  // 签名
  var datetime = (new Date()).toGMTString();
  var signStr = "x-date: " + datetime + "\n" + "x-source: " + source;
  var sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey))
  var auth = 'hmac id="' + secretId + '", algorithm="hmac-sha1", headers="x-date x-source", signature="' + sign + '"';
  // 请求方法
  var method = 'GET';
  // 请求头
  var headers = {
    "X-Source": source,
    "X-Date": datetime,
    "Authorization": auth,
  }
  // 查询参数
  var queryParams = req.body
  // body参数（POST方法下）
  var bodyParams = req.body

  var url = 'http://service-18c38npd-1300755093.ap-beijing.apigateway.myqcloud.com/release/idcard/VerifyIdcardv2';
  if (Object.keys(queryParams).length > 0) {
    url += '?' + querystring.stringify(queryParams);
  }
  var options = {
    url: url,
    timeout: 5000,
    method: method,
    headers: headers
  }
  if (['POST', 'PUT', 'PATCH'].indexOf(method) != -1) {
    options['body'] = querystring.stringify(bodyParams);
    options['headers']['Content-Type'] = "application/x-www-form-urlencoded";
  }
  request(options, function (error, response, body) {
    if (error !== null) {
      console.log('error:', error);
      return;
    }
    //console.log(body);
    res.send(body)
  });
})


//1.验证手机号是否注册过
//2.验证码是否正确
//3.保存
router_xcx.post('/xcxIsregister', function (req, res) {
  Customer.find({
    phone: req.body.phone
  }, function (err, customer) {
    if (customer.length === 1) {
      return res.status(200).json({
        err_code: 1,
        message: '该手机号已被注册'
      })
    }
     res.send({
      err_code: 0,
      message: '该手机号可用，还未被注册过~'
    })
  })
})

//发送手机验证码短信↓
router_xcx.post('/xcxgetphonetaskid', function (req, res) {    
  var CryptoJS = require("crypto-js");
  var request = require('request');
  var querystring = require('querystring');

  // 云市场分配的密钥Id
  var secretId = "AKIDlVjEbE41F1NOUBH5CkJAtootq9PIMpafNnPu";
  // 云市场分配的密钥Key
  var secretKey = "2P65X98ph55c3EvQq3C3CniOwTWD3L01hsh762M";
  var source = "market";

  // 签名
  var datetime = (new Date()).toGMTString();
  var signStr = "x-date: " + datetime + "\n" + "x-source: " + source;
  var sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signStr, secretKey))
  var auth = 'hmac id="' + secretId + '", algorithm="hmac-sha1", headers="x-date x-source", signature="' + sign + '"';

  // 请求方法
  var method = 'POST';
  // 请求头
  var headers = {
    "X-Source": source,
    "X-Date": datetime,
    "Authorization": auth,
  }
  // 查询参数
  var queryParams = {
  }
  // body参数（POST方法下）
  let bodyParams = {
    phone: '',
    templateId: '778',
    variables: ''
  }
  bodyParams.phone=req.body.phone
  bodyParams.variables=''
  for(let i=0;i<6;i++){
    bodyParams.variables+=parseInt(Math.random()*10)+''
  }
  
  
  // url参数拼接
  var url = 'https://service-n69wg6th-1259559761.ap-shanghai.apigateway.myqcloud.com/release/smsApi/verifyCode/send';
  if (Object.keys(queryParams).length > 0) {
    url += '?' + querystring.stringify(queryParams);
  }

  var options = {
    url: url,
    timeout: 5000,
    method: method,
    headers: headers
  }
  if (['POST', 'PUT', 'PATCH'].indexOf(method) != -1) {
    options['body'] = querystring.stringify(bodyParams);
    options['headers']['Content-Type'] = "application/x-www-form-urlencoded";
  }

  request(options, function (error, response, body) {
    if (error !== null) {
      console.log('error:', error);
      return;
    }
    body=JSON.parse(body)
    body.variables=bodyParams.variables
    console.log(body);
    res.send(body)
    
  });
})

//用户注册，save进customer数据库
router_xcx.post('/addCustomerRegister', function (req, res, next) {
  console.log(req.body);
  req.body.password = md5(md5(req.body.password))
  new Customer(req.body).save(function(err,data){
    res.send('保存成功')
  })
})

//用户修改密码

router_xcx.post('/changepassword', (req, res, next) => {
  console.log(req.body);
  
  Customer.findById(req.body._id, function (err,data) {
    if (err)
    return res.status(500).send("server error")
    console.log();
    
    //console.log(md5(md5(req.body.oldpass)),req.session.user.password);
    if (req.body.password === md5(md5(req.body.pwd.oldpass))) { //旧密码输入正确，才允许继续
      Customer.findByIdAndUpdate(req.body._id, {
        password: md5(md5(req.body.pwd.pass))
      }, function (err) {
        if (err)
          return res.status(500).send("server error")
        //req.session.user.password = md5(md5(req.body.pass)) 
        res.status(200).json({
          err_code: 0,
          message: 'ok!',
          password:md5(md5(req.body.pwd.pass))
        })
      })
    }
    else {
      res.status(200).json({
        err_code: 2,
        message: '原密码错误'
      })
    }
  })
});

//判断用户预约时，当前就诊号是否已被预约
router_xcx.post('/judgeState', function (req, res, next) {
  Keshi.findByIdAndUpdate('5e75c1a0f8190b490c79c85c', {
    time: 1
  }, function (err) {
    if (err)
      return res.status(500).send("server error")
    req.session.user.password = md5(md5(req.body.pass))
    res.status(200).json({
      err_code: 0,
      message: 'ok!'
    })
  })
})

router_xcx.post('/saveyuyue', function (req, res, next) {
  new Yuyue(req.body).save(function(err,data){

    res.send('保存成功')
  })
})



















module.exports = router_xcx 
