import { ref, set, push, get, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../config/firebase-config";
import { onValue } from "firebase/database";

//Implement UserID

/**
 * Adds a new chat room to the database.
 * @param {Object} chatRoom - Chat room object containing details (e.g., name, users).
 * @returns {string} - The unique chat room ID.
 */
export const addChatRoom = async (chatRoom) => {
  try {
    // Push creates a unique key for the chat room
    const newChatRoomRef = push(ref(db, 'chatRooms'));
    await set(newChatRoomRef, {
      ...chatRoom,
      createdOn: new Date().toISOString() 
    });
    return newChatRoomRef.key; // Return chats ID
  } catch (error) {
    console.error("Error creating chat room:", error.message);
  }
};

/**
 * Checks if a chat room name is unique.
 * @param {string} name - The name of the chat room to check.
 * @returns {boolean} - True if the name is unique, false otherwise.
 */
export const isChatRoomNameUnique = async (name) => {
  try {
    const chatRoomsRef = ref(db, 'chatRooms');
    const snapshot = await get(chatRoomsRef);

    if (snapshot.exists()) {
      const chatRooms = snapshot.val();
      const chatRoomNames = Object.values(chatRooms).map(chatRoom => chatRoom.name);
      return !chatRoomNames.includes(name);
    }
    return true; 
  } catch (error) {
    console.error("Error checking chat room name uniqueness:", error.message);
  }
};

/**
 * Retrieves a chat room by its ID.
 * @param {string} chatRoomId - The unique ID of the chat room.
 * @returns {Object|null} - The chat room object or null if not found.
 */
export const getChatRoomById = async (chatRoomId) => {
  try {
    const chatRoomRef = ref(db, `chatRooms/${chatRoomId}`);
    const snapshot = await get(chatRoomRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null; 
  } catch (error) {
    console.error("Error retrieving chat room:", error.message);
  }
};

/**
 * Retrieves all chat rooms that include a specific user.
 * @param {string} userId - The unique ID of the user.
 * @returns {Array} - An array of chat rooms where the user is a member.
 */
export const getChatRoomsForUser = async (userId) => {
  try {
    const chatRoomsRef = query(ref(db, 'chatRooms'), orderByChild('members'), equalTo(userId));
    const snapshot = await get(chatRoomsRef);

    if (snapshot.exists()) {
      const chatRooms = snapshot.val();
      return Object.entries(chatRooms).map(([id, data]) => ({ id, ...data }));
    }
    return [];
  } catch (error) {
    console.error("Error retrieving chat rooms for user:", error.message);
  }
};

// Get all chatrooms


export const getAllChatRooms = async () => {
  try {
    const snapshot = await get(ref(db, "chatRooms"));
    if (snapshot.exists()) {
      const roomsObject = snapshot.val(); // Firebase returns an object keyed by the unique IDs
      return Object.keys(roomsObject).map((key) => ({
        id: key, // Use the key as the ID
        ...roomsObject[key], // Include the rest of the chat room data
      }));
    }
    return []; // Return an empty array if no chat rooms exist
  } catch (error) {
    console.error("Error fetching chat rooms:", error.message);
    return [];
  }
};



// Fetch messages in real-time
// export const getMessages = (chatRoomId, callback) => {
//   const messagesRef = ref(db, `chatRooms/${chatRoomId}/messages`);
//   onValue(messagesRef, (snapshot) => {
//     if (snapshot.exists()) {
//       const messages = Object.values(snapshot.val());
//       callback(messages);
//     } else {
//       callback([]);
//     }
//   });
// };

export const getMessages = async (chatRoomId) => {
  try {
    const messagesRef = ref(db, `chatRooms/${chatRoomId}/messages`);
    const snapshot = await get(messagesRef); // Get the messages from Realtime Database
    
    if (!snapshot.exists()) {
      return []; // Return an empty array if there are no messages
    }

    const messagesData = snapshot.val(); // Get the message data
    const messages = [];

    // Loop through the messages and create an array
    for (const messageId in messagesData) {
      const message = messagesData[messageId];
      messages.push({
        id: messageId,
        ...message,
      });
    }

    // Optionally, you can sort messages by timestamp here
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    throw error;
  }
};




export const sendMessage = async (chatRoomId, message) => {
  try {
    const messagesRef = ref(db, `chatRooms/${chatRoomId}/messages`);
    const newMessageRef = push(messagesRef); // Push the new message to the messages node
    await set(newMessageRef, message); // Set the message at the newly created reference
  } catch (error) {
    console.error("Error sending message:", error.message);
    throw error;
  }
};




export const createChatRoom = async (userHandle, friendHandle) => {
  console.log("userHandle:", userHandle);
  console.log("friendHandle:", friendHandle);
  try {
    const chatRoomsRef = ref(db, "chatRooms");

    // Check if a chat room already exists for these participants
    const snapshot = await get(chatRoomsRef);

    let existingChatRoom = null;

    if (snapshot.exists()) {
      const chatRooms = snapshot.val();

      // Loop through chatRooms to find a match
      for (const roomId in chatRooms) {
        const room = chatRooms[roomId];
        if (
          room.participants &&
          room.participants.includes(userHandle) &&
          room.participants.includes(friendHandle)
        ) {
          existingChatRoom = { id: roomId, ...room };
          break;
        }
      }
    }

    // If the chat room exists, return it
    if (existingChatRoom) {
      return existingChatRoom;
    }

    // Otherwise, create a new chat room
    const newChatRoom = {
      participants: [userHandle, friendHandle],
      createdOn: new Date().toISOString(),
    };

    const newChatRoomRef = push(chatRoomsRef, newChatRoom);

    return { id: newChatRoomRef.key, ...newChatRoom };
  } catch (error) {
    console.error("Error creating chat room:", error.message);
    throw error;
  }
};
