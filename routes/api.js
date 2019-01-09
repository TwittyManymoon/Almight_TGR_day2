const express = require('express');
const router = express();

// Test 1
// router.get('/:data', (req, res) => {
//   console.log(req.body);
//   res.send(req.body)
// });

// Test 2
router.get('/almight', (req, res) => {
    console.log("Someone access your motherfucking server");
    res.send(`Welcome motherfucker, your motherfucking data: ${payload}`);
});

// Dashboard
router.get('/dashboard', (req, res) => {
    res.send(`Dashboard\n
                 Raw Data           :     ${payload}\n
                 Timestamp          :     ${timestamp}\n
                 Team ID            :     ${teamID}\n
                 Barometer          :     ${barovalue}  hectopascal\n
                 Temperature        :     ${tempvalue}  Celsius\n
                 Humidity           :     ${humidvalue} % RHO\n
                 Accelerometer_X    :     ${accexvalue} G\n
                 Accelerometer_Y    :     ${acceyvalue} G\n
                 Accelerometer_Z    :     ${accezvalue} G\n
                 Gyrometer_X        :     ${gyroxvalue} °/s\n
                 Gyrometer_Y        :     ${gyroyvalue} °/s\n
                 Gyrometer_Z        :     ${gyrozvalue} °/s\n
                 Magnetometer       :     ${magvalue}   tesla\n
                 DI                 :     ${digitalinvalue}\n
                 DO                 :     ${digitaloutvalue}\n `);

});


module.exports = router;