let mongoose = require("mongoose");
// require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;

//Article Schema
let temperatureSchema = mongoose.Schema({
  timestamp: {
    type: String,
    // timestamps: true,
    required: true
  },
  teamID: {
    type: Number,
    required: true
  },
  temp: {
    type: Number,
    required: true
  },
  humid: {
    type: Number,
    required: true
  }
});

let Temperature = (module.exports = mongoose.model(
  "Temperature",
  temperatureSchema
));
