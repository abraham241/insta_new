import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBl87ID17ntEE6bqsgmzbs4kg6Bt4c4Wfs",
  authDomain: "intagram-main.firebaseapp.com",
  databaseURL: "https://intagram-main-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "intagram-main",
  storageBucket: "intagram-main.appspot.com",
  messagingSenderId: "186208905347",
  appId: "1:186208905347:web:299d1f76bd41d7391dd3b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistence is set to session-based");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export { db, auth, storage };
