let temperatureChart = null;

// update the page with the current data
function refreshWeather(data) {
  console.log(data);
  let cityElement = document.querySelector("#city");
  let city = data.location.name + "," + data.location.country;

  let timeElement = document.querySelector("#time");
  let date = new Date(data.location.localtime_epoch * 1000);

  let descriptionElement = document.querySelector("#description");
  let description = data.current.condition.text;

  let humidityElement = document.querySelector("#humidity");
  let humidity = `${data.current.humidity}%`;

  let windElement = document.querySelector("#wind-speed");
  let windSpeed = `${data.current.wind_kph} km/h`;

  let temperatureElement = document.querySelector("#temperature");
  let temperature = data.current.temp_c;

  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = humidity;
  windElement.innerHTML = windSpeed;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${data.current.condition.icon}" class="weather-app-icon"/>`;

  getForecast(city);
}

/// search for the city's current weather in async way
// async function searchCity(city) {
//   let apiKey = "c7ab33300b3c4c59ba1141915240209";
//   let apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

//   try {
//     const response = await fetch(apiUrl);
//     if (!response.ok) {
//       throw new Error("City not found");
//     }
//     const data = await response.json();
//     //Add validation to check if city is found
//     if (data && data.location && data.location.name) {
//       refreshWeather(data);
//       getCityPhoto(city);
//     } else {
//       alert("Please enter a valid city name");
//     }
//   } catch (error) {
//     console.log("Error fetching weather data:", error);
//     alert("Please enter a valid city name");
//   }
// }

// search for the city's current weather in fetch way
function searchCity(city) {
  let apiKey = "c7ab33300b3c4c59ba1141915240209";
  let apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.location && data.location.name) {
        refreshWeather(data);
        getCityPhoto(city);
        getHourlyForecast(city);
      } else {
        alert("Please enter a valid city name");
      }
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
      alert("Please enter a valid city name");
    });
}

// Get the user's current location
navigator.geolocation.getCurrentPosition((position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Fetch the weather data for the user's current location
  const apiKey = "c7ab33300b3c4c59ba1141915240209";
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Display the weather data for the user's current location
      const cityElement = document.querySelector("#city");
      cityElement.innerHTML = data.location.name;

      const temperatureElement = document.querySelector("#temperature");
      temperatureElement.innerHTML = Math.round(data.current.temp_c);
    })
    .catch((error) => console.log("Error fetching weather data:", error));
});
function handelSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
  localStorage.setItem("lastSearchCity", searchInput.value); // store user's choice
}

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${day} ${hours}:${minutes}`;
}

//get forecast weather data in async way
// async function getForecast(city) {
//   let apiKey = "c7ab33300b3c4c59ba1141915240209";
//   let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

//   try {
//     const response = await fetch(apiUrl);
//     const data = await response.json();
//     displayForecast(data);
//   } catch (error) {
//     console.log("Error fetching forecast data:", error);
//   }
// }

//get forecast weather data in fetch way
function getForecast(city) {
  let apiKey = "c7ab33300b3c4c59ba1141915240209";
  let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => displayForecast(data))
    .catch((error) => console.log("Error fetching forecast data:", error));
}

//get format day
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[(date.getDay() + 1) % 7]; // +1 to make sure the forecast start from the next day 'not today' and the %7 to  ensure that the day of the week wraps around to Sunday (0)
}

//build the forecast
function displayForecast(data) {
  let forecastHtml = "";
  data.forecast.forecastday.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml += `
    <div class="weather-forecast-day">
     <div class="weather-forecast-date">${formatDay(day.date_epoch)}
     </div>
     <div>
     <img src="${day.day.condition.icon}"
      class="weather-forecast-icon"/>
     </div>
     <div class="weather-forecast-temperatures">
       <div class="weather-forecast-temperature">
        <strong>${Math.round(day.day.maxtemp_c)}°</strong>
       </div>
       <div class="weather-forecast-temperature">
        ${Math.round(day.day.mintemp_c)}°
       </div>
      </div>
     </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

//Get the hourly forecast
function getHourlyForecast(city) {
  let apiKey = "c7ab33300b3c4c59ba1141915240209";
  let apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch hourly forecast data");
      }
      return response.json();
    })
    .then((data) => {
      createTemperatureChart(data.forecast.forecastday[0].hour);
    })
    .catch((error) => {
      console.log("Error fetching hourly forecast data:", error);
    });
}

function createTemperatureChart(hourlyData) {
  const ctx = document.getElementById("temperatureChart").getContext("2d");

  const labels = hourlyData.map((hour) => {
    const date = new Date(hour.time);
    return date.getHours() + ":00";
  });

  const temperatures = hourlyData.map((hour) => hour.temp_c);

  // If a chart already exists, destroy it
  if (temperatureChart) {
    temperatureChart.destroy();
  }

  // Create a new chart
  temperatureChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: temperatures,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

// get city photo from Unsplash API in async way
// async function getCityPhoto(city) {
//   const apiKey = "kQjKixGY_Mrq17KtL20ILb5TDQ7p9JA91rGHjEdAAIs";
//   const apiUrl = `https://api.unsplash.com/search/photos?query=${city}&orientation=landscape&count=1`;

//   try {
//     const response = await fetch(apiUrl, {
//       headers: {
//         Authorization: `Client-ID ${apiKey}`,
//       },
//     });
//     const data = await response.json();
//     const photoUrl = data.results[0].urls.regular;
//     displayCityPhoto(photoUrl);
//   } catch (error) {
//     console.log("Error fetching city photo:", error);
//   }
// }
// get city photo from Unsplash API in fetch way
function getCityPhoto(city) {
  const apiKey = "kQjKixGY_Mrq17KtL20ILb5TDQ7p9JA91rGHjEdAAIs";
  const apiUrl = `https://api.unsplash.com/search/photos?query=${city}&orientation=landscape&count=1`;

  fetch(apiUrl, {
    headers: {
      Authorization: `Client-ID ${apiKey}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const photoUrl = data.results[0].urls.regular;
      console.log(data);
      displayCityPhoto(photoUrl);
    })
    .catch((error) => {
      console.log("Error fetching city photo:", error);
    });
}
//display city photo
function displayCityPhoto(photoUrl) {
  const photoElement = document.querySelector("#city-photo");
  photoElement.innerHTML = `<img src="${photoUrl}" class="city-photo">`;
}

//Add event listener
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handelSearchSubmit);
searchCity("Gent"); //by default the visible city is Gent

document.addEventListener("DOMContentLoaded", () => {
  let lastSearchCity = localStorage.getItem("lastSearchCity");
  if (lastSearchCity) {
    searchCity(lastSearchCity);
  }
});

//Add sound to the background and change the background
const themeIcon = document.getElementById("theme-icon");
const backgroundImage = document.querySelector(".background-image");
const dayAudio = document.getElementById("day-audio");
const nightAudio = document.getElementById("night-audio");
const soundIcon = document.getElementById("sound-icon");

let isDarkMode = false;
let isMuted = true;

function toggleAudio() {
  if (isDarkMode) {
    dayAudio.pause();
    if (!isMuted) nightAudio.play();
  } else {
    nightAudio.pause();
    if (!isMuted) dayAudio.play();
  }
}

themeIcon.addEventListener("click", () => {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    themeIcon.src = "./src/images/sun.png";
    backgroundImage.style.backgroundImage = "url(./src/images/night.jpg)";
  } else {
    document.body.classList.remove("dark-mode");
    themeIcon.src = "./src/images/moon.png";
    backgroundImage.style.backgroundImage = "url(./src/images/day.jpg)";
  }

  toggleAudio();
});

soundIcon.addEventListener("click", () => {
  isMuted = !isMuted;

  if (isMuted) {
    soundIcon.src = "./src/images/volume-off.png";
    dayAudio.pause();
    nightAudio.pause();
  } else {
    soundIcon.src = "./src/images/volume-up.png";
    toggleAudio();
  }
});

// Initial audio setup
toggleAudio();
