const API_URL = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
const SERVICE_KEY = process.env.WEATHER_API_SECRET_KEY || '';

export async function fetchWeatherData(): Promise<any> {
    const nx = 98;
    const ny = 75;
    const { baseDate, baseTime } = getBaseTime();

    const params = new URLSearchParams({
        serviceKey: SERVICE_KEY,
        pageNo: "1",
        numOfRows: "1000",
        dataType: "JSON",
        base_date: baseDate,
        base_time: baseTime,
        nx: nx.toString(),
        ny: ny.toString(),
    });

    const url = `${API_URL}?${params.toString()}`;

    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');
        const text = await response.text();

        // 응답 상태 코드 체크
        if (!response.ok) {
            const errorMsg = `날씨 정보를 가져올 수 없습니다. 상태코드: ${response.status}`;
            throw new Error(errorMsg);
        }

        // 응답이 JSON이 아닌 경우 처리
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('JSON이 아닌 응답을 받았습니다.');
        }

        // JSON 파싱
        const data = JSON.parse(text);

        // 응답에 items가 없을 때 처리
        if (!data.response || !data.response.body || !data.response.body.items) {
            throw new Error(`API 응답 형식이 잘못되었습니다: ${JSON.stringify(data)}`);
        }

        const items = data.response.body.items.item;

        const temperature = items.find((item: any) => item.category === "TMP");

        return temperature;
    } catch (error) {
        console.error('❌ fetchWeatherData 오류:', error);
        throw error;
    }
}


function getBaseTime() {
    const now = new Date();
    const hour = now.getHours();

    const times = [2, 5, 8, 11, 14, 17, 20, 23];
    let baseHour = times.reduce((prev, curr) =>
        Math.abs(curr - hour) >= 3 ? prev : curr
    );

    if (hour < 2) {
        // 자정~2시 사이는 전날 23시 데이터
        baseHour = 23;
        now.setDate(now.getDate() - 1);
    }

    const baseDate = now.toISOString().slice(0, 10).replace(/-/g, "");
    const baseTime = baseHour.toString().padStart(2, "0") + "00";

    return { baseDate, baseTime };
}