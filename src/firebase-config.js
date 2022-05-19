import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCI00oH9suxtoS1V1gBj8lm-fGIVa2i0fQ",
  authDomain: "todolist-d29ad.firebaseapp.com",
  projectId: "todolist-d29ad",
  storageBucket: "todolist-d29ad.appspot.com",
  messagingSenderId: "197178790723",
  appId: "1:197178790723:web:d1d7090742321afa1e95f6",
  measurementId: "G-7864MK68R9",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((res) => {
      localStorage.setItem('uid', 'xR095JJ1jrcs3fjWCrTrobrtSYD2');
    })
    .catch((err) => console.log(err));
};

export const logOut = () => {
  signOut(auth);
}