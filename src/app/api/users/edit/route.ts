import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_LOGIN_API_URL;

export async function PUT(req: Request) {
    try {
        const { username, newPassword, newNickname } = await req.json();

        if (!newPassword && !newNickname) {
            return NextResponse.json({ error: "변경점 없음" }, { status: 400 });
        }

        const res = await fetch(`${API_URL}/edit`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, newPassword, newNickname }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || "계정 수정 실패" }, { status: res.status });
        }

        return NextResponse.json({ message: "계정 정보 수정 완료" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}