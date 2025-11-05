import { EXPO_PUBLIC_API_URL } from "@env"; 

export const getPerfilById = async (id) => {
  try {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/getPerfilbyid/${id}`);
    if (!response.ok) throw new Error("Error al obtener el perfil del usuario");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getPerfilById:", error);
    throw error;
  }
};
