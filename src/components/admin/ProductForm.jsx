import { useEffect, useState, useMemo } from "react";
import { slugify } from "../../lib/storage";
import { useStore } from "../../store/StoreContext";
import { toast } from "sonner";
import { uploadToCloudinary } from "../../lib/cloudinary";

const initialForm = {
  name: "",
  category: "Clássicas",
  price: "",
  description: "",
  colors: "Nude,Rosé,Branco",
  sizes: "Curta,Média,Longa",
  image: "",
};

export default function ProductForm({ editingProduct, onClearEdit }) {
  const { products, createProduct, updateProduct } = useStore();
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fallbackImage = useMemo(() => products[0]?.image || "", [products]);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name ?? "",
        category: editingProduct.category ?? "Clássicas",
        price: String(editingProduct.price ?? ""),
        description: editingProduct.description ?? "",
        colors: Array.isArray(editingProduct.colors) ? editingProduct.colors.join(",") : "",
        sizes: Array.isArray(editingProduct.sizes) ? editingProduct.sizes.join(",") : "",
        image: editingProduct.image ?? "",
      });
      setImagePreview(editingProduct.image ?? "");
    } else {
      resetForm();
    }
  }, [editingProduct]);

  function resetForm() {
    setForm(initialForm);
    setImagePreview("");
    if (onClearEdit) onClearEdit();
  }

  function handleFieldChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "image") setImagePreview(value);
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Enviando imagem para o Cloudinary...");

    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, image: url }));
      setImagePreview(url);
      toast.success("Imagem enviada com sucesso!", { id: toastId });
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar imagem: " + error.message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.name),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      colors: form.colors.split(",").map((item) => item.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((item) => item.trim()).filter(Boolean),
      image: form.image || fallbackImage,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      toast.success("Produto atualizado com sucesso!");
    } else {
      createProduct(payload);
      toast.success("Produto criado com sucesso!");
    }

    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface p-7 md:p-9">
      <div className="mb-8 border-b border-neutral-100 pb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900 drop-shadow-sm">
          {editingProduct ? "Editar Produto" : "Criar Novo Produto"}
        </h2>
        {editingProduct && (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full">
            Modo Edição
          </span>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-1">
          <label className="label-default">Nome do Produto</label>
          <input
            className="input-default"
            value={form.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            required
            placeholder="Ex: Unha Amendoada Francesinha"
          />
        </div>

        <div>
          <label className="label-default">Categoria</label>
          <select
            className="input-default"
            value={form.category}
            onChange={(e) => handleFieldChange("category", e.target.value)}
          >
            <option>Clássicas</option>
            <option>Decoradas</option>
            <option>Luxo</option>
            <option>Minimalistas</option>
          </select>
        </div>

        <div>
          <label className="label-default">Preço (R$)</label>
          <input
            className="input-default"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => handleFieldChange("price", e.target.value)}
            required
            placeholder="0.00"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <label className="label-default">Descrição Detalhada</label>
          <textarea
            className="input-default resize-none min-h-[100px]"
            value={form.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            required
            placeholder="Fale um pouco sobre o estilo, material ou formato dessa unha..."
          />
        </div>

        <div>
          <label className="label-default">Cores Disponíveis</label>
          <input
            className="input-default"
            value={form.colors}
            onChange={(e) => handleFieldChange("colors", e.target.value)}
            placeholder="Nude,Rosé,Branco (Separe por vírgula)"
          />
        </div>

        <div>
          <label className="label-default">Tamanhos Disponíveis</label>
          <input
            className="input-default"
            value={form.sizes}
            onChange={(e) => handleFieldChange("sizes", e.target.value)}
            placeholder="P,M,G ou Curta,Média,Longa"
          />
        </div>

        <div>
           <label className="label-default">Imagem do Produto</label>
           <div className="flex flex-col gap-3">
             <input
               className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-neutral-100 file:text-primary hover:file:bg-neutral-200 border border-neutral-200 bg-white/50 rounded-2xl w-full"
               type="file"
               accept="image/*"
               onChange={handleImageUpload}
             />
             <input
               className="input-default text-xs"
               value={form.image}
               onChange={(e) => handleFieldChange("image", e.target.value)}
               placeholder="Ou cole uma URL externa..."
             />
           </div>
        </div>

        {(imagePreview || form.image) && (
          <div className="md:col-span-2 lg:col-span-3 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 shadow-inner flex justify-center py-4">
            <img
               src={imagePreview || form.image}
               alt="Pré-visualização do produto"
               className="h-48 w-48 object-cover rounded-2xl shadow-sm border border-white"
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-end gap-3 border-t border-neutral-100 pt-6">
        {editingProduct && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full md:w-auto px-8 py-3 rounded-full border border-neutral-300 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-600 hover:bg-neutral-100 transition-all"
          >
            Cancelar Edição
          </button>
        )}
        <button type="submit" className="btn-primary w-full md:w-auto shadow-md hover:shadow-lg hover:-translate-y-0.5">
          {editingProduct ? "Atualizar Produto" : "Salvar Produto"}
        </button>
      </div>
    </form>
  );
}
