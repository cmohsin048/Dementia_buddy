import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Check if notifications are supported
const isNotificationSupported = () => {
  // Notifications don't work in Expo Go (SDK 53+), only in development builds
  return Device.isDevice && !__DEV__ && Constants.appOwnership !== "expo";
};

// Configure notification behavior only if supported
if (isNotificationSupported()) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (error) {
    console.log(
      "Notifications not supported in this environment:",
      error.message
    );
  }
}

// Register for push notifications
export const registerForPushNotificationsAsync = async () => {
  if (!isNotificationSupported()) {
    console.log("Push notifications not supported in this environment");
    return null;
  }

  let token;

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;
  } catch (error) {
    console.log("Error registering for push notifications:", error.message);
    return null;
  }

  return token;
};

// Send local notification
export const sendLocalNotification = async (title, body, data = {}) => {
  if (!isNotificationSupported()) {
    console.log("Local notifications not supported in this environment");
    return;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.log("Error sending local notification:", error.message);
  }
};

// Schedule notification for specific time
export const scheduleNotification = async (
  title,
  body,
  triggerDate,
  data = {}
) => {
  if (!isNotificationSupported()) {
    console.log("Scheduled notifications not supported in this environment");
    return null;
  }

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: triggerDate,
    });
  } catch (error) {
    console.log("Error scheduling notification:", error.message);
    return null;
  }
};

// Cancel notification
export const cancelNotification = async (notificationId) => {
  if (!isNotificationSupported()) {
    console.log("Cancel notifications not supported in this environment");
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.log("Error canceling notification:", error.message);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  if (!isNotificationSupported()) {
    console.log("Cancel all notifications not supported in this environment");
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.log("Error canceling all notifications:", error.message);
  }
};

// Get notification permissions
export const getNotificationPermissions = async () => {
  if (!isNotificationSupported()) {
    return { status: "denied" };
  }

  try {
    return await Notifications.getPermissionsAsync();
  } catch (error) {
    console.log("Error getting notification permissions:", error.message);
    return { status: "denied" };
  }
};

// Request notification permissions
export const requestNotificationPermissions = async () => {
  if (!isNotificationSupported()) {
    return { status: "denied" };
  }

  try {
    return await Notifications.requestPermissionsAsync();
  } catch (error) {
    console.log("Error requesting notification permissions:", error.message);
    return { status: "denied" };
  }
};
