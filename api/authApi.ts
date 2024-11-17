import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const signIn = async (email: string, password: string): Promise<string | null> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in", userCredential);
        return null; // No error
    } catch (error: any) {
        console.log("Oops, kunne ikke logge inn", error);
        return error.message; // Return the error message
    }
};

export const signOut = async () => {
  await auth.signOut().then(() => {
    console.log("Signed out");
  });
};

export const signUp = (email: string, password: string, username: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      await updateProfile(userCredential.user, {
        displayName: username,
      });
      console.log("User signed up", userCredential.user.email);
      console.log("User signed up", userCredential.user.displayName);
    })
    .catch((error) => {
      console.log(`Oops! ${error.code} message: ${error.message}`);
    });
};
