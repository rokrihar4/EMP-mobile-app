import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meal } from "../types/mealTypes";
import { STORAGE_KEYS } from "./keys";

export async function saveMeal(meals: Meal[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
}

export async function loadMeals(): Promise<Meal[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
  return raw ? (JSON.parse(raw) as Meal[]) : [];
}

export async function deleteAllMeals(): Promise<Meal[]> {
  await AsyncStorage.removeItem(STORAGE_KEYS.MEALS);
  return [];
}

export async function deleteMeal(id: number): Promise<Meal[]> {
  const meals = await loadMeals();
  const next = meals.filter((m) => m.id !== id);
  await saveMeal(next);
  return next;
}

export async function addMeal(meal: Meal): Promise<Meal[]> {
  const meals = await loadMeals();

  const next = [...meals, meal];

  await saveMeal(next);
  return next;
}
