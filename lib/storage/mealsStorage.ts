import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meal } from "../types/mealTypes";
import { STORAGE_KEYS } from "./keys";

export async function deleteAllMeals(): Promise<Meal[]> {
  await AsyncStorage.removeItem(STORAGE_KEYS.MEALS);
  return [];
}