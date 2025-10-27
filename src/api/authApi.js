import { EXPO_PUBLIC_API_URL } from "@env";

export const loginRequest = async (correo, password) => {
  const response = await fetch(`${EXPO_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify({ correo, password }),
  });
  return response;
};

export const logoutRequest = async () => {
  const response = await fetch(`${EXPO_PUBLIC_API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return response;
};

export const googleLoginRequest = async (token) => {
  const response = await fetch(`${EXPO_PUBLIC_API_URL}/firebase-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return response;
};
