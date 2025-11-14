import React, { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableHighlight, View } from "react-native";
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
    padding: 10,
    marginTop: StatusBar.currentHeight || 0,
  },
  row:{
    flexDirection: "row",
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
  },
  cardText: {
    fontSize: 24,
  },
  title: {
    fontSize: 36,
    marginVertical: 20,
  },
  countText: {
    color: '#FF00FF',
  },
  containerCount: {
    flex: 1,
    
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  countContainer: {
    display: "flex",
    padding: 10,
  },
  addSubtract: {
    backgroundColor: "#8c8d8eff",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginHorizontal: 4,
    width: 30,
  },
   mealContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#8c8d8eff",
  },
  mealText: {
    fontWeight: "bold",      // ne fontStyle, ampak fontWeight
    fontSize: 28,
  },
  foodText: {
    fontWeight: "bold",
    color: "green",          // tintColor je za <Image />, ne za <Text />
    fontSize: 28,
  },
});

const items = ["Meal", "food",];

const saved = () => {
  const [count, setCount] = useState(0);
  const addOnPress = () => setCount(count + 1);
  const subtractOnPress = () => setCount(count - 1);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Saved</Text>

        <FlatList
          data={DATA}
          renderItem={({ item }) => (
            <TouchableHighlight >
              <View style={styles.card}>
                <Text style={styles.cardText}>{item.title}</Text>
              </View>
            </TouchableHighlight>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        {/*
        TO LAHK DODAVA ČE BI RES HOTLA
        <View style={styles.countContainer}>
          <Text>Number of meals: {count}</Text>
          <TouchableHighlight >
            <View >
              <Text style={styles.addSubtract} onPress={addOnPress}>+</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight>
            <View >
              <Text style={styles.addSubtract} onPress={subtractOnPress}>-</Text>
            </View>
          </TouchableHighlight>
        </View> */}
        
        <View style={styles.mealContainer}>
          <Text style={styles.mealText}>Breakfast</Text>
          <TouchableHighlight>
            <Text style={styles.foodText}>Add food</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.mealContainer}>
          <Text style={styles.mealText}>Lunch</Text>
          <TouchableHighlight>
            <Text style={styles.foodText}>Add food</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.mealContainer}>
          <Text style={styles.mealText}>Dinner</Text>
          <TouchableHighlight>
            <Text style={styles.foodText}>Add food</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.mealContainer}>
          <Text style={styles.mealText}>Snacks</Text>
          <TouchableHighlight>
            <Text style={styles.foodText}>Add food</Text>
          </TouchableHighlight>
        </View>
          
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


export default saved;
