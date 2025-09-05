import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBy9d1C0YkLGJH1U4JmMf_HtnWlJIhj810",
  authDomain: "todo-app-d5254.firebaseapp.com",
  projectId: "todo-app-d5254",
  storageBucket: "todo-app-d5254.firebasestorage.app",
  messagingSenderId: "660967141181",
  appId: "1:660967141181:web:cddf534f7a526a4d171f54",
  measurementId: "G-F618Q561W3"
};
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  if (e.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw e;
  }
}
export const db = getFirestore(app);

export { app, auth };
