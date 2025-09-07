import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "../../components/StatCard";
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";
import { signOutUser } from "../../services/authService";
import { getReminderStats } from "../../services/reminderService";

export default function PatientHomeScreen({ navigation }) {
  const { userData } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [stats, setStats] = useState({
    total: 0,
    taken: 0,
    missed: 0,
    pending: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    if (userData?.uid) {
      const result = await getReminderStats(userData.uid);
      if (result.success) {
        setStats(result.data);
      }
    }
  };

  useEffect(() => {
    loadStats();
  }, [userData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header with gradient background */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome, {userData?.name}!</Text>
              <Text style={styles.subtitleText}>
                Let's manage your daily reminders together
              </Text>
            </View>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Progress Statistics Section */}
        <View style={styles.statsContainer}>
          <Text style={[styles.statsTitle, { color: colors.text }]}>
            Your Progress
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              number={stats.total}
              label="Total Reminders"
              sectionIndex={2}
              cardIndex={0}
            />
            <StatCard
              number={stats.taken}
              label="Completed"
              sectionIndex={2}
              cardIndex={1}
            />
            <StatCard
              number={stats.missed}
              label="Missed"
              sectionIndex={2}
              cardIndex={2}
            />
            <StatCard
              number={stats.pending}
              label="Pending"
              sectionIndex={2}
              cardIndex={3}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("CreateReminder")}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonText}>
                ➕ Create New Reminder
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.secondaryButton,
              { borderColor: colors.primary },
            ]}
            onPress={() => navigation.navigate("ReminderList")}
          >
            <Text
              style={[
                styles.actionButtonText,
                styles.secondaryButtonText,
                { color: colors.primary },
              ]}
            >
              📋 View All Reminders
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  signOutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    margin: 20,
    marginTop: 24,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 8,
  },
  actionButton: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
