import { EXPO_PUBLIC_API_URL } from "@env";

export const getNoticias = async () => {
  try {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/getNoticias`);
    if (!response.ok) throw new Error("Error al obtener las noticias");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getNoticias:", error);
    throw error;
  }
};
