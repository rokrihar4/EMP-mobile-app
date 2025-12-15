export type Meal = {
  id: number; // v raw je number
  time_of_day: TimeOfDay | string; // raw je lowercase, pustimo string za "future-proof"
  name: string;
  allergies?: string;
  meal_type?: string;
  prep_time?: number;
  price?: number;
};

export type DayMenu = {
  day: number; // v raw je number 1..7
  menu: Meal[];
};

export type TimeOfDay = "breakfast" | "lunch" | "dinner" | "snacks";