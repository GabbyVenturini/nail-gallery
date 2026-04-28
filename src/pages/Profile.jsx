import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { 
  User, 
  MapPin, 
  Search, 
  Save, 
  ArrowLeft,
  Settings,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Edit2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useStore } from "../store/StoreContext";
import { apiFetch } from "../lib/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateProfile } = useStore();
  
  const [loading, setLoading] = useState(false);
  const [addresses, setAdminsAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para dados básicos
  const [personalData, setPersonalData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  // Estado para o endereço sendo editado/criado
  const [addressForm, setAddressForm] = useState({
    id: null,
    zip_code: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    is_default: false
  });

  async function loadAddresses() {
    try {
      const data = await apiFetch("/auth/addresses");
      setAdminsAddresses(data || []);
    } catch (err) {
      toast.error("Erro ao carregar endereços.");
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setPersonalData({ name: user.name, email: user.email });
    loadAddresses();
  }, [user, navigate]);

  async function handleCEPBlur() {
    const cep = addressForm.zip_code.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
      setLoading(true);
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      
      if (data.erro) {
        toast.error("CEP não encontrado.");
      } else {
        setAddressForm(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf
        }));
      }
    } catch (err) {
      toast.error("Erro ao buscar CEP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePersonal(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(personalData);
      toast.success("Dados pessoais atualizados!");
    } catch (error) {
      toast.error("Erro ao salvar dados.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveAddress(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (addressForm.id) {
        await apiFetch(`/auth/addresses/${addressForm.id}`, {
          method: "PUT",
          body: JSON.stringify(addressForm)
        });
        toast.success("Endereço atualizado!");
      } else {
        await apiFetch("/auth/addresses", {
          method: "POST",
          body: JSON.stringify(addressForm)
        });
        toast.success("Novo endereço adicionado!");
      }
      setIsModalOpen(false);
      loadAddresses();
    } catch (error) {
      toast.error("Erro ao salvar endereço.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAddress(id) {
    if (!confirm("Excluir este endereço?")) return;
    try {
      await apiFetch(`/auth/addresses/${id}`, { method: "DELETE" });
      toast.success("Endereço removido.");
      loadAddresses();
    } catch (err) {
      toast.error("Erro ao remover.");
    }
  }

  function openEditModal(addr) {
    setAddressForm(addr);
    setIsModalOpen(true);
  }

  function openCreateModal() {
    setAddressForm({
      id: null,
      zip_code: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      is_default: addresses.length === 0 // Primeiro endereço é padrão por padrão
    });
    setIsModalOpen(true);
  }

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-24 relative">
      <Helmet>
        <title>Meu Perfil | Nail Gallery</title>
      </Helmet>

      <section className="container-default py-12">
        <button 
           onClick={() => navigate(-1)} 
           className="flex items-center gap-2 text-sm text-neutral-400 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex items-center justify-center bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
               <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Meus Dados</h1>
              <p className="text-neutral-500">Gerencie seu perfil e locais de entrega.</p>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="card-surface p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-neutral-100">
              <Settings size={20} className="text-gold" />
              <h3 className="text-lg font-bold text-primary">Informações da Conta</h3>
            </div>
            <form onSubmit={handleSavePersonal} className="grid gap-6 md:grid-cols-2 items-end">
              <div>
                <label className="label-default">Nome Completo</label>
                <input className="input-default" value={personalData.name} onChange={e => setPersonalData({...personalData, name: e.target.value})} />
              </div>
              <div>
                <label className="label-default">E-mail</label>
                <input className="input-default" value={personalData.email} onChange={e => setPersonalData({...personalData, email: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button disabled={loading} className="btn-primary px-8">Salvar Alterações</button>
              </div>
            </form>
          </div>

          {/* Lista de Endereços */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin size={22} className="text-gold" />
                <h3 className="text-xl font-bold text-primary">Endereços de Entrega</h3>
              </div>
              <button onClick={openCreateModal} className="btn-secondary flex items-center gap-2 text-[10px] px-4 py-2">
                <Plus size={14} /> Novo Endereço
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((addr) => (
                <div key={addr.id} className={`card-surface p-6 border-2 transition-all ${addr.is_default ? "border-gold/30 bg-gold/[0.02]" : "border-transparent"}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl ${addr.is_default ? "bg-gold/10 text-gold" : "bg-neutral-100 text-neutral-400"}`}>
                      <MapPin size={18} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditModal(addr)} className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-primary">{addr.street}, {addr.number}</p>
                  <p className="text-xs text-neutral-500 mt-1">{addr.neighborhood} — {addr.city}/{addr.state}</p>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-widest">{addr.zip_code}</p>
                  {addr.is_default && (
                    <div className="mt-4 flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest">
                       <CheckCircle2 size={14} /> Endereço Padrão
                    </div>
                  )}
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="md:col-span-2 py-12 text-center border-2 border-dashed border-neutral-200 rounded-[28px]">
                   <p className="text-sm text-neutral-400">Você ainda não tem nenhum endereço cadastrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Endereço */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] w-full max-w-xl p-8 shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-5">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 hover:bg-neutral-100 rounded-full text-neutral-400 transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold text-primary mb-2">
                {addressForm.id ? "Editar Endereço" : "Novo Endereço"}
              </h2>
              <p className="text-neutral-500 text-sm mb-8">Onde você quer receber seus produtos?</p>

              <form onSubmit={handleSaveAddress} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="label-default">CEP</label>
                    <input 
                      className="input-default" 
                      value={addressForm.zip_code} 
                      onChange={e => setAddressForm({...addressForm, zip_code: e.target.value})} 
                      onBlur={handleCEPBlur}
                      required
                    />
                  </div>
                  <div className="col-span-1 flex items-end pb-1">
                    <p className="text-[10px] text-neutral-400 leading-tight">Preenchimento automático via ViaCEP</p>
                  </div>
                  <div className="col-span-2">
                    <label className="label-default">Rua / Avenida</label>
                    <input className="input-default" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} required />
                  </div>
                  <div className="col-span-1">
                    <label className="label-default">Número</label>
                    <input className="input-default" value={addressForm.number} onChange={e => setAddressForm({...addressForm, number: e.target.value})} required />
                  </div>
                  <div className="col-span-1">
                    <label className="label-default">Complemento</label>
                    <input className="input-default" value={addressForm.complement} onChange={e => setAddressForm({...addressForm, complement: e.target.value})} />
                  </div>
                  <div className="col-span-1">
                    <label className="label-default">Bairro</label>
                    <input className="input-default" value={addressForm.neighborhood} onChange={e => setAddressForm({...addressForm, neighborhood: e.target.value})} required />
                  </div>
                  <div className="col-span-1">
                    <label className="label-default">Cidade</label>
                    <input className="input-default" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                   <input 
                     type="checkbox" 
                     id="is_default"
                     checked={addressForm.is_default}
                     onChange={e => setAddressForm({...addressForm, is_default: e.target.checked})}
                     className="h-5 w-5 rounded-lg border-neutral-300 text-primary focus:ring-primary" 
                   />
                   <label htmlFor="is_default" className="text-sm font-semibold text-neutral-600 select-none">Definir como endereço padrão</label>
                </div>

                <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 text-xs font-bold uppercase text-neutral-500 hover:bg-neutral-100 rounded-2xl transition-all">Cancelar</button>
                   <button disabled={loading} className="flex-1 btn-primary py-4">
                     {loading ? "Salvando..." : "Salvar Endereço"}
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
