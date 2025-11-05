import { EXPO_PUBLIC_API_URL } from "@env";

export const getNoticias = async () => {
  try {
    if (!EXPO_PUBLIC_API_URL) {
      throw new Error("La variable EXPO_PUBLIC_API_URL no está definida.");
    }

    const response = await fetch(`${EXPO_PUBLIC_API_URL}/getNoticias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener las noticias: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("El formato de respuesta no es un array de noticias.");
    }

    return data;

  } catch (error) {
    console.error("Error en getNoticias:", error.message || error);
    throw error;
  }
};
