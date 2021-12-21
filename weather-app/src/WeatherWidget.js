import React, { useEffect, useState } from "react";
import { getWeatherByCity, getWeatherByLocation } from "./WebService";
import {
  Paper,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import useUpdateEffect from "./customHooks/useUpdateEffect";

const WeatherWidget = () => {
  const [cityWeatherData, setCityWeatherData] = useState();
  const [celsius, setCelsius] = useState(true);
  const [city, setCity] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // On initial load get the current location and set that city name returned by the weather API

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        getWeatherByLocation(
          position.coords.latitude,
          position.coords.longitude
        ).then((res) => {
          setCurrentCity(res.data.name);
          setCityWeatherData(res.data);
        });
      },
      (error) => {
        setCity("Brisbane");
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, []);

  // When the city value/format is changed, send a request
  // if the selected city is the current location, use the exact coordinates

  useUpdateEffect(() => {
    if (["Brisbane", "Melbourne", "Sydney"].includes(city)) {
      getWeatherByCity(city, celsius).then((res) => {
        setCityWeatherData(res.data);
      });
    } else {
      getWeatherByLocation(latitude, longitude).then((res) => {
        setCityWeatherData(res.data);
      });
    }
  }, [celsius, city]);

  // Set the current working city to the current location city once it has been retrieved

  useUpdateEffect(() => {
    setCity(currentCity);
  }, [currentCity]);

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  return (
    <Paper
      className="weatherWidget"
      variant="outlined"
      sx={{ backgroundColor: "#222", color: "#f1f5f8" }}
    >
      <Grid container spacing={2} alignItems={"center"}>
        <Grid item xs={6}>
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            sx={{ flex: "center" }}
          >
            {cityWeatherData?.name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <img
            src={
              "http://openweathermap.org/img/wn/" +
              cityWeatherData?.weather[0]?.icon +
              "@2x.png"
            }
            alt="icon"
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            size="large"
            onClick={() => setCelsius(!celsius)}
            variant="text"
            sx={{ color: "#f1f5f8" }}
          >
            {cityWeatherData?.main?.temp + "" + (celsius ? "°C" : "°F")}
          </Button>
        </Grid>
        <Grid item xs={6} sx={{ color: "#f1f5f8" }}>
          <Select
            value={city}
            onChange={handleChange}
            sx={{ color: "#f1f5f8" }}
          >
            <MenuItem value={"Brisbane"}>Brisbane</MenuItem>
            <MenuItem value={"Sydney"}>Sydney</MenuItem>
            <MenuItem value={"Melbourne"}>Melbourne</MenuItem>
            <MenuItem value={currentCity}>{currentCity}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default WeatherWidget;
