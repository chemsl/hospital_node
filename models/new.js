var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  id:{
    type:String||Number,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  picture:{
    type:String,
    required:false
  },
  date:{
    type:String||Date,
    required:false
  },
  author:{
    type:String,
    required:false
  },
  text:{
    type:String,
    required:true
  },
})

module.exports = mongoose.model('New', userSchema)
