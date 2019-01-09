let mongoose = require("mongoose");

//Article Schema
let temperatureSchema = mongoose.Schema({
  timestamp: {
    type: Timestamp,
    required: true
  },
  teamID: {
    type: Number,
    required: true
  },
  temp: {
    type: Double,
    required: true
  }
});

let Temperature = (module.exports = mongoose.model(
  "Temperature",
  temperatureSchema
));
