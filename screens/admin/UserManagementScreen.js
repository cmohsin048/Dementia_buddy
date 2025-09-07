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
import { SafeAreaView } from "react-native-safe-area-context";
import { updateUserRole, USER_ROLES } from "../../services/authService";
import { getAllUsers } from "../../services/userService";

export default function UserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data);
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

  const getRoleColor = (role) => {
    switch (role) {
      case "patient":
        return "#3498db";
      case "caretaker":
        return "#9b59b6";
      case "admin":
        return "#e74c3c";
      default:
        return "#7f8c8d";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleRoleChange = async (userId, currentRole) => {
    const roles = Object.values(USER_ROLES);
    const currentIndex = roles.indexOf(currentRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];

    Alert.alert(
      "Change User Role",
      `Change role from ${currentRole} to ${nextRole}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            const result = await updateUserRole(userId, nextRole);
            if (result.success) {
              Alert.alert("Success", "User role updated successfully");
              loadUsers(); // Refresh the list
            } else {
              Alert.alert("Error", result.error);
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <Text style={styles.userName}>{item.name}</Text>
        <TouchableOpacity
          style={[
            styles.roleBadge,
            { backgroundColor: getRoleColor(item.role) },
          ]}
          onPress={() => handleRoleChange(item.id, item.role)}
        >
          <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.userEmail}>{item.email}</Text>
      {item.phone && <Text style={styles.userPhone}>{item.phone}</Text>}
      <Text style={styles.userDate}>Joined: {formatDate(item.createdAt)}</Text>
      <Text style={styles.tapHint}>Tap role badge to change</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  userCard: {
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
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  userDate: {
    fontSize: 12,
    color: "#95a5a6",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  tapHint: {
    fontSize: 12,
    color: "#95a5a6",
    fontStyle: "italic",
    marginTop: 5,
  },
});
