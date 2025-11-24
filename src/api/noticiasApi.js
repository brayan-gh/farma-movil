const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getNoticias = async () => {
  try {
    if (!API_URL) {
      throw new Error("La variable API_URL no está definida.");
    }

    const response = await fetch(`${API_URL}/getNoticias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
     return null
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
