import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

// Patient Screens
import CreateReminderScreen from "../screens/patient/CreateReminderScreen";
import PatientHomeScreen from "../screens/patient/PatientHomeScreen";
import ReminderListScreen from "../screens/patient/ReminderListScreen";

// Caretaker Screens
import AllRemindersScreen from "../screens/caretaker/AllRemindersScreen";
import CaretakerHomeScreen from "../screens/caretaker/CaretakerHomeScreen";
import PatientRemindersScreen from "../screens/caretaker/PatientRemindersScreen";

// Admin Screens
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminAllRemindersScreen from "../screens/admin/AllRemindersScreen";
import LinkCaretakersScreen from "../screens/admin/LinkCaretakersScreen";
import UserManagementScreen from "../screens/admin/UserManagementScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isPatient, isCaretaker, isAdmin, loading } =
    useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : isPatient ? (
          // Patient Stack
          <>
            <Stack.Screen name="PatientHome" component={PatientHomeScreen} />
            <Stack.Screen
              name="CreateReminder"
              component={CreateReminderScreen}
            />
            <Stack.Screen name="ReminderList" component={ReminderListScreen} />
          </>
        ) : isCaretaker ? (
          // Caretaker Stack
          <>
            <Stack.Screen
              name="CaretakerHome"
              component={CaretakerHomeScreen}
            />
            <Stack.Screen
              name="PatientReminders"
              component={PatientRemindersScreen}
            />
            <Stack.Screen name="AllReminders" component={AllRemindersScreen} />
          </>
        ) : isAdmin ? (
          // Admin Stack
          <>
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
            />
            <Stack.Screen
              name="UserManagement"
              component={UserManagementScreen}
            />
            <Stack.Screen
              name="AllReminders"
              component={AdminAllRemindersScreen}
            />
            <Stack.Screen
              name="LinkCaretakers"
              component={LinkCaretakersScreen}
            />
          </>
        ) : (
          // Fallback - if user is authenticated but role is not recognized
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
