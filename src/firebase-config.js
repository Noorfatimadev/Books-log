// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"; 
import {getDatabase} from 'firebase/database'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO7j2j_lv8kL3GsuUy-mzelF9eijoKm9Q",
  authDomain: "books-log-6da71.firebaseapp.com",
  projectId: "books-log-6da71",
  storageBucket: "books-log-6da71.appspot.com",
  messagingSenderId: "646510029240",
  appId: "1:646510029240:web:8ede75e1e722586dfec74d",
  measurementId: "G-HFC22EBHB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export default  db;