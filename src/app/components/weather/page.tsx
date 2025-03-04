import axios from "axios";
import { useEffect, useState } from "react";

export default function Weather() {
    const [weather, setWeather] = useState<string>("🌤 불러오는 중...");

    useEffect(() => {
        axios.get("/api/weather")
          .then((response) => {
            if (response.data.success && response.data.weather?.temperature?.fcstValue) {
              setWeather(`🌤 현재 기온: ${response.data.weather.temperature.fcstValue}°C`);
            } else {
              setWeather("날씨 정보를 가져오는 데 실패했습니다.");
            }
          })
          .catch(() => {
            setWeather("날씨 정보를 가져오는 데 실패했습니다.");
          });
      }, []);

    return (
        <>
            <span>{weather}</span>
        </>
    )
}