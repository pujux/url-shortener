const mongoose = require('mongoose')

module.exports = mongoose.model('Short', new mongoose.Schema({
  slug: String,
  url: String,
  created: Number
}))
