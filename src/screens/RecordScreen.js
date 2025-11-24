import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExpedienteById } from "../api/expedienteApi";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { getLogoActivo } from "../api/apiLogoActivo";
import { generateExpedienteHTML } from "../pdfTemplates/expedienteTemplate";

export default function RecordScreen() {
  const [expediente, setExpediente] = useState(null);
  const [loading, setLoading] = useState(true);

  const generarPDF = async () => {
    try {
      const logoUrl = await getLogoActivo();
      const html = generateExpedienteHTML(expediente, logoUrl);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
      Alert.alert("PDF generado", "PDF guardado con éxito.");
    } catch (error) {
      console.log("Error al generar PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF");
    }
  };

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
        console.error("Error al cargar expediente:", error);
        Alert.alert("Error", "No se pudo cargar el expediente.");
      } finally {
        setLoading(false);
      }
    };
    fetchExpediente();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#137FEC" />
      </View>
    );
  }

  if (!expediente) {
    return (
      <View style={styles.loading}>
        <Text>No hay información de expediente disponible.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.cardRow}>
        {[
          { label: "Altura", value: `${expediente.altura} m` },
          { label: "Peso", value: `${expediente.peso} kg` },
          { label: "IMC", value: expediente.bmi },
          { label: "Tipo de Sangre", value: expediente.tipo_sangre },
        ].map((item) => (
          <View key={item.label} style={styles.card}>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {[
        { title: "Signos Vitales", content: [
          `Temperatura: ${expediente.temperatura} °C`,
          `Presión arterial: ${expediente.presion_art}`,
          `Frecuencia respiratoria: ${expediente.presion_resp} /min`,
          `Frecuencia cardíaca: ${expediente.presion_card} bpm`
        ]},
        { title: "Antecedentes", content: [expediente.antecedentes || "No registra antecedentes."] },
        { title: "Alergias", content: [expediente.alergias || "No registra alergias."] },
        { title: "Enfermedades", content: [expediente.enfermedades || "No registra enfermedades."] },
        { title: "Medicamentos", content: [expediente.medicamentos || "No hay medicamentos registrados."] },
        { title: "Notas Médicas", content: [expediente.notas || "No hay notas médicas."], isNotes: true },
      ].map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.content.map((text, idx) => (
            <Text key={idx} style={section.isNotes ? styles.notes : styles.text}>{text}</Text>
          ))}
        </View>
      ))}

      <TouchableOpacity onPress={generarPDF} style={styles.pdfButton}>
        <Text style={styles.pdfButtonText}>Descargar expediente en PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    backgroundColor: "#F1F5FB",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  cardLabel: {
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F2C4C",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F2C4C",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  pdfButton: {
    backgroundColor: "#137FEC",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop:'0',
    marginVertical: 20,
    alignItems: "center",
  },
  pdfButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
