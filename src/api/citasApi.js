import { EXPO_PUBLIC_API_URL } from "@env";

export const getCitasByDoctorId = async (codpaci) => {
  try {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/getCitasByPacienteId/${codpaci}`);
    if (!response.ok) throw new Error("Error al obtener las citas");
    return await response.json();
  } catch (error) {
    console.error("❌ Error en getCitasByDoctorId:", error);
    throw error;
  }
};
