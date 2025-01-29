import { NextResponse } from "next/server"

const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD

if (!CORRECT_PASSWORD) {
    throw new Error("ADMIN_PASSWORD environment variable is not set")
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { password } = data
        
        if (password === CORRECT_PASSWORD) {
            return NextResponse.json({ success: true })
        }
        
        return NextResponse.json(
            { success: false, message: "Invalid password" },
            { status: 401 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        )
    }
}