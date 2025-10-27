import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await getIdToken(firebaseUser, true);
        setUser(firebaseUser);
        setToken(idToken);
        await AsyncStorage.setItem("user", JSON.stringify(firebaseUser));
        await AsyncStorage.setItem("token", idToken);
      } else {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (firebaseUser, idToken) => {
    setUser(firebaseUser);
    setToken(idToken);
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setToken(null);
    await AsyncStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
