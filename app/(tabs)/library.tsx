
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { deleteAllMeals } from "@/lib/storage/mealsStorage";
import { addMeal } from "@/lib/storage/menusStorage";
import type { Meal } from "@/lib/types/mealTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  deleteAllButton: {
    backgroundColor: "#ff0000ff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  deleteAllButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  card: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    flex: 1, 
    padding: 12
  },
  cardText: {
    fontSize: 15,
    color: "black"
  },
});

export default function Library() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { day } = useLocalSearchParams();
  const dayNumber = typeof day === "string" ? Number(day) : 1;

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
        const parsed: Meal[] = raw ? JSON.parse(raw) : [];

        const uniqueMeals = parsed.filter(
          (meal, index, mealsArray) =>
            index === mealsArray.findIndex(m => m.id === meal.id)
        );

        setMeals(uniqueMeals);

      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Failed to load meals");
        setMeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // opcijsko: sortiraj po name
  const sorted = useMemo(
    () => [...meals].sort((a, b) => a.name.localeCompare(b.name)),
    [meals]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 12 }}>
        <Text>Loading…</Text>
      </SafeAreaView>
    );
  }

  const onDeleteAllMeals = async () => {
    try {
      const next = await deleteAllMeals();
      setMeals(next);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to delete meals");
    }
  };


  return (
    <SafeAreaView style={styles.card}>

      <Text style={{ fontSize: 32, fontWeight: "800", marginBottom: 12 }}>
        Library
      </Text>

      {sorted.length === 0 ? (
        <Text>No meals saved yet.</Text>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={{ padding: 12, borderRadius: 10, backgroundColor: "#F3F3F3", marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.name}</Text>
              <Text>{item.time_of_day}</Text>
              {!!item.allergies && <Text style={{ color: "red" }}>{item.allergies}</Text>}
              <Text>cca {item.prep_time ?? "-"} min - {item.price ?? "-"} €</Text>

              <TouchableOpacity
                onPress={async () => {
                  try {
                    await addMeal(dayNumber, item);   // <-- to uporabi tvojo funkcijo
                    router.back();                    // vrne nazaj na Saved
                  } catch (e: any) {
                    Alert.alert("Error", e?.message ?? "Failed to add meal");
                  }
                }}
                style={{
                  marginTop: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                  backgroundColor: "#0CD849",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Add to my menu</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity onPress={onDeleteAllMeals} style={{ width: "90%", alignItems: "center" }}>
        <View style={styles.deleteAllButton}>
          <Text style={styles.deleteAllButtonText}>Delete All Meals</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


