import { ref, set, push, get} from "firebase/database";
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