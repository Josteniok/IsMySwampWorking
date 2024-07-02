'use strict';

const ambientWeatherApiKey = "f6fdbc24eeb84a93a4ece8cc5477b9829cbf7eb2dd754611b4e82ee038799860";
const ambientWeatherAppKey = "a814385732c14e75b26d3d51c93caf9859a7ae77ebd345738e4e96af52de4076";

const macaddress = "98:CD:AC:22:47:F6";

const purpleAirApiReadKey = "ADB7BE2F-17CD-11EC-BAD6-42010A800017";
const outdoorsensorindex = "121389";
const indoorsensorindex = "125241";
const sensorgroupid = "717";
// Fields object
const Fields = {
    pm1: 'pm1.0',
    pm25: 'pm2.5',
    pm10: 'pm10.0',
    pm25cf: 'pm2.5_cf_1',
    humidity: 'humidity',
    lastseen: 'last_seen',
    um03: '0.3_um_count',
    um05: '0.5_um_count',
    um1: '1.0_um_count',
    um25: '2.5_um_count',
    um5: '5.0_um_count',
    um10: '10.0_um_count'
};
// Initial pull
getTempInfo();
// Repeat pulls
let tempInfo = setInterval(getTempInfo, 120000);

function getTempInfo() {
    fetch("https://rt.ambientweather.net/v1/devices?applicationKey="+ambientWeatherAppKey+"&apiKey="+ambientWeatherApiKey)
    .then(response => response.json())
    .then(function (sensorData) {
        document.getElementById("indoortemp").innerHTML = Math.round(sensorData[0].lastData.tempinf);
        //let drybulb = fahrenheitToCelsius(sensorData[0].lastData.tempf);
        let drybulb = fahrenheitToCelsius(95);
        let relhumidity = sensorData[0].lastData.humidity;
        document.getElementById("bestswamptemp").innerHTML = getWetBulb(drybulb, 35) + 5;
    })
    .catch(function (err) {
        console.log("ERROR: ", err);
    });
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

function calcAQI(pm25) {
    let bphi = 12.0;
    let bplo = 0.0;
    let aqhi = 50;
    let aqlo = 0;
    switch (true) {
        case (pm25 <= 12.0):
            break;
        case (pm25 > 12.0 && pm25 <=35.4):
            bphi = 35.4;
            bplo = 12.1;
            aqhi = 100;
            aqlo = 51;
            break;
        case (pm25 > 35.4 && pm25 <=55.4):
            bphi = 55.4;
            bplo = 35.5;
            aqhi = 150;
            aqlo = 101;
            break;
        case (pm25 > 55.4 && pm25 <=150.4):
            bphi = 150.4;
            bplo = 55.5;
            aqhi = 200;
            aqlo = 151;
            break;
        case (pm25 > 150.4 && pm25 <= 250.4):
            bphi = 250.4;
            bplo = 150.5;
            aqhi = 300;
            aqlo = 201;
            break;
        case (pm25 > 250.4 && pm25 <= 350.4):
            bphi = 350.4;
            bplo = 250.5;
            aqhi = 400;
            aqlo = 301;
            break;
        case (pm25 > 350.4 && pm25 <= 500.4):
            bphi = 500.4;
            bplo = 350.5;
            aqhi = 500;
            aqlo = 401;
            break;
        default:
            break;
    }
    let aqi = ((aqhi - aqlo)/(bphi - bplo))*(pm25 - bplo) + aqlo;
    return aqi;
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