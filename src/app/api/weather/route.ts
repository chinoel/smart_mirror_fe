import { NextResponse } from 'next/server';
import { fetchWeatherData } from '@/lib/weather';

export async function GET() {
    try {
        // fetchWeatherData에서 반환되는 기온 값을 가져옴
        const temperature = await fetchWeatherData();

        // 기온 정보를 포함한 성공적인 응답 반환
        return NextResponse.json(
            { success: true, weather: { temperature } },
            { status: 200 }
        );
    } catch (error) {
        console.error('❌ Error fetching weather data:', error);

        // 에러가 발생한 경우, 실패 응답 반환
        return NextResponse.json(
            { success: false, error: 'Failed to fetch weather data', weather: null },
            { status: 500 }
        );
    }
}
