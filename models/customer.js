var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  zhenduancontent: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  yydate: {
    type: Date,
    // 注意：这里不要写 Date.now() 因为会即刻调用
    // 这里直接给了一个方法：Date.now
    // 当你去 new Model 的时候，如果你没有传递 create_time ，则 mongoose 就会调用 default 指定的Date.now 方法，使用其返回值作为默认值
    required:true,
    default:Date.now
  },
  yaopinlist: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  todoctorid: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Yuyue', userSchema)
