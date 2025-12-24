import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LibraryMeal } from "../types/mealTypes";
import { STORAGE_KEYS } from "./keys";

export async function saveMeals(meals: LibraryMeal[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
}

export async function loadMeals(): Promise<LibraryMeal[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
  return raw ? (JSON.parse(raw) as LibraryMeal[]) : [];
}

export async function loadSingleMeal(id: number): Promise<LibraryMeal | undefined> {
  const meals = await loadMeals();
  return meals.find((m) => m.id === id);
}

export async function updateMeal(updated: LibraryMeal): Promise<LibraryMeal[]> {
  const meals = await loadMeals();
  const next = meals.map((m) => (m.id === updated.id ? updated : m));
  await saveMeals(next);
  return next;
}

export async function deleteAllMeals(): Promise<LibraryMeal[]> {
  await AsyncStorage.removeItem(STORAGE_KEYS.MEALS);
  return [];
}

export async function deleteMeal(id: number): Promise<LibraryMeal[]> {
  const meals = await loadMeals();
  const next = meals.filter((m) => m.id !== id);
  await saveMeals(next);
  return next;
}

export async function addMeal(meal: LibraryMeal): Promise<LibraryMeal[]> {
  const meals = await loadMeals();
  const next = [...meals, meal];
  await saveMeals(next);
  return next;
}
