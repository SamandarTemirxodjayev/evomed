"use strict";

const mongoose = require("mongoose");
const QabulSchema = new mongoose.Schema({
  id: {
    type: String
  },
  doctor: {
    type: String
  },
  time: {
    type: String
  },
  date: {
    type: String
  }
});
const Qabul = mongoose.model('qabul', QabulSchema);
module.exports = Qabul;