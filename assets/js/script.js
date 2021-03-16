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

async function queryAPI2() {
    let response1 = await fetch(constructURL1());
    let data1 = await response1.json()
    let coord = await data1.coord;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${defaultAPIKey}`)
        .then((response2)=>{
            console.log(response2);
            return response2.json();
        })
        .then((data)=>{
            console.log(data);
            return data;
        })
        .catch((err)=> {
            console.error(err);
        })
    };

weatherBtn.addEventListener("click", ()=>{
    let info = queryAPI2();

    cityName.value = "";
})

function renderHistory(){
    let historyListItem = cityName.value;
    let historyList = document.querySelector("#history-list");
    let newListItem = document.createElement("li");
    newListItem.textContent = historyListItem;
    historyList.append(newListItem);

}
