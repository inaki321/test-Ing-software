// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCa_PfcEt9xuC0wIXIGoLD2OmPlZsZQmfI",
    authDomain: "appj-26b22.firebaseapp.com",
    projectId: "appj-26b22",
    storageBucket: "appj-26b22.appspot.com",
    messagingSenderId: "673019746735",
    appId: "1:673019746735:web:4695b6a6fdb65b74cff75a",
    measurementId: "G-QZMZP2M6VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//colleciton r
const db = getFirestore();

const colRef = collection(db, 'temporal');

export default colRef;