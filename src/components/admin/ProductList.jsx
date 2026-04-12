import { currency } from "../../lib/storage";
import { useStore } from "../../store/StoreContext";
import { Pencil } from "lucide-react";

export default function ProductList({ onEditProduct }) {
  const { products } = useStore();

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Catálogo Ativo</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {products.length} {products.length === 1 ? "Item" : "Itens"}
        </span>
      </div>

      {!products.length ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 py-16 flex items-center justify-center text-sm text-neutral-500">
          Nenhum produto cadastrado no catálogo.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col rounded-3xl border border-neutral-100 bg-white/50 p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:bg-white"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 mb-4">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-400">
                    S/ Imagem
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <h3 className="font-bold text-neutral-900 leading-tight mb-1">{product.name}</h3>
                <p className="text-primary font-semibold">{currency(product.price)}</p>
                
                <p className="text-[11px] text-neutral-500 mt-2 mb-4">
                  {product.colors.length} Cores · {product.sizes.length} Tamanhos
                </p>

                <div className="mt-auto pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-600 transition-colors hover:border-primary hover:text-white hover:bg-primary"
                  >
                    <Pencil className="h-3 w-3" /> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
