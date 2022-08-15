const mongoose = require('mongoose');
const { Schema } = mongoose;

const shop = new Schema({
  title:  String,
  createDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Shop", shop);