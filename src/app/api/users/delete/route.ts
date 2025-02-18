import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_LOGIN_API_URL;

export async function DELETE(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: "아이디와 비밀번호를 입력하세요." }, { status: 400 });
        }

        // 백엔드 API 호출
        const res = await fetch(`${API_URL}/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || "계정 삭제 실패" }, { status: res.status });
        }

        return NextResponse.json({ message: "계정 삭제 완료" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "서버 오류" }, { status: 500 });
    }
}
