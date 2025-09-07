import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const q = query(
      collection(db, "users"),
      where("role", "==", role),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get patients linked to a caretaker
export const getCaretakerPatients = async (caretakerId) => {
  try {
    const q = query(
      collection(db, "caretaker_patients"),
      where("caretakerId", "==", caretakerId)
    );
    const querySnapshot = await getDocs(q);
    const patientIds = [];
    querySnapshot.forEach((doc) => {
      patientIds.push(doc.data().patientId);
    });

    if (patientIds.length === 0) {
      return { success: true, data: [] };
    }

    // Get patient details
    const patientsQuery = query(
      collection(db, "users"),
      where("__name__", "in", patientIds)
    );
    const patientsSnapshot = await getDocs(patientsQuery);
    const patients = [];
    patientsSnapshot.forEach((doc) => {
      patients.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: patients };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId, updateData) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      ...updateData,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user statistics (admin)
export const getUserStats = async () => {
  try {
    const usersQuery = query(collection(db, "users"));
    const usersSnapshot = await getDocs(usersQuery);

    let totalUsers = 0;
    let patients = 0;
    let caretakers = 0;

    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      totalUsers++;
      if (data.role === "patient") patients++;
      if (data.role === "caretaker") caretakers++;
    });

    return {
      success: true,
      data: { totalUsers, patients, caretakers },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
