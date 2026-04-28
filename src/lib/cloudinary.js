const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Faz o upload de um arquivo para o Cloudinary (Unsigned).
 * @param {File} file O arquivo de imagem a ser enviado.
 * @returns {Promise<string>} A URL segura (HTTPS) da imagem hospedada.
 */
export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Configurações do Cloudinary (Cloud Name ou Upload Preset) não encontradas no .env.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Falha no upload para o Cloudinary.");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Erro no upload para Cloudinary:", error);
    throw new Error(error.message || "Erro inesperado ao enviar imagem.");
  }
}
