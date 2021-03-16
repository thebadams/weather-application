//grab html elements:
var cityName = document.querySelector("#city-name");
var weatherBtn = document.querySelector("#weather-btn")
//construct requestURL #1;
//url http://api.openweathermap.org/data/2.5/weather?q={cityQuery}&appid={APIKey}

//construct requestURL #2
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
function constructURL1() {
    var cityQuery = cityName.value;
    var requestURL = `http://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${defaultAPIKey}`
    return requestURL;
}

//construct fetch

// function queryAPI() {
//    let requestURL = constructURL1();
//     fetch(requestURL)
//         .then((response)=> {
//             console.log(response)
//             return response.json();
//         })
//         .then((data)=> {
//             console.log(data);
//             var coord = data.coord
//             return coord;
            
        
//         })
//         .catch((err)=>{
//             console.error(err);
//         })
    
// }

//weatherInformation classes

class currentWeatherObject {
    constructor(tTemp, tHumidity, tWindSpeed, tUVI, tIcon){
        this.temperature = `${tTemp} F`,
        this.humidity = `${tHumidity} %`,
        this.windSpeed = `${tWindSpeed}MPH`,
        this.UVIndex = tUVI,
        this.iconURL = `http://openweathermap.org/img/wn/${tIcon}@2x.png`
    }
}

class foreCastWeatherObject {
    constructor(tTemp, tHumidity, tIcon) {
        this.temperature = `${tTemp} F`,
        this.humidity = `${tHumidity} %`,
        this.iconURL = `http://openweathermap.org/img/wn/${tIcon}@2x.png`
    }
}
async function queryAPI2() {
    let response1 = await fetch(constructURL1());
    let data1 = await response1.json()
    let coord = await data1.coord;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${defaultAPIKey}`)
        .then((response2)=>{
            return response2.json();
        })
        .then((data)=>{
            renderCurrentWeather(data);
            renderForecast(data);
        })
        .catch((err)=> {
            console.error(err);
        })
    };

weatherBtn.addEventListener("click", ()=>{
    let info = queryAPI2();

    cityName.value = "";
})

//function to render current weather data
function renderCurrentWeather(data) {
    let currentWeather = data.current
    let currentWeatherInfo = new currentWeatherObject(currentWeather.temp, currentWeather.humidity, currentWeather.wind_speed, currentWeather.uvi, currentWeather.weather[0].icon);
    let currentWeatherCard = document.querySelector("#current-weather");
    let currentTemp = document.createElement("p");
    currentTemp.textContent = `Temperature: ${currentWeatherInfo.temperature}`
    let currentHumidity = document.createElement("p");
    currentHumidity.textContent = `Humidity ${currentWeatherInfo.humidity}`
    let currentWindSpeed = document.createElement("p");
    currentWindSpeed.textContent = `${currentWeatherInfo.windSpeed}`
    let currentUVIndex = document.createElement("p")
    currentUVIndex.textContent = `UV Index: ${currentWeatherInfo.UVIndex}`
    let currentIcon = document.createElement("img");
    currentIcon.setAttribute("src", currentWeatherInfo.iconURL);
    currentWeatherCard.append(currentTemp, currentHumidity, currentWindSpeed, currentUVIndex, currentIcon);
}

//function to render forecast data
function renderForecast(data) {
    let forecastWeather = data.daily;
    let forecastWeatherCard = document.querySelector("#forecast");
    for(var j = 1; j < 6; j++) {
        let forecastWeatherInfo = new foreCastWeatherObject(forecastWeather[j].temp.max, forecastWeather[j].humidity, forecastWeather[j].weather[0].icon);
        let forecastTemp = document.createElement("p");
        forecastTemp.textContent = `Temperature: ${forecastWeatherInfo.temperature}`;
        let forecastHumidity = document.createElement("p");
        forecastHumidity.textContent = `Humidity: ${forecastWeatherInfo.humidity}`;
        let forecastIcon = document.createElement("img");
        forecastIcon.setAttribute("src", forecastWeatherInfo.iconURL);
        forecastWeatherCard.append(forecastTemp, forecastHumidity, forecastIcon);
    }
    
}


//function to display previously searched cities
//FIXME: currently wil add a city regardless of whether it appears on the list previously
function renderHistory(){
    let historyListItem = cityName.value;
    let historyList = document.querySelector("#history-list");
    let newListItem = document.createElement("li");
    newListItem.textContent = historyListItem;
    historyList.append(newListItem);

}
