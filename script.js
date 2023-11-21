function getWeather() {
    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';
    const city = document.getElementById('cityInput').value;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const xhr = new XMLHttpRequest();
    const currentWeatherDiv = document.getElementById('currentWeather');
    currentWeatherDiv.innerHTML = `<h2>Current weather in ${city}</h2>`;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                console.log('Current weather API Response:', data);
                const forecastDateTime = new Date(data.dt * 1000);
                const currentDiv = document.createElement('div');
                currentDiv.classList.add('forecast-current');
                currentDiv.innerHTML += `<h2>${forecastDateTime.toDateString()} ${forecastDateTime.toLocaleTimeString()}</h2>`;
                currentDiv.innerHTML += `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon" style="width: 75px; height: 75px;">`;
                currentDiv.innerHTML += `<p>Temperature: ${data.main.temp.toFixed(2)}°C</p>`;
                currentDiv.innerHTML += `<p>Pressure: ${data.main.pressure} hPa</p>`;
                currentDiv.innerHTML += `<p>Cloudiness: ${data.clouds.all}%</p>`;
                currentDiv.innerHTML += `<p>Humidity: ${data.main.humidity}%</p>`;
                currentDiv.innerHTML += `<p>Wind Speed: ${data.wind.speed} m/s</p>`;
                currentWeatherDiv.appendChild(currentDiv);
            } else {
                console.error('Error fetching current weather:', xhr.statusText);
            }
        }
    };
    xhr.open('GET', currentWeatherUrl, true);
    xhr.send();

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Next hours forecast API Response:', data);
            const forecastDiv = document.getElementById('forecast');
            forecastDiv.innerHTML = `<h2>Next hours forecast for ${city}</h2>`;
            for (let i = 0; i < 5; i += 1) {
                const forecastDateTime = new Date(data.list[i].dt * 1000);
                const dayDiv = document.createElement('div');
                dayDiv.classList.add('forecast-day');
                dayDiv.innerHTML += `<h2>${forecastDateTime.toDateString()} ${forecastDateTime.toLocaleTimeString()}</h2>`;
                dayDiv.innerHTML += `<img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="Weather Icon" style="width: 75px; height: 75px;">`;
                dayDiv.innerHTML += `<p>Temperature: ${data.list[i].main.temp.toFixed(2)}°C</p>`;
                dayDiv.innerHTML += `<p>Pressure: ${data.list[i].main.pressure} hPa</p>`;
                dayDiv.innerHTML += `<p>Cloudiness: ${data.list[i].clouds.all}%</p>`;
                dayDiv.innerHTML += `<p>Humidity: ${data.list[i].main.humidity}%</p>`;
                dayDiv.innerHTML += `<p>Wind Speed: ${data.list[i].wind.speed} m/s</p>`;
                forecastDiv.appendChild(dayDiv);
            }
        })
        .catch(error => console.error('Error fetching forecast:', error));
}
