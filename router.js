var express = require('express')
var Doctor = require('./models/doctor')
var Customer = require('./models/customer')
var Yaopinlist = require('./models/yaopinlist')
var Cusdetail=require('./models/cusdetail')
var md5 = require('blueimp-md5')
var router = express.Router()

router.get('/', function (req, res) {
  // console.log(req.session.user)
  res.render('index.html', {
    user: req.session.user
  })
})

router.get('/login', function (req, res) {
  res.cookie('username', 'haha');
  res.cookie("id", 123);
  res.cookie("usergroup", 'boy');
  res.cookie("realname", 'heihei');
  res.send()
  //res.render('login.html')
})

router.post('/login', function (req, res, next) {
  // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var body = req.body
  console.log(body.email);

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
      message: 'OK'
    })
  })
})


router.get('/register', function (req, res, next) {
  res.render('register.html')
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
  //1console.log(req.body)
  var body = req.body
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
    res.status(200).json({
      err_code: 0,
      message: 'ok!'
    })
  })
});

router.get('/getSession', function (req, res, next) {
  //console.log(req.session.user);

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
  console.log(req.body)
  Doctor.findById(req.session.user._id, function (err) {
    if (err)
      return res.sres.sendtatus(500).send("server error")
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
  Customer.find(function (err, customer) {
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

  Customer.findByIdAndUpdate(req.body._id, {
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
  Customer.find({
    cusId: req.body.cusId
  }, function (err, customer) {
    console.log(customer);
    
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
  console.log(req.body._id);
  Customer.findByIdAndRemove(req.body._id,function(err){
    if(err) 
      return res.status(500).send("server error")
    res.send('删除成功')
  })
})

module.exports = router 
