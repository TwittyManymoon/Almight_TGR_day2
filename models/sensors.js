let mongoose = require("mongoose");
// require('mongoose-double')(mongoose);

//Article Schema
let sensorSchema = mongoose.Schema({
  Timestamp: {
    type: String,
    // timestamps: true,
    required: true
  },
  TeamID: {
    type: Number,
    required: true
  },
  Temperature: {
    type: Number,
    required: true
  },
  Humidity: {
    type: Number,
    required: true
  },
  P_IN: {
    type: Number,
    required: true
  },
  P_OUT: {
    type: Number,
    required: true
  }
});

let Sensors = (module.exports = mongoose.model(
  "Sensors",
  sensorSchema
));
