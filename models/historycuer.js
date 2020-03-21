var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  cusId: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  },
  yydate: {
    type: Date,
    // 注意：这里不要写 Date.now() 因为会即刻调用
    // 这里直接给了一个方法：Date.now
    // 当你去 new Model 的时候，如果你没有传递 create_time ，则 mongoose 就会调用 default 指定的Date.now 方法，使用其返回值作为默认值
    required:false
  },
  yaopinlist: {
    type: String,
    required: false
  },
  age: {
    type: String,
    required: false
  },
  todoctorid: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  todoctorid:{
    type:String,
    required:false
  },
  doctorid:{
    type:String,
    required:false
  },
  keshi:{
    type:String,
    required:false
  },
  medicine:{
    type:Array,
    required:false
  },
  idcard:{
    type:String,
    required:false
  },
  content: {
    type: String,
    required: false
  },
})

module.exports = mongoose.model('Historycuer', userSchema)
