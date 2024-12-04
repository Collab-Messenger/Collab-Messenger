import { useState, useContext } from "react";
import { addTeam, isTeamNameUnique } from "../../services/teams.service.js";
import { AppContext } from "../../store/app-context.js";
import { useNavigate } from "react-router-dom";
import { getUserByUid } from "../../services/user.service.js";
import { ref, set } from "firebase/database"; 
import { db } from "../../config/firebase-config";

export function TeamsCreate() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [team, setTeam] = useState({
    id: '',
    name: '',
    members: [],
    owner: null,
    channels: []
  });


  const createTeam = async () => {

    if (team.name.length < 3 || team.name.length > 40) {
      alert('Team name must be between 3 and 40 characters.');
      return;
    }

    const isUnique = await isTeamNameUnique(team.name);
    if (!isUnique) {
      alert('Team name must be unique.');
      return;
    }

    try {
  
      const userHandle = user?.handle || (await getUserByUid(user.uid)).handle;

      if (!userHandle) {
        alert("Unable to retrieve your user handle. Please log in again.");
        return;
      }

      const newTeam = {
        name: team.name,
        members: [userHandle],
        owner: userHandle,
        channels: team.channels
      };

      const teamId = await addTeam(newTeam);

   
      setTeam((prevTeam) => ({
        ...prevTeam,
        id: teamId,
        name: '',
      }));

      const userTeamRef = ref(db, `users/${userHandle}/teams/${teamId}`);
      await set(userTeamRef, true);
      navigate('/teams');
      return;
    } catch (error) {
      console.error("Error creating team:", error.message);
    }
  };

  return (
    <div>
      <h1>Create a Team</h1>
      <input
        type="text"
        placeholder="Team Name"
        value={team.name}
        onChange={(e) => setTeam({ ...team, name: e.target.value })}
      />
      <button onClick={createTeam}>Create Team</button>
    </div>
  );
}
