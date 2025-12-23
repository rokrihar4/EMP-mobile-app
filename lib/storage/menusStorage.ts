import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DayMenu, Meal } from "../types/mealTypes";
import { STORAGE_KEYS } from "./keys";

export async function saveMenus(menus: DayMenu[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus));
}

export async function loadMenus(): Promise<DayMenu[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.MENUS);
  return raw ? (JSON.parse(raw) as DayMenu[]) : [];
}

export async function deleteMeal(day: number,mealId: number): Promise<DayMenu[]> {
  const menus = await loadMenus();

  const next = menus.map((m) => {
    if (m.day !== day) return m;
    return {
      ...m,
      menu: m.menu.filter((meal) => meal.id !== mealId),
    };
  });

  await saveMenus(next);
  return next;
}

export async function deleteAll(): Promise<DayMenu[]> {
  await AsyncStorage.removeItem(STORAGE_KEYS.MENUS);
  return [];
}

export async function addMeal(day: number, meal: Meal): Promise<DayMenu[]> {
  const menus = await loadMenus();

  const next =
    menus.findIndex((m) => m.day === day) === -1
      ? [...menus, { day, menu: [meal] }]
      : menus.map((m) =>
          m.day === day
            ? { ...m, menu: [...m.menu, meal] }
            : m
        );

  await saveMenus(next);
  return next;
}
