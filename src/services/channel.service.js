import { ref, push, set, get, update } from "firebase/database";
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





export const createChannel = async (teamId, channelData) => {
  try {
    // Log received channel data for debugging
    console.log("Creating channel with data:", channelData); 

    // Ensure the channel data is valid
    if (!channelData || !channelData.name || !channelData.description) {
      throw new Error("Invalid channel data: name and description are required.");
    }

    // Fetch the team members
    const teamMembersRef = ref(db, `teams/${teamId}/members`);
    const teamMembersSnapshot = await get(teamMembersRef);

    // Log the fetched members for debugging
    console.log("Fetched team members:", teamMembersSnapshot.val());

    // Ensure we have team members
    const teamMembers = teamMembersSnapshot.exists() ? teamMembersSnapshot.val() : [];

    if (!teamMembers || teamMembers.length === 0) {
      throw new Error("No team members found.");
    }

    // Log the team members to ensure they are being correctly fetched
    console.log("Team members:", teamMembers);

    // Prepare the full channel data, including members
    const fullChannelData = {
      name: channelData.name, // Channel name
      description: channelData.description, // Channel description
      createdOn: new Date().toISOString(),
    };

    // Log full channel data for debugging
    console.log("Full channel data to be set in Firebase:", fullChannelData);

    // Push the new channel to the channels list in Firebase
    const channelsRef = ref(db, `teams/${teamId}/channels`);
    const newChannelRef = push(channelsRef); // Generate a unique channel ID
    await set(newChannelRef, fullChannelData); // Write the channel data to Firebase

    console.log("Channel created successfully:", newChannelRef.key);

    // Add members explicitly to the new channel under the "members" path
    const channelMembersRef = ref(db, `teams/${teamId}/channels/${newChannelRef.key}/members`);
    await set(channelMembersRef, teamMembers);

    console.log("Members added to the channel successfully.");

    return newChannelRef.key; // Return the new channel key
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error; // Rethrow the error so the caller can handle it
  }
};



  export const addMembersToExistingChannels = async (teamId) => {
    try {
      const teamMembersRef = ref(db, `teams/${teamId}/members`);
      const teamMembersSnapshot = await get(teamMembersRef);
  
      const teamMembers = teamMembersSnapshot.exists() ? teamMembersSnapshot.val() : [];
  
      const channelsRef = ref(db, `teams/${teamId}/channels`);
      const channelsSnapshot = await get(channelsRef);
  
      if (channelsSnapshot.exists()) {
        const updates = {};
        const channels = channelsSnapshot.val();
  
        for (const channelId in channels) {
          if (!channels[channelId].members) {
            updates[`${channelId}/members`] = teamMembers; // Add members if missing
          }
        }
  
        await update(channelsRef, updates);
        console.log("Members added to all existing channels!");
      } else {
        console.log("No channels found for the team.");
      }
    } catch (error) {
      console.error("Error adding members to channels:", error);
      throw error;
    }
  };
  

export const leaveChannel = async (teamId, channelId, userId) => {
    const channelMembersRef = ref(db, `teams/${teamId}/channels/${channelId}/members`);
    const membersSnapshot = await get(channelMembersRef);
    const members = membersSnapshot.exists() ? membersSnapshot.val() : [];
  
    const updatedMembers = members.filter((member) => member !== userId);
    await set(channelMembersRef, updatedMembers);
    console.log("User removed from channel members!");
  };