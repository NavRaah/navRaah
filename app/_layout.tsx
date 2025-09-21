import { Stack } from "expo-router";
import { AuthProvider } from "../contexts";
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="dashboards" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(root)" />
      </Stack>
    </AuthProvider>
  );
}
