import { EXPO_PUBLIC_API_URL } from "@env";

export const getPerfilById = async (id) => {
  try {
    if (!EXPO_PUBLIC_API_URL) {
      throw new Error("La variable EXPO_PUBLIC_API_URL no está definida en tu archivo .env");
    }

    if (!id) {
      throw new Error("El ID del usuario es requerido para obtener el perfil.");
    }

    const response = await fetch(`${EXPO_PUBLIC_API_URL}/getPerfilById/${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener el perfil (${response.status}): ${errorText}`);
    }

    const data = await response.json();

    if (!data || typeof data !== "object") {
      throw new Error("La respuesta del servidor no tiene un formato válido de perfil.");
    }

    return data;

  } catch (error) {
    console.error("Error en getPerfilById:", error.message || error);
    throw error;
  }
};
