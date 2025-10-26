import { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, IconButton } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { WEB_CLIENT_ID } from "@env";

import { loginSchema } from "../schemas/loginSchema";
import { loginRequest, googleLoginRequest } from "../api/authApi"; // ✅ corregido

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginRequest(data.email, data.password);
      const dataRes = await response.json(); 

      if (response.ok && dataRes.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(dataRes.user));
        login(dataRes.user);
        Alert.alert("Bienvenido", `Hola ${dataRes.user.nombre}`);
        console.log("✅ Sesión iniciada:", dataRes.user);
      } else {
        Alert.alert("Error", dataRes.message || "Credenciales inválidas.");
      }
    } catch (error) {
      console.error("❌ Error login:", error);
      Alert.alert("Error", error.message || "Error al iniciar sesión.");
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const userCred = await auth().signInWithCredential(googleCredential);
      const idToken = await userCred.user.getIdToken();

      const response = await googleLoginRequest(idToken); 
      const dataRes = await response.json();

      if (response.ok && dataRes.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(dataRes.user));
        login(dataRes.user);
        Alert.alert("Bienvenido", `Hola ${dataRes.user.usuario}`);
      } else {
        Alert.alert("Error", dataRes.message || "No se pudo iniciar sesión con Google.");
      }

    } catch (error) {
      console.error("❌ Error con Google Sign-In:", error);
      if (error?.code === statusCodes.SIGN_IN_CANCELLED)
        Alert.alert("Cancelado", "Inicio de sesión cancelado.");
      else Alert.alert("Error", "No se pudo iniciar sesión con Google.");
    }
  };

  return (
    <View style={styles.container}>
      <IconButton icon="information" size={60} iconColor="#137FEC" />
      <Text style={styles.title}>¡Bienvenido!</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Correo electrónico"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            left={<TextInput.Icon icon="email" />}
            error={!!errors.email}
            style={styles.input}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Contraseña"
            mode="outlined"
            secureTextEntry={!showPassword}
            value={value}
            onChangeText={onChange}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            error={!!errors.password}
            style={styles.input}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Button mode="contained" style={styles.loginButton} onPress={handleSubmit(onSubmit)}>
        Iniciar sesión
      </Button>

      <Text style={{ marginVertical: 10, color: "gray" }}>────────── O ──────────</Text>

      <Button
        mode="outlined"
        icon="google"
        textColor="black"
        style={styles.googleButton}
        onPress={onGoogleButtonPress}
      >
        Acceder con Google
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 5,
  },
  error: {
    alignSelf: "flex-start",
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    marginTop: 15,
    padding: 5,
    backgroundColor: "#137FEC",
    borderRadius: 10,
  },
  googleButton: {
    width: "100%",
    borderColor: "#ccc",
    padding: 5,
  },
});
