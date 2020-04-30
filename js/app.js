//select elements
const notificationElement = document.querySelector(".notifications");
const iconsElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temp-value p");
const descElement = document.querySelector(".temp-description p");
const locationElement = document.querySelector(".location p");

//application data
const weather = {};

weatherTemperature = {
  unit: "celsius",
};

const Kelvin = 273;

//my api key
// const key = "1cf8731f5163af87c2e7c11a9a220bc2";
const key = "82005d27a116c2880c8f0fcb866998a0";

//geolocation support
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showErr);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Your does not support Geolocation</p>";
}

//setting user position
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

//display error if there is
function showErr(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message}</p>`;
}

//get weather from API
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  //   console.log(api);

  //fetch api
  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.value = Math.floor(data.main.temp - Kelvin);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      weather.timezone = data.timezone;
    })
    .then(function () {
      displayWeather();
    });
}

//display weather UI
function displayWeather() {
  iconsElement.innerHTML = `<img src = "icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;

  let today = new Date();
  let date = document.querySelector(".date p");
  date.innerHTML = dateBuilder(today);
}

//search box
const api = {
  key: "82005d27a116c2880c8f0fcb866998a0",
  base: "https://api.openweathermap.org/data/2.5/",
};

const searchBox = document.querySelector(".search-box");
searchBox.addEventListener("keypress", setQuery);

function setQuery(event) {
  if (event.keyCode == 13) {
    getResults(searchBox.value);
    console.log(searchBox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weather) => {
      return weather.json();
    })

    .then(displayResults);
}
function displayResults(weather) {
  console.log(weather);
  let locationElement = document.querySelector(".location p");
  locationElement.innerHTML = `${weather.name}, ${weather.sys.country}`;
  let tempElement = document.querySelector(".temp-value p");
  tempElement.innerHTML = `${Math.round(weather.main.temp)}°<span>C</span>`;
  let descElement = document.querySelector(".temp-description p");
  descElement.innerHTML = weather.weather[0].description;

  let iconsElement = document.querySelector(".weather-icon");
  iconsElement.innerHTML = `<img src = "icons/${weather.weather[0].icon}.png"/>`;

  let today = new Date();
  let date = document.querySelector(".date p");
  date.innerHTML = dateBuilder(today);
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

// click on temp
tempElement.addEventListener("click", function () {
  if (weather.value === undefined) return;

  if (weather.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.value}°<span>C</span>`;
    weather.unit = "celsius";
  }
});

function dateBuilder(da) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[da.getDay()];
  let date = da.getDate();
  let month = months[da.getMonth()];
  let year = da.getFullYear();

  return `${day} ${date}th ${month}, ${year}`;
}
