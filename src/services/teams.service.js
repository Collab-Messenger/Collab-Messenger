import { ref, set, push, get, update, remove} from "firebase/database";
import { db } from "../config/firebase-config";


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
  export const addMemberToTeam = async (teamId, userHandle) => {
    try {
      const teamRef = ref(db, `teams/${teamId}`);
      const teamSnapshot = await get(teamRef);
      if (!teamSnapshot.exists()) {
        throw new Error("Team not found");
      }
  
      const teamData = teamSnapshot.val();
      const updatedMembers = [...teamData.members, userHandle];
      await update(teamRef, { members: updatedMembers });
  
      const userRef = ref(db, `users/${userHandle}/teams/${teamId}`);
      await set(userRef, true);
  
      return { id: teamId, ...teamData };
    } catch (error) {
      console.error("Error adding member to team:", error);
    }
  };
  
  
  export const addChannelToTeam = async (teamId, channelName) => {
    try {
      const teamRef = ref(db, `teams/${teamId}`);
      const snapshot = await get(teamRef);
      if (snapshot.exists()) {
        const team = snapshot.val();
        const newChannel = { id: push().key, name: channelName };
        team.channels.push(newChannel);
        await update(teamRef, team);
        return team;
      }
      return null;
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  export const removeMemberFromTeam = async (teamId, userHandle) => {
    try {
      const teamRef = ref(db, `teams/${teamId}`);
      const teamSnapshot = await get(teamRef);
      if (!teamSnapshot.exists()) {
        throw new Error("Team not found");
      }
  
      const teamData = teamSnapshot.val();
      const updatedMembers = teamData.members.filter(member => member !== userHandle);
      await update(teamRef, { members: updatedMembers });
  

      const userRef = ref(db, `users/${userHandle}/teams/${teamId}`);
      await remove(userRef);
  
      return { id: teamId, ...teamData };
    } catch (error) {
      console.error("Error removing member from team:", error);
    }
  };
  

  export const leaveTeam = async (teamId, userHandle) => {
    try {
      const teamRef = ref(db, `teams/${teamId}`);
      const teamSnapshot = await get(teamRef);
      if (!teamSnapshot.exists()) {
        throw new Error("Team not found");
      }
  
      const teamData = teamSnapshot.val();
      const updatedMembers = teamData.members.filter(member => member !== userHandle);
      await update(teamRef, { members: updatedMembers });

      const userRef = ref(db, `users/${userHandle}/teams/${teamId}`);
      await remove(userRef);
  
      return { id: teamId, ...teamData };
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };
  
  

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

      await update(teamRef, { owner: newOwnerHandle });
  
      return { ...teamData, owner: newOwnerHandle };
    } catch (error) {
      console.error("Error changing owner:", error);
      throw error;
    }
  };


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
      await remove(teamRef);
  
      console.log("Team deleted successfully");
    } catch (error) {
      console.error("Error deleting team:", error);
      throw error;
    }
  };