const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
    getWeather('AMBUR');
});

function getWeather() {
    const cityName = $('#city-input').val() || 'Ambur';
    const fullUrl = `${url}?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(fullUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}
function displayWeather(data) {
    $('#city-name').html(`<p class="text"><i class="fas fa-map-marker-alt"></i> ${data.name}</p>`);
    
    
    let timeData = {
        dt: Math.floor(Date.now() / 1000), 
        timezone: data.timezone || 0 // Use the provided timezone from data or default to 0
    };

    function updateLocalTime() {
        timeData.dt += 1;
        const localTime = moment.unix(timeData.dt + timeData.timezone).utc().format('MMMM Do YYYY, h:mm:ss a');
        $('#date').text(localTime);
    }

    setInterval(updateLocalTime, 1000);
    updateLocalTime();

    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(data.weather[0].description);
    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
    $('#weather-icon').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
    $('#weather-info').removeClass('d-none');
    $('#extra-info').html(` 
        <p style="font-weight: bold; font-size: 18px; color: white;">Humidity: ${data.main.humidity}%</p> 
        <p style="font-weight: bold; font-size: 18px; color: white;">Pressure: ${data.main.pressure} hPa</p> 
    `);
    addWeatherEffects(data.weather[0].main);
}


function addWeatherEffects(weatherMain) {
    const extraInfo = $('#extra-info');
    extraInfo.empty(); // Clear previous weather effects
    switch (weatherMain.toLowerCase()) {
        case 'rain':
            extraInfo.append('<p class="text-info fw-bold"><i class="fas fa-umbrella"></i> Rainy day, bring an umbrella!</p>');
            break;
        case 'clear':
            extraInfo.append('<p class="text-success fw-bold"><i class="fas fa-sun"></i> Clear skies, enjoy the sunshine!</p>');
            break;
        case 'clouds':
            extraInfo.append('<p class="text-warning fw-bold"><i class="fas fa-cloud"></i> Partly cloudy, a comfortable day.</p>');
            break;
        default:
            extraInfo.append('<p class="text-warning fw-bold"><i class="fas fa-question"></i> Weather conditions may vary.</p>');
    }
}
