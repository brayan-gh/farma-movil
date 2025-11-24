import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, ActivityIndicator, Alert } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCitasByDoctorId } from "../api/citasApi";

export default function QuotesScreen() {
    const [citas, setCitas] = useState([]);
    const [filtro, setFiltro] = useState("Todas");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("userData");
                if (!storedUser) {
                    Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente.");
                    return;
                }

                const parsedUser = JSON.parse(storedUser);
                const data = await getCitasByDoctorId(parsedUser.id);
                setCitas(data);

            } catch (error) {
                console.error("Error al cargar citas:", error);
                Alert.alert("Error", "No se pudieron cargar las citas.");
            } finally {
                setLoading(false);
            }
        };

        fetchCitas();
    }, []);

    const estados = ["Todas", "Disponible", "Reservada", "Asistida", "Cancelada", "No asistio"];

    const citasFiltradas =
        filtro === "Todas" ? citas : citas.filter((cita) => cita.estado === filtro);

    const badgeColors = {
        "Disponible": styles.disponible,
        "Reservada": styles.reservada,
        "Asistida": styles.asistida,
        "Cancelada": styles.cancelada,
        "No asistio": styles.noAsistio,
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#137FEC" />
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.filterRow}>
                <ScrollView horizontal>
                    {estados.map((item) => (
                        <Button
                            key={item}
                            mode={filtro === item ? "contained" : "outlined"}
                            style={styles.filterButton}
                            onPress={() => setFiltro(item)}
                        >
                            {item}
                        </Button>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.scroll}>
                {citasFiltradas.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: 20 }}>No hay citas para mostrar.</Text>
                ) : (
                    citasFiltradas.map((cita) => (
                        <View key={cita.id} style={styles.card}>
                            <View style={styles.row}>
                                <Text style={styles.fecha}>
                                    {new Date(cita.fecha).toLocaleDateString("es-MX", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </Text>
                                <View style={[styles.estadoBadge, badgeColors[cita.estado] || styles.porDefecto]}>
                                    <Text style={styles.estadoTexto}>{cita.estado}</Text>
                                </View>
                            </View>
                            <Text style={styles.hora}>
                                {cita.hora_inicio && cita.hora_fin
                                    ? `${cita.hora_inicio} - ${cita.hora_fin}`
                                    : cita.hora}
                            </Text>
                            <Text style={styles.paciente}>Paciente: {cita.paciente} {cita.apellidoPaterno} {cita.apellidoMaterno}</Text>
                            <Text style={styles.doctor}>Doctor: {cita.doctor} {cita.apepaternoDoc} {cita.apematernoDoc} </Text>
                            <Text style={styles.especialidad}>Especialidad: {cita.especialidad}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5FB",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
    filterRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 15,
    },
    filterButton: {
        borderRadius: 20,
    },
    scroll: {
        flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    fecha: {
        fontWeight: "bold",
        fontSize: 14,
    },
    hora: {
        fontSize: 13,
        color: "#555",
        marginBottom: 5,
    },
    paciente: {
        fontSize: 14,
        marginBottom: 2,
    },
    doctor: {
        fontWeight: "600",
        fontSize: 16,
    },
    especialidad: {
        fontSize: 14,
        color: "#777",
    },
    estadoBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    estadoTexto: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "600",
    },
    disponible: { backgroundColor: "#137FEC" },
    reservada: { backgroundColor: "#ffa94d" },
    asistida: { backgroundColor: "#69db7c" },
    cancelada: { backgroundColor: "#ff6b6b" },
    noAsistio: { backgroundColor: "#6c757d" },
    porDefecto: { backgroundColor: "#888" },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
