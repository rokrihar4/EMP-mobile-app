import { View, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#00C851", //active (focused) label color
        tabBarInactiveTintColor: "#999999", // inactive label color
      }}
    >
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? require("../../assets/images/favourites_gray.png")
                    : require("../../assets/images/favourites.png")
                }
                style={{ width: 24, height: 24 }}
              />
            </>
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: () => null, // hides text
          title: "Index",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#00C851", // bright green
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 30, // lift it up a bit
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 3.5,
                elevation: 5,
              }}
            >
              <Image
                source={
                  focused
                    ? require("../../assets/images/add.png")
                    : require("../../assets/images/add.png")
                }
                style={{ width: 24, height: 24 }}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={
                  focused
                    ? require("../../assets/images/library_gray.png")
                    : require("../../assets/images/library.png")
                }
                style={{ width: 24, height: 24 }}
              />
            </>
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
