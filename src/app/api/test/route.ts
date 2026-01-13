import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
console.log("GET test called")
return NextResponse.json({ msg: 'success' });
}