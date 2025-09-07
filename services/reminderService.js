import * as Notifications from "expo-notifications";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getPatientCaretakers } from "./authService";
import { db } from "./firebaseConfig";

export const REMINDER_STATUS = {
  PENDING: "pending",
  TAKEN: "taken",
  MISSED: "missed",
};

// Create a new reminder
export const createReminder = async (reminderData) => {
  try {
    const reminder = {
      ...reminderData,
      status: REMINDER_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "reminders"), reminder);

    // Schedule notification
    await scheduleReminderNotification(docRef.id, reminder);

    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update reminder status
export const updateReminderStatus = async (reminderId, status) => {
  try {
    await updateDoc(doc(db, "reminders", reminderId), {
      status,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete reminder
export const deleteReminder = async (reminderId) => {
  try {
    await deleteDoc(doc(db, "reminders", reminderId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get reminders for a patient
export const getPatientReminders = async (patientId) => {
  try {
    console.log("Getting reminders for patient:", patientId);
    const q = query(
      collection(db, "reminders"),
      where("patientId", "==", patientId)
    );
    const querySnapshot = await getDocs(q);
    const reminders = [];
    querySnapshot.forEach((doc) => {
      console.log("Patient found reminder:", doc.id, doc.data());
      reminders.push({ id: doc.id, ...doc.data() });
    });

    // Sort by reminder time after fetching
    reminders.sort(
      (a, b) => new Date(a.reminderTime) - new Date(b.reminderTime)
    );

    console.log("Total patient reminders found:", reminders.length);
    return { success: true, data: reminders };
  } catch (error) {
    console.error("Error getting patient reminders:", error);
    return { success: false, error: error.message };
  }
};

// Get reminders for a caretaker (linked patients)
export const getCaretakerReminders = async (caretakerId) => {
  try {
    console.log("Getting reminders for caretaker:", caretakerId);
    // First get linked patients
    const patientsQuery = query(
      collection(db, "caretaker_patients"),
      where("caretakerId", "==", caretakerId)
    );
    const patientsSnapshot = await getDocs(patientsQuery);
    const patientIds = [];
    patientsSnapshot.forEach((doc) => {
      console.log("Caretaker linked to patient:", doc.data().patientId);
      patientIds.push(doc.data().patientId);
    });

    console.log("Caretaker linked to patients:", patientIds);

    if (patientIds.length === 0) {
      console.log("No patients linked to caretaker");
      return { success: true, data: [] };
    }

    // Get reminders for linked patients (without orderBy to avoid index requirement)
    const remindersQuery = query(
      collection(db, "reminders"),
      where("patientId", "in", patientIds)
    );
    const remindersSnapshot = await getDocs(remindersQuery);
    const reminders = [];
    remindersSnapshot.forEach((doc) => {
      console.log("Caretaker found reminder:", doc.id, doc.data());
      reminders.push({ id: doc.id, ...doc.data() });
    });

    // Sort by reminder time after fetching
    reminders.sort(
      (a, b) => new Date(a.reminderTime) - new Date(b.reminderTime)
    );

    console.log("Total caretaker reminders found:", reminders.length);
    return { success: true, data: reminders };
  } catch (error) {
    console.error("Error getting caretaker reminders:", error);
    return { success: false, error: error.message };
  }
};

// Get all reminders (admin)
export const getAllReminders = async () => {
  try {
    console.log("Getting all reminders...");
    const q = query(collection(db, "reminders"));
    const querySnapshot = await getDocs(q);
    const reminders = [];
    querySnapshot.forEach((doc) => {
      console.log("Admin found reminder:", doc.id, doc.data());
      reminders.push({ id: doc.id, ...doc.data() });
    });

    // Sort by creation time after fetching
    reminders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("Total admin reminders found:", reminders.length);
    return { success: true, data: reminders };
  } catch (error) {
    console.error("Error getting all reminders:", error);
    return { success: false, error: error.message };
  }
};

// Real-time listener for reminders
export const subscribeToReminders = (patientId, callback) => {
  const q = query(
    collection(db, "reminders"),
    where("patientId", "==", patientId)
  );

  return onSnapshot(q, (querySnapshot) => {
    const reminders = [];
    querySnapshot.forEach((doc) => {
      reminders.push({ id: doc.id, ...doc.data() });
    });

    // Sort by reminder time after fetching
    reminders.sort(
      (a, b) => new Date(a.reminderTime) - new Date(b.reminderTime)
    );

    callback(reminders);
  });
};

// Schedule notification for reminder
const scheduleReminderNotification = async (reminderId, reminder) => {
  try {
    const trigger = new Date(reminder.reminderTime);
    const now = new Date();

    if (trigger > now) {
      // Schedule notification for patient
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder: " + reminder.title,
          body: reminder.description,
          data: { reminderId, patientId: reminder.patientId },
        },
        trigger,
      });

      // Schedule notification for linked caretakers
      await scheduleCaretakerNotifications(reminderId, reminder);
    }
  } catch (error) {
    console.log(
      "Notification scheduling not available in this environment:",
      error.message
    );
    // Don't throw error, just log it - notifications are optional
  }
};

// Schedule notifications for caretakers linked to the patient
const scheduleCaretakerNotifications = async (reminderId, reminder) => {
  try {
    // Get caretakers linked to this patient
    const result = await getPatientCaretakers(reminder.patientId);

    if (result.success && result.data.length > 0) {
      const trigger = new Date(reminder.reminderTime);

      // Schedule notification for each linked caretaker
      for (const caretaker of result.data) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Patient Reminder: ${reminder.title}`,
            body: `Patient ${
              reminder.patientName || "Unknown"
            } has a reminder: ${reminder.description}`,
            data: {
              reminderId,
              patientId: reminder.patientId,
              caretakerId: caretaker.id,
              type: "caretaker_notification",
            },
          },
          trigger,
        });
      }
    }
  } catch (error) {
    console.log("Error scheduling caretaker notifications:", error.message);
  }
};

// Test function to get all reminders without any filters
export const testGetAllReminders = async () => {
  try {
    console.log("Testing: Getting all reminders without filters...");
    const querySnapshot = await getDocs(collection(db, "reminders"));
    const reminders = [];
    querySnapshot.forEach((doc) => {
      console.log("Test found reminder:", doc.id, doc.data());
      reminders.push({ id: doc.id, ...doc.data() });
    });
    console.log("Test total reminders found:", reminders.length);
    return { success: true, data: reminders };
  } catch (error) {
    console.error("Test error getting all reminders:", error);
    return { success: false, error: error.message };
  }
};

// Get reminder statistics
export const getReminderStats = async (patientId) => {
  try {
    console.log("Getting reminder stats for patient:", patientId);
    const q = query(
      collection(db, "reminders"),
      where("patientId", "==", patientId)
    );
    const querySnapshot = await getDocs(q);

    let total = 0;
    let taken = 0;
    let missed = 0;
    let pending = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Stats reminder:", doc.id, data.status);
      total++;
      switch (data.status) {
        case REMINDER_STATUS.TAKEN:
          taken++;
          break;
        case REMINDER_STATUS.MISSED:
          missed++;
          break;
        case REMINDER_STATUS.PENDING:
          pending++;
          break;
      }
    });

    console.log("Reminder stats:", { total, taken, missed, pending });
    return {
      success: true,
      data: { total, taken, missed, pending },
    };
  } catch (error) {
    console.error("Error getting reminder stats:", error);
    return { success: false, error: error.message };
  }
};
