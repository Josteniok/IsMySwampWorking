'use strict';

const ambientWeatherApiKey = "f6fdbc24eeb84a93a4ece8cc5477b9829cbf7eb2dd754611b4e82ee038799860";
const ambientWeatherAppKey = "a814385732c14e75b26d3d51c93caf9859a7ae77ebd345738e4e96af52de4076";

// Initial pull
getTempInfo();
//testTempFunction();
// Repeat pulls
let tempInfo = setInterval(getTempInfo, 120000);

function getTempInfo() {
    fetch("https://rt.ambientweather.net/v1/devices?applicationKey="+ambientWeatherAppKey+"&apiKey="+ambientWeatherApiKey)
    .then(response => response.json())
    .then(function (sensorData) {
        document.getElementById("indoortemp").innerHTML = Math.round(sensorData[0].lastData.tempinf);
        let drybulb = fahrenheitToCelsius(sensorData[0].lastData.tempf);
        let relhumidity = sensorData[0].lastData.humidity;
        let wetbulb = getWetBulb(drybulb, relhumidity);
        let indoortemp = sensorData[0].lastData.tempinf;
        let efficiency = (sensorData[0].lastData.tempf - indoortemp) / (sensorData[0].lastData.tempf - wetbulb);
        document.getElementById("bestswamptemp").innerHTML = Math.round(efficiency * 100) + '%';
    })
    .catch(function (err) {
        console.log("ERROR: ", err);
    });
}

function testTempFunction() {
    for (var relhum = 5; relhum < 85; relhum += 5) {
        for (var temp = 75; temp < 130; temp += 5) {
            let drybulb = fahrenheitToCelsius(temp);
            console.log(temp + ', ' + relhum + ', ' + getWetBulb(drybulb, relhum));
        }
    }
}

function formattedTime(unixtime) {
    const milliseconds = unixtime * 1000;
    const dateObject = new Date(milliseconds);
    return dateObject.toLocaleString();
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

function celsiusToFahrenheit(celsius) {
    return ((9/5) * celsius) + 32;
}

function getWetBulb(drybulb, relhumidity) {
    let celsiuswetbulb = drybulb * Math.atan(0.151977 * Math.sqrt(relhumidity + 8.313659))
        + 0.00391838 * Math.sqrt(relhumidity ** 3) * Math.atan(0.023101 * relhumidity)
        - Math.atan(relhumidity - 1.676331)
        + Math.atan(drybulb + relhumidity)
        - 4.686035;
    return Math.round(celsiusToFahrenheit(celsiuswetbulb));
}

function getBGColorForAQI(aqi) {
    switch (true) {
        case (aqi <= 50):
            return 'green';
        case (aqi > 50 && aqi <= 100):
            return 'yellow';
        case (aqi > 100 && aqi <= 150):
            return 'orange';
        case (aqi > 150 && aqi <= 200):
            return 'red';
        case (aqi > 200 && aqi <= 300):
            return 'purple';
        case (aqi > 300):
            return 'maroon';
        default:
            return 'green';
    }
}

function getBGColorForTemp(temp) {

}