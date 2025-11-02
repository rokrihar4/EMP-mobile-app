import { Link } from "expo-router";
import { fetchMeals } from "../../services/api";
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const styles = StyleSheet.create({
  textInputCustom: {
    backgroundColor: "#D9D9D9",
    opacity: 0.42,
    borderRadius: 11,
    fontSize: 14,
    margin: 10,
    padding: 15,
    width: "60%",
    fontFamily: "Outfit-Black",
  },

  buttonCustom: {
    backgroundColor: "#0CD849",
    borderRadius: 11,
    fontSize: 14,
    margin: 10,
    padding: 15,
    width: "60%",
    color: "white",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "Outfit-Black",
  },
});

export default function Index() {
  const handlePress = async () => {
    try {
      const data = await fetchMeals();
      // Show the response from the API
      Alert.alert("API Response", JSON.stringify(data, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch meals");
    }
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={require("../../assets/images/Logo.png")} />;
      <TextInput style={styles.textInputCustom} placeholder="Budget (€)" />
      <TextInput style={styles.textInputCustom} placeholder="Time (minutes)" />
      <TextInput
        style={styles.textInputCustom}
        placeholder="Allergies (seperated by comma)"
      />
      <TouchableOpacity
        style={styles.buttonCustom}
        onPress={async () => {
          try {
            const data = await fetchMeals();

            if (Array.isArray(data)) {
              Alert.alert("Meals", JSON.stringify(data, null, 2));
            }
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to fetch meals");
          }
        }}
      >
        <Text style={styles.buttonText}>Generate Weekly Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
