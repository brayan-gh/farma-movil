const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getExpedienteById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/getExpedienteById/${id}`);

    let data;
    try {
      data = await response.json();
    } catch (err) {
      const text = await response.text();
      console.warn("Respuesta no JSON del servidor:", text);
      throw new Error("El servidor devolvió una respuesta inválida.");
    }

    if (!response.ok) {
      return null;
    }

    return data;

  } catch (error) {
    console.error("Error en getExpedienteById:", error);
    throw error;
  }
};
