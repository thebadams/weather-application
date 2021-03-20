//grab html elements:
var cityName = document.querySelector('#city-name');
var weatherBtn = document.querySelector('#weather-btn');
//construct requestURL #1;
//url http://api.openweathermap.org/data/2.5/weather?q={cityQuery}&appid={APIKey}

//construct requestURL #2
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
function constructURL1() {
	var cityQuery = cityName.value;
	var requestURL = `http://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${defaultAPIKey}`;
	console.log(requestURL);
	return requestURL;
}

var previousSearches = JSON.parse(localStorage.getItem('previousSearches') || '[]');

function saveSearches() {
	if (previousSearches.includes(cityName.value)) {
		return;
	} else {
		previousSearches.push(cityName.value);
		window.localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
	}
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
	constructor(tDate, tTemp, tHumidity, tWindSpeed, tUVI, tIcon) {
		this.date = moment.unix(tDate).format("ddd MMM Do"),
		this.temperature = `${tTemp} F`,
		this.humidity = `${tHumidity} %`,
		this.windSpeed = `${tWindSpeed}MPH`,
		this.UVIndex = tUVI,
		this.iconURL = `http://openweathermap.org/img/wn/${tIcon}@2x.png`;
	}
}

class foreCastWeatherObject {
	constructor(tDate, tTemp, tHumidity, tIcon) {
		this.date = moment.unix(tDate).format("ddd MMM Do")
		this.temperature = `${tTemp} F`,
		this.humidity = `${tHumidity} %`,
		this.iconURL = `http://openweathermap.org/img/wn/${tIcon}@2x.png`;
	}
}
async function queryAPI2() {
	let response1 = await fetch(constructURL1());
	let data1 = await response1.json();
	let coord = await data1.coord;
	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${defaultAPIKey}`
	)
		.then((response2) => {
			return response2.json();
		})
		.then((data) => {
			console.log(data);
			renderCurrentWeather(data);
			renderForecast(data);
		})
		.catch((err) => {
			console.error(err);
		});
}

weatherBtn.addEventListener('click', () => {
	saveSearches();
	queryAPI2();

	cityName.value = '';
});

//function to render current weather data
function renderCurrentWeather(data) {
	let currentWeather = data.current;
	let currentWeatherInfo = new currentWeatherObject(
		currentWeather.dt,
		currentWeather.temp,
		currentWeather.humidity,
		currentWeather.wind_speed,
		currentWeather.uvi,
		currentWeather.weather[0].icon
	);
	let currentWeatherCard = document.querySelector('#current-weather');
	if (currentWeatherCard.childElementCount !== 0) {
		console.log("there's stuff on the page");
		for (var i = currentWeatherCard.children.length - 1; i >= 0; i--) {
			currentWeatherCard.children[i].remove();
		}
	}
	let currentDate = document.createElement('h2');
	currentDate.textContent = `${currentWeatherInfo.date}`
	currentDate.classList.add("display-3");
	let currentWeatherDiv = document.createElement('div');
	currentWeatherDiv.classList.add("card", "card-body", "text-center")
	let currentTemp = document.createElement('p');
	currentTemp.textContent = `${currentWeatherInfo.temperature}`;
	currentTemp.classList.add("lead");
	let currentHumidity = document.createElement('p');
	currentHumidity.textContent = `${currentWeatherInfo.humidity} Humidity`;
	currentHumidity.classList.add("lead")
	let currentWindSpeed = document.createElement('p');
	currentWindSpeed.textContent = `${currentWeatherInfo.windSpeed}`;
	currentWindSpeed.classList.add("lead");
	let currentUVIndex = document.createElement('p');
	currentUVIndex.textContent = `UV Index: ${currentWeatherInfo.UVIndex}`;
	currentUVIndex.classList.add("lead");
	let currentIcon = document.createElement('img');
	currentIcon.setAttribute('src', currentWeatherInfo.iconURL);
	currentWeatherCard.append(currentDate, currentWeatherDiv);
	currentWeatherDiv.append(currentTemp, currentHumidity, currentWindSpeed, currentUVIndex, currentIcon)
}

//function to render forecast data
function renderForecast(data) {
	let forecastWeather = data.daily;
	let forecastWeatherCard = document.querySelector('#forecast');
	if (forecastWeatherCard.childElementCount !== 0) {
		for (var i = forecastWeatherCard.children.length - 1; i >= 0; i--) {
			forecastWeatherCard.children[i].remove();
		}
	}
	let forecastHeadingDiv = document.createElement("div");
	forecastHeadingDiv.classList.add("row", "justify-content-center");
	let forecastHeading = document.createElement("h3");
	forecastHeading.classList.add("display-3");
	forecastHeading.textContent = "5 Day Forecast";
	let forecastCardsDiv = document.createElement("div")
	forecastCardsDiv.classList.add("row", "text-center", "justify-content-around","my-3");
	forecastWeatherCard.append(forecastHeadingDiv, forecastCardsDiv);
	forecastHeadingDiv.append(forecastHeading)
	

	for (var j = 1; j < 6; j++) {
		let forecastWeatherInfo = new foreCastWeatherObject(
			forecastWeather[j].dt,
			forecastWeather[j].temp.max,
			forecastWeather[j].humidity,
			forecastWeather[j].weather[0].icon
		);
		let forecastCard = document.createElement("div")
		forecastCard.classList.add("card", "col-12", "col-lg-5", "col-xl-2");
		forecastCardsDiv.append(forecastCard)
		let forecastDate = document.createElement('p');
		forecastDate.classList.add("lead")
		forecastDate.textContent = `${forecastWeatherInfo.date}`
		let forecastTemp = document.createElement('p');
		forecastTemp.classList.add("lead")
		forecastTemp.textContent = `Temperature: ${forecastWeatherInfo.temperature}`;
		let forecastHumidity = document.createElement('p');
		forecastHumidity.textContent = `${forecastWeatherInfo.humidity} Humidity`;
		forecastHumidity.classList.add("lead")
		let forecastIcon = document.createElement('img');
		forecastIcon.setAttribute('src', forecastWeatherInfo.iconURL);
		forecastCard.append(forecastDate, forecastTemp, forecastHumidity, forecastIcon);
	}
}

//function to display previously searched cities
//FIXME: currently wil add a city regardless of whether it appears on the list previously
function renderHistory() {
	for (var i = 0; i < previousSearches.length; i++) {
		let historyList = document.querySelector('#history-list');
		let newListItem = document.createElement('li');
		newListItem.textContent = previousSearches[i];
		historyList.append(newListItem);
	}
}

function getCityList() {
	fetch('./assets/js/city.list.min.json')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
		});
}
