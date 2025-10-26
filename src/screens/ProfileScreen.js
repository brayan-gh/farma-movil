import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPerfilById } from "../api/userApi";
import { useAuth } from "../context/AuthContext"; // ✅ Importamos el contexto

export default function ProfileScreen() {
  const { logout } = useAuth(); // ✅ Obtenemos la función logout
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (!storedUser) {
          Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente.");
          return logout(); // ✅ Usamos logout para redirigir al Login
        }

        const parsedUser = JSON.parse(storedUser);
        const perfil = await getPerfilById(parsedUser.id);
        setUser(perfil);
      } catch (error) {
        console.error("❌ Error al cargar perfil:", error);
        Alert.alert("Error", "No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se encontró información del usuario</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ ...styles.container, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <Avatar.Image
        size={100}
        source={{
          uri:
            user.foto_perfil ||
            "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png",
        }}
        style={styles.avatar}
      />

      {/* User Info */}
      <Text style={styles.name}>
        {user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}
      </Text>
      <Text style={styles.email}>{user.correo}</Text>

      {/* Personal Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Información Personal</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nombre de Usuario</Text>
            <Text style={styles.value}>{user.usuario || "No especificado"}</Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Género</Text>
            <Text style={styles.value}>{user.genero || "No especificado"}</Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Edad</Text>
            <Text style={styles.value}>
              {user.edad ? `${user.edad} años` : "No disponible"}
            </Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Número de Teléfono</Text>
            <Text style={styles.value}>{user.telefono || "No disponible"}</Text>
          </View>

          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Cuenta Creada</Text>
            <Text style={styles.value}>
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString("es-MX")
                : "No registrada"}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Log Out Button */}
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem("userData");
          logout(); // ✅ Esto actualizará RootNavigator y mostrará Login
        }}
        style={styles.logoutButton}
      >
        <MaterialIcons name="logout" size={20} color="#FF4444" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F9FC",
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C2526",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#FFF",
    elevation: 2,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C2526",
    marginBottom: 10,
  },
  infoRow: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 14,
    color: "#1C2526",
  },
  value: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  separator: {
    marginVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: "#FFE6E6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#FF4444",
    fontSize: 16,
    fontWeight: "bold",
  },
});
