// FILE: Teams.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeams } from '../../services/teams.service.js';
import { AppContext } from '../../store/app-context.js';

export const Teams = () => {
  const { user } = useContext(AppContext);
  const [teams, setTeams] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      if (user) {
        const teamsData = await getTeams(user.uid);
        setTeams(teamsData);
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

  const handleSearchFriends = () => {
    const query = prompt("Enter friend's name to search:");
    if (query) {
      // Mock search results
      setSearchResults([{ id: 1, name: query }]);
    }
  };

  if (!user) {
    return <div>Please log in to view your teams.</div>;
  }

  return (
    <div>
      <h1>Teams</h1>
      <button onClick={handleCreateTeam}>Create New Team</button>
      <button onClick={handleSearchFriends}>Search Friends</button>
      {teams && teams.length === 0 ? (
        <div>You are not a member of any teams.</div>
      ) : (
        <div>
          {teams.map(team => (
            <div key={team.id} onClick={() => handleViewTeam(team.id)}>{team.name}</div>
          ))}
        </div>
      )}
      <div>
        <h2>Search Results</h2>
        {searchResults.map(friend => (
          <div key={friend.id}>{friend.name}</div>
        ))}
      </div>
    </div>
  );
};