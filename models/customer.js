var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  name: {
    type: String,
    required: false
  },
  birthday: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  idcard: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: true
  },
  insertDate: {
    type: Date,
    required:false,
    default:Date.now
  },
  email:{
    type: String,
    required: false
  }

})

module.exports = mongoose.model('Customer', userSchema)
