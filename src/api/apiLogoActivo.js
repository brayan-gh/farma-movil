const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getLogoActivo = async () => {
  try {
    const response = await fetch(`${API_URL}/getLogoActivo`);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("Respuesta no JSON del servidor:", text);
      return null;
    }

    if (!response.ok) throw new Error(data?.message || "Error al obtener el logo");

    return data?.url || null;
  } catch (error) {
    console.error("Error obteniendo logo activo:", error);
    return null;
  }
};

export const getRecetasByPacienteId = async (id) => {
  try {
    const response = await fetch(`${API_URL}/getMisRecetas/${id}`);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("Respuesta no JSON del servidor:", text);
      return [];
    }

    if (!response.ok) throw new Error(data?.message || "Error al obtener recetas");

    return data || [];
  } catch (error) {
    console.error("Error obteniendo recetas:", error);
    return [];
  }
};
