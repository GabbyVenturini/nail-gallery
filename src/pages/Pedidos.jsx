import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { currency } from "../lib/storage";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../store/AuthContext";

export default function Pedidos() {
  const { user } = useAuth();
  const { myOrders } = useStore();

  if (!user) {
    return (
      <section className="container-default py-16">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-10 text-center">
          <p className="text-sm text-neutral-600">Faça login para ver seus pedidos.</p>
          <Link to="/login" className="btn-primary mt-6">
            Entrar
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-default py-16">
      <SectionHeading
        eyebrow="Meus pedidos"
        title="Acompanhe suas compras"
        description="Histórico de pedidos do usuário autenticado."
      />

      <div className="mt-10 space-y-6">
        {myOrders.map((order) => (
          <article key={order.id} className="card-surface p-7">
            <div className="flex flex-col gap-3 border-b border-neutral-200 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
                  Pedido
                </p>
                <h3 className="mt-2 text-xl font-semibold">{order.id}</h3>
              </div>

              <div className="text-sm text-neutral-600">
                <p>Status: <span className="font-semibold text-black">{order.status}</span></p>
                <p>Total: <span className="font-semibold text-black">{currency(order.total)}</span></p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-2xl bg-blush px-4 py-4 text-sm text-neutral-700">
                  {item.name} · {item.color} · {item.size} · {item.quantity}x
                </div>
              ))}
            </div>
          </article>
        ))}

        {!myOrders.length && (
          <div className="rounded-[28px] border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-600">
            Você ainda não possui pedidos.
          </div>
        )}
      </div>
    </section>
  );
}
