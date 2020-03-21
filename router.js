var express = require('express')
var Doctor = require('./models/doctor')
var Admin = require('./models/admin')
var yuyue = require('./models/yuyue')
var Customer = require('./models/customer')
var Yaopinlist = require('./models/yaopinlist')
var Cusdetail=require('./models/cusdetail')
var Historycuer=require('./models/historycuer')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function (req, res) {
  // console.log(req.session.user)
  res.render('index.html', {
    user: req.session.user
  })
})

router.get('/aaa', function (req, res) {
  
  let a={
    name:'bob',
    age:18
  }
  res.send(JSON.stringify(a))

  //res.render('login.html')
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
  //console.log(req.body)
  var body = req.body
  if(req.body.type==='doctor'){
    Doctor.findOne({
      email: body.email,
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
      console.log(req.session.user,168);
      
      res.status(200).json({
        err_code: 0,
        message: 'ok!',
        session:user
      })
    })
  }
  else{
    Admin.findOne({
      email: body.email,
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
        session:user
      })
    })
  }
});


router.post('/getSession', function (req, res, next) {
  console.log(req.session,22222);
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
    Cusdetail.findOne({_id:req.body._id},function(err,data){
      if(data){ //如果集合里存在，就更新。否则执行else的save(增添数据)
        Cusdetail.findByIdAndUpdate(req.body._id, {
          content:req.body.content,
          medicine:req.body.medicine
        }, function (err) {
          if (err)
            return res.status(500).send("server error")
          res.status(200).json({
            err_code: 0,
            message: 'content修改成功'
          })
        })
      }
      else{
        new Cusdetail(req.body).save(function(err,data){
          res.send('保存成功')
        })
      }
      
  })

})
router.post('/removeYyCus', function (req, res) {
  req.body.status='问诊完成'
  new Historycuer(req.body).save(function(err){
    yuyue.findByIdAndRemove(req.body._id,function(err){
      if(err) 
        return res.status(500).send("server error")
    })
    res.send('ookk')
  })
})

router.post('/getHistoryCuer', function (req, res) {
  Historycuer.find({
    doctorid: req.body.email
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
    name:req.body.name,
    birthday:req.body.birthday,
    gender:req.body.gender,
    address:req.body.address,
    email:req.body.email,
    phone:req.body.phone,
    insertDate:req.body.insertDate
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
    var options=require('./public/js/city.js')
    console.log(options);
    res.send(options)
})



router.get('/test', function (req, res) { //管理员页面客户管理患者地址的级联选择器

  new Cusdetail(req.body).save(function(err,data){
    res.send('保存成功')
  })
})


var Xcxindexpageinfors =require('./models/xcxindexpageinfors')
var Keshi = require('./models/keshi')
router.get('/toAddData', function (req, res, next) {
  let obj=
    {
      id:0,
      name: '康复科',
      time:[//该科室每个日期中,医生的排班数据
        {
          name:'3-25日',
          date:'03-25',
          doctor:[
            { doctorid:'2',
              name: '张医生',
              grade:'主治医师' ,
              number:[
              {num:1,state:'可预约',date:'8:05-9:00'},
              {num:2,state:'可预约',date:'9:00-10:00'},
              {num:3,state:'可预约',date:'10:00-11:00'},
              ]
            },
            { doctorid:'3',
              name: '林医生',
              grade:'主治医师' ,
              number:[
              {num:1,state:'可预约',date:'8:11-9:00'},
              {num:2,state:'可预约',date:'9:00-10:00'},
              {num:3,state:'可预约',date:'10:00-11:00'},
              ]
            },
            { doctorid:'4',
              name: '齐医生',
              grade:'主治医师' ,
              number:[
              {num:1,state:'可预约',date:'8:20-9:00'},
              {num:2,state:'可预约',date:'9:00-10:00'},
              {num:3,state:'可预约',date:'10:00-11:00'},
              ]
            },
          ],
        },
        {
          name:'3-26日',
          date:'03-26',
          doctor:[
            { doctorid:'3',
              name: '林医生',
              grade:'主治医师' ,
              number:[
              {num:1,state:'可预约',date:'8:00-9:00'},
              {num:2,state:'可预约',date:'9:00-10:00'},
              {num:3,state:'可预约',date:'10:00-11:00'},
              ]
            },
            { doctorid:'4',
              name: '钱医生',
              grade:'主治医师' ,
              number:[
              {num:1,state:'可预约',date:'8:10-9:00'},
              {num:2,state:'可预约',date:'9:00-10:00'},
              {num:3,state:'可预约',date:'10:00-11:00'},
              ]
            },
            { doctorid:'5',
              name: '孙医生',
              grade:'主治医师' ,
              number:[
              {num:1,state:'可预约',date:'8:20-9:00'},
              {num:2,state:'可预约',date:'9:00-10:00'},
              {num:3,state:'可预约',date:'10:00-11:00'},
              ]
            },
          ],
        },
      ]
    }
  new Keshi(obj).save(function(err,data){
    res.send('保存成功1')
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


module.exports = router  




