import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Colors } from "../constants/Colors";
import { REMINDER_STATUS } from "../services/reminderService";

export default function ReminderCard({
  reminder,
  onMarkTaken,
  onMarkMissed,
  showActions = true,
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const getStatusColor = (status) => {
    switch (status) {
      case REMINDER_STATUS.TAKEN:
        return Colors.common.reminderTaken;
      case REMINDER_STATUS.MISSED:
        return Colors.common.reminderMissed;
      case REMINDER_STATUS.PENDING:
        return Colors.common.reminderPending;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case REMINDER_STATUS.TAKEN:
        return "✓ Taken";
      case REMINDER_STATUS.MISSED:
        return "✗ Missed";
      case REMINDER_STATUS.PENDING:
        return "⏰ Pending";
      default:
        return "Unknown";
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case REMINDER_STATUS.TAKEN:
        return [Colors.common.reminderTaken, "#2ECC71"];
      case REMINDER_STATUS.MISSED:
        return [Colors.common.reminderMissed, "#E74C3C"];
      case REMINDER_STATUS.PENDING:
        return [Colors.common.reminderPending, "#F39C12"];
      default:
        return [colors.textTertiary, colors.textTertiary];
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (date - now) / (1000 * 60 * 60);

    if (diffInHours < 0) {
      return `Overdue: ${date.toLocaleDateString()} ${date.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;
    } else if (diffInHours < 1) {
      return `Due soon: ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffInHours < 24) {
      return `Today: ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <LinearGradient
        colors={getStatusGradient(reminder.status)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.statusIndicator}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {reminder.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(reminder.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusText(reminder.status)}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {reminder.description}
      </Text>

      <View style={styles.timeContainer}>
        <Text style={[styles.timeLabel, { color: colors.textTertiary }]}>
          Due:
        </Text>
        <Text style={[styles.time, { color: colors.text }]}>
          {formatDateTime(reminder.reminderTime)}
        </Text>
      </View>

      {reminder.patientName && (
        <View style={styles.patientContainer}>
          <Text style={[styles.patientLabel, { color: colors.textTertiary }]}>
            Patient:
          </Text>
          <Text style={[styles.patientInfo, { color: colors.primary }]}>
            {reminder.patientName}
          </Text>
        </View>
      )}

      {showActions && reminder.status === REMINDER_STATUS.PENDING && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.takenButton]}
            onPress={() => onMarkTaken && onMarkTaken(reminder.id)}
          >
            <Text style={styles.actionButtonText}>✓ Mark as Taken</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.missedButton]}
            onPress={() => onMarkMissed && onMarkMissed(reminder.id)}
          >
            <Text style={styles.actionButtonText}>✗ Mark as Missed</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    position: "relative",
  },
  statusIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginRight: 6,
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
  },
  patientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  patientLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginRight: 6,
  },
  patientInfo: {
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  takenButton: {
    backgroundColor: Colors.common.reminderTaken,
  },
  missedButton: {
    backgroundColor: Colors.common.reminderMissed,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
