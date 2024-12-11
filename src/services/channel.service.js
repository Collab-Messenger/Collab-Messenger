import { ref, push, set, get, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";

/**
 * Create a new channel in the specified team.
 *
 * @param {string} teamId - The ID of the team where the channel will be created.
 * @param {object} channelData - The data of the new channel, including name, description, etc.
 * @returns {object} - The created channel with an additional `key` property.
 * @throws Will throw an error if the channel creation fails.
 */
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

/**
 * Fetch messages for a specific channel in a team.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} channelId - The ID of the channel.
 * @returns {Array} - An array of messages or an empty array if no messages exist.
 * @throws Will throw an error if fetching messages fails.
 */
export const fetchMessagesForChannel = async (teamId, channelId) => {
  try {
    const messagesRef = ref(db, `teams/${teamId}/channels/${channelId}/messages`);
    const messagesSnapshot = await get(messagesRef);

    if (messagesSnapshot.exists()) {
      return Object.values(messagesSnapshot.val());
    } else {
      console.log("No messages found for this channel.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Failed to fetch messages.");
  }
};

/**
 * Send a message to a specific channel.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} channelId - The ID of the channel.
 * @param {object} messageData - The message data to send.
 * @throws Will throw an error if sending the message fails.
 */
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

/**
 * Add members to all existing channels in a team.
 *
 * @param {string} teamId - The ID of the team.
 * @throws Will throw an error if adding members fails.
 */
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

/**
 * Let a user leave a specific channel.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} channelId - The ID of the channel.
 * @param {string} userHandle - The handle of the user leaving the channel.
 * @returns {object} - The channel data after the user has left.
 * @throws Will throw an error if the user could not leave the channel.
 */
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

/**
 * Delete a channel if there are no members left.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} channelId - The ID of the channel.
 * @throws Will throw an error if deleting the channel fails.
 */
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

/**
 * Add a member to a specific channel.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} channelId - The ID of the channel.
 * @param {string} userHandle - The handle of the user to add.
 * @returns {Array} - The updated list of members in the channel.
 * @throws Will throw an error if the user could not be added to the channel.
 */
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

/**
 * Remove a member from a specific channel.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} channelId - The ID of the channel.
 * @param {string} memberToKick - The handle of the member to remove.
 * @throws Will throw an error if the member could not be removed from the channel.
 */
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
