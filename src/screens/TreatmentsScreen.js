import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView } from "react-native";
import { Card, Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLogoActivo, getRecetasByPacienteId } from "../api/apiLogoActivo";
import { generateRecetaHTML } from "../pdfTemplates/recetaTemplate";

export default function TreatmentsScreen() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState(null);
  const [selectedReceta, setSelectedReceta] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (!storedUser) throw new Error("No hay usuario logueado");

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser.id;

        const [logo, recetasData] = await Promise.all([
          getLogoActivo(),
          getRecetasByPacienteId(userId)
        ]);

        setLogoUrl(logo);
        setRecetas(recetasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Alert.alert("Error", "No se pudieron cargar las recetas o el logo.");
        setRecetas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generarPDF = async (receta) => {
    try {
      const html = generateRecetaHTML(receta, logoUrl);
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
      Alert.alert("PDF generado", `Compartiendo desde: ${uri}`);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      Alert.alert("Error", "No se pudo generar el PDF");
    }
  };

  const openPreview = (receta) => {
    setSelectedReceta(receta);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.title}>Receta #{item.id}</Text>
          <MaterialCommunityIcons name="link-variant" size={20} color="#4a90e2" />
        </View>

        <Text style={styles.text}>Paciente: {item.paciente}</Text>
        <Text style={styles.text}>Doctor: {item.doctor}</Text>
        <Text style={styles.text}>Estado: {item.estado === 0 ? "Pendiente" : "Completado"}</Text>
        <Text style={styles.text}>Fecha inicio: {new Date(item.fecha_inicio).toLocaleDateString()}</Text>
        <Text style={styles.text}>Fecha fin: {new Date(item.fecha_fin).toLocaleDateString()}</Text>
      </Card.Content>

      <TouchableOpacity style={styles.button} onPress={() => openPreview(item)}>
        <MaterialCommunityIcons name="eye" size={20} color="#4a90e2" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Vista previa</Text>
      </TouchableOpacity>

    </Card>
  );

  if (loading) return <ActivityIndicator size="large" color="#137FEC" style={{ marginTop: 50 }} />;
  if (!recetas.length) return <Text style={{ textAlign: "center", marginTop: 50 }}>No tienes recetas registradas.</Text>;

  return (
    <View style={styles.container }>
      <FlatList
        data={recetas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedReceta && (
                <View>
                  <Text style={styles.modalTitle}>Vista previa Receta #{selectedReceta.id}</Text>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Paciente:</Text>
                    <Text style={styles.value}>{selectedReceta.paciente}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Doctor:</Text>
                    <Text style={styles.value}>{selectedReceta.doctor}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Estado:</Text>
                    <Text style={[
                      styles.value,
                      { color: selectedReceta.estado === 0 ? "green" : "red", fontWeight: "bold" }
                    ]}>
                      {selectedReceta.estado === 0 ? "Activo" : "Inactivo"}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Fecha inicio:</Text>
                    <Text style={styles.value}>{new Date(selectedReceta.fecha_inicio).toLocaleDateString()}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Fecha fin:</Text>
                    <Text style={styles.value}>{new Date(selectedReceta.fecha_fin).toLocaleDateString()}</Text>
                  </View>

                  <Text style={[styles.label, { marginTop: 10 }]}>Medicamentos:</Text>
                  {selectedReceta.medicamentos.map((m, i) => (
                    <Text key={i} style={styles.value}>
                      - {m.medicamento} {m.dosis} {m.instrucciones}
                    </Text>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <Button mode="contained" onPress={() => generarPDF(selectedReceta)} style={{ marginBottom: 10 }}>
                Descargar PDF
              </Button>
              <Button mode="outlined" onPress={() => setModalVisible(false)}>
                Cerrar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, borderRadius: 12, backgroundColor: "white", elevation: 2 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 16, fontWeight: "bold", flex: 1 },
  text: { fontSize: 14, color: "#333", marginVertical: 2 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    justifyContent: 'flex-end',
  },
  container:{flex:1, backgroundColor: "#F1F5FB",},
  buttonText: { color: "#4a90e2", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#555',
  },
  modalButtons: {
    marginTop: 20,
  },
});
