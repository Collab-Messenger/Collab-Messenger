// FILE: TeamsCreate.jsx
import { useState, useContext } from "react";
import { addTeam, isTeamNameUnique } from "../../services/teams.service.js";
import { AppContext } from "../../store/app-context.js";
import { useNavigate } from "react-router-dom";

export function TeamsCreate() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [team, setTeam] = useState({
    id: '',
    name: '',
    members: '',
    owner: user ? user.uid : null,
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
      const newTeam = {
        name: team.name,
        members: [user.uid],
        owner: user.uid,
        channels: team.channels
      };
      const teamId = await addTeam(newTeam);
      setTeam((prevTeam) => ({
        ...prevTeam,
        id: teamId,
        name: '',
      }));
      navigate('/teams');
      return;
    } catch (error) {
      console.log(error.message);
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