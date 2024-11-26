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
    const snapshot = await get(ref(db, 'teams'));
    if (!snapshot.exists()) {
      return [];
    }

    const allTeams = snapshot.val();
    const userTeams = [];

    for (const [teamId, teamData] of Object.entries(allTeams)) {
      const members = Array.isArray(teamData.members) ? teamData.members : [];
      const owner = teamData.owner || '';
      if (owner === userHandle || members.includes(userHandle)) {
        userTeams.push({ id: teamId, ...teamData });
      }
    }

    console.log("Fetched Teams:", userTeams);
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
  export const addMemberToTeam = async (teamId, memberId) => {
    try {
      const teamRef = ref(db, `teams/${teamId}`);
      const snapshot = await get(teamRef);
      if (snapshot.exists()) {
        const team = snapshot.val();
        if (!team.members.includes(memberId)) {
          team.members.push(memberId);
          await update(teamRef, team);
        }
        return team;
      }
      return null;
    } catch (error) {
      console.log(error.message);
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
  
  
  export const removeMemberFromTeam = async (teamId, memberHandle) => {
    const teamRef = ref(db, `teams/${teamId}`);
    const teamSnapshot = await get(teamRef);
    if (!teamSnapshot.exists()) {
      throw new Error('Team not found');
    }
  
    const teamData = teamSnapshot.val();
    const updatedMembers = teamData.members.filter(
      (handle) => handle !== memberHandle
    );
    await update(teamRef, { members: updatedMembers });
    return { ...teamData, members: updatedMembers };
  };
  

  export const leaveTeam = async (teamId, memberHandle) => {
    const teamRef = ref(db, `teams/${teamId}`);
    const teamSnapshot = await get(teamRef);
  
    if (!teamSnapshot.exists()) {
      throw new Error('Team not found');
    }
  
    const teamData = teamSnapshot.val();
    const updatedMembers = teamData.members.filter(handle => handle !== memberHandle);
  
    // If the leaving user is the owner, transfer ownership
    if (teamData.owner === memberHandle) {
      if (updatedMembers.length > 0) {
        const newOwnerHandle = updatedMembers[0]; // Transfer ownership to the first member
        await update(teamRef, { owner: newOwnerHandle, members: updatedMembers });
      } else {
        // If no members left, delete the team
        await remove(teamRef);
        return null; // Team deleted
      }
    } else {
      // If the user is not the owner, just remove them from the members list
      await update(teamRef, { members: updatedMembers });
    }
  
    return { ...teamData, members: updatedMembers };
  };
  
  // Add any other necessary functions like addMemberToTeam or removeMemberFromTeam
  