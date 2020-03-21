var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  id:{
    type:String||Number,
    required:false
  },
  name:{
    type:String,
    required:true
  },
  urlname:{
    type:String,
    required:true
  },
  url:{
    type:String,
    required:true
  },
  img:{
    type:String,
    required:true
  },
})

module.exports = mongoose.model('Xcxindexpageinfor', userSchema)
