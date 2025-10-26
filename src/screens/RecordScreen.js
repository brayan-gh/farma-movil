import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExpedienteById } from "../api/expedienteApi"; // tu endpoint

export default function RecordScreen() {
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (!storedUser) {
          Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente.");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const data = await getExpedienteById(parsedUser.id);
        setExpediente(data);

      } catch (error) {
        console.error("❌ Error al cargar expediente:", error);
        Alert.alert("Error", "No se pudo cargar el expediente.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpediente();
  }, []);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </View>
    );
  }

  if (!expediente) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>No hay información de expediente disponible.</Text>
      </View>
    );
  }

  return (
      <ScrollView style={styles.scroll}>
        {/* Datos principales */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Altura</Text>
            <Text style={styles.cardValue}>{expediente.altura} m</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Peso</Text>
            <Text style={styles.cardValue}>{expediente.peso} kg</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>IMC</Text>
            <Text style={styles.cardValue}>{expediente.bmi}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Tipo de Sangre</Text>
            <Text style={styles.cardValue}>{expediente.tipo_sangre}</Text>
          </View>
        </View>

        {/* Signos vitales */}
        <Text style={styles.sectionTitle}>Signos Vitales</Text>
        <View style={styles.section}>
          <Text>Temperatura: {expediente.temperatura} °C</Text>
          <Text>Presión arterial: {expediente.presion_art}</Text>
          <Text>Frecuencia respiratoria: {expediente.presion_resp} /min</Text>
          <Text>Frecuencia cardíaca: {expediente.presion_card} bpm</Text>
        </View>

        {/* Antecedentes */}
        <Text style={styles.sectionTitle}>Antecedentes</Text>
        <View style={styles.section}>
          <Text>{expediente.antecedentes || "No registra antecedentes."}</Text>
        </View>

        {/* Alergias */}
        <Text style={styles.sectionTitle}>Alergias</Text>
        <View style={styles.section}>
          <Text>{expediente.alergias || "No registra alergias."}</Text>
        </View>

        {/* Enfermedades */}
        <Text style={styles.sectionTitle}>Enfermedades</Text>
        <View style={styles.section}>
          <Text>{expediente.enfermedades || "No registra enfermedades."}</Text>
        </View>

        {/* Medicamentos */}
        <Text style={styles.sectionTitle}>Medicamentos</Text>
        <View style={styles.section}>
          <Text>{expediente.medicamentos || "No hay medicamentos registrados."}</Text>
        </View>

        {/* Notas Médicas */}
        <Text style={styles.sectionTitle}>Notas Médicas</Text>
        <View style={styles.section}>
          <Text style={styles.notes}>{expediente.notas || "No hay notas médicas."}</Text>
        </View>
        <View style={{marginBottom:15}}></View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },
    scroll: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    cardRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#fff",
        width: "48%",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems:'center'
    },
    cardLabel: {
        color: "#6b7280",
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: "bold",
    },
    section: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    list: {
        marginLeft: 8,
    },
    notes: {
        lineHeight: 20,
    },
});
