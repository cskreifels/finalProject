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

const getLatLong = async (zip) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${WEATHER_API_KEY}&units=imperial`);
    const resJSON = await response.json();
    return resJSON;

}
const getWx = async (latLong) => {

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latLong.coord.lat}&lon=${latLong.coord.lon}&appid=${WEATHER_API_KEY}&units=imperial`); 
    const resJSON = await response.json();
    console.log(resJSON);
    return resJSON;
}




const sendWxToScreen = async (zip) => {
    // Get Coordinates and City Name
    const latLong = await getLatLong(zip);

    // Get Current Conditions

    const oneCallWx = await getWx(latLong);

    // Set City Name
    document.getElementById("cityName").textContent = latLong.name;
    
    // Build Current Conditions Header
    buildHeader("Current Conditions");

    // Build the Current Weather Icon Div
    buildIconDiv(oneCallWx.current.weather[0].icon, oneCallWx.current.weather[0].description, oneCallWx.current.temp, oneCallWx.current.feels_like);
    
    // Build Individual conditions
    buildWxItem("Low", "low", Math.round(oneCallWx.daily[0].temp.min), "°");
    buildWxItem("High", "high", Math.round(oneCallWx.daily[0].temp.max), "°");
    buildWxItem("Wind", "wind", processWind(oneCallWx.current), "")
    buildWxItem("Sunrise", "sunrise", unixTimeConvert(oneCallWx.daily[0].sunrise, "time"), "");
    buildWxItem("Sunset", "sunset", unixTimeConvert(oneCallWx.daily[0].sunset, "time"), "");
    buildWxItem("Humidity", "humidity", oneCallWx.current.humidity, " %");
    buildWxItem("Pressure", "pressure", oneCallWx.current.pressure, " hPA");

    buildHeader("Daily Forecast");

    for (let day = 0; day < 7; day++) {
        buildForecastDay(oneCallWx.daily[day]);
    }


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
const unixTimeConvert = (timecode, format) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // multiply timecode by 1000 so that the argument is in milliseconds, not seconds.
    const tc = new Date(timecode * 1000);

    const day = days[tc.getUTCDay()];
    const month = months[tc.getUTCMonth()]
    const date = tc.getUTCDate();
    // Hours part from the timestamp
    const hours = tc.getHours();
    // Minutes part from the timestamp
    const minutes = "0" + tc.getMinutes();
    // Format to 12-hour format if needed and return
        if (hours > 12) {
        const time = hours - 12 + ':' + minutes.substr(-2) + " pm";
    }
    // Will display time in 10:30 am format
    const time = hours + ':' + minutes.substr(-2) + " am";

    if (format === "time") {
        return time;
    } else if (format === "date") {
        return month + " " + date;
    } else if (format === "day") {
        return day;
    } else if (format === "shortDate") {
        return day.substr(0,3) + ", " + month.substr(0,3) + " " + date;    
    } else if (format === "full") {
        return day + ", " + month + " " + date;
    } else {
        return day + ", " + month + " " + date + " " + time;
    }
}

const processWind = (windInfo) => {
    return Math.round(windInfo.wind_speed) + " mph" + " " + getWindDirection(windInfo.wind_deg);
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

const buildForecastDay = (day) => {
    console.log(day);
    const div = document.createElement("div");
    div.className = "forecast";
    const iconDiv = document.createElement("div");
    iconDiv.className = "forecastIcon";
    iconDiv.innerHTML = `<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png">`;
    const valueDiv = document.createElement("div");
    valueDiv.className = "forecastValue";
    valueDiv.tabIndex = 0;
    valueDiv.innerHTML = "<span class='arrow'>&#8593;</span> " + Math.round(day.temp.max) + "° <span class='arrow'>&#8595;</span> " + Math.round(day.temp.min) + "°";
    const labelDiv = document.createElement("div");
    labelDiv.className = "forecastDayName";
    const datePar = document.createElement("p");
    datePar.className = "datePar";
    datePar.textContent = unixTimeConvert(day.dt, "shortDate");
    const precipPar = document.createElement("p");
    precipPar.className = "precipPar";
    precipPar.textContent = "Precipitation: " + Math.round(day.pop * 10) + "%";
    labelDiv.appendChild(datePar);
    labelDiv.appendChild(precipPar); 
    div.appendChild(iconDiv);
    div.appendChild(labelDiv);
    div.appendChild(valueDiv);
    const container = document.getElementById("currentWeather");
    container.appendChild(div);
}