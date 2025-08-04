import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet } from "react-native";

const TabsLayout = () => {

  const{colors} = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',

        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 60,
          borderRadius: 20,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(139, 92, 246, 0.9)', 'rgba(124, 58, 237, 0.9)']}
            style={{
              flex: 1,
              borderRadius: 20,
              borderWidth: 0.5,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              padding: 6,
              borderRadius: 10,
            }}>
              <Ionicons 
                name={focused ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={20} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              padding: 6,
              borderRadius: 10,
            }}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={20} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
