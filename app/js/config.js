import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFk7oW8_6viuDrCSM2mwClStqXUddc0Lo",
  authDomain: "mobilebank-5d2a7.firebaseapp.com",
  databaseURL: "https://mobilebank-5d2a7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mobilebank-5d2a7",
  storageBucket: "mobilebank-5d2a7.appspot.com",
  messagingSenderId: "498354890997",
  appId: "1:498354890997:web:729b44636fe1707d977dbc",
  measurementId: "G-1J2V8KMPFY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore(app);
const authentication = getAuth(app);

export {app, analytics, database, authentication}

