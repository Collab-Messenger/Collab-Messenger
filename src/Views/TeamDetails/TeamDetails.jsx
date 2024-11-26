import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  getTeamById,
  removeMemberFromTeam,
  addMemberToTeam,
} from '../../services/teams.service.js';
import { AppContext } from '../../store/app-context.js';
import { getAllUsers } from '../../services/user.service.js'; // Fetch all users with their handles

export const TeamDetails = () => {
  const { user } = useContext(AppContext);
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // Fetch the team data by ID
        const teamData = await getTeamById(teamId);
        setTeam(teamData);
        setMembers(teamData.members); // Use handles directly from the `members` array
      } catch (error) {
        console.error('Error fetching team:', error);
      }
    };

    fetchTeam();
  }, [teamId]);

  const handleKickMember = async (memberHandle) => {
    console.log('Attempting to kick member:', memberHandle);
  
    try {
      const updatedTeam = await removeMemberFromTeam(teamId, memberHandle);
      console.log('Updated team from Firebase:', updatedTeam);
  
      // Update local states
      setTeam(updatedTeam);
      setMembers((prevMembers) =>
        prevMembers.filter((handle) => handle !== memberHandle)
      );
    } catch (error) {
      console.error('Error kicking member:', error);
    }
  };

  const handleAddMember = async (userHandle) => {
    try {
      const updatedTeam = await addMemberToTeam(teamId, userHandle);
      setTeam(updatedTeam);
  
      // Optimistically update the members list
      setMembers((prevMembers) => [...prevMembers, userHandle]);
  
      // Remove the added user from the "allUsers" list
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.handle !== userHandle));
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };
  const handleShowMembers = () => {
    setShowMembers((prev) => !prev);
  };

  const handleShowUsers = async () => {
    if (!showUsers) {
      try {
        const usersData = await getAllUsers();
        // Filter out users already in the team
        const nonMembers = usersData.filter(
          (user) => !team.members.includes(user.handle)
        );
        setAllUsers(nonMembers);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    }
    setShowUsers((prev) => !prev);
  };

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Team: {team.name}</h1>

      {/* Show/Hide Team Members */}
      <button onClick={handleShowMembers}>
        {showMembers ? 'Hide Members' : 'Show Members'}
      </button>

      {showMembers && (
        <div>
          <h2>Members:</h2>
          <div>
            {members.map((handle, index) => (
              <div key={`member-${handle}-${index}`} style={{ marginBottom: '10px' }}>
                {handle}
                {handle !== user.handle && (
                  <button onClick={() => handleKickMember(handle)}>Kick</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show/Hide All Users */}
      <button onClick={handleShowUsers}>
        {showUsers ? 'Hide All Users' : 'Show All Users'}
      </button>

      {showUsers && (
        <div>
          <h2>All Users:</h2>
          <div>
            {allUsers.map((user, index) => (
              <div key={`user-${user.handle}-${index}`} style={{ marginBottom: '10px' }}>
                {user.handle}
                <button onClick={() => handleAddMember(user.handle)}>Add to Team</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
