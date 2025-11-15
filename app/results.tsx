import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Results = () => {
  const { data } = useLocalSearchParams();

  // Parse the array passed as a param
  const menus = JSON.parse(data || "[]");

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={menus}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const meals = item.menu; // breakfast, lunch, dinner

          return (
            <View style={styles.dayCard}>
              <Text style={styles.dayTitle}>Day {item.day}</Text>

              {meals.map((meal) => (
                <View key={meal.id} style={styles.mealCard}>
                  <Text style={styles.mealName}>
                    {meal.time_of_day.toUpperCase()}: {meal.name}
                  </Text>

                  <Text style={styles.mealDetail}>🕒 {meal.prep_time} min</Text>
                  <Text style={styles.mealDetail}>💰 {meal.price} €</Text>

                  {meal.allergies ? (
                    <Text style={styles.mealAllergies}>
                      ⚠ Allergies: {meal.allergies}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

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

export default Results;
