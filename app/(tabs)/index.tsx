import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import { useState } from "react";
import { fetchMenu } from "../../services/api";

const styles = StyleSheet.create({
  textInputCustom: {
    backgroundColor: "#D9D9D9",
    opacity: 0.42,
    borderRadius: 11,
    fontSize: 18,
    margin: 10,
    padding: 15,
    width: "90%",
  },

  buttonCustom: {
    backgroundColor: "#0CD849",
    borderRadius: 11,
    fontSize: 14,
    margin: 10,
    padding: 15,
    width: "90%",
    color: "white",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
  },
});

export default function Index() {
  const [noOfDays, setNoOfDays] = useState("");
  const handlePress = async () => {
    try {
      const data = await fetchMenu(Number(noOfDays));
      // Show the response from the API
      Alert.alert("API Response", JSON.stringify(data, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch meals");
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={require("../../assets/images/Logo.png")} />
      <TextInput style={styles.textInputCustom} placeholder="Budget (€)" />
      <TextInput style={styles.textInputCustom} placeholder="Time (minutes)" />
      <TextInput
        style={styles.textInputCustom}
        value={noOfDays}
        onChangeText={setNoOfDays}
        placeholder="Number of Days"
      />
      <TextInput
        style={styles.textInputCustom}
        placeholder="Allergies (seperated by comma)"
      />
      <TouchableOpacity
        style={styles.buttonCustom}
        onPress={async () => {
          try {
            const data = await fetchMenu(Number(noOfDays));

            if (Array.isArray(data)) {
              // Navigate to /results and pass the data as a URL param
              router.push({
                pathname: "/results",
                params: { data: JSON.stringify(data), noOfDays },
              });
            }
          } catch (error) {
            Alert.alert("Error", error.message || "Failed to fetch meals");
          }
        }}
      >
        <Text style={styles.buttonText}>
          Generate {noOfDays + " day" || ""} Menu
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
