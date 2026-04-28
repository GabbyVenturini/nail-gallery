import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../store/AuthContext";

export default function Cadastro() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="container-default py-16">
      <div className="mx-auto max-w-xl card-surface p-8 md:p-10">
        <SectionHeading
          eyebrow="Cadastro"
          title="Crie sua conta"
          description="Cadastro simples para salvar carrinho e visualizar pedidos."
          center
        />

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label-default">Nome</label>
            <input
              className="input-default"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="label-default">E-mail</label>
            <input
              className="input-default"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="label-default">Senha</label>
            <input
              className="input-default"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button className="btn-primary w-full">Cadastrar</button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold text-black">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
