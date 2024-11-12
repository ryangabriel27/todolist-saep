"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./tarefa.css";
import Header from "../components/header";

function CadastroTarefa() {
  const [descricao_tarefa, setDescricao] = useState("");
  const [setor, setSetor] = useState("");
  const [prioridade, setPrioridade] = useState("baixa");
  const [status, setStatus] = useState("a fazer");
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const res = await fetch("/api/usuarios");
      const data = await res.json();
      if (res.ok) {
        setUsuarios(data);
      } else {
        setMessage("Erro ao carregar usuários");
      }
    };

    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/tarefas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao_tarefa: descricao_tarefa,
          nome_setor: setor,
          prioridade: prioridade,
          id_usuario: usuarioId,
          status: status
        }),
      });

      if (res.ok) {
        setMessage("Tarefa registrada com sucesso!");
        setDescricao("");
        setSetor("");
        setUsuarioId("");
        setPrioridade("baixa");
        setStatus("a fazer");
      } else {
        const data = await res.json();
        setMessage(data.error || "Erro ao registrar a tarefa.");
      }
    } catch (error) {
      setMessage("Erro de rede. Tente novamente.");
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1>Registrar Tarefa</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label>Descrição:</label>
            <input
              type="text"
              value={descricao_tarefa}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Nome do Setor:</label>
            <input
              type="text"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Prioridade:</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              required
            >
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          <div className="field">
            <label>Usuário:</label>
            <select
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              required
            >
              <option value="">Selecione um usuário</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="button">
            Registrar Tarefa
          </button>
        </form>
      </div>
    </>
  );
}

export default CadastroTarefa;
