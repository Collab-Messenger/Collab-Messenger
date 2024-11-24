import { ref, set, push, get, update} from "firebase/database";
import { db } from "../config/firebase-config";


export const addTeam = async (team) => {
  try {
    const newTeamRef = push(ref(db, 'teams'));
    await set(newTeamRef, team);
    return newTeamRef.key;
  } catch (error) {
    console.log(error.message);
 
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

export const getTeams = async (userId) => {
    try {
      const teamsRef = ref(db, 'teams');
      const snapshot = await get(teamsRef);
      if (snapshot.exists()) {
        return Object.entries(snapshot.val())
          .map(([id, team]) => ({ id, ...team }))
          .filter(team => team.members && team.members.includes(userId));
      }
      return [];
    } catch (error) {
      console.log(error.message);
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