import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

const Results = () => {
  const { data } = useLocalSearchParams();
  const meals = JSON.parse(data || "[]");

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={meals}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.itemDesc}>🕒 {item.prep_time} min</Text>
              <Text style={styles.itemDesc}>💰 {item.price} €</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  itemContainer: {
    backgroundColor: "#F3F3F3", // light gray like the input fields
    borderRadius: 12,
    padding: 18,
    marginVertical: 10,
    width: "100%",
    alignSelf: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemDetail: {
    fontSize: 15,
    color: "#333",
  },
});

export default Results;
