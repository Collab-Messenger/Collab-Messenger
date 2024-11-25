import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeams } from '../../services/teams.service.js';
import { getUserByUid } from '../../services/user.service.js'; // Import function to fetch user details
import { AppContext } from '../../store/app-context.js';

export const Teams = () => {
  const { user } = useContext(AppContext);
  const [teams, setTeams] = useState([]);
  const [userHandle, setUserHandle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndTeams = async () => {
      if (user) {
        // Fetch the user's handle using their UID
        const userData = await getUserByUid(user.uid);
        if (userData && userData.handle) {
          setUserHandle(userData.handle);

          // Fetch teams using the user's handle
          const teamsData = await getTeams(userData.handle);
          console.log("Fetched Teams:", teamsData); // Debug fetched teams
          setTeams(teamsData || []);
        } else {
          console.error("User handle is missing or undefined.");
        }
      }
    };
    fetchUserAndTeams();
  }, [user]);

  const handleCreateTeam = () => {
    navigate('/createTeam');
  };

  const handleViewTeam = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  if (!user) {
    return <div>Please log in to view your teams.</div>;
  }

  return (
    <div>
      <h1>Teams</h1>
      {teams.length === 0 ? (
        <div>You are not a member of any teams.</div>
      ) : (
        <div>
          {teams.map(team => (
            <div key={team.id} onClick={() => handleViewTeam(team.id)}>{team.name}</div>
          ))}
        </div>
      )}
      <button onClick={handleCreateTeam}>Create New Team</button>
    </div>
  );
};
