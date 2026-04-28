import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiFetch } from "../../lib/api";
import { Shield, UserPlus, Trash2, Edit, X, RefreshCw } from "lucide-react";

export default function AdminUserForm() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Carregar lista de admins
  async function loadAdmins() {
    setFetching(true);
    try {
      const data = await apiFetch("/auth/admins");
      setAdmins(data);
    } catch (err) {
      toast.error("Erro ao carregar equipe.");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Modo Edição
        await apiFetch(`/auth/admins/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast.success("Dados do administrador atualizados!");
      } else {
        // Modo Criação
        await apiFetch("/auth/register-admin", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Novo administrador criado!");
      }
      cancelEdit();
      loadAdmins();
    } catch (err) {
      toast.error(err.message || "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja remover este administrador? Isso é irreversível.")) return;
    try {
      await apiFetch(`/auth/admins/${id}`, { method: "DELETE" });
      toast.success("Administrador removido.");
      loadAdmins();
    } catch (err) {
      toast.error(err.message);
    }
  }

  function handleEdit(admin) {
    setEditingId(admin.id);
    setForm({ name: admin.name, email: admin.email, password: "" }); // Senha fica vazia se não quiser mudar
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ name: "", email: "", password: "" });
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="space-y-10">
      {/* Formulário de Cadastro/Edição */}
      <div className="card-surface p-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {editingId ? <Edit size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-primary">
                {editingId ? "Editar Administrador" : "Novo Administrador"}
              </h2>
              <p className="text-sm text-neutral-500">
                {editingId ? "Atualize as credenciais de acesso." : "Conceda acesso gerencial a um novo usuário."}
              </p>
            </div>
          </div>
          {editingId && (
             <button onClick={cancelEdit} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400">
               <X size={20} />
             </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-3 items-end">
          <div>
            <label className="label-default">Nome completo</label>
            <input
              className="input-default"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ex: João Silva"
            />
          </div>
          <div>
            <label className="label-default">E-mail</label>
            <input
              className="input-default"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="admin@nailgallery.com"
            />
          </div>
          <div>
            <label className="label-default">
              {editingId ? "Nova Senha (opcional)" : "Senha de Acesso"}
            </label>
            <input
              className="input-default"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!editingId}
              placeholder={editingId ? "Deixe em branco para manter" : "Crie uma senha segura"}
            />
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 mt-2">
            {editingId && (
               <button type="button" onClick={cancelEdit} className="px-6 py-2.5 text-xs font-bold uppercase text-neutral-500 hover:bg-neutral-100 rounded-2xl transition-all">
                 Cancelar
               </button>
            )}
            <button disabled={loading} className="btn-primary px-8">
              {loading ? "Processando..." : editingId ? "Salvar Alterações" : "Criar Administrador"}
            </button>
          </div>
        </form>
      </div>

      {/* Listagem de Admins */}
      <div className="card-surface p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <Shield size={20} className="text-gold" />
              <h3 className="text-lg font-bold text-primary">Equipe Nail Gallery</h3>
           </div>
           {fetching && <RefreshCw className="animate-spin text-neutral-300" size={18} />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Nome</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">E-mail</th>
                <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {admins.map((admin) => (
                <tr key={admin.id} className="group hover:bg-neutral-50/50 transition-colors">
                  <td className="py-4">
                    <span className="text-sm font-semibold text-neutral-800">{admin.name}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-neutral-500 font-mono">{admin.email}</span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Editar Administrador"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                        title="Remover da Equipe"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && !fetching && (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-neutral-400 text-sm">
                    Nenhum administrador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
