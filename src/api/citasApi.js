import { EXPO_PUBLIC_API_URL } from "@env";

export const getCitasByDoctorId = async (id) => {
  try {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/getCitasByPacienteId/${id}`);
    if (!response.ok) throw new Error("Error al obtener las citas");
    return await response.json();
  } catch (error) {
    console.error("Error de getCitasByDoctorId:", error);
    throw error;
  }
};
