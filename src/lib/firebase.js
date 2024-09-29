// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCRJ-wqOvAhdI6fx5mS9-ZgXpT1F1NHrHM",
  	authDomain: "cloudcomputingobject.firebaseapp.com",
  	projectId: "cloudcomputingobject",
  	storageBucket: "cloudcomputingobject.appspot.com",
  	messagingSenderId: "912254982708",
  	appId: "1:912254982708:web:a1ecee2922ec943fcac861",
  	measurementId: "G-FL0KCB7ZZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
