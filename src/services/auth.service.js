import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

/**
 * Registers a new user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const registerUser = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error during registration:', error);
    alert(`Registration failed. Please try again. Error: ${error.message}`);
    throw error;
  }
};

/**
 * Logs in a user with email and password, ensuring the email is verified.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    if (!userCredential.user.emailVerified) {
      throw new Error("Email not verified. Please verify your email before logging in.");
    }

    return userCredential;
  } catch (error) {
    console.error('Error during login:', error);
    alert(`Login failed. ${error.message}`);
    throw error;
  }
};

/**
 * Logs out the current user.
 * @returns {Promise<void>}
 */
export const logoutUser = () => {
  return signOut(auth);
};