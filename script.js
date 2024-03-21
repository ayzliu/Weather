const API_KEY = 'YOUR_API_KEY_HERE';
const GEO_API_URL = 'http://api.openweathermap.org/geo/1.0/direct';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';


async function getCoordinates(location){
    const response = await fetch(`${GEO_API_URL}?q=${location}&limit=1&appid=${API_KEY}`);
    const data = await response.json();

    return data[0] ? {lat: data[0].lat, lon: data[0].lon} : null;

}

async function getWeather(lat, lon){
 const response = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
 const data = await response.json()
 return data
}

function processWeatherData(rawData) {
    // Assuming you want the temperature in Celsius by default
    const temperatureInCelsius = convertTemperature(rawData.main.temp, 'C');

    return {
        temperature: temperatureInCelsius.toFixed(2) + '°C', // Rounds to 2 decimal places and adds the °C symbol
        description: rawData.weather[0].description,
        icon: rawData.weather[0].icon,
    };
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather-data');
    weatherDiv.innerHTML = `
        <p>Temperature: ${data.temperature}</p>
        <p>Description: ${data.description}</p>
        <img src="http://openweathermap.org/img/wn/${data.icon}.png" alt="Weather icon">
    `;
}

function convertTemperature(kelvin, unit = 'C') {
    switch (unit) {
        case 'C':
            return kelvin - 273.15;
        case 'F':
            return (kelvin - 273.15) * 9/5 + 32;
        default:
            return kelvin; // Kelvin by default
    }
}

document.querySelector('#location-form').addEventListener('submit', async(e) => {
  e.preventDefault();
  const location = document.querySelector('#location-input').value;
  const coords = await getCoordinates(location);
  if(coords){
    const weatherdata = await getWeather(coords.lat, coords.lon)
    const processedData = processWeatherData(weatherdata);
    displayWeather(processedData)
  }else{
    alert('Location not found. Please try again.')
  }


})