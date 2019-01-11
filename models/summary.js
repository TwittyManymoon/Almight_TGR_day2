let mongoose = require("mongoose");
// require('mongoose-double')(mongoose);

//Article Schema
let summarySchema = mongoose.Schema({
    Timestamp: {
        type: Date,
        // timestamps: true,
        //  default: Date.now,
        // default: new Date()
        require: true
    },
    hour0: {
        type: Number,
        default: 0
    },
    hour1: {
        type: Number,
        default: 0
    },
    hour2: {
        type: Number,
        default: 0
    },
    hour3: {
        type: Number,
        default: 0
    },
    hour4: {
        type: Number,
        default: 0
    },
    hour5: {
        type: Number,
        default: 0
    },
    hour6: {
        type: Number,
        default: 0
    },
    hour7: {
        type: Number,
        default: 0
    },
    hour8: {
        type: Number,
        default: 0
    },
    hour9: {
        type: Number,
        default: 0
    },
    hour10: {
        type: Number,
        default: 0
    },
    hour11: {
        type: Number,
        default: 0
    },
    hour12: {
        type: Number,
        default: 0
    },
    hour13: {
        type: Number,
        default: 0
    },
    hour14: {
        type: Number,
        default: 0
    },
    hour15: {
        type: Number,
        default: 0
    },
    hour16: {
        type: Number,
        default: 0
    },
    hour17: {
        type: Number,
        default: 0
    },
    hour18: {
        type: Number,
        default: 0
    },
    hour19: {
        type: Number,
        default: 0
    },
    hour20: {
        type: Number,
        default: 0
    },
    hour21: {
        type: Number,
        default: 0
    },
    hour22: {
        type: Number,
        default: 0
    },
    hour23: {
        type: Number,
        default: 0
    }
});

let Summary = (module.exports = mongoose.model(
    "Summary",
    summarySchema
));
