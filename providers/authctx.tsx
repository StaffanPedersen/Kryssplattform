import { auth } from "@/firebaseConfig";
import { deleteData, storeData } from "@/utils/local_storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authApi from "@/api/authApi";

type AuthContextType = {
  signIn: (username: string, password: string) => void;
  signOut: VoidFunction;
  userNameSession?: string | null;
  isLoading: boolean;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  signIn: (s: string, p: string) => null,
  signOut: () => null,
  userNameSession: null,
  isLoading: false,
  user: null,
});

export function useAuthSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error(
        "UseAuthSession must be used within a AuthContext Provider"
    );
  }

  return value;
}

export function rAuthSessionProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<string | null>(null);
  const [userAuthSession, setUserAuthSession] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserSession(user.displayName);
        setUserAuthSession(user);
      } else {
        setUserSession(null);
        setUserAuthSession(null);
      }
      setIsLoading(false);
    });
  }, []);

  return (
      <AuthContext.Provider
          value={{
            signIn: async (userName: string, password: string) => {
              try {
                const errorMessage = await authApi.signIn(userName, password);
                if (!errorMessage) {
                  const user = auth.currentUser;
                  if (user) {
                    setUserSession(user.displayName);
                    setUserAuthSession(user);
                    router.replace("/authenticated/(app)/(tabs)");
                  }
                } else {
                  console.log("Error signing in:", errorMessage);
                  return errorMessage;
                }
              } catch (error) {
                console.error("Unexpected error during sign-in:", error);
                return "An unexpected error occurred during sign-in.";
              }
            },
            signOut: async () => {
              await authApi.signOut();
              setUserSession(null);
              setUserAuthSession(null);
            },
            userNameSession: userSession,
            user: userAuthSession,
            isLoading: isLoading,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}
