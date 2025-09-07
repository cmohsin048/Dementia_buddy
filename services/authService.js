import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const USER_ROLES = {
  PATIENT: "patient",
  CARETAKER: "caretaker",
  ADMIN: "admin",
};

// Create user account with role (without auto sign-in)
export const createUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: userData.role,
      name: userData.name,
      phone: userData.phone || "",
      createdAt: new Date().toISOString(),
      ...userData,
    });

    // Sign out the user immediately after creation
    await signOut(auth);

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user data from Firestore
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: "User data not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Update user role (admin only)
export const updateUserRole = async (userId, newRole) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      role: newRole,
      updatedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Link caretaker to patient
export const linkCaretakerToPatient = async (caretakerId, patientId) => {
  try {
    await setDoc(doc(db, "caretaker_patients", `${caretakerId}_${patientId}`), {
      caretakerId,
      patientId,
      linkedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Unlink caretaker from patient
export const unlinkCaretakerFromPatient = async (caretakerId, patientId) => {
  try {
    await deleteDoc(
      doc(db, "caretaker_patients", `${caretakerId}_${patientId}`)
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get caretaker's linked patients
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

    // Get patient details
    const patients = [];
    for (const patientId of patientIds) {
      const userDoc = await getDoc(doc(db, "users", patientId));
      if (userDoc.exists()) {
        patients.push({ id: userDoc.id, ...userDoc.data() });
      }
    }

    return { success: true, data: patients };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get caretakers linked to a patient
export const getPatientCaretakers = async (patientId) => {
  try {
    const q = query(
      collection(db, "caretaker_patients"),
      where("patientId", "==", patientId)
    );
    const querySnapshot = await getDocs(q);
    const caretakerIds = [];
    querySnapshot.forEach((doc) => {
      caretakerIds.push(doc.data().caretakerId);
    });

    // Get caretaker details
    const caretakers = [];
    for (const caretakerId of caretakerIds) {
      const userDoc = await getDoc(doc(db, "users", caretakerId));
      if (userDoc.exists()) {
        caretakers.push({ id: userDoc.id, ...userDoc.data() });
      }
    }

    return { success: true, data: caretakers };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
