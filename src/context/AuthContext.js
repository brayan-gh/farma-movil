import { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from "react-native";
import { getFCMToken } from "../services/notifications";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));

    const fcmToken = await getFCMToken();

    if (fcmToken) {
      try {
        await fetch(`${API_URL}/fcmTokens`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData.id,
            token: fcmToken
          }),
        });
      } catch (error) {
        console.log("Error enviando token FCM:", error);
      }
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("userData");

      if (user?.loginType === "google") {
        await GoogleSignin.signOut();
      }

      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión correctamente.");
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
