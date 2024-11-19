import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

/**
 * Registers a new user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const registerUser = (email, password) => {
    try{
        return createUserWithEmailAndPassword(auth, email, password);
    }catch(error){
        console.error('Error during registration:', error);
        alert(`Registration failed. Please try again. Error: ${error.message}`);
}
};

/**
 * Logs in a user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the current user.
 * @returns {Promise<void>}
 */
export const logoutUser = () => {
  return signOut(auth);
};
