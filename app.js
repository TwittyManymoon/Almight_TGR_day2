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

// Test : Add temperature, humidity, P_IN, P_OUT

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
let Beacon = require("./models/beacon");

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

// Test Dashboard
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

//////////////////////////////////////////////////////////////
/* SENSOR SENSOR SENSOR SENSOR SENSOR SENSOR SENSOR SENSOR */
//////////////////////////////////////////////////////////////
/* SENSOR SENSOR SENSOR SENSOR SENSOR SENSOR SENSOR SENSOR */
//////////////////////////////////////////////////////////////

/*------------ API : Main : Get data from sensors, send to MongoDB ------------*/

app.post("/sensorsData/receiveData", (req, res) => {

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
    sensors.Timestamp = new Date();
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

/*------------ API : show all or some temperature value ------------*/

app.get("/sensorsData/temperature/:teamID/:records", (req, res) => {

    let teamID = req.params.teamID;
    let records = req.params.records;

    let temp_array = [];
    let time_array = [];

    // initialize promise

    var promise_temp = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 1000);
    });

    // async function

    if (records == "all") {
        Sensors.find({ TeamID: teamID }, (err, value) => {
            if (err) {
                console.log(err);
            } else {

                for (let i = 0; i < value.length; i++) {
                    console.log(`
        timestamp : ${value[i].Timestamp}
        temperature : ${value[i].Temperature}
        `);
                    promise_temp
                        .then(function () {
                            temp_array.push(value[i].Temperature);
                            time_array.push(value[i].Timestamp);
                            // console.log(temp_array);

                        })

                        .then(function () {
                            res.send(`
            Temperature : ${temp_array}
            Timestamp : ${time_array}
            `);
                        });
                }
            }
        });
    }

    else {
        records = parseInt(records, 10);
        Sensors.find({ TeamID: teamID }, (err, value) => {
            if (err) {
                console.log(err);
            } else {

                for (let i = (value.length - 1); i > ((value.length) - records) - 1; i--) { //wtf
                    console.log(`
        timestamp : ${value[i].Timestamp}
        temperature : ${value[i].Temperature}
        `);
                    promise_temp
                        .then(function () {
                            temp_array.push(value[i].Temperature);
                            time_array.push(value[i].Timestamp);
                            // console.log(temp_array);

                        })

                        .then(function () {
                            res.send(`
                Temperature : ${temp_array}
                Timestamp : ${time_array}
                `);
                        });


                }
            }
        });
    }

});

/*------------ API : show all or some humidity value ------------*/

app.get("/sensorsData/humidity/:teamID/:records", (req, res) => {

    let teamID = req.params.teamID;
    let records = req.params.records;

    let humid_array = [];
    let time_array = [];

    // initialize promise

    var promise_humid = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 1000);
    });

    // async function

    if (records == "all") {
        Sensors.find({ TeamID: teamID }, (err, value) => {
            if (err) {
                console.log(err);
            } else {

                for (let i = 0; i < value.length; i++) {
                    console.log(`
        timestamp : ${value[i].Timestamp}
        Humidity : ${value[i].Humidity}
        `);
                    promise_humid
                        .then(function () {
                            humid_array.push(value[i].Humidity);
                            time_array.push(value[i].Timestamp);
                            // console.log(humid_array);

                        })

                        .then(function () {
                            res.send(`
            Humidity : ${humid_array}
            Timestamp : ${time_array}
            `);
                        });
                }
            }
        });
    }

    else {
        records = parseInt(records, 10);
        Sensors.find({ TeamID: teamID }, (err, value) => {
            if (err) {
                console.log(err);
            } else {

                for (let i = (value.length - 1); i > ((value.length) - records) - 1; i--) { //wtf
                    console.log(`
        timestamp : ${value[i].Timestamp}
        Humidity : ${value[i].Humidity}
        `);
                    promise_humid
                        .then(function () {
                            humid_array.push(value[i].Humidity);
                            time_array.push(value[i].Timestamp);
                            // console.log(humid_array);

                        })

                        .then(function () {
                            res.send(`
                Humidity : ${humid_array}
                Timestamp : ${time_array}
                `);
                        });


                }
            }
        });
    }

});

/*------------ API : show all or some Person-IN value ------------*/

app.get("/sensorsData/personIn/:teamID/:records", (req, res) => {

    let teamID = req.params.teamID;
    let records = req.params.records;

    let PIN_array = [];
    let time_array = [];

    // initialize promise

    var promise_pin = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 1000);
    });

    // async function

    if (records == "all") {
        Sensors.find({ TeamID: teamID }, (err, value) => {
            if (err) {
                console.log(err);
            } else {

                for (let i = 0; i < value.length; i++) {
                    console.log(`
        timestamp : ${value[i].Timestamp}
        person-in : ${value[i].P_IN}
        `);
                    promise_pin
                        .then(function () {
                            PIN_array.push(value[i].P_IN);
                            time_array.push(value[i].Timestamp);
                            // console.log(humid_array);

                        })

                        .then(function () {
                            res.send(`
            person-in : ${PIN_array}
            timestamp : ${time_array}
            `);
                        });
                }
            }
        });
    }

    else {
        records = parseInt(records, 10);
        Sensors.find({ TeamID: teamID }, (err, value) => {
            if (err) {
                console.log(err);
            } else {

                for (let i = (value.length - 1); i > ((value.length) - records) - 1; i--) { //wtf
                    console.log(`
        Timestamp : ${value[i].Timestamp}
        person-in : ${value[i].P_IN}
        `);
                    promise_pin
                        .then(function () {
                            PIN_array.push(value[i].P_IN);
                            time_array.push(value[i].Timestamp);
                            // console.log(humid_array);

                        })

                        .then(function () {
                            res.send(`
                person-in : ${PIN_array}
                Timestamp : ${time_array}
                `);
                        });


                }
            }
        });
    }

});

/*------------ API : show all or some Person-OUT value ------------*/

app.get("/sensorsData/personOut/:teamID/:records", (req, res) => {

    let teamID = req.params.teamID;
    let records = req.params.records;

    let POUT_array = [];
    let time_array = [];

    // initialize promise

    var promise_pout = new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 1000);
    });

    // async function

    if (records == "all") {
        Sensors.find({ TeamID: teamID }, (err, value) => {
            if (err) {
                console.log(err);
            } else {

                for (let i = 0; i < value.length; i++) {
                    console.log(`
        timestamp : ${value[i].Timestamp}
        person-out : ${value[i].P_OUT}
        `);
                    promise_pout
                        .then(function () {
                            POUT_array.push(value[i].P_OUT);
                            time_array.push(value[i].Timestamp);
                            // console.log(humid_array);

                        })

                        .then(function () {
                            res.send(`
            person-out : ${POUT_array}
            timestamp : ${time_array}
            `);
                        });
                }
            }
        });
    }

    else {
        records = parseInt(records, 10);
        Sensors.find({ TeamID: teamID }, (err, value) => {
            if (err) {
                console.log(err);
            } else {

                for (let i = (value.length - 1); i > ((value.length) - records) - 1; i--) { //wtf
                    console.log(`
        Timestamp : ${value[i].Timestamp}
        person-out : ${value[i].P_OUT}
        `);
                    promise_pout
                        .then(function () {
                            POUT_array.push(value[i].P_OUT);
                            time_array.push(value[i].Timestamp);
                            // console.log(humid_array);

                        })

                        .then(function () {
                            res.send(`
                person-out : ${POUT_array}
                Timestamp : ${time_array}
                `);
                        });


                }
            }
        });
    }

});

/*------------ API : Add 1 data by Team ID ------------*/

app.post("/sensorsData/addData", (req, res) => {
    let sensors = new Sensors();

    sensors.Timestamp = new Date();
    sensors.TeamID = req.body.TeamID;
    sensors.Temperature = req.body.Temperature;
    sensors.Humidity = req.body.Humidity;
    sensors.P_IN = req.body.P_IN;
    sensors.P_OUT = req.body.P_OUT;

    sensors.save((err, data) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("all saved");
            res.send(data);
        }
    });
})

/*------------ API : Delete all data followed by TeamID ------------*/

app.delete("/sensorsData/deleteData/:teamID", (req, res) => {

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

app.get("/sensorsData/showData", (req, res) => {

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

/*------------ API : Edit temperature followed by TeamID ------------*/
app.delete("/sensorsData/deleteData/:teamID", (req, res) => {

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

//////////////////////////////////////////////////////////////
/* BEACON BEACON BEACON BEACON BEACON BEACON BEACON BEACON  */
//////////////////////////////////////////////////////////////
/* BEACON BEACON BEACON BEACON BEACON BEACON BEACON BEACON  */
//////////////////////////////////////////////////////////////

const Header = {
    "Content-Type": 'application/json',
    "Authorization": "Bearer {HRibRmD6OaubdC9n+eIEDXzR2E2idTyUUgQC/ZUyHoBxwoS9LLRDqGpGow3OtElm7DB0MlLHTswalwSIZQozOUdjuL5hB28D7rXjOwNuROi5rNQ9MwczFMmIfr73pQqQ8E10j9AvQmgZBg616wFa6gdB04t89/1O/w1cDnyilFU=}"
}

let inBvalue = 0;
let outBvalue = 0;
let beaconStatus = 0;

app.post("/webhook", (req, res) => {
    // app.post("/beaconsData/receiveData", (req, res) => {

    let beacon = new Beacon();


    beacon.Timestamp = new Date();
    status = req.body.events[0].beacon.type;         // Enter (P_IN) or Leave (P_Out)

    if (status == "enter") { inBvalue += 1; }
    else if (status == "leave") { outBvalue += 1; }

    // if person in - person out > 2 GTFO!  
    if (inBvalue - outBvalue > 2) {
        beaconStatus = 1;
        console.log("Error : Person out exceeds the limitation (2)!");
    }
    else { beaconStatus = 0; }

    beacon.P_IN = inBvalue;
    beacon.P_OUT = outBvalue;
    beacon.Status = beaconStatus;

    console.log(`body : ${JSON.stringify(req.body)}`);
    console.log(`status : ${status}`);
    console.log(`event[0] : ${JSON.stringify(req.body.events[0])}`);
    console.log(`in : ${inBvalue}`);
    console.log(`out : ${outBvalue}`);

    setTimeout(() => {
        inBvalue = 0;
        outBvalue = 0;
        console.log("Person reset!!!")
    }, 60000)

    beacon.save((err, data) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("all saved");
            res.send(data);
        }
    });

});

function reply(reply_token, msg) {
    let body = JSON.stringify({
        replyToken = reply_token,
        messages: [{
            type: 'text',
            text: msg
        }]
    })
    curl('reply', body);
}

function curl(method, body) {
    request.post({
        url: 'https://api.line.me/v2/bot/message/' + method,
        headers: Header,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode)
    })
}


/*------------ Start Server ------------*/

app.listen(8080, () => {
    console.log("Server is started on port 8080");
});

// // :: Sample Payload
// //   "00732772016700eb02687103710010fffd04030486ffc8ffeb00c405021585060064070100";
