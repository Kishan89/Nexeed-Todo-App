import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyABqkK0fGcmFwaU6nvaG4RX7zMVIW--vIY",
  authDomain: "nexeedtodoapp.firebaseapp.com",
  projectId: "nexeedtodoapp",
  storageBucket: "nexeedtodoapp.firebasestorage.app",
  messagingSenderId: "583098998013",
  appId: "1:583098998013:web:d93de130ee23729200f294",
  measurementId: "G-K34DKVDFET",
};
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
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
