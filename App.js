import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { RecordingsProvider } from './src/components/RecordingsContext';
import PracticeScreen from './src/screens/PracticeScreen';
import SongsScreen from './src/screens/SongsScreen';
import SongDetailScreen from './src/screens/SongDetailScreen';
import RecordingsScreen from './src/screens/RecordingsScreen';
import StatsScreen from './src/screens/StatsScreen';
import { C } from './src/theme';

const SongsStack = createNativeStackNavigator();

function SongsNavigator() {
  return (
    <SongsStack.Navigator screenOptions={{ headerShown: false }}>
      <SongsStack.Screen name="SongsList" component={SongsScreen} />
      <SongsStack.Screen name="SongDetail" component={SongDetailScreen} />
    </SongsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const ICONS = {
  연습: ['play', 'play-outline'],
  곡: ['musical-notes', 'musical-notes-outline'],
  녹음: ['mic', 'mic-outline'],
  통계: ['stats-chart', 'stats-chart-outline'],
};

export default function App() {
  return (
    <RecordingsProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: C.tintBlue,
            tabBarInactiveTintColor: C.faint,
            tabBarStyle: { backgroundColor: 'rgba(249,249,251,0.95)', borderTopColor: C.line },
            tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={size - 2} color={color} />
            ),
          })}
        >
          <Tab.Screen name="연습" component={PracticeScreen} />
          <Tab.Screen name="곡" component={SongsNavigator} />
          <Tab.Screen name="녹음" component={RecordingsScreen} />
          <Tab.Screen name="통계" component={StatsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </RecordingsProvider>
  );
}
