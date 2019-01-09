let mongoose = require("mongoose");

//Article Schema
let temperatureSchema = mongoose.Schema({
  timestamp: {
    type: String,
    required: true
  },
  teamID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

let Temperature = (module.exports = mongoose.model(
  "Temperature",
  temperatureSchema
));
