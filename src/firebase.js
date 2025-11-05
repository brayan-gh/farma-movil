import { initializeApp } from "firebase/app";
import {initializeAuth,getReactNativePersistence,} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVr57yt8_R8rx-TyWk7OWIsDJVQuBaE5M",
  authDomain: "farmamapp.firebaseapp.com",
  projectId: "farmamapp",
  storageBucket: "farmamapp.firebasestorage.app",
  messagingSenderId: "637039410769",
  appId: "1:637039410769:web:26a96665f33c101ddc0270",
  measurementId: "G-SPQRHHCN7E"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);
// Inicializa Auth y guarda sesión entre reinicios
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
