import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BlogScreen from '../screens/BlogScreen';
import RecordScreen from '../screens/RecordScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          headerTitle: 'FarmaMedic',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Blog"
        component={BlogScreen}
        options={{
          headerTitle: 'Blog de Salud',
          tabBarLabel: 'Blog',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          headerTitle: 'Mi Perfil',
          tabBarLabel: 'Mi Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
