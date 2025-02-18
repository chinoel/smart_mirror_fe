import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_LOGIN_API_URL;

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || "Login failed" }, { status: res.status });
        }

        return NextResponse.json({ token: data.token }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
