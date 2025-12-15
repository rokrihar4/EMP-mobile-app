import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
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
  container: { padding: 10, marginTop: StatusBar.currentHeight || 0 },
  card: {
    backgroundColor: "#cefae0",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cardText: {
    fontSize: 24 
  },
  title: { 
    fontSize: 36, 
    marginVertical: 20 
  },
  mealContainer: { 
    marginVertical: 10, 
    padding: 10,
    backgroundColor: "#D9D9D9" 
  },
  mealText: { 
    fontWeight: "bold",
    fontSize: 28
  },
  foodText: { 
    fontWeight: "bold", 
    color: "#0CD849", 
    fontSize: 28 
  },
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
});

function MealSection({title, isLoading, meals, onDeleteMeal,}: {
  title: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  isLoading: boolean;
  meals: Meal[];
  onDeleteMeal: (mealId: number) => void;
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

            <TouchableHighlight onPress={() => onDeleteMeal(meal.id)}>
              <View style={{ paddingVertical: 6 }}>
                <Text style={{ color: "red" }}>Delete</Text>
              </View>
            </TouchableHighlight>
          </View>
        ))
      )}

      <TouchableHighlight onPress={() => { /* Tuki add food za dodat -> library */ }}>
        <View>
          <Text style={styles.foodText}>Add food</Text>
        </View>
      </TouchableHighlight>
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
          <TouchableHighlight onPress={onDeleteAll}>
            <View style={styles.deleteAllButton}>
              <Text style={styles.deleteAllButtonText}>DELETE ALL!!!</Text>
            </View>
          </TouchableHighlight>

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
          />
          <MealSection
            title="Lunch"
            isLoading={isLoading}
            meals={mealsFor("lunch")}
            onDeleteMeal={onDeleteMeal}
          />
          <MealSection
            title="Dinner"
            isLoading={isLoading}
            meals={mealsFor("dinner")}
            onDeleteMeal={onDeleteMeal}
          />
          <MealSection
            title="Snacks"
            isLoading={isLoading}
            meals={mealsFor("snacks")}
            onDeleteMeal={onDeleteMeal}
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
