// RecipeListScreen.js
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Card } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const recetas = [
  {
    id: "H12345",
    titulo: "Receta Médica para la hipertensión",
    medicamentos: "Paracetamol, Ibuprofeno",
    fecha: "15/07/2023",
    doctor: "Dr. Alan Turing"
  },
  {
    id: "A67890",
    titulo: "Receta Médica antibiótico",
    medicamentos: "Amoxicilina",
    fecha: "10/06/2023",
    doctor: "Dra. Ada Lovelace"
  },
  {
    id: "L54321",
    titulo: "Receta Médica para la alergia",
    medicamentos: "Loratadina",
    fecha: "01/05/2023",
    doctor: "Dr. John Doe"
  }
];

export default function TreatmentsScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.title}>{item.titulo}</Text>
          <MaterialCommunityIcons name="link-variant" size={20} color="#4a90e2" />
        </View>

        {/* Número de receta */}
        <Text style={styles.subtitle}>Receta #{item.id}</Text>

        {/* Medicamentos */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="pill" size={18} color="gray" />
          <Text style={styles.text}> Medicamentos: {item.medicamentos}</Text>
        </View>

        {/* Fecha */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="calendar" size={18} color="gray" />
          <Text style={styles.text}> Fecha de emisión: {item.fecha}</Text>
        </View>

        {/* Doctor */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="doctor" size={18} color="gray" />
          <Text style={styles.text}> Prescrito por: {item.doctor}</Text>
        </View>
      </Card.Content>

      {/* Botón Ver Detalles */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DetalleReceta", { recetaId: item.id })}
      >
        <Text style={styles.buttonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <FlatList
      data={recetas}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: "gray",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  button: {
    padding: 12,
    alignItems: "flex-end",
  },
  buttonText: {
    color: "#4a90e2",
    fontWeight: "bold",
  },
});
