import { ref, push, set, get, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";

export const sendMessageChannel = async (teamId, channelId, messageData) => {
  try {

    const messagesRef = ref(db, `teams/${teamId}/channels/${channelId}/messages`);

    const newMessageRef = push(messagesRef);
    await set(newMessageRef, messageData);

    console.log("Message sent successfully!");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const createChannel = async (teamId, channelData) => {
  try {
    console.log("Creating channel with data:", channelData); 


    if (!channelData || !channelData.name || !channelData.description) {
      throw new Error("Invalid channel data: name and description are required.");
    }
    const teamMembersRef = ref(db, `teams/${teamId}/members`);
    const teamMembersSnapshot = await get(teamMembersRef);
    console.log("Fetched team members:", teamMembersSnapshot.val());
    const teamMembers = teamMembersSnapshot.exists() ? teamMembersSnapshot.val() : [];

    if (!teamMembers || teamMembers.length === 0) {
      throw new Error("No team members found.");
    }
    console.log("Team members:", teamMembers);

    const fullChannelData = {
      name: channelData.name,
      description: channelData.description,
      createdOn: new Date().toISOString(),
    };

    console.log("Full channel data to be set in Firebase:", fullChannelData);


    const channelsRef = ref(db, `teams/${teamId}/channels`);
    const newChannelRef = push(channelsRef);
    await set(newChannelRef, fullChannelData);

    console.log("Channel created successfully:", newChannelRef.key);

    const channelMembersRef = ref(db, `teams/${teamId}/channels/${newChannelRef.key}/members`);
    await set(channelMembersRef, teamMembers);

    console.log("Members added to the channel successfully.");

    return newChannelRef.key;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
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
            updates[`${channelId}/members`] = teamMembers;
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
  


  
  export const leaveChannel = async (teamId, channelId, userHandle) => {
    try {
      const channelRef = ref(db, `teams/${teamId}/channels/${channelId}`);
      const channelSnapshot = await get(channelRef);
  
      if (!channelSnapshot.exists()) {
        throw new Error("Channel not found");
      }
  
      const channelData = channelSnapshot.val();
      const updatedMembers = channelData.members.filter((member) => member !== userHandle);

      await update(channelRef, { members: updatedMembers });

      const userChannelRef = ref(db, `users/${userHandle}/channels/${channelId}`);
      await remove(userChannelRef);
  
      console.log(`User ${userHandle} has left channel ${channelId}`);
  
      return { channelId, ...channelData };
  
    } catch (error) {
      console.error("Error leaving channel:", error);
      throw error;
    }
  };



  



  
  // Delete channel if there are no members left
  export const deleteChannel = async (teamId, channelId) => {
    try {
      const channelRef = ref(db, `teams/${teamId}/channels/${channelId}`);
      const channelSnapshot = await get(channelRef);
  
      if (channelSnapshot.exists()) {
        const channelData = channelSnapshot.val();
        console.log(`Checking channel ${channelId}:`, channelData);
        const members = channelData.members || [];

        console.log(`Channel ${channelId} members count: ${members.length}`);

        if (members.length === 0) {
          await remove(channelRef);
          console.log(`Channel ${channelId} deleted successfully.`);
        } else {
          console.log(`Channel ${channelId} still has members and cannot be deleted.`);
        }
      } else {
        console.error(`Channel ${channelId} not found.`);
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
      throw error;
    }
  };
  
  
  
