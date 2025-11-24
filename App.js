import { View, ActivityIndicator, PermissionsAndroid, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import TabNavigator from "./src/navigation/TabNavigator";
import RecordScreen from "./src/screens/RecordScreen";
import TreatmentsScreen from "./src/screens/TreatmentsScreen";
import QuotesScreen from "./src/screens/QuotesScreen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { useEffect } from "react";
import { listenForegroundNotifications, getFCMToken } from "./src/services/notifications";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/utils/toastconfig";
import NotificationScreen from "./src/screens/NotificationScreen";


const Stack = createNativeStackNavigator();

async function requestAndroidNotificationPermission() {
  if (Platform.OS !== "android") return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (e) {
    console.log("Error solicitando permisos:", e);
    return false;
  }
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#137FEC" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, headerTitleAlign: "center" }}
      >
        {user ? (
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        <Stack.Screen
          name="Record"
          component={RecordScreen}
          options={{ headerShown: true, title: "Mi Salud" }}
        />
        <Stack.Screen
          name="Treatments"
          component={TreatmentsScreen}
          options={{ headerShown: true, title: "Mis Tratamientos" }}
        />
        <Stack.Screen
          name="Quotes"
          component={QuotesScreen}
          options={{ headerShown: true, title: "Mis Citas" }}
        />
          <Stack.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{ headerShown: true, title: "Mis Notificaciones" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {

  useEffect(() => {
    const initNotifications = async () => {
      const permission = await requestAndroidNotificationPermission();

      if (permission) {
        await getFCMToken();
      }
    };

    initNotifications();

    const unsubscribe = listenForegroundNotifications();

    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <RootNavigator />
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}
