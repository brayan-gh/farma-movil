import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";
import App from "./App";

messaging().setBackgroundMessageHandler(async (message) => {
  console.log("📩 Notificación en background:", message);
});

registerRootComponent(App);
