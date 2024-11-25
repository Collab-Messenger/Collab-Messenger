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
    try {
      const updatedTeam = await removeMemberFromTeam(teamId, memberHandle);
      setTeam(updatedTeam);

      // Remove the member from the state
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

      // Add the new member to the members array
      setMembers((prevMembers) => [...prevMembers, userHandle]);
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
          <ul>
            {members.map((handle, index) => (
              <li key={index}>
                {handle}
                {/* Allow kicking a member */}
                {handle !== user.handle && ( // Prevent kicking yourself
                  <button onClick={() => handleKickMember(handle)}>Kick</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show/Hide All Users */}
      <button onClick={handleShowUsers}>
        {showUsers ? 'Hide All Users' : 'Show All Users'}
      </button>

      {showUsers && (
        <div>
          <h2>All Users:</h2>
          <ul>
            {allUsers.map((user) => (
              <li key={user.handle}>
                {user.handle}
                <button onClick={() => handleAddMember(user.handle)}>Add to Team</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
