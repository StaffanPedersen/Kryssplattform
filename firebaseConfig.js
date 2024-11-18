import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseEnv.js';
import { getFirestore } from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import { initializeAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"
import {Platform} from "react-native";
import {browserSessionPersistence} from "firebase/auth";

const app = initializeApp(firebaseConfig);

let persistence
if (Platform.OS === 'web') {
    persistence = browserSessionPersistence;
} else {
    persistence = getReactNativePersistence(ReactNativeAsyncStorage);
}

export  const auth = initializeAuth(app, {
    persistence
});

export const db = getFirestore(app);

const storage = getStorage(app);

export const getStorageRef = (path) => ref(storage, path);

export const getDownloadUrl = async (path) => {
    const url = await getDownloadURL(ref(storage, path));
    return url;
}
