import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";

const results = () => {
  const { data } = useLocalSearchParams();

  // Parse the JSON string that was passed
  const meals = JSON.parse(data || "[]");
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={meals}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
});

export default results;
