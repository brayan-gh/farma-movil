import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import TabNavigator from "./src/navigation/TabNavigator";
import RecordScreen from "./src/screens/RecordScreen";
import TreatmentsScreen from "./src/screens/TreatmentsScreen";
import QuotesScreen from "./src/screens/QuotesScreen";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

const Stack = createNativeStackNavigator();

// ✅ Este componente usa el contexto de autenticación
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ✅ Aquí sí envolvemos todo dentro del AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
