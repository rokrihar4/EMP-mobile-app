
import { STORAGE_KEYS } from "@/lib/storage/keys";
import { deleteAllMeals, deleteMeal } from "@/lib/storage/mealsStorage";
import { LibraryMeal } from "@/lib/types/mealTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  deleteAllButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#ff0000",
  },
  deleteAllButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  deleteButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#ff0000",
    alignSelf: "flex-end",
    padding: 6
  },
  deleteButtonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 18,
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#008cffff",
    alignSelf: "flex-end",
    padding: 6
  },
  editButtonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 18,
  },
  addMealButton: {
    backgroundColor: "#0cd849ff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addMealButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
  container: { 
    flex: 1, 
    padding: 12 
  },
  listContent: { 
    paddingBottom: 24 
  },
  mealCard: {
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

});

export default function Library() {
  const [meals, setMeals] = useState<LibraryMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { day } = useLocalSearchParams();
  const dayNumber = typeof day === "string" ? Number(day) : 1;

  // To je hook v expo-router, ki se zažene vsakič, ko zaslon preide v fokus
  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
          const parsed: LibraryMeal[] = raw ? JSON.parse(raw) : [];

          const uniqueMeals = parsed.filter(
            (meal, index, arr) => index === arr.findIndex(m => m.id === meal.id)
          );

          if (active) setMeals(uniqueMeals);
        } catch (e: any) {
          Alert.alert("Error", e?.message ?? "Failed to load meals");
          if (active) setMeals([]);
        } finally {
          if (active) setIsLoading(false);
        }
      })();

      return () => {
        active = false;
      };
    }, [])
  );

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

  const onDeleteMeal = async (id : number) => {
    try {
      const next = await deleteMeal(id);
      setMeals(next);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to delete meals");
    }
  };

  const onEditMeal = (id: number) => {
    router.push({ pathname: "/edit-meal", params: { mealId: String(id) } });
  };

  const onAddMeal = () => {
    router.push("/add-meal");
  };

  return (
  <SafeAreaView style={styles.container}>
    <FlatList
      data={sorted}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View style={styles.headerRow}>
          <Text style={{ fontSize: 32, fontWeight: "800" }}>Library</Text>

          <TouchableOpacity onPress={onAddMeal}>
            <View style={styles.addMealButton}>
              <Text style={styles.addMealButtonText}>Add meal +</Text>
            </View>
          </TouchableOpacity>
        </View>
      }
      ListEmptyComponent={<Text>No meals saved yet.</Text>}
      renderItem={({ item }) => (
        <View style={styles.mealCard}>
          <View style={styles.rowTop}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "700" }}>{item.name}</Text>
              {!!item.allergies && <Text style={{ color: "red" }}>{item.allergies}</Text>}
              <Text>cca {item.prep_time ?? "-"} min - {item.price ?? "-"} €</Text>
            </View>

            <TouchableOpacity 
              onPress={() => onEditMeal(item.id)} 
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onDeleteMeal(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={async () => {
              try {
                router.push({
                  pathname: "/add-to-menu",
                  params: { mealId: String(item.id) },
                });
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
      ListFooterComponent={
        <TouchableOpacity onPress={onDeleteAllMeals} style={{ alignItems: "center" }}>
          <View style={styles.deleteAllButton}>
            <Text style={styles.deleteAllButtonText}>Delete All Meals</Text>
          </View>
        </TouchableOpacity>
      }
    />
  </SafeAreaView>
);
}


