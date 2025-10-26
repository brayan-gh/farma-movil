import { EXPO_PUBLIC_API_URL } from "@env";

export const getExpedienteById = async (id) => {
  try {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/getExpedienteById/${id}`);
    if (!response.ok) throw new Error("Error al obtener el expediente");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getExpedienteById:", error);
    throw error;
  }
};
