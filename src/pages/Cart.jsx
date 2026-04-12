import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { currency } from "../lib/storage";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../store/AuthContext";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentCart, cartTotal, removeCartItem, updateCartItem, checkout } = useStore();

  function handleCheckout() {
    try {
      checkout();
      navigate("/pedidos");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <section className="container-default py-16">
      <SectionHeading
        eyebrow="Carrinho"
        title="Revise seus produtos"
        description="Fluxo de compra com personalização salva por item."
      />

      {!currentCart.length ? (
        <div className="mt-10 rounded-[28px] border border-dashed border-neutral-300 p-12 text-center">
          <p className="text-sm text-neutral-600">Seu carrinho está vazio.</p>
          <Link to="/shop" className="btn-primary mt-6">
            Ir para o shop
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {currentCart.map((item) => (
              <article
                key={item.id}
                className="grid gap-5 rounded-[28px] border border-neutral-200 bg-white p-5 md:grid-cols-[120px_1fr]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-32 w-full rounded-2xl object-cover"
                />

                <div className="flex flex-col justify-between gap-5">
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                      Cor: {item.color} · Tamanho: {item.size}
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {currency(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateCartItem(item.id, Number(event.target.value))
                      }
                      className="input-default max-w-24"
                    />
                    <button
                      onClick={() => removeCartItem(item.id)}
                      className="btn-secondary"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="card-surface h-fit p-7">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Resumo
            </p>

            <div className="flex items-center justify-between border-b border-neutral-200 pb-4 text-sm">
              <span>Itens</span>
              <span>{currentCart.length}</span>
            </div>

            <div className="flex items-center justify-between py-5 text-lg font-semibold">
              <span>Total</span>
              <span>{currency(cartTotal)}</span>
            </div>

            {!user && (
              <p className="mb-4 text-sm leading-7 text-neutral-600">
                Faça login antes de finalizar o pedido.
              </p>
            )}

            <button onClick={handleCheckout} className="btn-primary w-full">
              Finalizar pedido
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
