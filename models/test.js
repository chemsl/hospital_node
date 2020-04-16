var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  Collector: {
    type: String,
    required: false
  },
  activity: {
    type: String,
    required: false
  },
  activity_price: {
    type: String,
    required: false
  },
  add_time: {
    type: String,
    required: false
  },
  collection1: {
    type: String,
    required: false
  },
  ext_data: {
    type: String,
    required: false
  },
  namename: {
    type: String,
    required: false
  },
  num: {
    type: String,
    required: false
  },
  number1: {
    type: String,
    required: false
  },
  pic: {
    type: String,
    required: false
  },
  price: {
    type: String,
    required: false
  },
  price1: {
    type: String,
    required: false
  },
  selected: {
    type: String,
    required: false
  },
  selected1: {
    type: String,
    required: false
  },
  shopping: {
    type: String,
    required: false
  },
  teacher_name: {
    type: String,
    required: false
  },
  unit: {
    type: String,
    required: false
  },
  update_time: {
    type: String,
    required: false
  },
  uuid: {
    type: String,
    required: false
  },
  video: {
    type: String,
    required: false
  },
  id: {
    type: String||Number,
    required: false
  }

})

module.exports = mongoose.model('Test', userSchema)
