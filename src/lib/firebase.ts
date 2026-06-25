import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Import the core runtime
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Data Connect using the explicit configuration
// Initialize Data Connect with the correct property names
export const dataConnect = getDataConnect({
  service: "studio-8058744913-5a601-service",
  location: "us-east4",
  connector: "example" 
});

/*if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
  connectDataConnectEmulator(dataConnect, "127.0.0.1", 9399);
  console.log("🔌 Successfully mapped to local SQL Connect Emulator on port 9399!");
}*/

export { app, db, auth, storage };