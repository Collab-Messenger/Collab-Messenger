// FILE: Teams.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeams } from '../../services/teams.service.js';
import { AppContext } from '../../store/app-context.js';

export const Teams = () => {
  const { user } = useContext(AppContext);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      if (user) {
        const teamsData = await getTeams(user.uid);
        setTeams(teamsData || []);
      }
    };
    fetchTeams();
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
