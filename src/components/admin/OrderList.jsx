import { currency } from "../../lib/storage";
import { useStore } from "../../store/StoreContext";
import { ChevronRight, Package, Truck, CheckCircle2, Clock } from "lucide-react";

const statuses = ["Recebido", "Em produção", "Enviado", "Concluído"];

const statusConfig = {
  "Recebido": { color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  "Em produção": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Package },
  "Enviado": { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
  "Concluído": { color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
};

export default function OrderList() {
  const { orders, updateOrderStatus } = useStore();

  function nextStatus(current) {
    const idx = statuses.indexOf(current);
    if (idx < statuses.length - 1) return statuses[idx + 1];
    return current;
  }

  return (
    <div className="card-surface p-7">
      <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-4">
        <h2 className="text-xl font-bold tracking-tight">Status de Pedidos</h2>
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {orders.length} {orders.length === 1 ? "Pedido" : "Pedidos"}
        </span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const config = statusConfig[order.status] || statusConfig["Recebido"];
          const Icon = config.icon;
          const isDone = order.status === "Concluído";

          return (
            <div
              key={order.id}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-neutral-100 bg-white/50 p-5 shadow-sm transition-all hover:bg-white hover:shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-neutral-900">{order.customerName}</h3>
                  <span className="font-mono text-[10px] text-neutral-400">#{order.id.split("-")[1]}</span>
                </div>
                <p className="text-sm font-medium text-neutral-500">
                  {order.customerEmail} · <span className="text-primary font-bold">{currency(order.total)}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border ${config.color}`}>
                  <Icon size={14} />
                  {order.status}
                </span>

                {!isDone && (
                  <button
                    onClick={() => updateOrderStatus(order.id, nextStatus(order.status))}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary hover:text-white transition-colors"
                    title="Avançar Status"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!orders.length && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-neutral-200 py-16 text-center text-neutral-500">
            <Package className="text-neutral-300" size={40} />
            <p className="text-sm font-medium">Você ainda não recebeu nenhum pedido.</p>
          </div>
        )}
      </div>
    </div>
  );
}
