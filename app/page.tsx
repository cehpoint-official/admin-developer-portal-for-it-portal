"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserIcon, ShieldIcon, CodeIcon, Loader } from "lucide-react";
import Image from "next/image";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { auth, db, googleProvider } from "@/firebase";

// Define type for client signup form
interface ClientSignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Define type for login form
interface LoginForm {
  email: string;
  password: string;
}

// Define type for user roles
type UserRole = "client" | "admin" | "developer";

// Define Firebase error type
interface FirebaseError {
  code: string;
  message?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showStaffLogin, setShowStaffLogin] = useState<boolean>(false);

  // Client signup form state
  const [clientSignupForm, setClientSignupForm] = useState<ClientSignupForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  // Handle client signup form changes
  const handleClientSignupChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setClientSignupForm({
      ...clientSignupForm,
      [e.target.id]: e.target.value,
    });
  };

  // Handle login form changes
  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLoginForm({
      ...loginForm,
      [e.target.id]: e.target.value,
    });
  };

  // Handle client signup
  const handleClientSignup = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (clientSignupForm.password !== clientSignupForm.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match.",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create user with Firebase auth
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          auth,
          clientSignupForm.email,
          clientSignupForm.password
        );

      const user: User = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: clientSignupForm.name,
      });

      // Send email verification
      await sendEmailVerification(user);

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: clientSignupForm.name,
        email: clientSignupForm.email,
        phone: clientSignupForm.phone,
        password: clientSignupForm.password,
        role: "client" as UserRole,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      toast.success("Account created!", {
        description:
          "You've successfully signed up as a client. Please verify your email.",
      });

      // Redirect to client dashboard
      router.push("/projects");
    } catch (error) {
      console.error("Error during signup:", error);

      const errorMessage = getErrorMessage(error as FirebaseError);
      toast.error("Signup failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login (for all roles)
  // Modify the handleLogin function to only use database authentication
  const handleLogin = async (e: FormEvent, role: UserRole): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Query the database to find a user with the given email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", loginForm.email));
      const querySnapshot = await getDocs(q);

      // Check if a user with this email exists
      if (querySnapshot.empty) {
        throw new Error("No account found with this email");
      }

      // Find the user document
      let userDoc = null;
      let userData = null;
      let userId = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if the password matches (Note: In a real app, you'd need proper password hashing)
        if (data.password === loginForm.password) {
          userDoc = doc;
          userData = data;
          userId = doc.id;
        }
      });

      // If no matching password was found
      if (!userDoc) {
        throw new Error("Invalid email or password");
      }

      // Check if the user has the requested role
      if (userData.role !== role) {
        throw new Error(
          `You don't have ${role} privileges. Please use the appropriate login option.`
        );
      }

      // Update last login timestamp
      await setDoc(
        doc(db, "users", userId),
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      // Reset form fields
      setLoginForm({
        email: "",
        password: "",
      });

      toast.success("Welcome back!", {
        description: `You've successfully logged in as a ${role}.`,
      });

      // Redirect based on role
      switch (role) {
        case "client":
          router.push("/projects");
          break;
        case "admin":
          router.push("/admin");
          break;
        case "developer":
          router.push("/developer");
          break;
      }
    } catch (error) {
      console.error("Error during login:", error);

      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? error.message
          : "An unknown error occurred";

      toast.error("Login failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Handle Google sign-in
  const handleGoogleSignIn = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Sign in with Google
      const result: UserCredential = await signInWithPopup(
        auth,
        googleProvider
      );

      // Get credentials
      const user: User = result.user;

      // Check if user already exists in our database
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // If new user, create record with client role
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || "",
          email: user.email,
          phone: user.phoneNumber || "",
          role: "client" as UserRole, // Default role for Google sign-ins
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          photoURL: user.photoURL || "",
          isGoogleAccount: true,
        });

        toast.success("Account created with Google!", {
          description: "You've been registered as a client.",
        });
      } else {
        // Update last login timestamp for existing user
        await setDoc(
          doc(db, "users", user.uid),
          {
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );

        toast.success("Google sign-in successful!", {
          description: "Welcome back to your account.",
        });
      }

      // Redirect to client dashboard
      router.push("/projects");
    } catch (error) {
      console.error("Error during Google sign-in:", error);

      const errorMessage = getErrorMessage(error as FirebaseError);
      toast.error("Google sign-in failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: FirebaseError): string => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/invalid-email":
        return "Please provide a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password.";
      case "auth/too-many-requests":
        return "Too many unsuccessful login attempts. Try again later.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";
      default:
        return error.message || "An unknown error occurred.";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        className="w-full max-w-5xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Toggle between client and staff sections */}
        <motion.div
          className="flex justify-center mb-8"
          variants={itemVariants}
        >
          <div className="bg-white rounded-full p-1 shadow-md">
            <Button
              variant={showStaffLogin ? "ghost" : "default"}
              className={`rounded-full px-6 ${
                !showStaffLogin ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setShowStaffLogin(false)}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Client Area
            </Button>
            <Button
              variant={!showStaffLogin ? "ghost" : "default"}
              className={`rounded-full px-6 ${
                showStaffLogin ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => setShowStaffLogin(true)}
            >
              <ShieldIcon className="mr-2 h-4 w-4" />
              Staff Login
            </Button>
          </div>
        </motion.div>

        {/* Client Authentication Section */}
        {!showStaffLogin && (
          <motion.div
            className="grid md:grid-cols-5 gap-8"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            key="client-section"
          >
            {/* Left side - Welcome message */}
            <motion.div
              className="md:col-span-2 flex flex-col justify-center p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold mb-4">Client Portal</h2>
              <p className="text-lg opacity-90 mb-8">
                Join our platform to manage your projects efficiently and
                collaborate with our team.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Real-time project tracking</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Dedicated support team</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Secure and reliable platform</p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Client Auth forms */}
            <motion.div className="md:col-span-3" variants={itemVariants}>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    Client Authentication
                  </CardTitle>
                  <CardDescription className="text-center">
                    Sign up for a new account or log in to your existing account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="signup" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full mb-6">
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      <TabsTrigger value="login">Log In</TabsTrigger>
                    </TabsList>

                    {/* Client Signup Tab */}
                    <TabsContent value="signup">
                      <motion.form
                        onSubmit={handleClientSignup}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Your name</Label>
                            <Input
                              id="name"
                              placeholder="Name"
                              value={clientSignupForm.name}
                              onChange={handleClientSignupChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Your email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Email"
                              value={clientSignupForm.email}
                              onChange={handleClientSignupChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Your phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Phone"
                              value={clientSignupForm.phone}
                              onChange={handleClientSignupChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">
                              Enter your password
                            </Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Password"
                              value={clientSignupForm.password}
                              onChange={handleClientSignupChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirm password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="Confirm password"
                              value={clientSignupForm.confirmPassword}
                              onChange={handleClientSignupChange}
                              required
                            />
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center">
                                  <Loader className="h-4 w-4 animate-spin mr-2" />
                                  Creating account...
                                </div>
                              ) : (
                                "Create account"
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.form>

                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <Separator />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full mt-4 flex items-center gap-2"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Image
                                src="/google.png"
                                width={20}
                                height={20}
                                alt="Google logo"
                                className="h-4 w-4"
                              />
                            )}
                            Google
                          </Button>
                        </motion.div>
                      </div>
                    </TabsContent>

                    {/* Client Login Tab */}
                    <TabsContent value="login">
                      <motion.form
                        onSubmit={(e) => handleLogin(e, "client")}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Email"
                              value={loginForm.email}
                              onChange={handleLoginChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Password"
                              value={loginForm.password}
                              onChange={handleLoginChange}
                              required
                            />
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center">
                                  <Loader className="h-4 w-4 animate-spin mr-2" />
                                  Logging in...
                                </div>
                              ) : (
                                "Login as Client"
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.form>

                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <Separator />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            className="w-full mt-4 flex items-center gap-2"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Image
                                src="/google.png"
                                width={20}
                                height={20}
                                alt="Google logo"
                                className="h-4 w-4"
                              />
                            )}
                            Google
                          </Button>
                        </motion.div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy.
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Staff Login Section */}
        {showStaffLogin && (
          <motion.div
            className="grid md:grid-cols-5 gap-8"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            key="staff-section"
          >
            {/* Left side - Staff info */}
            <motion.div
              className="md:col-span-2 flex flex-col justify-center p-8 bg-gradient-to-br from-indigo-700 to-purple-700 text-white rounded-2xl shadow-xl"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-bold mb-4">Staff Portal</h2>
              <p className="text-lg opacity-90 mb-8">
                Secure access for administrators and developers to manage the
                platform.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <ShieldIcon className="h-6 w-6" />
                  </div>
                  <p>Admin dashboard access</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <CodeIcon className="h-6 w-6" />
                  </div>
                  <p>Developer tools and resources</p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Staff Auth forms */}
            <motion.div className="md:col-span-3" variants={itemVariants}>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">
                    Staff Login
                  </CardTitle>
                  <CardDescription className="text-center">
                    Secure access for administrators and developers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="admin" className="w-full">
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="admin">
                        <ShieldIcon className="mr-2 h-4 w-4" />
                        Admin
                      </TabsTrigger>
                      <TabsTrigger value="developer">
                        <CodeIcon className="mr-2 h-4 w-4" />
                        Developer
                      </TabsTrigger>
                    </TabsList>

                    {/* Admin Login Tab */}
                    <TabsContent value="admin">
                      <motion.form
                        onSubmit={(e) => handleLogin(e, "admin")}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Admin Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Admin Email"
                              value={loginForm.email}
                              onChange={handleLoginChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Password"
                              value={loginForm.password}
                              onChange={handleLoginChange}
                              required
                            />
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center">
                                  <Loader className="h-4 w-4 animate-spin mr-2" />
                                  Logging in...
                                </div>
                              ) : (
                                "Login as Admin"
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.form>
                    </TabsContent>

                    {/* Developer Login Tab */}
                    <TabsContent value="developer">
                      <motion.form
                        onSubmit={(e) => handleLogin(e, "developer")}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Developer Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Developer Email"
                              value={loginForm.email}
                              onChange={handleLoginChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Password"
                              value={loginForm.password}
                              onChange={handleLoginChange}
                              required
                            />
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center">
                                  <Loader className="h-4 w-4 animate-spin mr-2" />
                                  Logging in...
                                </div>
                              ) : (
                                "Login as Developer"
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </motion.form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                  Staff access is restricted to authorized personnel only.
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
