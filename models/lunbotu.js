var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  picture:{
    type:String,
    required:false
  },
  title:{
    type:String,
    required:false
  },
  description:{
    type:String,
    required:false
  },
  path:{
    type:String,
    required:false
  }
})

module.exports = mongoose.model('Lunbotu', userSchema)
