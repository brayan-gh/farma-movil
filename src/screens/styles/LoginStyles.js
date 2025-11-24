import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  topBackground: {
    position: "absolute",
    top: 0,
    width: "120%",
    height: 180,
    backgroundColor: "#137FEC",
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  bottomBackground: {
    position: "absolute",
    bottom: 0,
    width: "120%",
    height: 150,
    backgroundColor: "#137FEC",
    borderTopLeftRadius: 300,
    borderTopRightRadius: 200,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    marginBottom: 5,
  },
  error: {
    alignSelf: "flex-start",
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    marginTop: 15,
    padding: 5,
    backgroundColor: "#137FEC",
  },
  googleButton: {
    width: "100%",
    borderColor: "#ccc",
    padding: 5,
  },
  googleImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 15,
  },
  googleName: {
    fontSize: 18,
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
    color: "gray",
  },
});
