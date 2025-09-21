import { Stack } from "expo-router";

export default function DashboardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="user" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="driver" />
    </Stack>
  );
}
