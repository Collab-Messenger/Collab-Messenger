import { ref, push, set } from "firebase/database";
import { db } from "../config/firebase-config"; // Assuming Firebase config is set up properly

export const sendMessageChannel = async (teamId, channelId, messageData) => {
  try {
    // Define the correct reference path for the message (under team > channel > messages)
    const messagesRef = ref(db, `teams/${teamId}/channels/${channelId}/messages`);

    // Push a new message to the messages list
    const newMessageRef = push(messagesRef); // Push generates a unique ID for each message
    await set(newMessageRef, messageData); // Store the message data at the generated path

    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};