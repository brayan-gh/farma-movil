import { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text, IconButton } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../schemas/loginSchema";
import { loginRequest, googleLoginRequest } from "../api/authApi";

import styles from "./styles/LoginStyles";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);
  
  const { control, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(loginSchema), });
  const onSubmit = async (data) => {
    try {
      const response = await loginRequest(data.email, data.password);

      if (!response.ok) {
        const err = await response.json();
        return Alert.alert("Error", err.message);
      }

      const dataRes = await response.json();

      login(dataRes.user);

    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar sesión.");
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const googleUserData = await GoogleSignin.signIn();

      const user = googleUserData?.user || googleUserData?.data?.user;
      if (!user) return Alert.alert("Error", "No se pudo obtener la información del usuario.");

      const givenName = user.givenName || "";
      const familyName = user.familyName || "";
      const email = user.email || "";
      const photo = user.photo || "";

      if (!email) return Alert.alert("Error", "Google no devolvió tu correo.");

      const response = await googleLoginRequest({ givenName, familyName, email, photo });
      const dataRes = await response.json();

      if (!response.ok) return Alert.alert("Error", dataRes.message || "Error al iniciar sesión.");

      await AsyncStorage.setItem("userData", JSON.stringify(dataRes.user));
      login(dataRes.user);

    } catch (error) {
      console.log("Google ERROR real:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED)
        return Alert.alert("Cancelado", "Iniciaste sesión con Google, pero cancelaste.");
      if (error.code === statusCodes.IN_PROGRESS)
        return Alert.alert("Espera", "Inicio de sesión ya en proceso.");
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE)
        return Alert.alert("Error", "Google Play Services no están disponibles.");

      return Alert.alert("Error", "No se pudo iniciar sesión con Google.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />
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

      <Text style={styles.divider}>────────── O ──────────</Text>

      <Button
        mode="outlined"
        icon="google"
        textColor="black"
        style={styles.googleButton}
        onPress={onGoogleButtonPress}
      >
        Acceder con Google
      </Button>

      <View style={styles.bottomBackground} />
    </View>
  );
}
