// /lib/hooks/useAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createUserAccount,
  signInWithEmail,
  signInWithGoogle,
  logoutUser,
  initializeAuthListener,
} from "../firebase/authService";
import { useAuthStore, UserRole } from "../store/userStore";

export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    error,
    setError,
    setLoading,
  } = useAuthStore();

  // Set up auth listener on mount
  useEffect(() => {
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, []);

  // Client signup
  const signUp = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      await createUserAccount(email, password, name, phone);
      router.push("/client/projects");
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password
  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password, role);

      // Redirect based on role
      switch (role) {
        case "client":
          router.push("/client");
          break;
        case "admin":
          router.push("/admin");
          break;
        case "developer":
          router.push("/developer");
          break;
      }

      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const googleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      router.push("/projects"); // Google login is for clients only
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);

    try {
      await logoutUser();
      router.push("/");
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    error,
    signUp,
    login,
    googleLogin,
    logout,
  };
};
