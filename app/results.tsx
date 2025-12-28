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
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  mealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  mealDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  mealDetail: {
    fontSize: 14,
    color: "#444",
  },
  mealAllergies: {
    marginTop: 6,
    color: "#C0392B",
    fontSize: 13,
  },
  timeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E9E9E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  buttonCustom: {
    backgroundColor: "#0CD849",
    borderRadius: 14,
    marginVertical: 20,
    padding: 16,
    width: "90%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
      <ScrollView contentContainerStyle={styles.listContent}>
        {menus.map((day) => (
          <View key={day.day} style={styles.dayCard}>
            <Text style={styles.dayTitle}>Day {day.day}</Text>

            {day.menu.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{meal.time_of_day.toUpperCase()}</Text>
                </View>

                <Text style={styles.mealName}>{meal.name}</Text>

                <View style={styles.mealDetailRow}>
                  <Text style={styles.mealDetail}>🕒 {meal.prep_time} min</Text>
                  <Text style={styles.mealDetail}>💰 {meal.price} €</Text>
                </View>

                {meal.allergies ? (
                  <Text style={styles.mealAllergies}>
                    ⚠️ Allergies: {meal.allergies}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.buttonCustom} onPress={saveAndGo}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Results;
