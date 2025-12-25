import { Stack } from "expo-router";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { storage } from "../../utils/storage";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await storage.getToken();
      const firstSegment = segments[0] as string; 
      const inAuthGroup = firstSegment === "auth";

      console.log("Token:", token);
      console.log("In Auth Group:", inAuthGroup);

      if (!token && !inAuthGroup) {
        if (firstSegment !== "auth") {
          console.log("Unauthorized! Redirecting to /auth/login");
          router.replace("/auth/login");
        }
      } else if (token && inAuthGroup) {
        console.log("Authenticated! Redirecting to /app/chat");
        router.replace("/app/chat");
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="app" />
    </Stack>
  );
}
