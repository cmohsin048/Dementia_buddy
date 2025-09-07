import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPatientReminders,
  REMINDER_STATUS,
  updateReminderStatus,
} from "../../services/reminderService";

export default function ReminderListScreen({ navigation }) {
  const { userData } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadReminders = async () => {
    if (userData?.uid) {
      console.log("Loading reminders for patient:", userData.uid);
      const result = await getPatientReminders(userData.uid);
      console.log("Patient reminders result:", result);
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

  const handleMarkAsTaken = async (reminderId) => {
    const result = await updateReminderStatus(
      reminderId,
      REMINDER_STATUS.TAKEN
    );
    if (result.success) {
      await loadReminders();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const handleMarkAsMissed = async (reminderId) => {
    const result = await updateReminderStatus(
      reminderId,
      REMINDER_STATUS.MISSED
    );
    if (result.success) {
      await loadReminders();
    } else {
      Alert.alert("Error", result.error);
    }
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

      {item.status === REMINDER_STATUS.PENDING && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.takenButton]}
            onPress={() => handleMarkAsTaken(item.id)}
          >
            <Text style={styles.actionButtonText}>Mark as Taken</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.missedButton]}
            onPress={() => handleMarkAsMissed(item.id)}
          >
            <Text style={styles.actionButtonText}>Mark as Missed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reminders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("CreateReminder")}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
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
            <Text style={styles.emptyText}>No reminders yet</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate("CreateReminder")}
            >
              <Text style={styles.emptyButtonText}>
                Create your first reminder
              </Text>
            </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  addButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
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
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  takenButton: {
    backgroundColor: "#27ae60",
  },
  missedButton: {
    backgroundColor: "#e74c3c",
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
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
