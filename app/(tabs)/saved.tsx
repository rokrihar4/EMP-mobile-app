import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const DATA = [
  { id: "1", title: "Mon" },
  { id: "2", title: "Tue" },
  { id: "3", title: "Wed" },
  { id: "4", title: "Thu" },
  { id: "5", title: "Fri" },
  { id: "6", title: "Sat" },
  { id: "7", title: "Sun" },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    marginTop: StatusBar.currentHeight || 0,
  },
  row:{
    flexDirection: "row", // put children side by side
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "#cefae0",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginHorizontal: 4,
    height: '8%'
  },
  cardText: {
    fontSize: 24,
  },
  title: {
    fontSize: 36,
    marginVertical: 20,
  },
});

const saved = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Saved</Text>

        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{item.title}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default saved;
