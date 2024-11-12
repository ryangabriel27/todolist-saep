"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
import Header from "./components/header";

export default function Home() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email }),
      });

      if (res.ok) {
        setMessage("Usuário cadastrado com sucesso!");
        setNome("");
        setEmail("");
        // router.push(/tasks)
      } else {
        const data = await res.json();
        setMessage(data.error || "Erro ao cadastrar o usuário.");
      }
    } catch (error) {
      setMessage("Erro de rede. Tente novamente.");
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <h1>Cadastro de Usuário</h1>
        {message && <p className="messagge">{message}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button">
            Cadastrar
          </button>
        </form>
      </div>
    </>
  );
}
