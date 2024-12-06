import { ref, push, set, get, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";

export const createChannel = async (teamId, channelData) => {
  try {
    const teamChannelRef = ref(db, `teams/${teamId}/channels`);


    const newChannelRef = push(teamChannelRef);
    await set(newChannelRef, channelData);
    const createdChannel = { key: newChannelRef.key, ...channelData };
    return createdChannel;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw new Error("Channel creation failed.");
  }
};
  
  
  
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
  
  export const addMemberToChannel = async (teamId, channelId, userHandle) => {
    try {
      const teamRef = ref(db, `teams/${teamId}`);
      const channelRef = ref(db, `teams/${teamId}/channels/${channelId}`);
  
      // Fetch team and channel data
      const [teamSnapshot, channelSnapshot] = await Promise.all([get(teamRef), get(channelRef)]);
  
      if (!teamSnapshot.exists()) {
        throw new Error("Team not found");
      }
      if (!channelSnapshot.exists()) {
        throw new Error("Channel not found");
      }
  
      const teamData = teamSnapshot.val();
      const channelData = channelSnapshot.val();
      if (!teamData.members.includes(userHandle)) {
        throw new Error("User is not a member of the team");
      }
      const updatedChannelMembers = channelData.members || [];
      if (updatedChannelMembers.includes(userHandle)) {
        throw new Error("User is already a member of the channel");
      }
      updatedChannelMembers.push(userHandle);

      await update(channelRef, { members: updatedChannelMembers });
  
      console.log(`User ${userHandle} added to channel ${channelId} successfully.`);

      return updatedChannelMembers;
    } catch (error) {
      console.error("Error adding member to channel:", error);
      throw error;
    }
  };
  


  export const removeMemberFromChannel = async (teamId, channelId, memberToKick) => {
    try {
      const membersRef = ref(db, `teams/${teamId}/channels/${channelId}/members`);
      const membersSnapshot = await get(membersRef);
      
      const currentMembers = membersSnapshot.val() || [];

      const memberIndex = currentMembers.indexOf(memberToKick);
      if (memberIndex !== -1) {

        const memberRef = ref(db, `teams/${teamId}/channels/${channelId}/members/${memberIndex}`);
        await remove(memberRef);
        console.log("Member removed successfully");
      }
    } catch (error) {
      console.error("Error kicking member from channel:", error);
      throw new Error("Failed to kick member.");
    }
  };
  
  
