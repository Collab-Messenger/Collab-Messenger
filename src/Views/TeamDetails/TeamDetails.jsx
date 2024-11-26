// FILE: TeamDetails.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getTeamById, removeMemberFromTeam, addMemberToTeam } from '../../services/teams.service.js';
import { AppContext } from '../../store/app-context.js';
import { getFriends } from '../../services/user.service';

export const TeamDetails = () => {
  const { user } = useContext(AppContext);
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      const teamData = await getTeamById(teamId);
      setTeam(teamData);
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

  const handleShowFriends = async () => {
    const friendsData = await getFriends(user.uid);
    const nonMembers = friendsData.filter(friend => !team.members.some(member => member.id === friend.id));
    setFriends(nonMembers);
    setShowFriends(true);
  };

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Team: {team.name}</h1>
    </div>
  );
};
