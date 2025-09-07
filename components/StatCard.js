import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

export default function StatCard({
  number,
  label,
  color = null,
  gradient = null,
  sectionIndex = 0, // New prop to identify which section this card belongs to
  cardIndex = 0, // New prop to identify position within the section
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  // Create unified gradient system using the beautiful color palette
  const getGradient = () => {
    if (gradient) return gradient;

    // Create synchronized gradients for each section using the beautiful blue palette
    const gradientSets = {
      // User Statistics Section (3 cards) - Beautiful Blue Palette Progression
      0: [
        ["#10284D", "#20427D"], // Darkest midnight to deep navy - Total Users
        ["#20427D", "#3260A8"], // Deep navy to royal blue - Patients
        ["#3260A8", "#4F82C7"], // Royal blue to medium blue - Caretakers
      ],
      // Reminder Statistics Section (4 cards) - Blue Palette Flow
      1: [
        ["#10284D", "#20427D"], // Midnight to deep navy - Total Reminders
        ["#20427D", "#3260A8"], // Deep navy to royal blue - Completed
        ["#3260A8", "#4F82C7"], // Royal blue to medium blue - Missed
        ["#4F82C7", "#78A9E0"], // Medium blue to cornflower - Pending
      ],
      // Patient Progress Section (4 cards) - Blue Palette Journey
      2: [
        ["#10284D", "#20427D"], // Midnight to deep navy - Total Reminders
        ["#20427D", "#3260A8"], // Deep navy to royal blue - Completed
        ["#3260A8", "#4F82C7"], // Royal blue to medium blue - Missed
        ["#4F82C7", "#78A9E0"], // Medium blue to cornflower - Pending
      ],
    };

    // Get the appropriate gradient set for this section
    const sectionGradients = gradientSets[sectionIndex] || gradientSets[0];

    // Use cardIndex to pick the right gradient within the section
    const index = Math.min(cardIndex, sectionGradients.length - 1);

    return sectionGradients[index];
  };

  const cardColor = color || colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={getGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      />
      <View style={styles.content}>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 70,
  },
  number: {
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 6,
    textAlign: "center",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
    opacity: 0.95,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
