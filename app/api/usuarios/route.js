import { query } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await query("SELECT * FROM usuarios", []);
    return new NextResponse(JSON.stringify(res.rows), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const { nome, email } = await request.json();
  try {
    const res = await query(
      "INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *",
      [nome, email]
    );
    return new NextResponse(JSON.stringify(res.rows[0]), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
