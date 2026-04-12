import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { useAuth } from "../store/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="container-default py-16">
      <div className="mx-auto max-w-xl card-surface p-8 md:p-10">
        <SectionHeading
          eyebrow="Acesso"
          title="Entrar"
          description="Faça login para acompanhar pedidos e usar o carrinho."
          center
        />

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

          <button className="btn-primary w-full">Entrar</button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" className="font-semibold text-black">
            Criar cadastro
          </Link>
        </p>
      </div>
    </section>
  );
}
