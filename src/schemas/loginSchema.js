import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Correo no válido").required("El correo es obligatorio"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("La contraseña es obligatoria"),
});
