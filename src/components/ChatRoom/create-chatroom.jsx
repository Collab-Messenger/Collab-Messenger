import { ref, set, push, serverTimestamp } from "firebase/database";

import { db } from "../../config/firebase-config";
// Function to create a new chatroom
export const createChatRoom = async (userHandle, friendHandle) => {
  try {
    // Generate a new unique key for the chatroom
    const newChatRoomRef = push(ref(db, "chatRooms"));

    // Define chatroom structure
    const newChatRoom = {
      name: `ChatRoom between ${userHandle} and ${friendHandle}`,
      createdOn: serverTimestamp(),
      description: "",
      messages: {}, // Empty messages initially
    };

    // Save the chatroom to the database
    await set(newChatRoomRef, newChatRoom);

    return {
      id: newChatRoomRef.key, // Return the generated chatroom ID
      ...newChatRoom,
    };
  } catch (error) {
    console.error("Error creating chat room:", error.message);
    throw error; // Rethrow for further handling
  }
};
