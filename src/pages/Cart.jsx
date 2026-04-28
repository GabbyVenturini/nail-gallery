import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  ChevronRight, 
  ArrowLeft,
  Truck,
  QrCode,
  FileText,
  CheckCircle2,
  Search,
  Trash2,
  Plus
} from "lucide-react";
import { currency } from "../lib/storage";
import { useStore } from "../store/StoreContext";
import { useAuth } from "../store/AuthContext";
import { apiFetch } from "../lib/api";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentCart, 
    cartTotal, 
    removeCartItem, 
    updateCartItem, 
    checkout,
    updateProfile 
  } = useStore();

  const [step, setStep] = useState(1); // 1: Items, 2: Shipping, 3: Payment
  const [loading, setLoading] = useState(false);
  
  // Estado do Endereço Selecionado/Escrito
  const [address, setAddress] = useState({
    zip_code: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: ""
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Carregar endereços salvos
  useEffect(() => {
    if (user) {
      apiFetch("/auth/addresses").then(data => {
        setSavedAddresses(data || []);
        // Pré-selecionar o padrão
        const def = data?.find(a => a.is_default);
        if (def) setAddress(def);
        else if (data?.length > 0) setAddress(data[0]);
        else setShowForm(true);
      });
    }
  }, [user]);

  // Estado do Pagamento
  const [paymentMethod, setPaymentMethod] = useState("pix");

  // Busca de CEP (API ViaCEP)
  async function handleCEPBlur() {
    const cep = address.zip_code.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      setLoading(true);
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado.");
      } else {
        setAddress(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
        toast.success("Endereço localizado!");
      }
    } catch (err) {
      toast.error("Erro ao buscar CEP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinalize() {
    if (!user) {
      toast.error("Você precisa estar logado para comprar.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Salvar/Atualizar endereço no perfil do usuário
      await updateProfile({
        ...address,
        name: user.name,
        email: user.email
      });

      // 2. Criar o pedido
      const payload = {
        shippingAddress: address,
        paymentMethod: paymentMethod
      };

      await checkout(payload);
      
      toast.success("Pedido realizado com sucesso!");
      navigate("/pedidos");
    } catch (error) {
      toast.error(error.message || "Erro ao processar pedido.");
    } finally {
      setLoading(false);
    }
  }

  if (!currentCart.length && step === 1) {
    return (
      <section className="container-default py-24 text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
           <ShoppingBag size={40} />
        </div>
        <h1 className="text-3xl font-bold text-primary">Seu carrinho está vazio</h1>
        <p className="mt-4 text-neutral-500">Que tal explorar nossas coleções e escolher algo lindo?</p>
        <Link to="/shop" className="btn-primary mt-10 inline-flex items-center gap-2">
          Ver Produtos <ChevronRight size={18} />
        </Link>
      </section>
    );
  }

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-24">
      <Helmet>
        <title>Checkout | Nail Gallery</title>
      </Helmet>

      {/* Header do Checkout (Steps) */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-30">
        <div className="container-default py-6 flex items-center justify-center gap-4 md:gap-12">
          {[
            { id: 1, label: "Carrinho", icon: ShoppingBag },
            { id: 2, label: "Entrega", icon: MapPin },
            { id: 3, label: "Pagamento", icon: CreditCard }
          ].map((s) => (
            <div key={s.id} className={`flex items-center gap-2 transition-all duration-300 ${step === s.id ? "text-primary opacity-100 scale-105" : "text-neutral-400 opacity-60"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step === s.id ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-neutral-100"}`}>
                <s.icon size={14} />
              </div>
              <span className="hidden md:block text-[11px] font-bold uppercase tracking-widest">{s.label}</span>
              {s.id < 3 && <div className="hidden md:block h-px w-8 bg-neutral-200 mx-2" />}
            </div>
          ))}
        </div>
      </div>

      <section className="container-default py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] items-start">
          
          {/* Main Content Area */}
          <main className="space-y-8 animate-in fade-in duration-500">
            
            {/* ETAPA 1: REVISÃO DE ITENS */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-2xl font-bold text-primary">Meus Itens</h2>
                   <span className="text-sm text-neutral-500">{currentCart.length} produto(s)</span>
                </div>
                {currentCart.map((item) => (
                  <article key={item.id} className="card-surface p-6 flex gap-6 items-center flex-col md:flex-row">
                    <img src={item.image} alt={item.name} className="h-28 w-28 rounded-2xl object-cover shrink-0 bg-neutral-100" />
                    <div className="flex-1 space-y-1">
                      <h3 className="font-bold text-lg text-primary">{item.name}</h3>
                      <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">
                        {item.color} · {item.size}
                      </p>
                      <p className="text-lg font-bold text-primary pt-2">{currency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-4 bg-neutral-50 p-2 rounded-2xl border border-neutral-100">
                       <button onClick={() => updateCartItem(item.id, item.quantity - 1)} className="h-8 w-8 flex items-center justify-center rounded-xl bg-white shadow-sm hover:scale-105 transition-transform">-</button>
                       <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                       <button onClick={() => updateCartItem(item.id, item.quantity + 1)} className="h-8 w-8 flex items-center justify-center rounded-xl bg-white shadow-sm hover:scale-105 transition-transform">+</button>
                    </div>
                    <button onClick={() => removeCartItem(item.id)} className="text-red-400 p-3 hover:bg-red-50 rounded-2xl transition-colors">
                       <Trash2 size={18} />
                    </button>
                  </article>
                ))}
                <div className="pt-4">
                  <button onClick={() => setStep(2)} className="btn-primary w-full md:w-auto px-12 py-4 flex items-center justify-center gap-3">
                    Continuar para Entrega <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

  // ETAPA 2: ENDEREÇO DE ENTREGA
  {step === 2 && (
    <div className="space-y-8">
      <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
         <ArrowLeft size={16} /> Voltar aos itens
      </button>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center bg-gold/10 text-gold rounded-xl">
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-bold text-primary">Selecione o Endereço de Entrega</h2>
           </div>
           <button 
             onClick={() => {
               setAddress({ zip_code: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "" });
               setShowForm(true);
             }}
             className="btn-secondary flex items-center gap-2 text-[10px] px-4 py-2"
           >
             <Plus size={14} /> Novo Endereço
           </button>
        </div>

        {/* Listagem de Endereços Salvos */}
        {!showForm && savedAddresses.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
             {savedAddresses.map((addr) => (
               <button 
                 key={addr.id}
                 onClick={() => setAddress(addr)}
                 className={`card-surface p-6 border-2 text-left transition-all duration-300 relative ${address?.id === addr.id ? "border-gold bg-gold/[0.05]" : "border-transparent"}`}
               >
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-primary">{addr.street}, {addr.number}</span>
                    {address?.id === addr.id && <CheckCircle2 size={18} className="text-gold animate-in zoom-in" />}
                 </div>
                 <p className="text-xs text-neutral-500">{addr.neighborhood} — {addr.city}/{addr.state}</p>
                 <p className="text-[10px] text-neutral-400 mt-2 font-bold tracking-widest uppercase">{addr.zip_code}</p>
               </button>
             ))}
          </div>
        )}

        {/* Formulário para Novo ou Edição (se não houver salvos ou se clicou em novo) */}
        {(showForm || savedAddresses.length === 0) && (
          <div className="card-surface p-8 space-y-6">
             <div className="grid gap-5 md:grid-cols-6 text-left">
                <div className="md:col-span-2">
                  <label className="label-default">CEP</label>
                  <div className="relative">
                     <input 
                        className="input-default pr-10" 
                        placeholder="00000-000" 
                        onBlur={handleCEPBlur}
                        value={address.zip_code}
                        onChange={(e) => setAddress({...address, zip_code: e.target.value})}
                     />
                     <Search className="absolute right-3 top-3 text-neutral-300" size={16} />
                  </div>
                </div>
                <div className="md:col-span-4"></div>
                <div className="md:col-span-5">
                  <label className="label-default">Rua / Avenida</label>
                  <input className="input-default" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
                </div>
                <div className="md:col-span-1">
                  <label className="label-default">Nº</label>
                  <input className="input-default" value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} />
                </div>
                <div className="md:col-span-3">
                  <label className="label-default">Bairro</label>
                  <input className="input-default" value={address.neighborhood} onChange={(e) => setAddress({...address, neighborhood: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="label-default">Cidade</label>
                  <input className="input-default" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
                </div>
                <div className="md:col-span-1">
                  <label className="label-default">UF</label>
                  <input className="input-default" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} maxLength={2} />
                </div>
             </div>
             {savedAddresses.length > 0 && (
               <button onClick={() => setShowForm(false)} className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-primary transition-colors">
                 Cancelar e escolher salvo
               </button>
             )}
          </div>
        )}
      </div>

      <button 
        disabled={!address.street}
        onClick={() => setStep(3)} 
        className="btn-primary w-full md:w-auto px-12 py-4 flex items-center justify-center gap-3 disabled:opacity-50"
      >
        Avançar para Pagamento <ChevronRight size={18} />
      </button>
    </div>
  )}

            {/* ETAPA 3: PAGAMENTO */}
            {step === 3 && (
              <div className="space-y-8">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary transition-colors">
                   <ArrowLeft size={16} /> Voltar ao envio
                </button>
                <div className="card-surface p-8 space-y-6">
                   <div className="flex items-center gap-3 border-b border-neutral-100 pb-5 mb-5">
                      <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl">
                        <CreditCard size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-primary">Forma de Pagamento</h2>
                   </div>

                   <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { id: "pix", label: "Pix", sub: "Aprovação instantânea", icon: QrCode, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { id: "card", label: "Cartão Online", sub: "Até 12x s/ juros", icon: CreditCard, color: "text-blue-500", bg: "bg-blue-50" },
                        { id: "boleto", label: "Boleto", sub: "72h para aprovar", icon: FileText, color: "text-neutral-500", bg: "bg-neutral-50" }
                      ].map((m) => (
                        <button 
                          key={m.id} 
                          onClick={() => setPaymentMethod(m.id)}
                          className={`flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 text-center ${paymentMethod === m.id ? "border-primary bg-primary/[0.02]" : "border-neutral-100 hover:border-neutral-200 bg-white"}`}
                        >
                          <div className={`h-12 w-12 flex items-center justify-center rounded-2xl ${m.bg} ${m.color}`}>
                             <m.icon size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-primary uppercase text-[11px] tracking-widest">{m.label}</h4>
                            <p className="text-[10px] text-neutral-400 mt-1">{m.sub}</p>
                          </div>
                          {paymentMethod === m.id && <CheckCircle2 size={20} className="text-primary mt-2 animate-in zoom-in" />}
                        </button>
                      ))}
                   </div>

                   {paymentMethod === 'card' && (
                     <div className="mt-8 p-6 bg-neutral-50 rounded-3xl border border-neutral-100 text-center space-y-3">
                       <p className="text-sm text-neutral-500">Integração Mercado Pago será habilitada após a compra.</p>
                       <p className="text-xs text-neutral-400">Você será redirecionado para um ambiente seguro.</p>
                     </div>
                   )}
                </div>

                <button 
                  onClick={handleFinalize} 
                  disabled={loading}
                  className="btn-primary w-full md:w-auto px-16 py-5 text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl shadow-primary/20"
                >
                  {loading ? "Processando..." : "Finalizar e Pagar ✅"}
                </button>
              </div>
            )}
          </main>

          {/* Sidebar Summary */}
          <aside className="sticky top-28 space-y-6">
            <div className="card-surface p-8 space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">Resumo da Compra</h3>
              
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal ({currentCart.length} itens)</span>
                    <span className="font-semibold text-primary">{currency(cartTotal)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Entrega</span>
                    <span className="font-semibold text-emerald-500">Grátis</span>
                 </div>
                 <div className="h-px bg-neutral-100 my-2" />
                 <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-primary">Total</span>
                    <span className="text-2xl font-bold text-primary">{currency(cartTotal)}</span>
                 </div>
              </div>

              {step === 2 && (
                <div className="bg-neutral-50 p-4 rounded-2xl flex gap-3 items-start border border-neutral-100">
                  <Truck className="text-gold shrink-0 mt-1" size={16} />
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">Prazo Estimado</p>
                    <p className="text-[11px] text-neutral-500 mt-1">5 a 12 dias úteis via Transportadora.</p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-neutral-50 p-4 rounded-2xl text-left border border-neutral-100">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Entregar em:</p>
                    <p className="text-xs font-semibold text-primary mt-1 line-clamp-2">
                       {address.street}, {address.number} - {address.city}/{address.state}
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-2xl text-left border border-neutral-100">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Pagamento:</p>
                    <p className="text-xs font-semibold text-primary mt-1 uppercase tracking-wider">
                       {paymentMethod === 'pix' ? '💠 Pix' : paymentMethod === 'card' ? '💳 Cartão' : '📄 Boleto'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-center text-[10px] text-neutral-400 leading-relaxed max-w-[280px] mx-auto uppercase tracking-tighter font-medium px-4">
               Ao finalizar, você concorda com nossos termos de venda e política de entrega personalizada.
            </p>
          </aside>

        </div>
      </section>
    </div>
  );
}
