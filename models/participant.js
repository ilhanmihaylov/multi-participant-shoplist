const mongoose = require('mongoose');
const { Schema } = mongoose;

const participant = new Schema({
  name:  String,
  createDate: { type: Date, default: Date.now },
  shop_id: String,
});

module.exports = mongoose.model("Participant", participant);