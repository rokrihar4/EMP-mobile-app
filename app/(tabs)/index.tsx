import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import React, { useState } from "react";
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

  checkboxRow: {
    flexDirection: "row",
    width: "90%",
    marginVertical: 8,
    flexWrap: "wrap",
  },

  checkbox: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },

  checkboxSelected: {
    backgroundColor: "#0CD849",
  },

  checkboxText: {
    color: "black",
    fontSize: 15,
  },

  checkboxTextSelected: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  sectionLabel: {
    fontSize: 18,
    width: "90%",
    marginTop: 10,
    marginBottom: 5,
  },

  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    width: "90%",
  },

  mealTypeRow: {
    flexDirection: "row",
    width: "90%",
    marginTop: 10,
    marginBottom: 15,
  },

  mealTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    marginHorizontal: 5,
  },

  mealTypeSelected: {
    backgroundColor: "#0CD849",
  },

  mealTypeText: {
    color: "black",
    fontSize: 16,
  },

  mealTypeTextSelected: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default function Index() {
  const [noOfDays, setNoOfDays] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [meals, setMeals] = useState(["Breakfast", "Lunch", "Dinner"]);
  const [mealType, setMealType] = useState("regular");
  const mealsStr = Array.from(meals).join(",").toLowerCase();

  const handlePress = async () => {
    try {
      const data = await fetchMenu(Number(noOfDays), mealsStr);
      // Show the response from the API
      Alert.alert("API Response", JSON.stringify(data, null, 2));
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch meals");
    }
  };

  const ALLERGY_OPTIONS = ["Gluten", "Eggs", "Dairy"];
  const MEAL_OPTIONS = ["Breakfast", "Lunch", "Dinner"];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.header}>Generate menu</Text>
      <TextInput
        style={styles.textInputCustom}
        keyboardType="numeric"
        placeholder="Budget (€)"
      />
      <TextInput
        style={styles.textInputCustom}
        keyboardType="numeric"
        placeholder="Time (minutes)"
      />
      <TextInput
        style={styles.textInputCustom}
        keyboardType="numeric"
        value={noOfDays}
        onChangeText={setNoOfDays}
        placeholder="Number of Days"
      />
      <Text style={styles.sectionLabel}>Allergies to exclude</Text>
      <View style={styles.checkboxRow}>
        {ALLERGY_OPTIONS.map((option) => {
          const selected = allergies.includes(option);
          const toggleAllergy = (item: string) => {
            setAllergies((prev) =>
              prev.includes(item)
                ? prev.filter((a) => a !== item)
                : [...prev, item]
            );
          };

          return (
            <TouchableOpacity
              key={option}
              style={[styles.checkbox, selected && styles.checkboxSelected]}
              onPress={() => toggleAllergy(option)}
            >
              <Text
                style={
                  selected ? styles.checkboxTextSelected : styles.checkboxText
                }
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Meals of the day</Text>
      <View style={styles.checkboxRow}>
        {MEAL_OPTIONS.map((option) => {
          const selected = meals.includes(option);
          const toggleMeal = (item: string) => {
            setMeals((prev) =>
              prev.includes(item)
                ? prev.filter((a) => a !== item)
                : [...prev, item]
            );
          };

          return (
            <TouchableOpacity
              key={option}
              style={[styles.checkbox, selected && styles.checkboxSelected]}
              onPress={() => toggleMeal(option)}
            >
              <Text
                style={
                  selected ? styles.checkboxTextSelected : styles.checkboxText
                }
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Meal type</Text>
      <View style={styles.mealTypeRow}>
        {["regular", "vegan", "vegetarian"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.checkbox,
              mealType === type && styles.checkboxSelected,
            ]}
            onPress={() => setMealType(type)}
          >
            <Text
              style={
                mealType === type
                  ? styles.checkboxTextSelected
                  : styles.checkboxText
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.buttonCustom}
        onPress={async () => {
          try {
            const data = await fetchMenu(Number(noOfDays), mealsStr);

            if (Array.isArray(data)) {
              // Navigate to /results and pass the data as a URL param
              router.push({
                pathname: "/results",
                params: { data: JSON.stringify(data), noOfDays, mealsStr },
              });
            }
          } catch (e) {
            Alert.alert("Error, Failed to fetch meals");
            console.log(e);
          }
        }}
      >
        <Text style={styles.buttonText}>Generate Menu</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
