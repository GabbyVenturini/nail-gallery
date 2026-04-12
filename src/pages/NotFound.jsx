import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container-default py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
        Página não encontrada
      </p>
      <h1 className="mt-4 text-4xl font-semibold">404</h1>
      <Link to="/" className="btn-primary mt-8">
        Voltar para home
      </Link>
    </section>
  );
}
