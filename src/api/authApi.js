import { EXPO_PUBLIC_API_URL } from "@env";

export const loginRequest = async (email, password) => {
  const response = await fetch(`${EXPO_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ correo: email, password }),
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


export const googleLoginRequest = async (idToken) => {
  try {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/googleLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: idToken }),
    });
    return response;
  } catch (error) {
    console.error("Error de googleLoginRequest:", error);
    throw error;
  }
};
