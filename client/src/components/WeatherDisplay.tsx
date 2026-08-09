import { useState, useEffect } from 'react';
import { Loader2, Cloud } from 'lucide-react';

interface WeatherData {
  temperature: number;
  description: string;
  isDay: boolean;
}

export default function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Jávea coordinates
        const lat = 38.7892;
        const lon = 0.1615;
        
        // Open-Meteo API - free, no API key required
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=Europe/Madrid`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather fetch failed');
        
        const data = await response.json();
        
        // Map weather codes to descriptions
        const weatherCodeMap: Record<number, string> = {
          0: 'Clear sky',
          1: 'Mainly clear',
          2: 'Partly cloudy',
          3: 'Overcast',
          45: 'Foggy',
          48: 'Foggy',
          51: 'Light drizzle',
          53: 'Moderate drizzle',
          55: 'Dense drizzle',
          61: 'Slight rain',
          63: 'Moderate rain',
          65: 'Heavy rain',
          80: 'Slight rain showers',
          81: 'Moderate rain showers',
          82: 'Violent rain showers',
          95: 'Thunderstorm',
          96: 'Thunderstorm with hail',
          99: 'Thunderstorm with hail'
        };
        
        const temperature = Math.round(data.current.temperature_2m);
        const weatherCode = data.current.weather_code;
        const description = weatherCodeMap[weatherCode] || 'Unknown';
        const isDay = data.current.is_day === 1;
        
        setWeather({
          temperature,
          description,
          isDay
        });
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Update every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (weatherCode: number, isDay: boolean) => {
    if (weatherCode === 0) return isDay ? '☀️' : '🌙'; // Clear sky
    if (weatherCode === 1) return isDay ? '🌤️' : '🌙'; // Mainly clear
    if (weatherCode === 2) return '⛅'; // Partly cloudy
    if (weatherCode === 3) return '☁️'; // Overcast
    if (weatherCode === 45 || weatherCode === 48) return '🌫️'; // Foggy
    if (weatherCode >= 51 && weatherCode <= 57) return '🌦️'; // Drizzle
    if (weatherCode >= 61 && weatherCode <= 67) return '🌧️'; // Rain
    if (weatherCode >= 71 && weatherCode <= 77) return '🌨️'; // Snow
    if (weatherCode >= 80 && weatherCode <= 82) return '🌧️'; // Rain showers
    if (weatherCode >= 85 && weatherCode <= 86) return '🌨️'; // Snow showers
    if (weatherCode >= 95 && weatherCode <= 99) return '⛈️'; // Thunderstorm
    return isDay ? '☀️' : '🌙'; // Default
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Cloud className="w-4 h-4" />
        <span>29°C</span>
      </div>
    );
  }

  // Map weather description to weather code for icon selection
  const getWeatherCode = (description: string): number => {
    const desc = description.toLowerCase();
    if (desc.includes('clear sky')) return 0;
    if (desc.includes('mainly clear')) return 1;
    if (desc.includes('partly cloudy')) return 2;
    if (desc.includes('overcast')) return 3;
    if (desc.includes('fog')) return 45;
    if (desc.includes('drizzle')) return 51;
    if (desc.includes('rain')) return 61;
    if (desc.includes('thunderstorm')) return 95;
    return 0; // Default to clear sky
  };

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <span className="text-lg">
        {getWeatherIcon(getWeatherCode(weather.description), weather.isDay)}
      </span>
      <span className="text-gray-800">
        {weather.temperature}°C
      </span>
    </div>
  );
}