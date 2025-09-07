import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  getCaretakerReminders,
  REMINDER_STATUS,
} from "../../services/reminderService";

export default function AllRemindersScreen({ navigation }) {
  const { userData } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadReminders = async () => {
    if (userData?.uid) {
      console.log("Loading reminders for caretaker:", userData.uid);
      const result = await getCaretakerReminders(userData.uid);
      console.log("Caretaker reminders result:", result);
      if (result.success) {
        console.log("Setting reminders:", result.data);
        setReminders(result.data);
      } else {
        console.error("Failed to load reminders:", result.error);
      }
    } else {
      console.log("No userData.uid available");
    }
  };

  useEffect(() => {
    loadReminders();
  }, [userData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReminders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case REMINDER_STATUS.TAKEN:
        return "#27ae60";
      case REMINDER_STATUS.MISSED:
        return "#e74c3c";
      case REMINDER_STATUS.PENDING:
        return "#f39c12";
      default:
        return "#7f8c8d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case REMINDER_STATUS.TAKEN:
        return "Taken";
      case REMINDER_STATUS.MISSED:
        return "Missed";
      case REMINDER_STATUS.PENDING:
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const renderReminderItem = ({ item }) => (
    <View style={styles.reminderCard}>
      <View style={styles.reminderHeader}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.reminderDescription}>{item.description}</Text>
      <Text style={styles.reminderTime}>
        Due: {formatDateTime(item.reminderTime)}
      </Text>
      <Text style={styles.patientInfo}>
        Patient: {item.patientName || "Unknown"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>All Patient Reminders</Text>
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={renderReminderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reminders found</Text>
            <Text style={styles.emptySubtext}>
              Make sure patients are linked to your account
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  listContainer: {
    padding: 15,
  },
  reminderCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  reminderDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  reminderTime: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 5,
  },
  patientInfo: {
    fontSize: 12,
    color: "#3498db",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#95a5a6",
    textAlign: "center",
  },
});
