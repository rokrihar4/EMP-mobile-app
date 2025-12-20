import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { STORAGE_KEYS } from "../../lib/storage/keys";
import { deleteAll, deleteMeal } from "../../lib/storage/menusStorage";
import type { DayMenu, Meal, TimeOfDay } from "../../lib/types/mealTypes";

const DAYS = [
  { id: "1", title: "Mon", dayNumber: 1 },
  { id: "2", title: "Tue", dayNumber: 2 },
  { id: "3", title: "Wed", dayNumber: 3 },
  { id: "4", title: "Thu", dayNumber: 4 },
  { id: "5", title: "Fri", dayNumber: 5 },
  { id: "6", title: "Sat", dayNumber: 6 },
  { id: "7", title: "Sun", dayNumber: 7 },
];

const styles = StyleSheet.create({
  container: { 
    padding: 10, 
    width: "100%"
  },
  card: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
    color: "black"
  },
  title: { 
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    width: "90%",
  },
  mealContainer: { 
    marginVertical: 10, 
    padding: 15,
    backgroundColor: "#D9D9D9",
    borderRadius: 11,
    width: "90%",
    alignSelf: "center"
  },
  mealText: { 
    fontWeight: "bold",
    fontSize: 18,
    color: "black"
  },
  foodText: { 
    fontWeight: "bold", 
    color: "#0CD849", 
    fontSize: 16 
  },
  deleteAllButton: {
    backgroundColor: "#ff0000ff",
    borderRadius: 11,
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 10,
    width: "90%",
    alignSelf: "center"
  },
  deleteAllButtonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  },
});

function MealSection({ title, isLoading, meals, onDeleteMeal, day, }: {
    title: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
    isLoading: boolean;
    meals: Meal[];
    onDeleteMeal: (mealId: number) => void;
    day: number;
  }) {
  return (
    <View style={styles.mealContainer}>
      <Text style={styles.mealText}>{title}</Text>

      {isLoading ? (
        <Text style={{ marginTop: 12 }}>Loading…</Text>
      ) : meals.length === 0 ? (
        <Text style={{ marginTop: 12 }}>No {title.toLowerCase()} saved.</Text>
      ) : (
        meals.map((meal) => (
          <View key={meal.id} style={{ paddingVertical: 6 }}>
            <Text>{meal.name}</Text>

            <TouchableOpacity onPress={() => onDeleteMeal(meal.id)}>
                <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(tabs)/library",
            params: { day: String(day) },
          })
        }
      >
          <Text style={styles.foodText}>Add food</Text>
      </TouchableOpacity>

    </View>
  );
}

export default function Saved() {
  const [menus, setMenus] = useState<DayMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // IZBRAN DAN je number, ker raw day je number
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const dayMeals = useMemo(() => {
    const dayMenu = menus.find((m) => m.day === selectedDay);
    return dayMenu?.menu ?? [];
  }, [menus, selectedDay]);

  const mealsFor = (time: TimeOfDay) =>
    dayMeals.filter((meal) => meal.time_of_day === time);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.MENUS);
        const parsed: DayMenu[] = raw ? JSON.parse(raw) : [];
        //console.log("raw:", raw);
        //console.log("parsed:", parsed);
        setMenus(parsed);
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Failed to load");
        setMenus([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const onDeleteMeal = async (mealId: number) => {
    // deleteMeal v storage naj tudi primerja day kot number in mealId kot number
    const next = await deleteMeal(selectedDay, mealId);
    setMenus(next);
  };

  const onDeleteAll = async () => {
    const next = await deleteAll();
    setMenus(next);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Saved (Day {selectedDay})</Text>

          <FlatList
            data={DAYS}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => setSelectedDay(item.dayNumber)}>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <MealSection
            title="Breakfast"
            isLoading={isLoading}
            meals={mealsFor("breakfast")}
            onDeleteMeal={onDeleteMeal}
            day={selectedDay}
          />
          <MealSection
            title="Lunch"
            isLoading={isLoading}
            meals={mealsFor("lunch")}
            onDeleteMeal={onDeleteMeal}
            day={selectedDay}
          />
          <MealSection
            title="Dinner"
            isLoading={isLoading}
            meals={mealsFor("dinner")}
            onDeleteMeal={onDeleteMeal}
            day={selectedDay}
          />
          <MealSection
            title="Snacks"
            isLoading={isLoading}
            meals={mealsFor("snacks")}
            onDeleteMeal={onDeleteMeal}
            day={selectedDay}
          />

          <TouchableOpacity onPress={onDeleteAll}>
            <View style={styles.deleteAllButton}>
              <Text style={styles.deleteAllButtonText}>DELETE ALL</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
