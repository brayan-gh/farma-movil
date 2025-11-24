import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUserData = async (data) => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(data));
  } catch (error) {
    console.error("Error al guardar usuario:", error);
  }
};

export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("userData");
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error al leer usuario:", error);
    return null;
  }
};

export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem("userData");
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
};
