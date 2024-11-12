
import Link from "next/link";
import "./style/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>Gerencimento de Tarefas</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link href="/">Cadastro de Usuários</Link>
          </li>
          <li>
            <Link href="/register-tarefas">Cadastro de Tarefas</Link>
          </li>
          <li>
            <Link href="/gerenciamento">Gerenciamento</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
