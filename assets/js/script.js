//grab html elements:
var cityName = document.querySelector("#city-name");

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

function queryAPI() {
   let requestURL = constructURL1();
    fetch(requestURL)
        .then((response)=> {
            console.log(response)
            return response.json();
        })
        .then((data)=> {
            console.log(data);
            var coord = data.coord
            return coord;
            
        
        })
        .catch((err)=>{
            console.error(err);
        })
    
}

async function queryAPI2() {
    let response1 = await fetch(constructURL1());
    let data = await response1.json()
    let coord = await data.coord;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${defaultAPIKey}`)
        .then((response)=>{
            console.log(response);
            return response.json();
        })
        .then((data)=>{
            console.log(data);
        })
        .catch((err)=> {
            console.err(err);
        })
    };