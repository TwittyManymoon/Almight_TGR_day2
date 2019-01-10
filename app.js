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
let Sensors = require("./models/sensors");

let Barometer = require("./models/barometer");
let Humidity = require("./models/humidity");
let Accelerometer = require("./models/accelerometer");
let Gyrometer = require("./models/gyrometer");
let Magnetometer = require("./models/magnetometer");
let Digitalinput = require("./models/digitalinput");
let Digitaloutput = require("./models/digitaloutput");

var payload, teamID, timestamp, barovalue, tempvalue, humidvalue, accexvalue, acceyvalue, accezvalue,
    gyroxvalue, gyroyvalue, gyrozvalue, magvalue, digitalinvalue, digitaloutvalue,
    invalue, outvalue;

/*------------ Database setup : EDIT ------------*/

// :: MongoDB ATLAS
// mongoose.connect(
//   "mongodb+srv://root:1234@topgunkmutt-j8ejr.gcp.mongodb.net/test?retryWrites=true",
//   { useNewUrlparser: true }
// );

// :: MongoDB Localhost
// mongoose.connect("mongodb://202.139.192.89/TGR_2019_Almight")
var option = { auth: { user: "Twitty", password: "thigmal1234" } };
mongoose.connect("mongodb://Twitty:thigmal1234@202.139.192.89/Almight_Integration", { useNewUrlParser: true });


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

// // Dashboard
// app.get('/showData', (req, res) => {
//     res.send(`Dashboard\n
//                Timestamp          :     ${timestamp}\n
//                Team ID            :     ${teamID}\n
//                Temperature        :     ${tempvalue}  Celsius\n
//  `);

// });

// // Dashboard
// app.get('/showData', (req, res) => {
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

/*------------ API : Main : Get data from sensors, send to MongoDB ------------*/

app.post("/receiveData", (req, res) => {

    let barometer = new Barometer();
    let sensors = new Sensors();
    let humidity = new Humidity();
    let accelerometer = new Accelerometer();
    let gyrometer = new Gyrometer();
    let magnetometer = new Magnetometer();
    let digitalinput = new Digitalinput();
    let digitaloutput = new Digitaloutput();

    devEUI = JSON.stringify(req.body.DevEUI_uplink.DevEUI);                                 // DevEUI
    teamID = devEUI[devEUI.length - 3] + devEUI[devEUI.length - 2];         // Team ID 
    payload = JSON.stringify(req.body.DevEUI_uplink.payload_hex);                           // Payload

    // payload2 = req.body.DevEUI_uplink;
    // payload3 = req.body.DevEUI_uplink.payload;
    timestamp = JSON.stringify(req.body.DevEUI_uplink.Time);                                // Timestamp
    // bbb = req.body;
    // console.log(`fucking data : ${teamID} = ${payload}`);        
    console.log(`payload : ${payload}`);
    console.log(`body : ${devEUI}`);
    console.log(`teamID : ${teamID}`);

    // ------- Keep value ------

    // :: Team ID & Timestamp
    sensors.Timestamp = timestamp;
    sensors.TeamID = teamID;

    // :: Temperature (Signed)
    tempvalue = parseInt(payload.slice(5, 9), 16);

    if (tempvalue >= 32768) {
        tempvalue = ((65536 - tempvalue) * -0.1).toFixed(2);
    } else {
        tempvalue = (tempvalue * 0.1).toFixed(2);
    }

    sensors.Temperature = tempvalue;

    console.log(`timestamp : ${timestamp}`)
    console.log(`temp : ${tempvalue}`);        // Server Debugger (Payload)
    // console.log(`tempnum : ${tempnum}`);


    // :: Humidity
    humidvalue = (parseInt(payload.slice(13, 15), 16) * 0.5).toFixed(2);
    sensors.Humidity = humidvalue;
    console.log(`hunmid : ${humidvalue}`);

    // :: Person In
    invalue = (parseInt(payload.slice(19, 23), 16) * 1);
    sensors.P_IN = invalue;
    console.log(`in : ${invalue}`);

    // :: Person In
    outvalue = (parseInt(payload.slice(27, 31), 16) * 1);
    sensors.P_OUT = outvalue;
    console.log(`out : ${outvalue}`);


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
    sensors.save(err => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("all saved");
            // res.redirect("/");
        }
    });

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

// 
/*------------ API : Add 1 data by Team ID ------------*/
app.post("/addData", (req, res) => {
    let sensors = new Sensors();

    sensors.Timestamp = req.body.Timestamp;
    sensors.TeamID = req.body.TeamID;
    sensors.Temperature = req.body.Temperature;
    sensors.Humidity = req.body.Humidity;
    sensors.P_IN = req.body.P_IN;
    sensors.P_OUT = req.body.P_OUT;

    sensors.save(err => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("all saved");
            // res.redirect("/");
        }
    });
})


/*------------ API : Delete all data followed by TeamID ------------*/
app.delete("/deleteData/:teamID", (req, res) => {

    let ID = req.params.teamID;
    Sensors.remove({ TeamID: ID }, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            res.send(data);
            console.log(data);
        }
    });
})

/*------------ API : Show all data ------------*/

app.get("/showData", (req, res) => {

    Sensors.find({}, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        else {
            res.send(data);
            console.log(data);
        }
    }
    )

});




// });

/*------------ Start Server ------------*/

app.listen(8080, () => {
    console.log("Server is started on port 8080");
});

// // :: Sample Payload
// //   "00732772016700eb02687103710010fffd04030486ffc8ffeb00c405021585060064070100";
