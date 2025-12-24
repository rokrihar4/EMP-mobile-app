import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
import type { DayMenu, MenuMeal, TimeOfDay } from "../../lib/types/mealTypes";

const DAYS = [
  { id: "1", title: "Mon", dayNumber: 1 },
  { id: "2", title: "Tue", dayNumber: 2 },
  { id: "3", title: "Wed", dayNumber: 3 },
  { id: "4", title: "Thu", dayNumber: 4 },
  { id: "5", title: "Fri", dayNumber: 5 },
  { id: "6", title: "Sat", dayNumber: 6 },
  { id: "7", title: "Sun", dayNumber: 7 },
];

const getTodayDayNumber = () => {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
  },
  card: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 15,
    color: "black"
  },
  title: { 
    fontSize: 32,
    fontWeight: "bold",
    margin: 10,
    width: "90%",
  },
  mealContainer: { 
    margin: 10,
    padding: 15,
    backgroundColor: "#D9D9D9",
    borderRadius: 11,
    width: "90%",
  },
  mealText: { 
    fontWeight: "bold",
    fontSize: 18,
    color: "black",
    marginBottom: 8,
  },
  foodText: { 
    fontWeight: "bold", 
    color: "#0CD849", 
    fontSize: 16,
    marginTop: 8,
  },
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
  sectionLabel: {
    fontSize: 18,
    width: "90%",
    marginTop: 10,
    marginBottom: 5,
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

  mealCard: {
    backgroundColor: "#bebebeff",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  mealRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  mealInfo: { 
    flex: 1 
  },
  mealName: { 
    fontSize: 16, 
    fontWeight: "700" 
  },
  deleteX: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#ff0000",
  },
  deleteXText: { 
    color: "white", 
    fontWeight: "800" 
  },
});

function MealSection({ title, time, isLoading, meals, onDeleteMeal, day }: {
    title: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
    time: TimeOfDay;
    isLoading: boolean;
    meals: MenuMeal[];
    onDeleteMeal: (mealId: number) => void;
    day: number;
  }) {
  return (
    <View style={styles.mealContainer}>
      <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
        <Text style={styles.mealText}>{title}</Text>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(tabs)/library",
              params: { day: String(day), time },
            })
          }
        >
          <View style={{ backgroundColor: "#0CD849", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Add food +</Text>
          </View>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={{ marginTop: 12 }}>Loading…</Text>
      ) : meals.length === 0 ? (
        <Text style={{ marginTop: 12 }}>No {title.toLowerCase()} saved.</Text>
      ) : (
        meals.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealRow}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                {!!meal.allergies && <Text style={{ color: "red" }}>{meal.allergies}</Text>}
                <Text>cca {meal.prep_time ?? "-"} min - {meal.price ?? "-"} €</Text>
              </View>

              <TouchableOpacity onPress={() => onDeleteMeal(meal.id)} style={styles.deleteX}>
                <Text style={styles.deleteXText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

export default function Saved() {
  const [menus, setMenus] = useState<DayMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // IZBRAN DAN je number, ker raw day je number
  // Tole nastavm default dan današnji dan
  const [selectedDay, setSelectedDay] = useState<number>(() => getTodayDayNumber());

  const dayMeals = useMemo(() => {
    const dayMenu = menus.find((m) => m.day === selectedDay);
    return dayMenu?.menu ?? [];
  }, [menus, selectedDay]);

  const rotatedDays = useMemo(() => {
    const today = getTodayDayNumber();
    const startIndex = DAYS.findIndex(d => d.dayNumber === today);
    return [...DAYS.slice(startIndex), ...DAYS.slice(0, startIndex)];
  }, []);

  const mealsFor = (time: TimeOfDay) =>
    dayMeals.filter((meal) => meal.time_of_day === time);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        try {
          setIsLoading(true);
          const raw = await AsyncStorage.getItem(STORAGE_KEYS.MENUS);
          const parsed: DayMenu[] = raw ? JSON.parse(raw) : [];
          if (active) setMenus(parsed);
        } catch (e: any) {
          Alert.alert("Error", e?.message ?? "Failed to load");
          if (active) setMenus([]);
        } finally {
          if (active) setIsLoading(false);
        }
      };

      load();

      return () => {
        active = false;
      };
    }, [])
  );

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
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={true}

      >
          <Text style={styles.title}>Saved (Day {selectedDay})</Text>

          <FlatList
            data={rotatedDays}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingRight: 10, gap: 10, }}
            renderItem={({ item }) => (
              <TouchableHighlight onPress={() => setSelectedDay(item.dayNumber)}>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
              </TouchableHighlight>
            )}
          />


          <MealSection
            title="Breakfast"
            isLoading={isLoading}
            meals={mealsFor("breakfast")}
            onDeleteMeal={onDeleteMeal}
            day={selectedDay}
            time="breakfast"
          />
          <MealSection
            title="Lunch"
            isLoading={isLoading}
            meals={mealsFor("lunch")}
            onDeleteMeal={onDeleteMeal}
            day={selectedDay}
            time="lunch"
          />
          <MealSection
            title="Dinner"
            isLoading={isLoading}
            meals={mealsFor("dinner")}
            onDeleteMeal={onDeleteMeal}
            day={selectedDay}
            time="dinner"
          />
          <MealSection
            title="Snacks"
            isLoading={isLoading}
            meals={mealsFor("snacks")}
            onDeleteMeal={onDeleteMeal}
            day={selectedDay}
            time="snacks"
          />

          <TouchableOpacity onPress={onDeleteAll} style={{ width: "90%", alignItems: "center" }}>
            <View style={styles.deleteAllButton}>
              <Text style={styles.deleteAllButtonText}>Delete All</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
