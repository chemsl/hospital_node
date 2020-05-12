var express = require('express')
var Doctor = require('./models/doctor')
var Admin = require('./models/admin')
var yuyue = require('./models/yuyue')
var Customer = require('./models/customer')
var Yaopinlist = require('./models/yaopinlist')
var Cusdetail = require('./models/cusdetail')
var Historycuer = require('./models/historycuer')
var Lunbotu = require('./models/lunbotu')
var news = require('./models/new')
var md5 = require('blueimp-md5')
var fs = require('fs')
var router = express.Router()

router.post('/addjson', function (req, res) {
  let body=JSON.stringify(req.body)
  fs.writeFile('./hw.json', body, function (error) {
    if (error) {
      res.send('err')
    } else {
      res.send('ok')
    }
  })
})

router.post('/getjson', function (req, res) {
  let body=JSON.stringify(req.body)
  fs.readFile('./hw.json',function(error,data){
    // 判断
    if(error){
      res.send('err')
    }else{
      // 转字符
      res.send(data)
    }
  })
})

router.get('/', function (req, res) {
  // console.log(req.session.user)
  res.render('login.html', {
  })
})

router.get('/aaa', function (req, res) {
  let object = {
    name: 'bob',
    age: 18
  }
  res.send(object)

})



router.post('/login', function (req, res, next) {
  // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var body = req.body
  Doctor.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      // return res.status(500).json({
      //   err_code: 500,
      //   message: err.message
      // })
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

    // res.status(200).json({
    //   err_code: 0,
    //   message: 'OK'
    // })
    res.send({
      err_code: 0,
      message: 'OKk'
    })
  })
})




router.post('/register', function (req, res, next) {
  // 1. 获取表单提交的数据
  //    req.body
  // 2. 操作数据库
  //    判断改用户是否存在
  //    如果已存在，不允许注册
  //    如果不存在，注册新建用户
  // 3. 发送响应
  var body = req.body
  Doctor.findOne({
    $or: [{
      email: body.email
    },
    {
      nickname: body.nickname
    }
    ]
  }, function (err, data) {
    if (err) {
      // return res.status(500).json({
      //   success: false,
      //   message: '服务端错误'
      // })
      return next(err)
    }
    // console.log(data)
    if (data) {
      // 邮箱或者昵称已存在
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname aleady exists.'
      })
      return res.send(`邮箱或者密码已存在，请重试`)
    }

    // 对密码进行 md5 重复加密
    body.password = md5(md5(body.password))

    new Doctor(body).save(function (err, user) {
      if (err) {
        return next(err)
      }

      // 注册成功，使用 Session 记录用户的登陆状态
      req.session.user = user

      // Express 提供了一个响应方法：json
      // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })

      // 服务端重定向只针对同步请求才有效，异步请求无效
      // res.redirect('/')
    })
  })
})

router.get('/logout', function (req, res) {
  // 清除登陆状态
  req.session.user = null

  // 重定向到登录页
  res.redirect('/login')
})






//以下是super的路由
router.post('/getCheck', (req, res, next) => {
  console.log(req.body)
  var body = req.body
  if (req.body.type === 'doctor') {
    Doctor.findOne({
      doctorid: body.doctorid,
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
      console.log(req.session.user, 168);

      res.status(200).json({
        err_code: 0,
        message: 'ok!',
        session: user
      })
    })
  }
  else {
    Admin.findOne({
      doctorid: body.doctorid,
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
  }
});


router.post('/getSession', function (req, res, next) {
  res.send(req.session.user)
})

router.get('/logOut', function (req, res) {
  console.log('logout');

  req.session.user = null;
  res.status(200).json({
    err_code: 0,
    message: '登出成功'
  })
})


router.post('/checkPwd', (req, res, next) => {
  // console.log(req.session.user)
  Doctor.findById(req.session.user._id, function (err) {
    if (err)
      return res.status(500).send("server error")
    //console.log(md5(md5(req.body.oldpass)),req.session.user.password);

    if (md5(md5(req.body.oldpass)) === req.session.user.password) { //旧密码输入正确，才允许继续
      Doctor.findByIdAndUpdate(req.session.user._id, {
        password: md5(md5(req.body.pass))
      }, function (err) {
        if (err)
          return res.status(500).send("server error")
        req.session.user.password = md5(md5(req.body.pass))
        res.status(200).json({
          err_code: 0,
          message: 'ok!'
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

router.get('/yuyue', function (req, res) {
  yuyue.find(function (err, customer) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(customer))
  })
})

router.get('/yaoPinList', function (req, res) {
  Yaopinlist.find(function (err, yaopinlist) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(yaopinlist))
  })
})

router.post('/updateCusStatus', function (req, res) {
  yuyue.findByIdAndUpdate(req.body._id, {
    status: "治疗中"
  }, function (err) {
    if (err)
      return res.status(500).send("server error")
    res.status(200).json({
      err_code: 0,
      message: 'ok!111'
    })
  })
})

router.post('/postAllDoctor', function (req, res) {
  Doctor.find(function (err, doctor) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(doctor))
  })
})

router.post('/getThisCusAllList', function (req, res) {
  yuyue.find({
    cusId: req.body.cusId
  }, function (err, customer) {

    res.send(JSON.stringify(customer))
  })
})


router.post('/saveCusDetail', function (req, res, next) {
  Cusdetail.findOne({ _id: req.body._id }, function (err, data) {
    if (data) { //如果集合里存在，就更新。否则执行else的save(增添数据)
      Cusdetail.findByIdAndUpdate(req.body._id, {
        content: req.body.content,
        medicine: req.body.medicine
      }, function (err) {
        if (err)
          return res.status(500).send("server error")
        res.status(200).json({
          err_code: 0,
          message: 'content修改成功'
        })
      })
    }
    else {
      new Cusdetail(req.body).save(function (err, data) {
        res.send('保存成功')
      })
    }

  })

})
router.post('/removeYyCus', function (req, res) {
  req.body.status = '问诊完成'
  console.log(req.body)
  new Historycuer(req.body).save(function (err) {
    yuyue.findByIdAndRemove(req.body._id, function (err) {
      if (err)
        return res.status(500).send("server error")
    })
    res.send('ookk')
  })
})

router.post('/getHistoryCuer', function (req, res) {
  Historycuer.find({
    doctorid: req.body.doctorid
  }, function (err, his) {
    res.send(JSON.stringify(his))
  })
})

router.post('/getAllCuer', function (req, res) { //
  Customer.find(function (err, customer) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(customer))
  })
})

router.post('/updateCusInformation', function (req, res) { //管理员修改customer信息(客户管理)
  console.log(req.body);
  Customer.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    birthday: req.body.birthday,
    gender: req.body.gender,
    address: req.body.address,
    email: req.body.email,
    phone: req.body.phone,
    insertDate: req.body.insertDate
  }, function (err) {
    if (err)
      return res.status(500).send("server error")
    res.status(200).json({
      err_code: 0,
      message: 'ok!111000'
    })
  })
})


router.post('/getCity', function (req, res) { //管理员页面客户管理患者地址的级联选择器
  var options = require('./public/js/city.js')
  res.send(options)
})



router.get('/test', function (req, res) {

  new Cusdetail(req.body).save(function (err, data) {
    res.send('保存成功')
  })
})


var Xcxindexpageinfors = require('./models/xcxindexpageinfors')
var Keshi = require('./models/keshi')
var Disease = require('./models/disease')
var DiseaseInfo = require('./models/diseaseInfo')
router.get('/toAddData', function (req, res, next) {
  let obj = {
    id: 'yanjing4',
    name: '干燥综合征',
    ovewview: '干燥综合征是一种全身外分泌腺的慢性炎症性的自身免疫病, 主要侵犯泪腺和大小唾液腺等，导致腺体破坏和分泌减少或缺乏，临床表现以眼和口腔粘膜为主的干燥症状，呼吸道、消化道、泌尿道、神经、肌肉、关节等均可受损。分为原发性和继发性两种，前者指有干燥性角结膜炎和口腔干燥而不伴有其他结缔组织病;而后者则指伴发其他结缔组织病。',
    keshi: '眼科',
    cause: '（一）感染 （二）过敏体质 （三）遗传因素',
    description: '起病多数呈隐袭和慢性进展，少数急和进展快。本病系累及多系统的疾病。 （一）口腔 轻度病变常被病人忽视，较重时唾液少，食物刺激和咀嚼不能相应增加唾液分泌，舌红、干裂或溃疡，活动不便，舌系带底部无唾液积聚，咀嚼和吞咽困难。龋齿和齿龈炎常见，牙齿呈粉末状或小块破碎掉落，唇和口角干燥皲裂，有口臭。约半数病人反复发生腮腺肿大，重度时形成松鼠样脸，颔下腺亦可肿大。 （二）眼呈干燥性角结膜炎，眼觉干燥、痒痛，可有异物或烧灼感，视力模糊，似有幕状物，畏光，角膜可混浊，有糜烂或溃疡，小血管增生，严重时可穿孔。可合并虹膜脉络膜炎;结膜发炎，球结膜血管扩张；泪液少，少数泪腺肿大，易并发细菌、真菌和病毒感染。偶见有突眼为首发症状的。 （三）呼吸道：鼻粘膜腺体受侵犯引起鼻腔干燥，鼻痂形成，常有鼻衄和鼻中膈炎，欧氏管堵塞可发生浆液性中耳炎，传导性耳聋；咽喉干燥，有声音嘶哑，痰液稠粘，并发气管炎、支气管炎、胸膜炎、间质性肺炎和肺不张，临床无明显肺部病变的患者可有限制性换气障碍和气体弥漫功能下降。 （四）消化道：咽部和食管干燥可使吞咽困难，胃粘膜因腺淋巴细胞浸润增大，胃粘膜皱襞粗大，胃酸分泌减少小肠吸收功能可受损，对胃泌素和促胰酶素的反应有障碍。 （五）泌尿道：肾病变占1/3，常见为间质性肾炎，有肾小管功能缺陷，呈肾小管性酸中毒、肾性糖尿、氨基酸尿，和尿酸再吸收减少等，亦有并发肾小球肾炎，系IgM和补体在肾小球沉积。 （六）神经系统：各水平的神经组织可受损，中枢神经累及为25%、周围神经为10%～43%。前者从脑膜到脑实质和各个部位的脊髓都可受累，周围神经的部位广泛，包括神经根、轴索、髓鞘、感觉和运动支均可累及；临床表现多样，包括精神障碍、抽搐、偏盲、失语、偏瘫、截瘫，共济失调等。 （七）肌肉：累及占2%左右，表现为肌痛，肌无力，由间质性肌炎造成，间质小血管周围有淋巴细胞和单核细胞浸润，也可出现绿发于肾小管酸中毒、低血钾造成的周期性麻痹。 （八）关节：约10%病例累及关节，呈现肿痛，常为非侵犯性关节为。 （九）皮肤粘膜：干燥如鱼鳞病样，有结节性红斑、紫癜，雷诺现象和皮肤溃疡;阴道粘膜亦可干燥和萎缩。 （十）淋巴结：局部或全身淋巴结可肿大。',
    find: '1.血液学检查：轻度正细胞正色素性贫血，白细胞减少，血沉增快。特异性抗体抗SS-A抗体和抗SS-B抗体，阳性率分别达70%～75%和48%～60%。90%以上胡总奈何有高丙球蛋白血症。 2.泪腺和唾液腺功能测定：可定量测定干燥性角结膜炎和口干燥症的程度。',
    diagnosis: '1.干燥性角结膜炎；2.口干燥症；3.血清中有下列一种抗体阳性者：抗SS-A、抗SS-B，ANA>1：20、RF>1：20。具有上述3条，并除外其他结缔组织病和淋巴瘤、AIDS和GVH等疾病者可以确诊；只有上述二条并除外其他疾病者为可能病例。 本病需与系统性红斑狼疮、类风湿关节炎、血小板减少性紫癜、淋巴瘤、感染性疾病相鉴别。',
    prevention: '由于病因不清，目前尚无有效的预防措施',
    complication: '本病可累及全身，最多见于肺部。肺内病变严重者可出现肺大疱，气胸和支气管扩张，可发展成纤维化，引起肺功能不全和心力衰竭。眼部病变可造成严重的视力障碍。可并发尿崩症，出现Addison综合征，偶见蛋白尿、脓尿、血尿，高钙血症，肾功能衰竭等。',
    treatment: '无特殊治疗。注意口眼的卫D生，以0.5%甲基纤维素滴眼；时常以枸橼酸溶液漱口以刺激唾液腺分泌功能及代替部分唾液，以2%甲基纤维素餐前涂抹口腔偶可改善症状。在发生严重的功能改变及广泛的系统累及以及伴同其他结缔组织病时，可采用皮质类固醇、免疫抑制剂或雷公芚制剂，血浆置换治疗。'
  }
  new Disease(obj2).save(function (err, data) {
    res.send('保存成功')
  })
})

router.post('/abc', function (req, res) {
  Keshi.find(function (err, data) {
    if (err)
      return res.status(500).send("server err.")
    //console.log(data,446)
    res.send(data)
  })
})

router.post('/getlbt', function (req, res) {
  Lunbotu.find(function (err, data) {
    if (err)
      return res.status(500).send("server err.")
    res.send(data)
  })
})

router.post('/updatelbt', function (req, res, next) {
  console.log(req.body._id);

  Lunbotu.findByIdAndUpdate(req.body._id, {
    picture: req.body.picture,
    title: req.body.title,
    description: req.body.description,
    path: ''
  }, function (err) {
    if (err)
      return res.status(500).send("server error")
    res.send('修改成功')
  })
})
router.post('/addNews', function (req, res, next) {
  new news(req.body).save(function (err, data) {
    res.send('保存成功')
  })
})
router.post('/getNewsPC', function (req, res) {
  news.find(function (err, data) {
    if (err)
      return res.status(500).send("server err.")
    res.send(JSON.stringify(data))
  })
})
router.post('/updateNewsPC', function (req, res) {
  news.findByIdAndUpdate(req.body._id, {
    author: req.body.author,
    date: req.body.date,
    title: req.body.title,
  }, err => {
    if (err)
      return res.status(500).send("server error")
    res.send('修改成功')
  })
})
router.post('/deleteNewsPC', function (req, res) {
  news.findByIdAndRemove(req.body._id, err => {
    if (err)
      return res.status(500).send("server err.")
    res.send('删除成功')
  })
})

router.post('/deleteDoctor', function (req, res) {
  Doctor.findByIdAndRemove(req.body._id, err => {
    if (err)
      return res.status(500).send("server err.")
    res.send('删除成功')
  })
})

// var test = require('./models/test')
// router.post('/ttest', function (req, res) {
//   console.log(req.body);
//   let arr=req.body.arr
//   for(let i of arr){
//     new test(i).save(function(err,data){

//     })
//   }
//   res.send('保存成功')
// })

router.post('/AddDoctor', function (req, res) {
  req.body.password = md5(md5(req.body.password))
  console.log(req.body);

  new Doctor(req.body).save(function (err, data) {
    res.send('保存成功')
  })
})
var fs = require('fs')
router.get('/getQues', function (req, res) {
  fs.readFile('./test.json', function (err, data) {
    res.send(data)
  })
})






module.exports = router
