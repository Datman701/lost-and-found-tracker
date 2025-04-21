import {auth} from "./firebase";

import { signInWithEmailAndPassword, signOut , createUserWithEmailAndPassword , GoogleAuthProvider  , signInWithPopup} from "firebase/auth";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        console.error("Error creating user with email and password:", error);
        return false;
    }
}

export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    } catch (error) {
        console.error("Error signing in with email and password:", error);
        return false;
    }
}

export const doSignInWithGoogle =  async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        return true;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        return false;
    }
}

export const doSignOut = async () => {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Error signing out:", error);
        return false;
    }
}
