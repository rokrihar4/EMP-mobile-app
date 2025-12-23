import { addMeal as addMealToLibrary } from "@/lib/storage/mealsStorage";
import type { Meal, TimeOfDay } from "@/lib/types/mealTypes";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const TIMES: { label: string; value: TimeOfDay }[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snacks", value: "snacks" },
];

export default function AddMealScreen() {
  const [name, setName] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("breakfast");
  const [allergies, setAllergies] = useState("");
  const [mealType, setMealType] = useState("");
  const [prepTime, setPrepTime] = useState(""); // string input
  const [price, setPrice] = useState("");       // string input

  const parsedPrepTime = useMemo(() => {
    const v = prepTime.trim();
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  }, [prepTime]);

  const parsedPrice = useMemo(() => {
    const v = price.trim();
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : NaN;
  }, [price]);

  const onSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert("Validation", "Name is required.");
      return;
    }

    if (parsedPrepTime !== undefined && Number.isNaN(parsedPrepTime)) {
      Alert.alert("Validation", "Prep time must be a number.");
      return;
    }

    if (parsedPrice !== undefined && Number.isNaN(parsedPrice)) {
      Alert.alert("Validation", "Price must be a number.");
      return;
    }

    const newMeal: Meal = {
      id: Date.now(), // simple unique id (ok za začetek)
      name: trimmedName,
      time_of_day: timeOfDay,
      allergies: allergies.trim() || undefined,
      meal_type: mealType.trim() || undefined,
      prep_time: parsedPrepTime,
      price: parsedPrice,
    };

    try {
      await addMealToLibrary(newMeal);
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to save meal");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>Add meal</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name (e.g. Chicken salad)"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 10 }}
      />

      {/* Time of day selector (simple buttons) */}
      <Text style={{ fontWeight: "700", marginTop: 6 }}>Time of day</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {TIMES.map((t) => {
          const selected = t.value === timeOfDay;
          return (
            <TouchableOpacity key={t.value} onPress={() => setTimeOfDay(t.value)}>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  backgroundColor: selected ? "#0CD849" : "#D9D9D9",
                }}
              >
                <Text style={{ color: selected ? "white" : "black", fontWeight: selected ? "800" : "600" }}>
                  {t.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TextInput
        value={mealType}
        onChangeText={setMealType}
        placeholder="Meal type (optional)"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 10 }}
      />

      <TextInput
        value={allergies}
        onChangeText={setAllergies}
        placeholder="Allergies (optional)"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 10 }}
      />

      <TextInput
        value={prepTime}
        onChangeText={setPrepTime}
        placeholder="Prep time in minutes (optional)"
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 10 }}
      />

      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Price (optional)"
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 10 }}
      />

      <TouchableOpacity onPress={onSave} style={{ marginTop: 8 }}>
        <View style={{ backgroundColor: "black", padding: 14, borderRadius: 12 }}>
          <Text style={{ color: "white", fontWeight: "800", textAlign: "center" }}>Save</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ textAlign: "center", marginTop: 8 }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
