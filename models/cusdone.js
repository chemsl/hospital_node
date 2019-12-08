var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  medicine:{//药品
    type:Array,
    require:true
  },
  cusId:{
    type:String,
    required:true
  },
  done_date:{
    type:Date,
    required:true,
    default:Date.now
  },
  age:{
    type:String,
    required:true
  },
})

module.exports = mongoose.model('Cusdetail', userSchema)
