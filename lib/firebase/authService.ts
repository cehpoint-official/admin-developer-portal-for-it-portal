import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

import { useAuthStore, UserProfile, UserRole } from "../store/userStore";
import { auth, db } from "@/firebase";

// Create a new user account (client only)
export const createUserAccount = async (
  email: string,
  password: string,
  name: string,
  phone: string
): Promise<UserProfile> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      name: name,
      phone: phone,
      avatar: null,
      role: "client", // Only clients can sign up
      createdAt: Date.now(),
      lastLogin: Date.now(),
    };

    // Save to Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return userProfile;
  } catch (error: any) {
    console.error("Error creating user account:", error);
    throw new Error(error.message || "Failed to create account");
  }
};

// Sign in with email/password (all user types)
export const signInWithEmail = async (
  email: string,
  password: string,
  role: UserRole
): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data() as UserProfile;

    // Verify role
    if (userData.role !== role) {
      await signOut(auth); // Sign out if wrong role
      throw new Error(`You do not have ${role} permissions`);
    }

    // Update last login
    await setDoc(
      doc(db, "users", user.uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );

    return userData;
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw new Error(error.message || "Failed to sign in");
  }
};

// Sign in with Google (client only)
export const signInWithGoogle = async (): Promise<UserProfile> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user exists
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // User exists, update last login
      const userData = userDoc.data() as UserProfile;
      await setDoc(
        userDocRef,
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      return userData;
    } else {
      // New user, create profile as client
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        avatar: user.photoURL || null,
        phone: user.phoneNumber,
        role: "client", // Google sign-in is for clients only
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };

      await setDoc(userDocRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      return userProfile;
    }
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw new Error(error.message || "Failed to sign in with Google");
  }
};

// Sign out
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    useAuthStore.getState().resetAuth();
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error.message || "Failed to sign out");
  }
};

// Set up auth listener
export const initializeAuthListener = (): (() => void) => {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    const { setUser, setProfile, setLoading, setError } =
      useAuthStore.getState();

    try {
      setLoading(true);

      if (user) {
        setUser(user);

        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setProfile(userData);
        } else {
          // Edge case: user exists in auth but not in Firestore
          setProfile(null);
          setError("User profile not found");
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error: any) {
      console.error("Auth state error:", error);
      setError(error.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  });
};
