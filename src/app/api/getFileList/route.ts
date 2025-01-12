import { NextResponse } from "next/server"
import fs from "fs"

export async function GET() {
    try {
        const files = fs.readdirSync("./documents")
        return NextResponse.json(files)
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to read documents" },
            { status: 500 }
        )
    }
}