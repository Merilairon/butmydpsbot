const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  date: Date,
  
  encounterId: Number,
  encounterType: String,
  name: String,
  players: [
    {
      type: String,
    },
  ],
  duration: String,
  link: String,
  success: Boolean,
});

let model = mongoose.model("Logs", schema);
module.exports = model;
