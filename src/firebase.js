import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword , signOut} from "firebase/auth"
import { addDoc, collection, getFirestore } from "firebase/firestore"
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAuiN7mV_UyVWd_8IYR87OlaFDf3bfeDRc",
  authDomain: "learn-netflix.firebaseapp.com",
  projectId: "learn-netflix",
  storageBucket: "learn-netflix.firebasestorage.app",
  messagingSenderId: "231753527568",
  appId: "1:231753527568:web:63cf5485f12c6044bbf595"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name,email,password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth,email,password);
    const user = res.user;
    await addDoc(collection(db,"users"),{
      uid:user.uid,
      name,
      authProvider:"local",
      email
    })
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
}

const login = async (email,password) => {
  try {
    await signInWithEmailAndPassword(auth,email,password);
  } catch (error) {
    console.log(error);
    toast.error("Invalid email or password");
  }
}

const logout = () => {
  signOut(auth);
}

export {signup,login,logout,auth, db};