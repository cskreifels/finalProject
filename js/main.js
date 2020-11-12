// import API Key
import {WEATHER_API_KEY} from "./apikey.js";

// Beginning of Fetch API code
// Define currentWeather object;

document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});

const initApp = () => {
    // TODO: Make zip code dynamic
    sendWxToScreen(67152);
}

const getWx = async (zip) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${WEATHER_API_KEY}&units=imperial`); 
    const resJSON = await response.json();
    return resJSON;
}


const sendWxToScreen = async (zip) => {
    // Get Current Conditions
    const currentWx = await getWx(zip);

    // Set City Name
    document.getElementById("cityName").textContent = currentWx.name;
    
    // Build Current Conditions Header
    buildHeader("Current Conditions");

    // Build the Current Weather Icon Div
    buildIconDiv(currentWx.weather[0].icon, currentWx.weather[0].description, currentWx.main.temp, currentWx.main.feels_like);
    
    // Build Individual conditions
    buildWxItem("Low", "low", "TODO", "°");
    buildWxItem("High", "high", "TODO", "°");
    buildWxItem("Wind", "wind", processWind(currentWx.wind), "")
    buildWxItem("Sunrise", "sunrise", unixTimeConvert(currentWx.sys.sunrise), "");
    buildWxItem("Sunset", "sunset", unixTimeConvert(currentWx.sys.sunset), "");
    buildWxItem("Humidity", "humidity", currentWx.main.humidity, " %");
    buildWxItem("Pressure", "pressure", currentWx.main.pressure, " hPA");

    buildHeader("5-Day Forecast");
}

const buildIconDiv = (icon, desc, temp, feelsLike) => {
    const div = document.createElement("div");
    div.className = "weatherSummary";
    const iconDiv = document.createElement("div");
    iconDiv.className = "weatherIcon";
    iconDiv.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`;
    const tempDiv = document.createElement("div");
    tempDiv.className = "weatherDesc";
    tempDiv.innerHTML =  `<p class="mainTemp">${Math.round(temp)}°</p>`;
    tempDiv.innerHTML += `<p class="feelsLikeTemp">Feels Like: ${Math.round(feelsLike)}°</p>`;
    tempDiv.innerHTML += `<p class="feelsLikeTemp">Skies: ${capital(desc)}</p>`;
    div.appendChild(iconDiv);
    div.appendChild(tempDiv);
    const container = document.getElementById("currentWeather");
    container.appendChild(div);
    
}
const buildWxItem = (name, id, value, unit) => {
    const div = document.createElement("div");
    div.className = "condition";
    const valueDiv = document.createElement("div");
    valueDiv.className = "conditionValue";
    valueDiv.id = id;
    valueDiv.tabIndex = 0;
    valueDiv.textContent = value + unit;
    const labelDiv = document.createElement("div");
    labelDiv.className = "conditionName";
    labelDiv.id = id;
    labelDiv.textContent = name;
    div.appendChild(labelDiv);
    div.appendChild(valueDiv);
    const container = document.getElementById("currentWeather");
    container.appendChild(div);
}
const buildHeader = (name) => {
    const div = document.createElement("div");
    div.className = "wxHeader";
    div.innerHTML = `<h3>${name}</h3>`;
    const container = document.getElementById("currentWeather");
    container.appendChild(div);
}
// Capitalize all words in a string
function capital(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//convert Unix time to normal time
const unixTimeConvert = (timecode) => {

    // multiply timecode by 1000 so that the argument is in milliseconds, not seconds.
    const date = new Date(timecode * 1000);
    // Hours part from the timestamp
    const hours = date.getHours();
    // Minutes part from the timestamp
    const minutes = "0" + date.getMinutes();

    // Format to 12-hour format if needed and return
    if (hours > 12) {
        return hours - 12 + ':' + minutes.substr(-2) + " pm";
    }
    // Will display time in 10:30 am format
   return hours + ':' + minutes.substr(-2) + " am";
}
const processWind = (windInfo) => {
    return Math.round(windInfo.speed) + " mph" + " " + getWindDirection(windInfo.deg);
}

const getWindDirection = (degrees) => {
    // accepts wind direction in compass degrees and converts to cardinal direction text
    if (degrees >= 22 && degrees < 67 ) return "NE";
    if (degrees >= 67 && degrees < 112 ) return "E";
    if (degrees >= 112 && degrees < 157 ) return "SE";
    if (degrees >= 157 && degrees < 202 ) return "S";
    if (degrees >= 202 && degrees < 247 ) return "SW";
    if (degrees >= 247 && degrees < 292 ) return "W";
    if (degrees >= 292 && degrees < 337 ) return "NW";
    return "N";

}