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
import { Colors } from "../../constants/Colors";
import { useAuth } from "../../contexts/AuthContext";
import { getCaretakerPatients, signOutUser } from "../../services/authService";

export default function CaretakerHomeScreen({ navigation }) {
  const { userData } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [patients, setPatients] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPatients = async () => {
    if (userData?.uid) {
      const result = await getCaretakerPatients(userData.uid);
      if (result.success) {
        setPatients(result.data);
      }
    }
  };

  useEffect(() => {
    loadPatients();
  }, [userData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatients();
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
                Monitor and support your patients' care
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

        {/* Patients Section */}
        <View style={styles.patientsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Patients
          </Text>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <TouchableOpacity
                key={patient.id}
                style={[
                  styles.patientCard,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() =>
                  navigation.navigate("PatientReminders", { patient })
                }
              >
                <View style={styles.patientInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>
                    {patient.name}
                  </Text>
                  <Text
                    style={[
                      styles.patientEmail,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {patient.email}
                  </Text>
                  {patient.phone && (
                    <Text
                      style={[
                        styles.patientPhone,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {patient.phone}
                    </Text>
                  )}
                </View>
                <View style={styles.viewRemindersContainer}>
                  <Text
                    style={[
                      styles.viewRemindersText,
                      { color: colors.primary },
                    ]}
                  >
                    View Reminders
                  </Text>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View
              style={[
                styles.emptyContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No patients linked yet
              </Text>
              <Text
                style={[styles.emptySubtext, { color: colors.textTertiary }]}
              >
                Contact your administrator to link patients to your account
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("AllReminders")}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonText}>📋 View All Reminders</Text>
            </LinearGradient>
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backdropFilter: "blur(10px)",
  },
  signOutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  patientsContainer: {
    margin: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  patientCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  patientEmail: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "500",
  },
  patientPhone: {
    fontSize: 14,
    fontWeight: "500",
  },
  viewRemindersContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewRemindersText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 8,
  },
  actionButton: {
    borderRadius: 16,
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
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
