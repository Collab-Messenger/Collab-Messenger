import { ref, set, push, get, update, remove } from "firebase/database";
import { db } from "../config/firebase-config";

/**
 * Add a new team to Firebase.
 *
 * @param {object} team - The data for the new team.
 * @returns {Promise<string>} - The ID of the newly created team.
 * @throws Will throw an error if team creation fails.
 */
export const addTeam = async (team) => {
  try {
    const validateTeamData = (team) => {
      const cleanTeam = { ...team };
      Object.keys(cleanTeam).forEach((key) => {
        if (cleanTeam[key] === undefined) {
          cleanTeam[key] = null;
        }
      });
      return cleanTeam;
    };

    const newTeamRef = push(ref(db, 'teams'));
    const teamData = validateTeamData(team);
    await set(newTeamRef, teamData);
    return newTeamRef.key;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

/**
 * Check if a team name is unique across all teams.
 *
 * @param {string} name - The name of the team to check.
 * @returns {Promise<boolean>} - True if the team name is unique, false otherwise.
 * @throws Will throw an error if the check fails.
 */
export const isTeamNameUnique = async (name) => {
  try {
    const teamsRef = ref(db, 'teams');
    const snapshot = await get(teamsRef);
    if (snapshot.exists()) {
      const teams = snapshot.val();
      const teamNames = Object.values(teams).map(team => team.name);
      return !teamNames.includes(name);
    }
    return true;
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * Get all teams for a specific user.
 *
 * @param {string} userHandle - The handle of the user.
 * @returns {Promise<Array>} - An array of team objects.
 * @throws Will return an empty array if no teams are found or if the fetch fails.
 */
export const getTeams = async (userHandle) => {
  try {
    const snapshot = await get(ref(db, `users/${userHandle}/teams`)); 
    if (!snapshot.exists()) {
      return [];
    }

    const userTeamsIds = snapshot.val(); 
    if (!userTeamsIds) {
      return [];
    }

    const userTeams = [];
    for (const teamId of Object.keys(userTeamsIds)) {
      const teamSnapshot = await get(ref(db, `teams/${teamId}`));
      if (teamSnapshot.exists()) {
        userTeams.push({ id: teamId, ...teamSnapshot.val() });
      }
    }

    return userTeams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};

/**
 * Get a team by its ID.
 *
 * @param {string} teamId - The ID of the team.
 * @returns {Promise<object|null>} - The team object if found, otherwise null.
 * @throws Will throw an error if fetching the team fails.
 */
export const getTeamById = async (teamId) => {
  try {
    const teamRef = ref(db, `teams/${teamId}`);
    const snapshot = await get(teamRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * Add a channel to a specific team.
 * 
 * @param {string} teamId - The ID of the team.
 * @param {string} channelName - Name of the new channel.
 * @param {string} description - Description of the channel.
 * @returns {Promise<object>} - Updated team object after adding the new channel.
 * @throws Will throw an error if adding the channel fails.
 */
export const addChannelToTeam = async (teamId, channelName, description) => {
  try {
    // Reference to the 'channels' collection of the team
    const teamChannelsRef = ref(db, `teams/${teamId}/channels`);
    
    // Create the channel data
    const channelData = {
      name: channelName,           // Channel name
      description: description,    // Channel description
      createdOn: new Date().toISOString(),  // Timestamp when the channel is created
    };

    // Use push() to generate a unique ID for this channel
    const newChannelRef = push(teamChannelsRef);  // This creates a unique ID for the channel

    // Store the channel data under the unique ID generated by push()
    await set(newChannelRef, channelData);  // Set the channel data at the new unique ID reference

    // Fetch and return the updated team data after adding the new channel
    const teamRef = ref(db, `teams/${teamId}`);
    const snapshot = await get(teamRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error adding channel to team:", error.message);
    throw error;
  }
};

/**
 * Add a member to a team.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} userHandle - The handle of the user to add.
 * @returns {Promise<object>} - The updated team object after adding the member.
 * @throws Will throw an error if adding the member fails.
 */
export const addMemberToTeam = async (teamId, userHandle) => {
  try {
    const teamRef = ref(db, `teams/${teamId}`);
    const teamSnapshot = await get(teamRef);
    
    if (!teamSnapshot.exists()) {
      throw new Error("Team not found");
    }

    const teamData = teamSnapshot.val();
    const updatedMembers = [...teamData.members, userHandle];

    // Update the team with the new members list
    await update(teamRef, { members: updatedMembers });

    // Add the team to the user's list of teams
    const userRef = ref(db, `users/${userHandle}/teams/${teamId}`);
    await set(userRef, true);

    return { id: teamId, ...teamData };
  } catch (error) {
    console.error("Error adding member to team:", error);
    throw error;
  }
};

/**
 * Remove a member from a team.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} userHandle - The handle of the user to remove.
 * @returns {Promise<object>} - The updated team object after removing the member.
 * @throws Will throw an error if removing the member fails.
 */
export const removeMemberFromTeam = async (teamId, userHandle) => {
  try {
    const teamRef = ref(db, `teams/${teamId}`);
    const teamSnapshot = await get(teamRef);
    
    if (!teamSnapshot.exists()) {
      throw new Error("Team not found");
    }

    const teamData = teamSnapshot.val();
    const updatedMembers = teamData.members.filter((member) => member !== userHandle);

    // Update the team with the new members list
    await update(teamRef, { members: updatedMembers });

    // Remove the team from the user's list of teams
    const userRef = ref(db, `users/${userHandle}/teams/${teamId}`);
    await remove(userRef);

    return { id: teamId, ...teamData };
  } catch (error) {
    console.error("Error removing member from team:", error);
    throw error;
  }
};

/**
 * Leave a team.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} userHandle - The handle of the user leaving the team.
 * @returns {Promise<object>} - The updated team object after the user has left.
 * @throws Will throw an error if the user could not leave the team.
 */
export const leaveTeam = async (teamId, userHandle) => {
  try {
    const teamRef = ref(db, `teams/${teamId}`);
    const teamSnapshot = await get(teamRef);
    
    if (!teamSnapshot.exists()) {
      throw new Error("Team not found");
    }

    const teamData = teamSnapshot.val();
    const updatedMembers = teamData.members.filter((member) => member !== userHandle);

    // Update the team with the new members list
    await update(teamRef, { members: updatedMembers });

    // Remove the team from the user's list of teams
    const userRef = ref(db, `users/${userHandle}/teams/${teamId}`);
    await remove(userRef);

    return { id: teamId, ...teamData };
  } catch (error) {
    console.error("Error leaving team:", error);
    throw error;
  }
};

/**
 * Change the owner of a team.
 *
 * @param {string} teamId - The ID of the team.
 * @param {string} newOwnerHandle - The handle of the new owner.
 * @returns {Promise<object>} - The updated team object with the new owner.
 * @throws Will throw an error if changing the owner fails.
 */
export const changeOwner = async (teamId, newOwnerHandle) => {
  try {
    const teamRef = ref(db, `teams/${teamId}`);
    const teamSnapshot = await get(teamRef);

    if (!teamSnapshot.exists()) {
      throw new Error('Team not found');
    }

    const teamData = teamSnapshot.val();

    if (!teamData.members.includes(newOwnerHandle)) {
      throw new Error('New owner must be a member of the team');
    }

    if (teamData.owner === newOwnerHandle) {
      throw new Error('New owner is already the current owner');
    }

    // Update the team's owner
    await update(teamRef, { owner: newOwnerHandle });

    return { ...teamData, owner: newOwnerHandle };
  } catch (error) {
    console.error("Error changing owner:", error);
    throw error;
  }
};

/**
 * Delete a team from Firebase.
 *
 * @param {string} teamId - The ID of the team.
 * @throws Will throw an error if the deletion fails.
 */
export const deleteTeam = async (teamId) => {
  try {
    const teamRef = ref(db, `teams/${teamId}`);
    const teamSnapshot = await get(teamRef);

    if (!teamSnapshot.exists()) {
      throw new Error("Team not found");
    }

    const teamData = teamSnapshot.val();

    if (teamData.members && teamData.members.length > 0) {
      for (const memberHandle of teamData.members) {
        const userTeamRef = ref(db, `users/${memberHandle}/teams/${teamId}`);
        await remove(userTeamRef);
      }
    }

    // Delete the team from the database
    await remove(teamRef);

    console.log("Team deleted successfully");
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
};
