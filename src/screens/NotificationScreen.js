import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList, Alert } from "react-native";
import { Text, Card, Avatar, Badge, IconButton, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-toast-message";

export default function NotificationScreen() {
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(null);
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const fetchNotifications = async (id) => {
        if (!id) return;
        try {
            const res = await fetch(`${API_URL}/getNotiById/${id}`);
            const data = await res.json();
            setNotifications(data || []);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("userData");
                if (!storedUser) return;
                const parsedUser = JSON.parse(storedUser);
                setUserName(parsedUser.usuario);
                setUserId(parsedUser.id);

                await fetchNotifications(parsedUser.id);

                const unsubscribe = messaging().onMessage(async (message) => {
                    Toast.show({
                        type: "success",
                        text1: message.notification?.title || "Nueva notificación",
                        text2: message.notification?.body || "",
                        position: "top",
                        visibilityTime: 4000,
                        topOffset: 50,
                    });

                    fetchNotifications(parsedUser.id);
                });

                return unsubscribe;
            } catch (error) {
                console.error("Error al cargar usuario o notificaciones:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const marcarLeida = async (id) => {
        try {
            await fetch(`${API_URL}/notiLeida/${id}`, { method: "PUT" });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, leida: 1 } : n));
        } catch (error) {
            console.error("Error al marcar notificación como leída:", error);
        }
    };

    const marcarTodasLeidas = async () => {
        if (!userId) return;
        try {
            await fetch(`${API_URL}/notiLeidas/${userId}`, { method: "PUT" });
            setNotifications(prev => prev.map(n => ({ ...n, leida: 1 })));
        } catch (error) {
            console.error("Error al marcar todas como leídas:", error);
        }
    };

    const eliminarNotificacion = async (id) => {
        Alert.alert("Eliminar Notificación", "¿Estás seguro de eliminar esta notificación?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    try {
                        await fetch(`${API_URL}/deleteNoti/${id}`, { method: "DELETE" });
                        setNotifications(prev => prev.filter(n => n.id !== id));
                    } catch (error) {
                        console.error("Error al eliminar notificación:", error);
                    }
                }
            }
        ]);
    };

    const eliminarTodasNotis = async () => {
        if (!userId) return;
        Alert.alert("Eliminar todas las notificaciones", "¿Estás seguro?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar Todas",
                style: "destructive",
                onPress: async () => {
                    try {
                        await fetch(`${API_URL}/deleteNotisAll/${userId}`, { method: "DELETE" });
                        setNotifications([]);
                    } catch (error) {
                        console.error("Error al eliminar todas las notificaciones:", error);
                    }
                }
            }
        ]);
    };

    const renderNotification = ({ item }) => (
        <Card style={styles.notificationCard}>
            <Card.Title
                title={item.titulo}
                titleStyle={styles.cardTitle}
                subtitle={item.mensaje}
                subtitleStyle={styles.cardSubtitle}
                left={(props) => (
                    <View>
                        <Avatar.Icon {...props} icon="bell" color="#137FEC" size={48} style={styles.avatar} />
                        {!item.leida && <Badge style={styles.badge}>!</Badge>}
                    </View>
                )}
                right={(props) => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {!item.leida && (
                            <IconButton
                                {...props}
                                icon="check"
                                size={20}
                                onPress={() => marcarLeida(item.id)}
                                color="#4CAF50"
                            />
                        )}
                        <IconButton
                            {...props}
                            icon="delete"
                            size={20}
                            onPress={() => eliminarNotificacion(item.id)}
                            color="#FF3B30"
                        />
                    </View>
                )}
            />
            <Text style={styles.date}>{item.fecha}</Text>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#137FEC" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Aquí están tus notificaciones recientes:</Text>

            {notifications.length > 0 && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <Button mode="contained" onPress={marcarTodasLeidas} style={{ flex: 1, marginRight: 5 }}>
                        Marcar todas como leídas
                    </Button>
                    <Button mode="outlined" onPress={eliminarTodasNotis} style={{ flex: 1, marginLeft: 5 }}>
                        Eliminar todas
                    </Button>
                </View>
            )}

            {notifications.length === 0 ? (
                <Text style={styles.noNotifications}>No tienes notificaciones nuevas</Text>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderNotification}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
        backgroundColor: "#F1F5FB",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    greeting: {
        fontSize: 26,
        fontWeight: "800",
        marginBottom: 6,
        color: "#0F2C4C",
    },
    subtitle: {
        fontSize: 16,
        color: "#5A6A80",
        marginBottom: 15,
        fontWeight: "400",
    },
    notificationCard: {
        marginBottom: 15,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        elevation: 4,
        paddingVertical: 6,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#0F2C4C",
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#6F7B8A",
        marginTop: 2,
    },
    avatar: {
        backgroundColor: "#E4F0FF",
    },
    badge: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#FF3B30",
        color: "#fff",
    },
    date: {
        fontSize: 12,
        color: "#9AA0B1",
        paddingLeft: 70,
        paddingTop: 2,
    },
    noNotifications: {
        marginTop: 50,
        textAlign: "center",
        color: "#6F7B8A",
        fontSize: 16,
    },
});
