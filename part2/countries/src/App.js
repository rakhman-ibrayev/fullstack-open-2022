import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    const KEY = process.env.REACT_APP_WEATHER_KEY
    
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${KEY}`)
      .then(res => {
        setWeather(res.data)
      })
  }, [city])

  return (
    weather.main ? 
    <div>
      <h2>Weather in {city}</h2>
      <p>temperature {weather.main.temp} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt={`${weather.weather.description}`}/>
      <p>wind {weather.wind.speed} m/s</p>
    </div> : null
  )
}

const Country = ({ country }) => {
  const name = country.name.common
  const langs = Object.values(country.languages)

  return (
    <article>
      <h1>{name}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>
        {langs.map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`${name} flag`} />
      <Weather city={country.capital[0]} />
    </article>
  )
}

const Show = ({ country }) => {
  const [show, setShow] = useState(false)
  
  const handleShow = () => {
    setShow(!show)
  }
  
  return (
    <li>
      {country.name.common} 
      <button onClick={handleShow}>{show ? 'hide' : 'show'}</button>
      {show ? <Country country={country} /> : <></>}
    </li>
  )
}

const Countries = ({ countries }) => {
  const size = countries.length
  
  if (size <= 0) {
    return null
  }

  if (size > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  if (size <= 10 && size > 1) {
    return (
      <ul>
        {countries.map(country => {
            return (
              <Show key={country.name.official} country={country} />
            )
        })}
      </ul>
    )
  }

  return (
    <Country country={countries[0]} />
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchRes, setSearchRes] = useState([])

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(res => {
        setCountries(res.data)
    })
  }, [])

  const handleSearch = (event) => {
    const search = event.target.value.toLowerCase()

    const newSearchRes = countries.filter(country => {
      const name = country.name.common.toLowerCase()
      return name.includes(search)
    })

    setSearchRes(newSearchRes)
  }

  return (
    <div>
      <label>
        find countries <input onChange={handleSearch} />
      </label>
      <Countries countries={searchRes} />
    </div>
  )
}

export default App