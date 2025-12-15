import { DayMenu, Meal } from "@/lib/types/mealTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STORAGE_KEYS } from "../lib/storage/keys";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    padding: 16,
  },
  dayCard: {
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  mealDetail: {
    fontSize: 14,
    color: "#444",
  },
  mealAllergies: {
    marginTop: 6,
    color: "red",
    fontSize: 13,
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

const Results = () => {
  
  const { data } = useLocalSearchParams();

  // Parse the array passed as a param
  const menus = useMemo<DayMenu[]>(() => {
    if (typeof data !== "string") return [];
    try {
      return JSON.parse(data) as DayMenu[];
    } catch {
      return [];
    }
  }, [data]);

  const saveAndGo = async () => {
    try {
      // MENUS
      const existingRawMenus = await AsyncStorage.getItem(STORAGE_KEYS.MENUS);
      const existingMenus: DayMenu[] = existingRawMenus ? JSON.parse(existingRawMenus) : [];

      const nextMenus: DayMenu[] = [...existingMenus, ...menus];
      await AsyncStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(nextMenus));

      // MEALS LIBRARY (unikatno)
      const incomingMeals: Meal[] = menus.flatMap((d) => d.menu ?? []);

      const existingRawMeals = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
      const existingMeals: Meal[] = existingRawMeals ? JSON.parse(existingRawMeals) : [];

      // dedupe po id
      const merged = [...existingMeals, ...incomingMeals];
      const uniqueMeals = Array.from(new Map(merged.map((m) => [m.id, m])).values());

      await AsyncStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(uniqueMeals));

      router.push("/(tabs)/saved");
    } catch (e) {
      Alert.alert("Error", "Failed to save");
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        {menus.map((m) => {
          const meals = m.menu;
          return (
            <View key={m.day}>
              <Text key={m.day} style={styles.dayTitle}>
                Day {m.day}
              </Text>
              {meals.map((meal: Meal) => (
                <View key={meal.id}>
                  <Text>{meal.time_of_day}</Text>
                  <Text>{meal.name}</Text>
                </View>
              ))}
            </View>
          );
        })}
        <TouchableOpacity
                style={styles.buttonCustom}
                onPress={saveAndGo}
              >
                <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Results;
