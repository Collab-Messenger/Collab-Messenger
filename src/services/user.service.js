import { get, set, ref, query, equalTo, orderByChild, update, getDatabase } from 'firebase/database';
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
    const db = getDatabase();
    const dbRef = ref(db, 'users');
    const q = query(dbRef, orderByChild('handle'), equalTo(name));
    const snapshot = await get(q);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
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
    const db = getDatabase();
    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(Object.values(snapshot.val()));
      } else {
        callback([]);
      }
    });
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

export const addFriendRequestToUser = async (handle, senderHandle) => {
    const userRef = ref(db, `users/${handle}`);
    const userSnapshot = await get(userRef);
    const user = userSnapshot.val();
    const friendRequests = user.friendRequests || [];
    friendRequests.push(senderHandle);
    await update(userRef, { friendRequests });
  };

export const acceptFriendRequest = async (handle, senderHandle) => {
    const userRef = ref(db, `users/${handle}`);
    const senderRef = ref(db, `users/${senderHandle}`);

    const userSnapshot = await get(userRef);
    const senderSnapshot = await get(senderRef);

    if (userSnapshot.exists() && senderSnapshot.exists()) {
        const user = userSnapshot.val();
        const sender = senderSnapshot.val();

        const friendRequests = user.friendRequests || [];
        const userFriends = user.friends || [];
        const senderFriends = sender.friends || [];

        const updatedFriendRequests = friendRequests.filter(request => request !== senderHandle);

        userFriends.push(senderHandle);
        senderFriends.push(handle);

        await update(userRef, { friendRequests: updatedFriendRequests, friends: userFriends });
        await update(senderRef, { friends: senderFriends });
    }
};


export const removeFriend = async (handle, friendHandle) => {
    const userRef = ref(db, `users/${handle}`);
    const friendRef = ref(db, `users/${friendHandle}`);

    const userSnapshot = await get(userRef);
    const friendSnapshot = await get(friendRef);

    if (userSnapshot.exists() && friendSnapshot.exists()) {
        const user = userSnapshot.val();
        const friendData = friendSnapshot.val();

        const userFriends = user.friends || [];
        const friendFriends = friendData.friends || [];

        const updatedUserFriends = userFriends.filter(friend => friend !== friendHandle);
        const updatedFriendFriends = friendFriends.filter(friend => friend !== handle);

        await update(userRef, { friends: updatedUserFriends });
        await update(friendRef, { friends: updatedFriendFriends });
    }
};

export const declineFriendRequest = async (handle, senderHandle) => {
    const userRef = ref(db, `users/${handle}`);
    const userSnapshot = await get(userRef);
    const user = userSnapshot.val();
    const friendRequests = user.friendRequests || [];
    const updatedFriendRequests = friendRequests.filter(request => request !== senderHandle);
    await update(userRef, { friendRequests: updatedFriendRequests });
}
  

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
    const db = getDatabase();
    const usersRef = ref(db, 'users');
    const usersSnapshot = await get(usersRef);
    const users = usersSnapshot.val();
    const usersArray = Object.keys(users).map(key => users[key]);
    return usersArray.filter(user => user.handle && user.handle.toLowerCase().includes(searchTerm.toLowerCase()));
  };

/**
 * Sets the user's online status.
 * @param {string} handle - The handle of the user.
 * @param {boolean} isOnline - The online status of the user.
 * @returns {Promise<void>}
 */
export const setUserOnlineStatus = async (handle) => {
    const userRef = ref(db, `users/${handle}`);
    await update(userRef, { isOnline: true });
  };

export const setUserOfflineStatus = async (handle) => {
    const userRef = ref(db, `users/${handle}`);
    await update(userRef, { isOnline: false });
  }
  export const getFriends = async (userId) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.friends) {
          const friendsPromises = userData.friends.map(async (friendId) => {
            const friendRef = ref(db, `users/${friendId}`);
            const friendSnapshot = await get(friendRef);
            if (friendSnapshot.exists()) {
              return { id: friendId, ...friendSnapshot.val() };
            }
            return null;
          });
          const friends = await Promise.all(friendsPromises);
          return friends.filter(friend => friend !== null);
        }
      }
      return [];
    } catch (error) {
      console.log(error.message);
      return [];
    }
  };