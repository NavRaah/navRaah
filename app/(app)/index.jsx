import { useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/bus.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to NavRaah !!</Text>
      <TouchableOpacity
        onPress={() => router.push("/SignUp")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: { width: 300, height: 300, marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 40,
  },
  button: {
    marginTop:40,
    backgroundColor: "#1e40af",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});
