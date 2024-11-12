import { query } from "@/utils/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { id_tarefa } = params; // Acessamos o parâmetro da URL de forma assíncrona

  const { status } = await req.json();

  try {
    const result = await query(
      `UPDATE tarefas SET status = $1 WHERE id_tarefa = $2 RETURNING *`,
      [status, id_tarefa]
    );

    if (result.rows.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Tarefa não encontrada" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro ao atualizar status" }),
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  const { id_tarefa } = params;

  try {
    const result = await query(
      `DELETE FROM tarefas WHERE id_tarefa = $1 RETURNING *`,
      [id_tarefa]
    );

    if (result.rows.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Tarefa não encontrada" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Tarefa excluída com sucesso!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro ao excluir tarefa" }),
      { status: 500 }
    );
  }
}
