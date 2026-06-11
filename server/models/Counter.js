const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: 'url_count',
  },
  sequence_value: {
    type: Number,
    required: true,
    default: 1000,
  },
});

module.exports = mongoose.model('Counter', counterSchema);
