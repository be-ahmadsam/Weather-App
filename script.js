const button = document.getElementById("search-button");
const input = document.getElementById("City-input");

// Current Location Elements
const currentCity = document.getElementById("current-city");
const currentTime = document.getElementById("current-time");
const currentTemp = document.getElementById("current-temp");

// Searched Location Elements
const cityDisplayName = document.getElementById("City-name");
const time = document.getElementById("City-time");
const temp = document.getElementById("City-temp");
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");

const API_KEY = "415021de044b4e9ebc9172852242602";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

// Function to fetch weather data
async function getData(cityName) {
    try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${cityName}&aqi=no`);
        if (!response.ok) throw new Error("City not found");
        return await response.json();
    } catch (error) {
        return null;
    }
}

// Auto-fetch weather for user's location
async function getCurrentLocationWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const result = await getData(`${lat},${lon}`);

                if (result) {
                    currentCity.innerText = `${result.location.name}, ${result.location.region}, ${result.location.country}`;
                    currentTime.innerText = `🕒 ${result.location.localtime}`;
                    currentTemp.innerText = `🌡️ ${result.current.temp_c}°C`;
                } else {
                    currentCity.innerText = "Location not found";
                    currentTemp.innerText = "";
                    currentTime.innerText = "";
                }
            },
            (error) => {
                currentCity.innerText = "Location access denied";
                currentTemp.innerText = "❌ Unable to fetch data";
                currentTime.innerText = "";
            }
        );
    } else {
        currentCity.innerText = "Geolocation not supported";
        currentTemp.innerText = "❌ Unable to fetch data";
        currentTime.innerText = "";
    }
}

// Search for another location's weather
button.addEventListener("click", async () => {
    const value = input.value.trim();

    if (value === "") {
        errorMessage.innerText = "Please enter a city name!";
        errorMessage.classList.remove("hidden");
        weatherInfo.classList.add("hidden");
        return;
    }

    const result = await getData(value);

    if (result) {
        cityDisplayName.innerText = `${result.location.name}, ${result.location.region}, ${result.location.country}`;
        time.innerText = `🕒 ${result.location.localtime}`;
        temp.innerText = `🌡️ ${result.current.temp_c}°C`;

        weatherInfo.classList.remove("hidden");
        errorMessage.classList.add("hidden");
    } else {
        errorMessage.innerText = "City not found. Try again.";
        errorMessage.classList.remove("hidden");
        weatherInfo.classList.add("hidden");
    }
});

// Load user's location weather on startup
getCurrentLocationWeather();
