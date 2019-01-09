let mongoose = require("mongoose");

//Article Schema
let temperatureSchema = mongoose.Schema({
  timestamp: {
    type: String,
    required: true
  },
  teamID: {
    type: Number,
    required: true
  },
  temp: {
    type: Number,
    required: true
  }
});

let Temperature = (module.exports = mongoose.model(
  "Temperature",
  temperatureSchema
));
