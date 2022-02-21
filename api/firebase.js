import firebase from "firebase";
import "firebase/firestore";

import { firebaseConfig } from "../config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  // if already initialized, use that one
  firebase.app();
}

const db = firebase.firestore();

export { db };