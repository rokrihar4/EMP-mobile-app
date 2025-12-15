import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./keys";

export async function saveMenus(menus) {
  await AsyncStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus));
}

export async function loadMenus() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.MENUS);
  return raw ? JSON.parse(raw) : [];
}

export async function deleteMeal(day, mealId) {
  const menus = await loadMenus();

  const next = menus.map((m) => {
    if (m.day !== day) return m;
    return { ...m, menu: (m.menu ?? []).filter((meal) => meal.id !== mealId) };
  });

  await saveMenus(next);
  return next;
}

export async function deleteAll() {
  await AsyncStorage.removeItem(STORAGE_KEYS.MENUS);
  return [];
}

export async function addMeal(day, meal) {
  const menus = await loadMenus();

  const next = (() => {
    const idx = menus.findIndex((m) => m.day === day);

    if (idx === -1) {
      return [...menus, { day, menu: [meal] }];
    }

    return menus.map((m) =>
      m.day === day ? { ...m, menu: [...(m.menu ?? []), meal] } : m
    );
  })();

  await saveMenus(next);
  return next;
}
