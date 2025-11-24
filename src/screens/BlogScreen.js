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
        console.error("Error al cargar noticias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#137FEC" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {noticias.length === 0 ? (
          <Text style={styles.emptyText}>No hay noticias disponibles.</Text>
        ) : (
          noticias.map((noticia) => (
            <View key={noticia.id} style={styles.newsItem}>
              <Text style={styles.sectionTitle}>{noticia.titulo}</Text>

              <Card style={styles.card}>
                <Image
                  source={{ uri: noticia.imagen || "https://via.placeholder.com/300x200" }}
                  style={styles.cardImageFull}
                  resizeMode="cover"
                />
              </Card>

              <Text style={styles.description}>{noticia.descripcion}</Text>
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
    backgroundColor: "#EAF0F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
    fontSize: 16,
  },
  newsItem: {
    marginBottom: 28,
    paddingBottom: 15,
    borderBottomWidth: 1.2,
    borderBottomColor: "#D7E1EC",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F2C4C",
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "#fff",
  },
  cardImageFull: {
    width: width - 40,
    height: undefined,
    aspectRatio: 16 / 9,
  },
  description: {
    marginTop: 12,
    color: "#4A5568",
    fontSize: 15,
    lineHeight: 22,
  },
});
