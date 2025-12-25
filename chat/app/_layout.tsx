import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme(); 

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack 
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          animation: 'none',
          header: () => null,
          contentStyle: { height: '100%' },
          presentation: 'transparentModal',
          gestureEnabled: false,
        }}
      >
        <Stack.Screen 
          name="index"
          options={{
            headerShown: false,
            header: () => null,
          }}
        />
        <Stack.Screen 
          name="(auth)/login/index"
          options={{
            headerShown: false,
            header: () => null,
          }}
        />
        <Stack.Screen 
          name="(app)/chat/index"
          options={{
            headerShown: false,
            header: () => null,
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}