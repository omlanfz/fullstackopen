import { useState, useEffect } from "react";
import axios from "axios";

const WeatherInfo = ({ capital, weather }) => (
  <div>
    <h2>Weather in {capital}</h2>
    <p>Temperature {weather.main.temp} Celsius</p>
    <img
      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      alt={weather.weather[0].description}
    />
    <p>Wind {weather.wind.speed} m/s</p>
  </div>
);

const CountryDetail = ({ country, weather }) => (
  <div>
    <h1>{country.name.common}</h1>
    <p>Capital {country.capital?.[0]}</p>
    <p>Area {country.area}</p>
    <h2>Languages</h2>
    <ul>
      {Object.values(country.languages || {}).map((lang) => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img
      src={country.flags.png}
      alt={`flag of ${country.name.common}`}
      width="150"
    />
    {weather && (
      <WeatherInfo capital={country.capital?.[0]} weather={weather} />
    )}
  </div>
);

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [picked, setPicked] = useState(null);
  const [weather, setWeather] = useState(null);

  const fetchWeather = (capital) => {
    const apiKey = import.meta.env.VITE_SOME_KEY;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`,
      )
      .then((res) => setWeather(res.data))
      .catch((err) => {
        console.error("Weather fetch error:", err);
        setWeather(null);
      });
  };

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setPicked(null);
      setWeather(null);
      return;
    }

    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => {
        const matched = res.data.filter((c) =>
          c.name.common.toLowerCase().includes(query.toLowerCase()),
        );
        setResults(matched);
        setPicked(null);
        setWeather(null);

        if (matched.length === 1 && matched[0].capital?.[0]) {
          fetchWeather(matched[0].capital[0]);
        }
      })
      .catch((err) => console.error("Country fetch error:", err));
  }, [query]);

  const handleShow = (country) => {
    setPicked(country);
    if (country.capital?.[0]) {
      fetchWeather(country.capital[0]);
    }
  };

  const displayedCountry = results.length === 1 ? results[0] : picked;

  return (
    <div>
      find countries{" "}
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {results.length > 10 && <p>Too many matches, specify another filter</p>}
      {results.length > 1 && results.length <= 10 && !picked && (
        <div>
          {results.map((country) => (
            <div key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleShow(country)}>show</button>
            </div>
          ))}
        </div>
      )}
      {displayedCountry && (
        <CountryDetail country={displayedCountry} weather={weather} />
      )}
    </div>
  );
};

export default App;
