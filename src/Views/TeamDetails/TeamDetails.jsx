import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getTeamById, removeMemberFromTeam, addMemberToTeam } from '../../services/teams.service.js';
import { AppContext } from '../../store/app-context.js';
import { getUserByUid } from '../../services/user.service.js';  // Import the getUserByUid function

export const TeamDetails = () => {
  const { user } = useContext(AppContext);
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      // Fetch the team data using the teamId
      const teamData = await getTeamById(teamId);
      setTeam(teamData);

      // Fetch members' details by their UID
      const membersData = await Promise.all(
        teamData.members.map(async (uid) => {
          const userData = await getUserByUid(uid);  // Use the getUserByUid function to get user data
          return userData ? userData.handle : null;  // Collect the user's handle
        })
      );
      setMembers(membersData);  // Set the members' handles
    };

    fetchTeam();
  }, [teamId]);

  const handleKickMember = async (memberId) => {
    const updatedTeam = await removeMemberFromTeam(teamId, memberId);
    setTeam(updatedTeam);
  };

  const handleAddMember = async (friendId, friendHandle) => {
    const updatedTeam = await addMemberToTeam(teamId, friendId, friendHandle);
    setTeam(updatedTeam);
  };

  const handleShowMembers = () => {
    setShowMembers(!showMembers);
  };

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Team: {team.name}</h1>
      <button onClick={handleShowMembers}>
        {showMembers ? 'Hide Members' : 'Show Members'}
      </button>

      {showMembers && (
        <div>
          <h2>Members:</h2>
          <ul>
            {members.map((handle, index) => (
              <li key={index}>{handle}</li>  // Display the member's handle
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
