import 'dotenv/config';
import Mustache from 'mustache';
import fetch from 'node-fetch';
import fs from 'fs';

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  cityName: 'Ho Chi Minh City, Vietnam',
  refresh_date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }),
};

async function setWeatherInformation() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Ho%20Chi%20Minh%20City,VN&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`,
    );
    const r = await response.json();

    // Log the response to debug
    console.log(r);

    if (r.main && r.main.temp && r.weather && r.weather[0] && r.sys) {
      DATA.city_temperature = Math.round(r.main.temp);
      DATA.city_weather = r.weather[0].description;
      DATA.city_weather_icon = r.weather[0].icon;
      DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
      });
      DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
      });
    } else {
      console.error('Error: Incomplete weather data received');
      DATA.city_temperature = 'N/A';
      DATA.city_weather = 'N/A';
      DATA.city_weather_icon = 'N/A';
      DATA.sun_rise = 'N/A';
      DATA.sun_set = 'N/A';
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    DATA.city_temperature = 'N/A';
    DATA.city_weather = 'N/A';
    DATA.city_weather_icon = 'N/A';
    DATA.sun_rise = 'N/A';
    DATA.sun_set = 'N/A';
  }
}

async function generateReadMe() {
  try {
    const data = await fs.promises.readFile(MUSTACHE_MAIN_DIR);
    const output = Mustache.render(data.toString(), DATA);
    await fs.promises.writeFile('README.md', output);
  } catch (err) {
    console.error('Error generating README:', err);
  }
}

async function action() {
  /**
   * Fetch Weather
   */
  await setWeatherInformation();

  /**
   * Generate README
   */
  await generateReadMe();
}

action();
