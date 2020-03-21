var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  createDate: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  idcard: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  keshi: {
    type: String,
    required: true
  },
  doctorname: {
    type: String,
    required: true
  },
  doctorid: {
    type: String,
    required: true
  },
  yydate: {
    type: String,
    required: true
  },
  yynum: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default:'排队中'
  },
})

module.exports = mongoose.model('Yuyue', userSchema)
