import { addMeal as addMealToLibrary, loadSingleMeal, updateMeal } from "@/lib/storage/mealsStorage";
import type { LibraryMeal } from "@/lib/types/mealTypes";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddMealScreen() {
  const { mealId } = useLocalSearchParams();
  const editingId = typeof mealId === "string" ? Number(mealId) : undefined;
  const isEditing = Number.isFinite(editingId);

  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState("");
  const [mealType, setMealType] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [price, setPrice] = useState("");

  // prefill, ko je edit mode
  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        if (!isEditing || !editingId) return;

        const m = await loadSingleMeal(editingId);
        if (!m) {
          Alert.alert("Error", "Meal not found");
          router.back();
          return;
        }

        if (!active) return;

        setName(m.name ?? "");
        setAllergies(m.allergies ?? "");
        setMealType(m.meal_type ?? "");
        setPrepTime(m.prep_time != null ? String(m.prep_time) : "");
        setPrice(m.price != null ? String(m.price) : "");
      })();

      return () => {
        active = false;
      };
    }, [isEditing, editingId])
  );

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

    const meal: LibraryMeal = {
      id: isEditing && editingId ? editingId : Date.now(),
      name: trimmedName,
      allergies: allergies.trim() || undefined,
      meal_type: mealType.trim() || undefined,
      prep_time: parsedPrepTime,
      price: parsedPrice,
    };

    try {
      if (isEditing) {
        await updateMeal(meal);
      } else {
        await addMealToLibrary(meal);
      }
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to save meal");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 28, fontWeight: "800" }}>
        {isEditing ? "Edit meal" : "Add meal"}
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name (e.g. Chicken salad)"
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 10 }}
      />

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
          <Text style={{ color: "white", fontWeight: "800", textAlign: "center" }}>
            Save
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ textAlign: "center", marginTop: 8 }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
