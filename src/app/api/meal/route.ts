import { NextResponse } from 'next/server';
import { fetchMealData } from '@/lib/mealParser';

export async function GET() {
    try {
        const data = await fetchMealData();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error fetching meal data:', error);
        return NextResponse.json({ error: 'Failed to fetch meal data' }, { status: 500 });
    }
}