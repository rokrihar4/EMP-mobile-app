import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    padding: 16,
  },
  dayCard: {
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  mealDetail: {
    fontSize: 14,
    color: "#444",
  },
  mealAllergies: {
    marginTop: 6,
    color: "red",
    fontSize: 13,
  },
});

const Results = () => {
  const { data } = useLocalSearchParams();

  // Parse the array passed as a param
  const menus = JSON.parse(data || "[]");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        {menus.map((m) => {
          const meals = m.menu;
          return (
            <View key={m.day}>
              <Text key={m.day} style={styles.dayTitle}>
                Day {m.day}
              </Text>
              {meals.map((meal) => {
                return (
                  <View key={meal.id}>
                    <Text>{meal.name}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Results;
