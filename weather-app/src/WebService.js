import axios from "axios";

const GET_WEATHER = "http://api.openweathermap.org/data/2.5/weather";
const API_KEY = "052ce79d0b2c957ebd6a452844b6d69e";

export function getWeatherByCity(cityName, celsius) {
  const unit = celsius ? "metric" : "imperial";
  return axios(GET_WEATHER, {
    params: {
      q: cityName,
      APPID: API_KEY,
      units: unit,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getWeatherByLocation(latitude, longitude) {
  return axios(GET_WEATHER, {
    params: {
      lat: latitude,
      lon: longitude,
      APPID: API_KEY,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}
