/*

// ---- TGR 2019 : Server Side ----
// Gets sensors data from STM32 LoraWan by using POST method, also stores in MongoDB
// consists of                                        
//                Payload
//                Timestamp
//                Team ID
//                Barometer
//                Temperature
//                Humidity
//                Accelerometer_X
//                Accelerometer_Y
//                Accelerometer_Z     
//                Gyrometer_X        
//                Gyrometer_Y        
//                Gyrometer_Z        
//                Magnetometer       
//                DI                 
//                DO

// There are 7 parts

//   1. Initialization
//   2. Database Setup
//   3. Create Middleware
//   4. Create API Route
//   5. Main : handle value from sensors***
//   6. Save values from sensors to database
//   7. Start Server

// : Developed by :
// ----- Twitty Manymoon
// ----- Bosskmt Surangsuriyakul

/*

/*------------ Initialization ------------*/

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const port = 8080;
//const Schema = mongoose.Schema;

//Init app
const app = express();

// :: Bring in model
let Barometer = require("./models/barometer");
let Temperature = require("./models/temperature");
let Humidity = require("./models/humidity");
let Accelerometer = require("./models/accelerometer");
let Gyrometer = require("./models/gyrometer");
let Magnetometer = require("./models/magnetometer");
let Digitalinput = require("./models/digitalinput");
let Digitaloutput = require("./models/digitaloutput");

var payload, teamID, timestamp, barovalue, tempvalue, humidvalue, accexvalue, acceyvalue, accezvalue,
    gyroxvalue, gyroyvalue, gyrozvalue, magvalue, digitalinvalue, digitaloutvalue;

/*------------ Database setup : EDIT ------------*/

// :: MongoDB ATLAS
// mongoose.connect(
//   "mongodb+srv://root:1234@topgunkmutt-j8ejr.gcp.mongodb.net/test?retryWrites=true",
//   { useNewUrlparser: true }
// );

// :: MongoDB Localhost
// mongoose.connect("mongodb://202.139.192.89/TGR_2019_Almight")
var option = { auth: { user: "Twitty", password: "thigmal1234" } };
mongoose.connect("mongodb://Twitty:thigmal1234@202.139.192.89/hwData", { useNewUrlParser: true });


let db = mongoose.connection;

db.once("open", () => {
    console.log("Connected to mongodb");
});

db.on("error", err => {
    console.log(err);
});

/*------------ Create middleware ------------*/

// Load engine
app.use(bodyparser.urlencoded({ entended: false }));
app.use(bodyparser.json());

/*------------ Create API route : EDIT ------------*/

// Test 1
// app.get('/api/:data', (req, res) => {
//   console.log(req.body);
//   res.send(req.body)
// });

// Test 2
// app.get('/api/almight', (req, res) => {
//     console.log(`Someone access your motherfucking server : ${payload}`);
//     res.send(`Welcome motherfucker, your motherfucking data: ${payload}`);
// });

// Dashboard
// app.get('/api/dashboard', (req, res) => {
//     res.send(`Dashboard\n
//                Raw Data           :     ${payload}\n
//                Timestamp          :     ${timestamp}\n
//                Team ID            :     ${teamID}\n
//                Barometer          :     ${barovalue}  hectopascal\n
//                Temperature        :     ${tempvalue}  Celsius\n
//                Humidity           :     ${humidvalue} % RHO\n
//                Accelerometer_X    :     ${accexvalue} G\n
//                Accelerometer_Y    :     ${acceyvalue} G\n
//                Accelerometer_Z    :     ${accezvalue} G\n
//                Gyrometer_X        :     ${gyroxvalue} °/s\n
//                Gyrometer_Y        :     ${gyroyvalue} °/s\n
//                Gyrometer_Z        :     ${gyrozvalue} °/s\n
//                Magnetometer       :     ${magvalue}   tesla\n
//                DI                 :     ${digitalinvalue}\n
//                DO                 :     ${digitaloutvalue}\n `);

// });

// Main : handle values from sensors

app.post("/receiveData", (req, res) => {

    let barometer = new Barometer();
    let temperature = new Temperature();
    let humidity = new Humidity();
    let accelerometer = new Accelerometer();
    let gyrometer = new Gyrometer();
    let magnetometer = new Magnetometer();
    let digitalinput = new Digitalinput();
    let digitaloutput = new Digitaloutput();

    devEUI = req.body.DevEUI_uplink.DevEUI;                                 // DevEUI
    teamID = devEUI[devEUI.length - 2] + devEUI[devEUI.length - 1];         // Team ID 
    payload = req.body.DevEUI_uplink.payload_hex;                           // Payload
    body = req.body;
    // payload2 = req.body.DevEUI_uplink;
    // payload3 = req.body.DevEUI_uplink.payload;
    // timestamp = req.body.DevEUI_uplink.Time;                                // Timestamp
    // bbb = req.body;
    // console.log(`fucking data : ${teamID} = ${payload}`);        
    console.log(`fucking data1 : ${payload}`);
    console.log(`fucking data2 : ${teamID}`);
    console.log(`body : ${JSON.parse(body)}`);
    console.log("abc");        // Server Debugger (Payload)



    // // :: Barometer
    // barovalue = (parseInt(payload.slice(4, 8), 16) * 0.1).toFixed(2);
    // barometer.timestamp = timestamp;
    // barometer.teamID = teamID;
    // barometer.name = "barometer";
    // barometer.value = barovalue;
    // barometer.unit = "hectopascal";


    // // :: Temperature (Signed)
    // tempvalue = parseInt(payload.slice(12, 16), 16);

    // if (tempvalue >= 32768) {
    //     tempvalue = ((65536 - tempvalue) * -0.1).toFixed(2);
    // } else {
    //     tempvalue = (tempvalue * 0.1).toFixed(2);
    // }
    // temperature.timestamp = timestamp;
    // temperature.teamID = teamID;
    // // temperature.name = "temperature";
    // temperature.temp = tempvalue;
    // // temperature.unit = "°C";

    // // :: Humidity
    // humidvalue = (parseInt(payload.slice(20, 22), 16) * 0.5).toFixed(2);
    // humidity.timestamp = timestamp;
    // humidity.teamID = teamID;
    // humidity.name = "humidity";
    // humidity.value = humidvalue;
    // humidity.unit = "%";

    // // :: Accelerometer (Signed)

    // // X-Axis
    // accexvalue = parseInt(payload.slice(26, 30), 16);
    // if (accexvalue >= 32768) {
    //     // accexvalue = ((65536 - accexvalue) * -0.001).toFixed(2);
    //     accexvalue = ((65536 - accexvalue) * -0.001).toFixed(4);
    // } else {
    //     accexvalue = (accexvalue * 0.001).toFixed(4);
    // }

    // // Y-Axis
    // acceyvalue = (parseInt(payload.slice(30, 34), 16));
    // if (acceyvalue >= 32768) {
    //     acceyvalue = ((65536 - acceyvalue) * -0.001).toFixed(4);
    // } else {
    //     acceyvalue = (acceyvalue * 0.001).toFixed(4);
    // }

    // // Z-Axis
    // accezvalue = (parseInt(payload.slice(34, 38), 16));
    // if (accezvalue >= 32768) {
    //     accezvalue = ((65536 - accezvalue) * -0.001).toFixed(4);
    // } else {
    //     accezvalue = (accezvalue * 0.001).toFixed(4);
    // }
    // accelerometer.timestamp = timestamp;
    // accelerometer.teamID = teamID;
    // accelerometer.name = "accelerometer";
    // accelerometer.valueX = accexvalue;
    // accelerometer.valueY = acceyvalue;
    // accelerometer.valueZ = accezvalue;
    // accelerometer.unit = "G";

    // // :: Gyrometer (Signed)

    // // X-Axis
    // gyroxvalue = parseInt(payload.slice(42, 46), 16);
    // if (gyroxvalue >= 32768) {
    //     gyroxvalue = ((65536 - gyroxvalue) * -0.01).toFixed(2);
    // } else {
    //     gyroxvalue = (gyroxvalue * 0.01).toFixed(2);
    // }
    // // Y-Axis
    // gyroyvalue = parseInt(payload.slice(46, 50), 16);
    // if (gyroyvalue >= 32768) {
    //     gyroyvalue = ((65536 - gyroyvalue) * -0.01).toFixed(2);
    // } else {
    //     gyroyvalue = (gyroyvalue * 0.01).toFixed(2);
    // }
    // // Z-Axis
    // gyrozvalue = parseInt(payload.slice(50, 54), 16);
    // if (gyrozvalue >= 32768) {
    //     gyrozvalue = ((65536 - gyrozvalue) * -0.01).toFixed(2);
    // } else {
    //     gyrozvalue = (gyrozvalue * 0.01).toFixed(2);
    // }
    // gyrometer.timestamp = timestamp;
    // gyrometer.teamID = teamID;
    // gyrometer.name = "gyrometer";
    // gyrometer.valueX = gyroxvalue;
    // gyrometer.valueY = gyroyvalue;
    // gyrometer.valueZ = gyrozvalue;
    // gyrometer.unit = "°/s";

    // // :: Magnetometer (Signed)

    // magvalue = (parseInt(payload.slice(58, 62), 16));
    // if (magvalue >= 32768) {
    //     magvalue = ((65536 - magvalue) * -0.01).toFixed(2);
    // } else {
    //     magvalue = (magvalue * 0.01).toFixed(2);
    // }
    // magnetometer.timestamp = timestamp;
    // magnetometer.teamID = teamID;
    // magnetometer.name = "magnetometer";
    // magnetometer.value = magvalue;
    // magnetometer.unit = "tesla";

    // // :: Digital Input
    // digitalinvalue = (parseInt(payload.slice(66, 68), 16) * 0.01).toFixed(2);
    // digitalinput.timestamp = timestamp;
    // digitalinput.teamID = teamID;
    // digitalinput.name = "digital_input";
    // digitalinput.value = digitalinvalue;
    // digitalinput.unit = "ON/OFF";

    // // :: Digital Output
    // digitaloutvalue = (parseInt(payload.slice(72, 74), 16) * 0.01).toFixed(2);
    // digitaloutput.timestamp = timestamp;
    // digitaloutput.teamID = teamID;
    // digitaloutput.name = "digital_output";
    // digitaloutput.value = digitaloutvalue;
    // digitaloutput.unit = "ON/OFF";

    // Save values from sensors to database

    // barometer.save(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         // console.log("baro saved");
    //         res.redirect("/");
    //     }
    // });
    // temperature.save(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         // console.log("temp saved");
    //         // res.redirect("/");
    //     }
    // });
    // humidity.save(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         // console.log("humid saved");
    //         // res.redirect("/");
    //     }
    // });
    // accelerometer.save(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         // console.log("acce saved");
    //         // res.redirect("/");
    //     }
    // });
    // gyrometer.save(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         // console.log("gyro saved");
    //         // res.redirect("/");
    //     }
    // });
    // magnetometer.save(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         // console.log("magne saved");
    //         // res.redirect("/");
    //     }
    // });
    // digitalinput.save(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         // console.log("digital_input saved");
    //         // res.redirect("/");
    //     }
    // });
    // digitaloutput.save(err => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     } else {
    //         // console.log("digital_output saved");
    //         // res.redirect("/");
    //     }
    // });
});

// API - Barometer ; http://'IP'/api/pressure/teamID/records

// app.get("/api/almight/pressure/:teamIDbar/:recordsbar", (req, res) => {

//     let teamID_bar = req.params.teamIDbar;
//     let records_bar = req.params.recordsbar;

//     let barro_array = [];

//     // initialize promise

//     var promise_bar = new Promise(function (resolve, reject) {
//         setTimeout(function () {
//             resolve();
//         }, 1000);
//     });

//     // async function

//     if (records_bar == "all") {
//         Barometer.find({ teamID: teamID_bar }, (err, value) => {
//             if (err) {
//                 console.log(err);
//             } else {

//                 for (let i = 0; i < value.length; i++) {
//                     console.log(`
//       timestamp : ${value[i].timestamp};
//       pressure : ${value[i].value}
//       `);
//                     promise_bar.then(function () {
//                         barro_array.push(value[i].value);
//                         console.log(barro_array);

//                     })

//                         .then(function () {
//                             res.send(`
//           pressure : ${barro_array}
//           `);
//                         });
//                 }
//             }
//         });
//     }

//     else {
//         records_bar = parseInt(records_bar, 10);
//         Barometer.find({ teamID: teamID_bar }, (err, value) => {
//             if (err) {
//                 console.log("bobo");
//             } else {

//                 for (let i = (value.length - 1); i > ((value.length) - records_bar) - 1; i--) { //wtf
//                     console.log(`
//       timestamp : ${value[i].timestamp};
//       pressure : ${value[i].value}
//       `);
//                     promise_bar.then(function () {
//                         barro_array.push(value[i].value);
//                         console.log(barro_array);

//                     })

//                         .then(function () {
//                             res.send(`
//               pressure : ${barro_array}
//               `);
//                         });


//                 }
//             }
//         });
//     }





// });

// /*------------ Start Server ------------*/

app.listen(8080, () => {
    console.log("Server is started on port 8080");
});

// // :: Sample Payload
// //   "00732772016700eb02687103710010fffd04030486ffc8ffeb00c405021585060064070100";
