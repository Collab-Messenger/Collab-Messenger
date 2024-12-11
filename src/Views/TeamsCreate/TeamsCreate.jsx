import { useState, useContext } from "react";
import { addTeam, isTeamNameUnique } from "../../services/teams.service.js";
import { AppContext } from "../../store/app-context.js";
import { useNavigate } from "react-router-dom";
import { getUserByUid } from "../../services/user.service.js";
import { ref, set } from "firebase/database"; 
import { db } from "../../config/firebase-config";
import styles from './TeamsCreate.module.css';

/**
 * Component for creating a new team.
 *
 * @returns {JSX.Element} The TeamsCreate component allowing users to create a new team.
 */
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

  /**
   * Function to create a new team.
   * Validates team name length, checks if the team name is unique, then creates the team.
   */
  const createTeam = async () => {
    // Check if the team name is between 3 and 40 characters
    if (team.name.length < 3 || team.name.length > 40) {
      alert('Team name must be between 3 and 40 characters.');
      return;
    }

    // Check if the team name is unique
    const isUnique = await isTeamNameUnique(team.name);
    if (!isUnique) {
      alert('Team name must be unique.');
      return;
    }

    try {
      // Retrieve the user handle for the current user
      const userHandle = user?.handle || (await getUserByUid(user.uid)).handle;
      if (!userHandle) {
        alert("Unable to retrieve your user handle. Please log in again.");
        return;
      }

      // Create the new team object
      const newTeam = {
        name: team.name,
        members: [userHandle],
        owner: userHandle,
        channels: team.channels
      };

      // Add the new team to the database
      const teamId = await addTeam(newTeam);
      
      // Update the component state with the new team ID and reset the name field
      setTeam((prevTeam) => ({
        ...prevTeam,
        id: teamId,
        name: '',
      }));

      // Set the user reference for the newly created team
      const userTeamRef = ref(db, `users/${userHandle}/teams/${teamId}`);
      await set(userTeamRef, true);
      
      // Navigate to the team home page after creation
      navigate('/');
      return;
    } catch (error) {
      console.error("Error creating team:", error.message);
    }
  };

  return (
    <div className={styles.popupBackground}>
      <div className={styles.popupContainer}>
        <h1>Create a Team</h1>
        <input
          type="text"
          placeholder="Team Name"
          value={team.name}
          onChange={(e) => setTeam({ ...team, name: e.target.value })}
        />
        <button onClick={createTeam}>Create Team</button>
      </div>
    </div>
  );
}
