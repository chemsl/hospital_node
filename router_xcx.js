var express = require('express')
var md5 = require('blueimp-md5')
var router_xcx = express.Router()
var Department = require('./models/department')
var Customer = require('./models/customer')
var Yuyue = require('./models/yuyue')
var Keshi = require('./models/keshi')
var Advisory = require('./models/advisory')
var Disease= require('./models/disease')
var news= require('./models/new')
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
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid.'
      })
    }
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
    console.log(body);
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



router_xcx.post('/saveyuyue', function (req, res, next) {
  new Yuyue(req.body).save(function(err,data){

    res.send('保存成功')
  })
})


var DiseaseInfo= require('./models/diseaseInfo')
router_xcx.post('/getThisDiseaseInformation', function (req, res, next) {
  console.log(req.body.id)
  DiseaseInfo.findOne({
    id:req.body.id
  }, function (err, data) {
    console.log(data,typeof(data),285)
    res.send(data)
  
    
  })
})


router_xcx.post('/changeState', function (req, res, next) {
  console.log(req.body)
  Keshi.findByIdAndUpdate(req.body.id, {
    time: req.body.time
  }, function (err) {
    if (err)
      return res.status(500).send("server error")
    //req.session.user.password = md5(md5(req.body.pass)) 
    res.send('修改成功')
  })
})

router_xcx.post('/getThisCusYuyueInfo', function (req, res) {
  Yuyue.find({
    idcard: req.body.idcard
  }, function (err, data) {
    
    res.send(JSON.stringify(data))
  })
})


router_xcx.post('/updateYuyueStatusToquxiao', function (req, res, next) {
  console.log(req.body)
  Yuyue.findByIdAndUpdate(req.body.id, {
    status: req.body.status
  }, function (err) {
    if (err)
      return res.status(500).send("server error")
    //req.session.user.password = md5(md5(req.body.pass)) 
    res.send('修改成功')
  })
})

router_xcx.post('/getAllQuestion', function (req, res) {
  Advisory.find(function (err, data) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(data))
  })
})

router_xcx.post('/getDisease', function (req, res) {
  Disease.find(function (err, data) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(data))
  })
})


router_xcx.get('/at', function (req, res, next) {
  let obj={
    id:1,
    title:'84岁钟南山再次出马，这次，是为了世界',
    picture:'',
    date:'2020-04-03',
    author:'小乐',
    text:`<p>&nbsp;最近，看到了张文宏教授说的这样一段话：</p><p><br></p><p>&nbsp;“中国最艰难的一段时间已经过掉了……看看下一阶段，中国能不能也为世界做些什么。”<br></p><p><br></p><p><img src="http://sports-files.lifesense.com/o_1e379s8oe1o0s1hb71of6uus3d7.jpg" style="max-width:100%;"><br></p><p><br></p><p>为了帮助世界，中国捐物资，派专家团队，据环球时报报道，欧洲求助钟南山，钟南山与欧洲呼吸学会候任主席安妮塔·西蒙斯博士视频连线，全程英语分享中国经验。</p><p><br></p><p>记得俄罗斯“扔下物资就跑”的硬核支援方式，曾让所有人哭笑不得——这可真是“铁憨憨”！</p><p><br></p><p>可看了中国帮助世界的阵仗，才知道什么是真正的“铁憨憨”。</p><p><br></p><p>中国的“傻气”，终于藏不住了。</p><p><br></p><p><strong>01：患难见真情</strong></p><p><br></p><p>时间回到一个多月前。</p><p><br></p><p>中国爆发疫情，武汉人民正处在病毒肆虐的水深火热之中。</p><p><br></p><p>缺医生、缺物资、缺床位......武汉不断增加的确诊人数，纠动着每一个中国人的心。</p><p><br></p><p>一方有难，八方支援。</p><p><br></p><p>而让人意外的是，为武汉送去薪火的，不只有相拥的中国人，还有其他国家。</p><p><br></p><p>日本向中国捐赠了100万只口罩、10万套防护服。</p><p><br></p><p>贴在箱子上的暖心鼓励，更是让很多人瞬间泪奔——“山川异域，风月同天”。</p><p><br></p><p><img src="http://sports-files.lifesense.com/o_1e379t6ti1frjreg188f11qmr38h.jpg" style="max-width:100%;"><br></p><p><br></p><p>还有伊朗。</p><p><br></p><p>他们紧急捐赠了100万支N95口罩发往北京。</p><p><br></p><p>要知道，伊朗的经济状况在近几年持续低迷，这100万只口罩还是他们倾全国之力紧急筹集的。</p><p><br></p><p><img src="http://sports-files.lifesense.com/o_1e379thkdj85e91le6qen1rcmm.jpg" style="max-width:100%;"><br></p><p><br></p><p>而对于欧洲其他国家，我们的“国宝”钟南山也出马了。</p><p><br></p><p><b>近日，钟南山应邀向欧洲呼吸学会介绍中国经验。</b></p><p><b><br></b></p><p><img src="http://sports-files.lifesense.com/o_1e37a83qv1ktd12jjslep0617da23.jpg" style="max-width:100%;"><b><br></b></p><p><br></p><p>中国曾受到各个国家的帮助，此刻，虽然中国还未完全脱离疫情状况，但仍愿意付出全力，帮助整个世界的人，度过难关。</p><p><br></p><p>列夫托尔斯泰曾说：“没有单纯、善良和真实，就没有伟大。”</p><p><br></p><p>而国家的强大，应该也是如此评定——心存善念，亦有力量对世界施以善行。何其有幸，生在这样一个温柔而伟大的国家。如今疫情肆虐全球，中国也在全面抗疫。</p><p></p><p><br></p><p>唯愿早日战胜疫情。</p><p><br></p><p></p><p>唯愿日本的樱花，韩国的木槿花，意大利的雏菊，伊朗的蔷薇，能像武汉的樱花一样，如期开放。</p><p><br></p><p></p><p>那一天，不会很远的。</p>`
    
  }
  new news(obj).save(function(err,data){
    res.send('保存成功1')
  })
})

router_xcx.post('/getNews', function (req, res) {
  news.find(function (err, data) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(data))
  })
})














module.exports = router_xcx 
