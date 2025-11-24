import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Text, Card, Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (!storedUser) return;
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.usuario);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {userName || "Usuario"}</Text>
      <Text style={styles.subtitle}>¿Cómo podemos ayudarte hoy?</Text>

      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate("Record")}>
        <Card style={styles.card}>
          <Card.Title
            title="Mi Salud"
            titleStyle={styles.cardTitle}
            subtitle="Revisa tu información de salud"
            subtitleStyle={styles.cardSubtitle}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="shield-plus"
                color="#137FEC"
                size={48}
                style={styles.avatar}
              />
            )}
          />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate("Treatments")}>
        <Card style={styles.card}>
          <Card.Title
            title="Mis Tratamientos"
            titleStyle={styles.cardTitle}
            subtitle="Gestiona tus medicamentos y tratamientos"
            subtitleStyle={styles.cardSubtitle}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="pill"
                color="#137FEC"
                size={48}
                style={styles.avatar}
              />
            )}
          />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate("Quotes")}>
        <Card style={styles.card}>
          <Card.Title
            title="Mis Citas"
            titleStyle={styles.cardTitle}
            subtitle="Consulta tus próximas citas médicas"
            subtitleStyle={styles.cardSubtitle}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="calendar"
                color="#137FEC"
                size={48}
                style={styles.avatar}
              />
            )}
          />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate("Notifications")}>
        <Card style={styles.card}>
          <Card.Title
            title="Mis Notificaciones"
            titleStyle={styles.cardTitle}
            subtitle="Revisa tus alertas y mensajes"
            subtitleStyle={styles.cardSubtitle}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="bell"
                color="#137FEC"
                size={48}
                style={styles.avatar}
              />
            )}
          />
        </Card>
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: "#F1F5FB",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
    color: "#0F2C4C"
  },
  subtitle: {
    fontSize: 16,
    color: "#5A6A80",
    marginBottom: 25,
    fontWeight: "400",
  },
  card: {
    marginBottom: 15,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    paddingVertical: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F2C4C",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6F7B8A",
  },
  avatar: {
    backgroundColor: "#E4F0FF",
  },
});
