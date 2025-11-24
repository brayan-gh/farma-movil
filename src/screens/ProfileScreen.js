import { useEffect, useState } from "react";
import {ScrollView,View,StyleSheet,TouchableOpacity,ActivityIndicator,Alert,} from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPerfilById } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (!storedUser) {
          Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente.");
          return logout();
        }

        const parsedUser = JSON.parse(storedUser);
        const perfil = await getPerfilById(parsedUser.id);
        setUser(perfil);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        Alert.alert("Error", "No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#137FEC" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No se encontró información del usuario</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ ...styles.container, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatarWrapper}>
        <Avatar.Image
          size={110}
          source={{
            uri:
              user.foto_perfil ||
              "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png",
          }}
        />
      </View>

      <Text style={styles.name}>
        {user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}
      </Text>
      <Text style={styles.email}>{user.correo}</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Información Personal</Text>

          {[
            { label: "Nombre de Usuario", value: user.usuario },
            { label: "Género", value: user.genero },
            { label: "Edad", value: user.edad ? `${user.edad} años` : null },
            { label: "Número de Teléfono", value: user.telefono },
            {
              label: "Cuenta Creada",
              value: user.created_at
                ? new Date(user.created_at).toLocaleDateString("es-MX")
                : null,
            },
          ].map((item, index) => (
            <View key={index}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value || "No disponible"}</Text>
              </View>
              {index < 4 && <View style={styles.separator} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      <TouchableOpacity
         onPress={logout}
        style={styles.logoutButton}
      >
        <MaterialIcons name="logout" size={22} color="#FF4C4C" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flexGrow: 1,
    backgroundColor: "#F1F5FB",
    padding: 20,
    alignItems: "center",
  },

  avatarWrapper: {
    borderWidth: 3,
    borderColor: "#137FEC30",
    padding: 6,
    borderRadius: 80,
    marginBottom: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F2C4C",
    marginBottom: 4,
    textAlign: "center",
  },

  email: {
    fontSize: 14,
    color: "#6C7A89",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    width: "100%",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    paddingVertical: 6,
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F2C4C",
    marginBottom: 15,
  },

  infoRow: {
    paddingVertical: 10,
  },

  label: {
    fontSize: 14,
    color: "#0F2C4C",
    fontWeight: "600",
  },

  value: {
    fontSize: 14,
    color: "#5A6A80",
    marginTop: 2,
  },

  separator: {
    marginVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#C5CED6",
  },

  logoutButton: {
    backgroundColor: "#FFE8E8",
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  logoutText: {
    color: "#FF4C4C",
    fontSize: 16,
    fontWeight: "700",
  },
});
