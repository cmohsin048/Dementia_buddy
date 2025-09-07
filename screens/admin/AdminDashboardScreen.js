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
import { getAllReminders } from "../../services/reminderService";
import { getUserStats } from "../../services/userService";

export default function AdminDashboardScreen({ navigation }) {
  const { userData } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    patients: 0,
    caretakers: 0,
  });
  const [reminderStats, setReminderStats] = useState({
    total: 0,
    taken: 0,
    missed: 0,
    pending: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const userStatsResult = await getUserStats();
    if (userStatsResult.success) {
      setUserStats(userStatsResult.data);
    }

    const remindersResult = await getAllReminders();
    if (remindersResult.success) {
      const reminders = remindersResult.data;
      let total = reminders.length;
      let taken = 0;
      let missed = 0;
      let pending = 0;

      reminders.forEach((reminder) => {
        switch (reminder.status) {
          case "taken":
            taken++;
            break;
          case "missed":
            missed++;
            break;
          case "pending":
            pending++;
            break;
        }
      });

      setReminderStats({ total, taken, missed, pending });
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

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
              <Text style={styles.welcomeText}>Admin Dashboard</Text>
              <Text style={styles.subtitleText}>
                System Overview & Management
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

        {/* User Statistics Section */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            User Statistics
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              number={userStats.totalUsers}
              label="Total Users"
              sectionIndex={0}
              cardIndex={0}
            />
            <StatCard
              number={userStats.patients}
              label="Patients"
              sectionIndex={0}
              cardIndex={1}
            />
            <StatCard
              number={userStats.caretakers}
              label="Caretakers"
              sectionIndex={0}
              cardIndex={2}
            />
          </View>
        </View>

        {/* Reminder Statistics Section */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Reminder Statistics
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              number={reminderStats.total}
              label="Total Reminders"
              sectionIndex={1}
              cardIndex={0}
            />
            <StatCard
              number={reminderStats.taken}
              label="Completed"
              sectionIndex={1}
              cardIndex={1}
            />
            <StatCard
              number={reminderStats.missed}
              label="Missed"
              sectionIndex={1}
              cardIndex={2}
            />
            <StatCard
              number={reminderStats.pending}
              label="Pending"
              sectionIndex={1}
              cardIndex={3}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("UserManagement")}
          >
            <LinearGradient
              colors={["#10284D", "#20427D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonText}>Manage Users</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate("AllReminders")}
          >
            <Text
              style={[
                styles.actionButtonText,
                styles.secondaryButtonText,
                { color: colors.primary },
              ]}
            >
              View All Reminders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate("LinkCaretakers")}
          >
            <Text
              style={[
                styles.actionButtonText,
                styles.secondaryButtonText,
                { color: colors.primary },
              ]}
            >
              Link Caretakers
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
  },
  sectionTitle: {
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
    borderRadius: 16,
    marginBottom: 16,
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
