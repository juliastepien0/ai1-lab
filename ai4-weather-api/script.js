const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.resultsBlock = document.querySelector(resultsBlockSelector);
        this.currentWeather = null;
        this.forecast = null;
        this.baseUrl = "https://api.openweathermap.org/data/2.5";
        this.iconUrl = "https://openweathermap.org/img/wn/{icon}@2x.png";
    }

    getForecast(query) {
        const url = `${this.baseUrl}/forecast?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            this.forecast = data.list;
            this.drawWeather();
        });
    }

    getCurrentWeather(query) {
        const url = `${this.baseUrl}/weather?q=${query}&appid=${this.apiKey}&units=metric&lang=pl`;
        let requests = new XMLHttpRequest();
        requests.open("GET", url, true);
        requests.addEventListener("load", () => {
            this.currentWeather = JSON.parse(requests.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        requests.send();
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        this.resultsBlock.innerHTML = '';
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;
            const temperature = this.currentWeather.main.temp;
            const feelsLikeTemperature = this.currentWeather.main.feels_like;
            const iconName = this.currentWeather.weather[0].icon;
            const description = this.currentWeather.weather[0].description;
            const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
            this.resultsBlock.appendChild(weatherBlock);
        }

        if (this.forecast && this.forecast.length > 0) {
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
                const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;
                const temperature = weather.main.temp;
                const feelsLikeTemperature = weather.main.feels_like;
                const iconName = weather.weather[0].icon;
                const description = weather.weather[0].description;
                const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
                this.resultsBlock.appendChild(weatherBlock);
            }
        }
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        let dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);

        let temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        let feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.className = "weather-temperature-feels-like";
        feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconUrl.replace("{icon}", iconName);
        weatherBlock.appendChild(weatherIcon);

        let weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.innerText = description;
        weatherBlock.appendChild(weatherDescription);

        return weatherBlock;
    }
}

document.weatherApp = new WeatherApp("f1b319abe66f44e62c0ceb6e5e22cef1", "#weather-results-container");

document.querySelector("#przycisk").addEventListener("click", function() {
    const query = document.querySelector("#lokalizacja").value;
    document.weatherApp.getWeather(query);
});