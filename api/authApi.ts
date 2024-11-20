// Code from lecture or modified code from lecture
import { auth } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";


export const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed in", userCredential);
        })
        .catch((error) => {
            console.log("Oops, kunne ikke logge inn", error);
        });
};

export const signOut = async () => {
  await auth.signOut().then(() => {
    console.log("Signed out");
  });
};

export const signUp = async (email: string, password: string, username: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: username,
        });
        console.log("User signed up", userCredential.user.email);
        console.log("User signed up", userCredential.user.displayName);
        return userCredential.user;
    }catch (error: any) {
        console.log(`Oops! ${error.code} message: ${error.message}`);
        throw error;
    }
};
