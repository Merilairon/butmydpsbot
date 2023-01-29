const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  discordId: String,
  apiKey: String,
});

let model = mongoose.model("DiscordAccounts", schema);
module.exports = model;