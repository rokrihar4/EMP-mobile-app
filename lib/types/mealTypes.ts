export type TimeOfDay = "breakfast" | "lunch" | "dinner" | "snacks";

export type LibraryMeal = {
  id: number;
  name: string;
  allergies?: string;
  meal_type?: string;
  prep_time?: number;
  price?: number;
};

export type MenuMeal = LibraryMeal & {
  time_of_day: TimeOfDay; // tukaj ni optional
};

export type DayMenu = {
  day: number; // 1..7
  menu: MenuMeal[];
};
