import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-toast-message";

export async function getFCMToken() {
  try {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log("Permiso NO otorgado");
      return null;
    }

    await messaging().deleteToken();

    const newToken = await messaging().getToken();

    return newToken;
  } catch (error) {
    console.log("Error obteniendo token FCM:", error);
    return null;
  }
}

export function listenForegroundNotifications() {
  return messaging().onMessage(async (message) => {
    Toast.show({
      type: "success",
      text1: message.notification?.title || "Nueva notificación",
      text2: message.notification?.body || "",
      position: "top",
      visibilityTime: 4000,
      topOffset: 50,      
    });
    
  });
}