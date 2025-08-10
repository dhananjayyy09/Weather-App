async function getWeather(location = null) {
    if (!location) {
        location = document.getElementById('location').value;
        if (!location) {
            alert('Please enter a location');
            return;
        }
    }
    document.getElementById('inputContainer').classList.add('blurred-input');
    document.getElementById('weatherInfo').classList.remove('hidden');
    
    const apiKey = 'c987651cd2934c6fa41174926250902';
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=10&aqi=yes`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            document.getElementById('weatherInfo').innerHTML = `<button class="close-btn" onclick="closeWeather()">✖</button><p>${data.error.message}</p>`;
        } else {
            let forecastHtml = `<button class="close-btn" onclick="closeWeather()">✖</button><h3>${data.location.name}, ${data.location.country}</h3>`;
            forecastHtml += `<p>🌡 Current Temperature: ${data.current.temp_c}°C</p>`;
            
            data.forecast.forecastday.forEach(day => {
                let conditionEmoji = '';
                if (day.day.condition.text.includes("Rain")) conditionEmoji = '🌧';
                else if (day.day.condition.text.includes("Cloud")) conditionEmoji = '☁';
                else if (day.day.condition.text.includes("Sunny")) conditionEmoji = '☀';
                else conditionEmoji = '🌤';
                
                forecastHtml += `
                    <p>${day.date} - ${conditionEmoji} ${day.day.condition.text}</p>
                    <p>🌡 Max: ${day.day.maxtemp_c}°C | Min: ${day.day.mintemp_c}°C</p>
                    <img src="${day.day.condition.icon}" alt="Weather icon">
                `;
            });
            
            document.getElementById('weatherInfo').innerHTML = forecastHtml;
        }
    } catch (error) {
        document.getElementById('weatherInfo').innerHTML = `<button class="close-btn" onclick="closeWeather()">✖</button><p>Error fetching weather data</p>`;
    }
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(`${lat},${lon}`);
        }, () => {
            alert('Geolocation permission denied');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

function closeWeather() {
    document.getElementById('weatherInfo').classList.add('hidden');
    document.getElementById('inputContainer').classList.remove('blurred-input');
}
