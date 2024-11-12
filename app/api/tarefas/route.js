import { query } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await query("SELECT * FROM tarefas", []);
    return new NextResponse(JSON.stringify(res.rows), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  const { id_usuario, descricao_tarefa, nome_setor, prioridade, status } =
    await request.json();
  try {
    const res = await query(
      `INSERT INTO tarefas (id_usuario, descricao_tarefa, nome_setor, prioridade, status) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_usuario, descricao_tarefa, nome_setor, prioridade, status]
    );
    return new NextResponse(JSON.stringify(res.rows[0]), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
