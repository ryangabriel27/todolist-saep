"use client";
import { useEffect, useState } from "react";
import "./style.css";
import Header from "../components/header";

export default function Gerenciamento() {
  const [tarefas, setTarefas] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Função para buscar as tarefas do banco de dados
    const fetchTarefas = async () => {
      try {
        const res = await fetch("/api/tarefas");

        if (!res.ok) {
          setMessage("Erro ao carregar tarefas.");
          return;
        }

        const data = await res.json(); // Converte a resposta para JSON
        console.log("Tarefas recebidas:", data); // Verifique o conteúdo da resposta

        setTarefas(data); // Armazena as tarefas no estado
      } catch (error) {
        setMessage("Erro de rede. Tente novamente.");
        console.error("Erro ao carregar tarefas:", error);
      }
    };

    fetchTarefas();
  }, []);

  // Função para alterar o status de uma tarefa
  const handleStatusChange = async (tarefaId, novoStatus) => {
    try {
      const res = await fetch(`/api/tarefas/${tarefaId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) {
        const updatedTarefa = await res.json();
        setTarefas((prevTarefas) =>
          prevTarefas.map((tarefa) =>
            tarefa.id_tarefa === updatedTarefa.id_tarefa
              ? updatedTarefa
              : tarefa
          )
        );
        setMessage("Status atualizado com sucesso!");
      } else {
        setMessage("Erro ao atualizar status.");
      }
    } catch (error) {
      setMessage("Erro de rede. Tente novamente.");
    }
  };

  const handleDelete = async (tarefaId) => {
    try {
      const res = await fetch(`/api/tarefas/${tarefaId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTarefas((prevTarefas) =>
          prevTarefas.filter((tarefa) => tarefa.id_tarefa !== tarefaId)
        );
        setMessage("Tarefa excluída com sucesso!");
      } else {
        setMessage("Erro ao excluir tarefa.");
      }
    } catch (error) {
      setMessage("Erro de rede. Tente novamente.");
    }
  };

  // Função para determinar o próximo status
  const getNextStatus = (status) => {
    if (status === "a fazer") return "fazendo";
    if (status === "fazendo") return "pronto";
    return "a fazer"; // O status "pronto" não volta para "a fazer"
  };

  // Organiza as tarefas por status
  const tarefasPorStatus = {
    "a fazer": [],
    fazendo: [],
    pronto: [],
  };

  tarefas.forEach((tarefa) => {
    tarefasPorStatus[tarefa.status].push(tarefa);
  });

  return (
    <>
      <Header />
      <div className="container">
        {message && <p className="message">{message}</p>}

        <div className="columns">
          {["a fazer", "fazendo", "pronto"].map((status) => (
            <div key={status} className="column">
              <h2>{status.toUpperCase()}</h2>
              <div className="tasks">
                {tarefasPorStatus[status].map((tarefa) => (
                  <div
                    key={tarefa.id_tarefa} // A chave agora está sendo dada corretamente a cada tarefa
                    className="task-card"
                  >
                    <h3>{tarefa.descricao_tarefa}</h3>
                    <p>Usuário: {tarefa.id_usuario}</p>
                    <p>Setor: {tarefa.nome_setor}</p>
                    <p>Prioridade: {tarefa.prioridade}</p>

                    <div className="action-buttons">
                      <button
                        className="status-button"
                        onClick={() =>
                          handleStatusChange(
                            tarefa.id_tarefa,
                            getNextStatus(tarefa.status)
                          )
                        }
                      >
                        Atualizar Status
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => console.log("Editar tarefa", tarefa.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(tarefa.id_tarefa)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
