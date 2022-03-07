import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

import { firebaseConfig } from "../config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  // if already initialized, use that one
  firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };