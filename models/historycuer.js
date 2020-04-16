var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  createDate: {
    type: Date,
    required: false
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
    required: false
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
    required: true
  },
  content: {
    type: String,
    required: false
  },
  medicine: {
    type: Array,
    required: false
  },
})

module.exports = mongoose.model('Historycuer', userSchema)
