import { ref, set, push, get, update} from "firebase/database";
import { db } from "../config/firebase-config";


export const addTeam = async (team) => {
  try {
    // Ensure no undefined values
    const validateTeamData = (team) => {
      const cleanTeam = { ...team };
      Object.keys(cleanTeam).forEach((key) => {
        if (cleanTeam[key] === undefined) {
          cleanTeam[key] = null; // Replace undefined with null
        }
      });
      return cleanTeam;
    };

    const newTeamRef = push(ref(db, 'teams'));
    const teamData = validateTeamData(team); // Validate team data
    await set(newTeamRef, teamData);
    return newTeamRef.key;
  } catch (error) {
    console.log(error.message);
    throw error; // Re-throw the error for further handling if needed
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
      // Safeguard against missing or malformed data
      const members = Array.isArray(teamData.members) ? teamData.members : [];
      const owner = teamData.owner || '';

      // Check if the user is either the owner or in the members list
      if (owner === userHandle || members.includes(userHandle)) {
        userTeams.push({ id: teamId, ...teamData });
      }
    }

    console.log("Fetched Teams:", userTeams); // Debugging fetched teams
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
  
  export const removeMemberFromTeam = async (teamId, memberId) => {
    try {
      const teamRef = ref(db, `teams/${teamId}`);
      const snapshot = await get(teamRef);
      if (snapshot.exists()) {
        const team = snapshot.val();
        team.members = team.members.filter(member => member.id !== memberId);
        await update(teamRef, team);
        return team;
      }
      return null;
    } catch (error) {
      console.log(error.message);
    }
  };