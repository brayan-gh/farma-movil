import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator } from "react-native";
import { Card, Text } from "react-native-paper";
import { getNoticias } from "../api/noticiasApi";

const { width } = Dimensions.get("window");

export default function BlogScreen() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const data = await getNoticias();
        setNoticias(data);
      } catch (error) {
        console.error("❌ Error al cargar noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {noticias.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No hay noticias disponibles.</Text>
        ) : (
          noticias.map((noticia) => (
            <View key={noticia.id} style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>{noticia.titulo}</Text>
              <Card style={styles.card}>
                <Image
                  source={{ uri: noticia.imagen || "https://via.placeholder.com/300x200" }}
                  accessibilityLabel={noticia.titulo}
                  style={styles.cardImageFull}
                  resizeMode="cover"
                />
              </Card>
              <Text style={{ marginTop: 8, color: "#555" }}>{noticia.descripcion}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1C2526",
    marginBottom: 10,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  cardImageFull: {
    width: width - 40,
    height: undefined,
    aspectRatio: 16 / 9,
  },
});
