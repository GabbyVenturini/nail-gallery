import { useState, useRef } from "react";
import { toast } from "sonner";
import { useStore } from "../../store/StoreContext";

export default function SiteSettingsForm() {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState(settings);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleImageUpload(e, fieldName) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito pesada (máximo 2MB recomendado).");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      updateSettings(formData);
      toast.success("Design atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar o design.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface p-7 md:p-9 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="border-b border-neutral-100 pb-6">
        <h2 className="text-xl font-bold text-neutral-900 drop-shadow-sm">Aparência do Site & Personalização</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Modifique logotipo, fotos de capa e gerencie a paleta de cores.
        </p>
      </div>

      <div className="space-y-6">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-gold">Cores Principais (Theming)</h3>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="label-default">Cor Primária (Fontes escuras)</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor || "#111111"}
                onChange={handleChange}
                className="w-12 h-12 rounded-lg cursor-pointer bg-white border-none p-1 shadow-sm"
              />
              <span className="text-xs font-mono">{formData.primaryColor || "#111111"}</span>
            </div>
          </div>
          <div>
            <label className="label-default">Cor de Fundo Secundária</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                name="secondaryColor"
                value={formData.secondaryColor || "#f7f7f7"}
                onChange={handleChange}
                className="w-12 h-12 rounded-lg cursor-pointer bg-white border-none p-1 shadow-sm"
              />
              <span className="text-xs font-mono">{formData.secondaryColor || "#f7f7f7"}</span>
            </div>
          </div>
          <div>
            <label className="label-default">Cor Destaque (Dourado)</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                name="goldColor"
                value={formData.goldColor || "#a17c54"}
                onChange={handleChange}
                className="w-12 h-12 rounded-lg cursor-pointer bg-white border-none p-1 shadow-sm"
              />
              <span className="text-xs font-mono">{formData.goldColor || "#a17c54"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-gold">Imagens Globais (Upload)</h3>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <label className="label-default">Logotipo Pequena (Menu)</label>
            <div className="flex items-center gap-4 border border-neutral-200 p-3 bg-white/50 rounded-2xl">
              {formData.logo && (
                <img src={formData.logo} alt="Logo" className="w-12 h-12 rounded-full object-cover shadow-sm bg-neutral-200 shrink-0" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logo")}
                className="text-xs file:mr-3 file:-my-3 file:py-3 file:px-4 file:rounded-l-xl file:border-0 file:text-[11px] file:font-semibold file:bg-neutral-100 file:text-primary hover:file:bg-neutral-200 w-full"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="label-default">Capa do Hero Banner (Home Tela Cheia)</label>
            <div className="flex items-center gap-4 border border-neutral-200 p-3 bg-white/50 rounded-2xl">
              {formData.heroBanner && (
                <img src={formData.heroBanner} alt="Hero Banner" className="w-16 h-12 rounded bg-neutral-200 object-cover shadow-sm shrink-0" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "heroBanner")}
                className="text-xs file:mr-3 file:-my-3 file:py-3 file:px-4 file:rounded-l-xl file:border-0 file:text-[11px] file:font-semibold file:bg-neutral-100 file:text-primary hover:file:bg-neutral-200 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-gold">Textos da Página Inicial (Hero Banner)</h3>
        
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label-default">Título Principal</label>
            <input
              required
              name="heroTitle1"
              value={formData.heroTitle1 || ""}
              onChange={handleChange}
              className="input-default"
            />
          </div>
          <div>
            <label className="label-default">Palavra em Destaque (Itálico Colorido)</label>
            <input
              required
              name="heroTitle2"
              value={formData.heroTitle2 || ""}
              onChange={handleChange}
              className="input-default"
            />
          </div>
        </div>

        <div>
          <label className="label-default">Subtítulo / Descrição</label>
          <textarea
            rows="3"
            required
            name="heroDescription"
            value={formData.heroDescription || ""}
            onChange={handleChange}
            className="input-default resize-none"
          />
        </div>
      </div>
      
      <div className="space-y-5">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-gold">Rodapé & Contatos</h3>

        <div>
           <label className="label-default">Descrição da Loja no Rodapé</label>
          <textarea
            rows="2"
            required
            name="footerDescription"
            value={formData.footerDescription || ""}
            onChange={handleChange}
            className="input-default resize-none"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label-default">Link do Instagram</label>
            <input
              required
              name="instagramUrl"
              value={formData.instagramUrl || ""}
              onChange={handleChange}
              className="input-default"
            />
          </div>
          <div>
            <label className="label-default">Texto do Instagram</label>
            <input
              required
              name="instagramText"
              value={formData.instagramText || ""}
              onChange={handleChange}
              className="input-default"
            />
          </div>
          <div>
            <label className="label-default">E-mail de Contato</label>
            <input
              required
              type="email"
              name="contactEmail"
              value={formData.contactEmail || ""}
              onChange={handleChange}
              className="input-default"
            />
          </div>
          <div>
            <label className="label-default">Horário de Atendimento</label>
            <input
              required
              name="contactSchedule"
              value={formData.contactSchedule || ""}
              onChange={handleChange}
              className="input-default"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <button type="submit" className="btn-primary w-full md:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Salvar Aparência e Layout
        </button>
      </div>
    </form>
  );
}
