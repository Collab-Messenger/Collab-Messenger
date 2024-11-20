import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config.js';
import { onValue } from 'firebase/database';

/**
 * Retrieves a user by their handle.
 * @param {string} handle - The handle of the user.
 * @returns {Promise<Object>}
 */
export const getUserByHandle = async (handle) => {
  console.log('getUserByHandle', handle);
  return get(ref(db, `users/${handle}`));
};

export const getUsersByName = async (name) => {
    console.log('getUserByName', name);
    return get(ref(db, `users/${name}`));
  };

/**
 * Creates a new user handle.
 * @param {string} handle - The handle of the user.
 * @param {string} uid - The UID of the user.
 * @param {string} email - The email of the user.
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} status - The status of the user.
 * @param {string} avatar - The avatar of the user.
 * @param {string} note - The note of the user.
 * @returns {Promise<void>}
 */
export const createUserHandle = async (handle, uid, email) => {
    console.log( uid);
  const user = {
    handle,
    email,
    uid,
    createdOn: new Date().toString()
  };

  return set(ref(db, `users/${handle}`), user);
};

/**
 * Retrieves user data by UID.
 * @param {string} uid - The UID of the user.
 * @returns {Promise<Object>}
 */
export const getUserData = async (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

/**
 * Updates user data.
 * @param {string} handle - The handle of the user.
 * @param {Object} userData - The new user data.
 * @returns {Promise<void>}
 */
export const updateUser = async (handle, userData) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, userData);
};

/**
 * Retrieves all users and executes a callback with the users data.
 * @param {Function} callback - The callback function to execute with the users data.
 * @returns {Function} - The unsubscribe function.
 */
export const getAllUsers = (callback) => {
  const usersRef = ref(db, 'users');
  const unsubscribe = onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    const usersArray = Object.keys(users).map(key => users[key]);
    callback(usersArray);
  });
  return unsubscribe;
};

/**
 * Adds a post to a user.
 * @param {string} handle - The handle of the user.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<void>}
 */
export const addPostToUser = async (handle, postId) => {
  const userRef = ref(db, `users/${handle}`);
  const userSnapshot = await get(userRef);
  const user = userSnapshot.val();
  const posts = user.posts || [];
  posts.push(postId);
  await update(userRef, { posts });
};

/**
 * Removes a post from a user.
 * @param {string} handle - The handle of the user.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<void>}
 */
export const removePostFromUser = async (handle, postId) => {
  const userRef = ref(db, `users/${handle}/posts`);
  const userSnapshot = await get(userRef);
  if (userSnapshot.exists()) {
    const posts = userSnapshot.val();
    const updatedPosts = posts.filter(id => id !== postId);
    await update(ref(db, `users/${handle}`), { posts: updatedPosts });
  }
};

/**
 * Removes a comment from a user.
 * @param {string} handle - The handle of the user.
 * @param {string} commentId - The ID of the comment.
 * @returns {Promise<void>}
 */
export const removeCommentFromUser = async (handle, commentId) => {
  const userRef = ref(db, `users/${handle}/comments`);
  const userSnapshot = await get(userRef);
  if (userSnapshot.exists()) {
    const comments = userSnapshot.val();
    const updatedComments = comments.filter(id => id !== commentId);
    await update(ref(db, `users/${handle}`), { comments: updatedComments });
  }
};

/**
 * Removes a reply from a user.
 * @param {string} handle - The handle of the user.
 * @param {string} replyId - The ID of the reply.
 * @returns {Promise<void>}
 */
export const removeReplyFromUser = async (handle, replyId) => {
  const userRef = ref(db, `users/${handle}/replies`);
  const userSnapshot = await get(userRef);
  if (userSnapshot.exists()) {
    const replies = userSnapshot.val();
    const updatedReplies = replies.filter(id => id !== replyId);
    await update(ref(db, `users/${handle}`), { replies: updatedReplies });
  }
};

/**
 * Blocks a user.
 * @param {string} handle - The handle of the user.
 * @returns {Promise<void>}
 */
export const blockUser = async (handle) => {
  const userRef = ref(db, `users/${handle}`);
  console.log('userRef', userRef);
  await update(userRef, { isBlocked: true });
  console.log('456');
};

/**
 * Unblocks a user.
 * @param {string} handle - The handle of the user.
 * @returns {Promise<void>}
 */
export const unblockUser = async (handle) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, { isBlocked: false });
};

/**
 * Makes a user an admin.
 * @param {string} handle - The handle of the user.
 * @returns {Promise<void>}
 */
export const makeAdmin = async (handle) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, { isAdmin: true });
};

/**
 * Removes admin privileges from a user.
 * @param {string} handle - The handle of the user.
 * @returns {Promise<void>}
 */
export const removeAdmin = async (handle) => {
  const userRef = ref(db, `users/${handle}`);
  await update(userRef, { isAdmin: false });
};

/**
 * Searches for users by name.
 * @param {string} searchTerm - The search term.
 * @returns {Promise<Array>}
 */
export const searchUsers = async (searchTerm) => {
  const usersRef = ref(db, 'users');
  const usersSnapshot = await get(usersRef);
  const users = usersSnapshot.val();
  const usersArray = Object.keys(users).map(key => users[key]);
  return usersArray.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
};