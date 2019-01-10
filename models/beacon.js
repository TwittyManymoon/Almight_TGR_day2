let mongoose = require("mongoose");
// require('mongoose-double')(mongoose);

//Article Schema
let beaconSchema = mongoose.Schema({
    Timestamp: {
        type: Date,
        // timestamps: true,
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

let Beacon = (module.exports = mongoose.model(
    "Beacon",
    beaconSchema
));
