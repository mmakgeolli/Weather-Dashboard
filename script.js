const apiKey = '79b249344a1b0068d621507a80e947cc'; // Replace with your API key

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

searchBtn.addEventListener('click', e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
  cityInput.value = '';
});

searchHistory.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    const city = e.target.textContent;
    getWeatherData(city);
  }
});

function getWeatherData(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      updateSearchHistory(city);
      updateCurrentWeather(data);
      updateForecast(data);
    })
    .catch(error => {
      console.log(error);
      alert('Error getting weather data. Please try again.');
    });
}

function updateSearchHistory(city) {
  const button = document.createElement('button');
  button.textContent = city;
  searchHistory.appendChild(button);
}

function updateCurrentWeather(data) {
  const cityName = data.city.name;
  const date = new Date(data.list[0].dt * 1000);
  const iconCode = data.list[0].weather[0].icon;
  const temperature = Math.round(data.list[0].main.temp);
  const humidity = data.list[0].main.humidity;
  const windSpeed = data.list[0].wind.speed;

  const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

  const html = `
    <h2>${cityName} (${date.toLocaleDateString()}) <img src="${iconUrl}" alt="${data.list[0].weather[0].description}"></h2>
    <p>Temperature: ${temperature} °C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
  `;

  currentWeather.innerHTML = html;
}

function updateForecast(data) {
  let html = '';

  for (let i = 0; i < data.list.length; i += 8) {
    const date = new Date(data.list[i].dt * 1000);
    const iconCode = data.list[i].weather[0].icon;
    const temperature = Math.round(data.list[i].main.temp);
    const humidity = data.list[i].main.humidity;
    const windSpeed = data.list[i].wind.speed;

    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

    html += `
      <div class="forecast-card">
        <h3>${date.toLocaleDateString()}</h3>
        <img src="${iconUrl}" alt="${data.list[i].weather[0].description}">
        <p>Temperature: ${temperature} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      </div>
    `;
  }

  forecast.innerHTML = html;
}
