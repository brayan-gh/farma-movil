import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const toastConfig = {
  success: ({ text1, text2, props, ...rest }) => (
    <View style={styles.toastContainer}>
      <MaterialCommunityIcons
        name="bell-ring-outline" 
        size={28}
        color="#fff"
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, { backgroundColor: "#FF4D4F" }]}>
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={28}
        color="#fff"
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginTop: 5,
    marginHorizontal: 16,
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  text2: {
    fontSize: 14,
    color: "#fff",
  },
});
