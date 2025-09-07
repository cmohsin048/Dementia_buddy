import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import {
  getCaretakerPatients,
  linkCaretakerToPatient,
  unlinkCaretakerFromPatient,
} from "../../services/authService";
import { getAllUsers } from "../../services/userService";

export default function LinkCaretakersScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [caretakers, setCaretakers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [linkedPatients, setLinkedPatients] = useState({});
  const [showCaretakerDetails, setShowCaretakerDetails] = useState(false);
  const [selectedCaretakerForDetails, setSelectedCaretakerForDetails] =
    useState(null);

  const loadUsers = async () => {
    const result = await getAllUsers();
    if (result.success) {
      const allUsers = result.data;
      setCaretakers(allUsers.filter((user) => user.role === "caretaker"));
      setPatients(allUsers.filter((user) => user.role === "patient"));

      // Load linked patients for each caretaker
      const links = {};
      for (const caretaker of allUsers.filter(
        (user) => user.role === "caretaker"
      )) {
        const linkedResult = await getCaretakerPatients(caretaker.id);
        if (linkedResult.success) {
          links[caretaker.id] = linkedResult.data;
        }
      }
      setLinkedPatients(links);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleLinkCaretaker = async (caretakerId, patientId) => {
    const result = await linkCaretakerToPatient(caretakerId, patientId);
    if (result.success) {
      Alert.alert("Success", "Caretaker linked to patient successfully!");
      loadUsers(); // Refresh the list
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const handleUnlinkCaretaker = async (caretakerId, patientId) => {
    Alert.alert(
      "Unlink Caretaker",
      "Are you sure you want to unlink this caretaker from the patient?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => {
            const result = await unlinkCaretakerFromPatient(
              caretakerId,
              patientId
            );
            if (result.success) {
              Alert.alert(
                "Success",
                "Caretaker unlinked from patient successfully!"
              );
              loadUsers();
            } else {
              Alert.alert("Error", result.error);
            }
          },
        },
      ]
    );
  };

  const handleCaretakerClick = (caretaker) => {
    setSelectedCaretakerForDetails(caretaker);
    setPatientSearchQuery(""); // Reset patient search when opening modal
    setShowCaretakerDetails(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "patient":
        return "#3498db";
      case "caretaker":
        return "#9b59b6";
      default:
        return "#7f8c8d";
    }
  };

  const filteredCaretakers = caretakers.filter(
    (caretaker) =>
      caretaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caretaker.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(patientSearchQuery.toLowerCase())
  );

  const renderCaretakerListItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.caretakerListItem, { backgroundColor: colors.surface }]}
      onPress={() => handleCaretakerClick(item)}
    >
      <View style={styles.caretakerListItemInfo}>
        <Text style={[styles.caretakerListItemName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text
          style={[
            styles.caretakerListItemEmail,
            { color: colors.textSecondary },
          ]}
        >
          {item.email}
        </Text>
        <Text
          style={[styles.caretakerListItemCount, { color: colors.primary }]}
        >
          Linked to {linkedPatients[item.id]?.length || 0} patients
        </Text>
      </View>
      <Text style={[styles.caretakerListItemArrow, { color: colors.primary }]}>
        →
      </Text>
    </TouchableOpacity>
  );

  const renderLinkedPatientItem = ({ item }) => (
    <View style={styles.linkedPatientCard}>
      <View style={styles.linkedPatientInfo}>
        <Text style={styles.linkedPatientName}>{item.name}</Text>
        <Text style={styles.linkedPatientEmail}>{item.email}</Text>
        {item.phone && (
          <Text style={styles.linkedPatientPhone}>{item.phone}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.unlinkButton}
        onPress={() =>
          handleUnlinkCaretaker(selectedCaretakerForDetails.id, item.id)
        }
      >
        <Text style={styles.actionButtonText}>Unlink</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header with gradient background */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Link Caretakers to Patients</Text>
          <Text style={styles.subtitle}>
            Manage caretaker-patient relationships
          </Text>
        </View>
      </LinearGradient>

      {/* Search Field */}
      <View style={[styles.searchSection, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Search caretakers by name or email..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Caretakers List */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Caretakers
        </Text>
        <FlatList
          data={filteredCaretakers}
          keyExtractor={(item) => item.id}
          renderItem={renderCaretakerListItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.caretakerListContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No caretakers found matching your search"
                  : "No caretakers found"}
              </Text>
            </View>
          }
        />
      </View>

      {/* Caretaker Details Modal */}
      {showCaretakerDetails && selectedCaretakerForDetails && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedCaretakerForDetails.name}'s Patients
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowCaretakerDetails(false);
                  setSelectedCaretakerForDetails(null);
                }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Linked Patients */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Linked Patients</Text>
              {linkedPatients[selectedCaretakerForDetails.id]?.length > 0 ? (
                <View style={styles.linkedPatientsContainer}>
                  <FlatList
                    data={linkedPatients[selectedCaretakerForDetails.id]}
                    keyExtractor={(item) => item.id}
                    renderItem={renderLinkedPatientItem}
                    contentContainerStyle={styles.linkedPatientsList}
                    showsVerticalScrollIndicator={true}
                    indicatorStyle="black"
                  />
                  {linkedPatients[selectedCaretakerForDetails.id]?.length >
                    3 && (
                    <View style={styles.scrollIndicator}>
                      <Text style={styles.scrollIndicatorText}>
                        ↓ Scroll to see more
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No patients linked yet</Text>
                </View>
              )}
            </View>

            {/* Search and Link New Patients */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Link New Patients</Text>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search patients by name or email..."
                value={patientSearchQuery}
                onChangeText={setPatientSearchQuery}
              />
              <View style={styles.availablePatientsContainer}>
                <FlatList
                  data={filteredPatients.filter(
                    (patient) =>
                      !linkedPatients[selectedCaretakerForDetails.id]?.some(
                        (linked) => linked.id === patient.id
                      )
                  )}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.patientCard}>
                      <View style={styles.patientInfo}>
                        <Text style={styles.patientName}>{item.name}</Text>
                        <Text style={styles.patientEmail}>{item.email}</Text>
                        {item.phone && (
                          <Text style={styles.patientPhone}>{item.phone}</Text>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() =>
                          handleLinkCaretaker(
                            selectedCaretakerForDetails.id,
                            item.id
                          )
                        }
                      >
                        <Text style={styles.actionButtonText}>Link</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={styles.patientList}
                  showsVerticalScrollIndicator={true}
                  indicatorStyle="black"
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>
                        {patientSearchQuery
                          ? "No patients found matching your search"
                          : "No patients available to link"}
                      </Text>
                    </View>
                  }
                />
                {filteredPatients.filter(
                  (patient) =>
                    !linkedPatients[selectedCaretakerForDetails.id]?.some(
                      (linked) => linked.id === patient.id
                    )
                ).length > 4 && (
                  <View style={styles.scrollIndicator}>
                    <Text style={styles.scrollIndicatorText}>
                      ↓ Scroll to see more
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  searchInput: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modalSearchInput: {
    backgroundColor: "white",
    padding: 15,
    marginHorizontal: 0,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  patientList: {
    paddingHorizontal: 0,
  },
  patientCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  patientEmail: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  patientPhone: {
    fontSize: 12,
    color: "#95a5a6",
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    minWidth: 80,
  },
  linkButton: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  unlinkButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  // Search section
  searchSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  // New styles for caretaker list and modal
  caretakerListContainer: {
    paddingHorizontal: 0,
  },
  caretakerListItem: {
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
  caretakerListItemInfo: {
    flex: 1,
  },
  caretakerListItemName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  caretakerListItemEmail: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },
  caretakerListItemCount: {
    fontSize: 13,
    fontWeight: "600",
  },
  caretakerListItemArrow: {
    fontSize: 20,
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxHeight: "80%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  closeButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#e74c3c",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  linkedPatientsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  linkedPatientsList: {
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  availablePatientsContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  linkedPatientCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  linkedPatientInfo: {
    flex: 1,
  },
  linkedPatientName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 2,
  },
  linkedPatientEmail: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  linkedPatientPhone: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  scrollIndicator: {
    backgroundColor: "#e8f4fd",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#d1ecf1",
    alignItems: "center",
  },
  scrollIndicatorText: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "500",
  },
});
