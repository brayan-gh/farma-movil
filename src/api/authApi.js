const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginRequest = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: email, password }),
  });
  return response;
};

export const logoutRequest = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return response;
};

export const googleLoginRequest = async ({  givenName, familyName, email, photo  }) => {
  return fetch(`${API_URL}/login-google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({  givenName, familyName, email, photo }),
  });
};
