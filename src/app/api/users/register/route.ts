import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_LOGIN_API_URL;

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || "회원가입 실패" }, { status: res.status });
        }

        return NextResponse.json({ message: "회원가입 성공" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "서버 연결 오류" }, { status: 500 });
    }
}
