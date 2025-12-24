import { loadSingleMeal } from "@/lib/storage/mealsStorage";
import { addMeal as addMealToMenu } from "@/lib/storage/menusStorage";
import type { LibraryMeal, MenuMeal, TimeOfDay } from "@/lib/types/mealTypes";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const DAYS = [
  { label: "Mon", dayNumber: 1 },
  { label: "Tue", dayNumber: 2 },
  { label: "Wed", dayNumber: 3 },
  { label: "Thu", dayNumber: 4 },
  { label: "Fri", dayNumber: 5 },
  { label: "Sat", dayNumber: 6 },
  { label: "Sun", dayNumber: 7 },
];

const getTodayDayNumber = () => {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 7 : jsDay;
};

const TIMES: { label: string; value: TimeOfDay }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snacks", value: "snacks" },
];

export default function AddToMenu() {
  const { mealId } = useLocalSearchParams();
  const id = typeof mealId === "string" ? Number(mealId) : NaN;

  const [meal, setMeal] = useState<LibraryMeal | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<number>(() => getTodayDayNumber());
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("breakfast");

  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        if (!Number.isFinite(id)) return;

        const m = await loadSingleMeal(id);
        if (active) setMeal(m);
      })();

      return () => {
        active = false;
      };
    }, [id])
  );

  const rotatedDays = useMemo(() => {
      const today = getTodayDayNumber();
      const startIndex = DAYS.findIndex(d => d.dayNumber === today);
      return [...DAYS.slice(startIndex), ...DAYS.slice(0, startIndex)];
    }, []);

  const onSave = async () => {
    if (!meal) {
      Alert.alert("Error", "Meal not found.");
      return;
    }

    const menuMeal: MenuMeal = {
      ...meal,
      time_of_day: selectedTime,
    };

    try {
      await addMealToMenu(selectedDay, menuMeal);
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to add to menu");
    }
  };

  if (!meal) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 26, fontWeight: "800" }}>Add to menu</Text>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{meal.name}</Text>

      <Text style={{ fontWeight: "700" }}>Choose day</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {rotatedDays.map((d) => {
          const selected = d.dayNumber === selectedDay;
          return (
            <TouchableOpacity key={d.dayNumber} onPress={() => setSelectedDay(d.dayNumber)}>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor: selected ? "#0CD849" : "#D9D9D9",
                }}
              >
                <Text style={{ color: selected ? "white" : "black", fontWeight: "700" }}>
                  {d.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={{ fontWeight: "700" }}>Choose time</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {TIMES.map((t) => {
          const selected = t.value === selectedTime;
          return (
            <TouchableOpacity key={t.value} onPress={() => setSelectedTime(t.value)}>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor: selected ? "#0CD849" : "#D9D9D9",
                }}
              >
                <Text style={{ color: selected ? "white" : "black", fontWeight: "700" }}>
                  {t.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity onPress={onSave} style={{ marginTop: 8 }}>
        <View style={{ backgroundColor: "black", padding: 14, borderRadius: 12 }}>
          <Text style={{ color: "white", textAlign: "center", fontWeight: "800" }}>
            Add
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ textAlign: "center" }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
