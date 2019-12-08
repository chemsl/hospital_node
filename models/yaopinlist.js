var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },
  demo: {
    type: String,
    required: true,
    default:'haha'
  }
})

module.exports = mongoose.model('Yaopinlist', userSchema)
