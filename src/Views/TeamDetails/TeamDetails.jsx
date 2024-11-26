import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamById, removeMemberFromTeam, addMemberToTeam, leaveTeam, changeOwner } from '../../services/teams.service.js';
import { AppContext } from '../../store/app-context.js';
import { getAllUsers, getUserByUid } from '../../services/user.service.js';

export const TeamDetails = () => {
  const { user } = useContext(AppContext);
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [userHandle, setUserHandle] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) {
      navigate('/login');
      return;
    }

    const fetchUserHandle = async () => {
      try {
        const userData = await getUserByUid(user.uid);
        setUserHandle(userData.handle);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserHandle();
  }, [user, navigate]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const teamData = await getTeamById(teamId);
        setTeam(teamData);
        setMembers(teamData.members);
      } catch (error) {
        console.error('Error fetching team:', error);
      }
    };

    fetchTeam();
  }, [teamId]);

  const isOwner = team?.owner === userHandle;

  const handleKickMember = async (memberHandle) => {
    if (!isOwner) return;
    try {
      const updatedTeam = await removeMemberFromTeam(teamId, memberHandle);
      setTeam(updatedTeam);
      setMembers((prevMembers) =>
        prevMembers.filter((handle) => handle !== memberHandle)
      );
    } catch (error) {
      console.error('Error kicking member:', error);
    }
  };

  const handleAddMember = async (userHandle) => {
    if (!isOwner) return;
    try {
      const updatedTeam = await addMemberToTeam(teamId, userHandle);
      setTeam(updatedTeam);
      setMembers((prevMembers) => [...prevMembers, userHandle]);
      setAllUsers((prevUsers) =>
        prevUsers.filter((user) => user.handle !== userHandle)
      );
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleShowMembers = () => {
    setShowMembers((prev) => !prev);
  };

  const handleShowUsers = async () => {
    if (!isOwner) return;
    if (!showUsers) {
      try {
        const usersData = await getAllUsers();
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

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(teamId, userHandle);
      navigate('/teams');
    } catch (error) {
      console.error('Error leaving team:', error);
    }
  };

  const handleChangeOwner = async (newOwnerHandle) => {
    if (!isOwner) return;
    try {
      const updatedTeam = await changeOwner(teamId, newOwnerHandle);
      setTeam(updatedTeam);
    } catch (error) {
      console.error('Error changing owner:', error);
    }
  };

  if (!team || !userHandle) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Team: {team.name}</h1>
      <h2>{isOwner ? 'You are the owner' : `Owner: ${team.owner}`}</h2>

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

                {isOwner && handle !== userHandle && (
                  <button onClick={() => handleKickMember(handle)}>Kick</button>
                )}

                {isOwner && handle !== userHandle && (
                  <button onClick={() => handleChangeOwner(handle)}>
                    Change Owner
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isOwner && (
        <>
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
        </>
      )}

      <button onClick={handleLeaveTeam}>Leave Team</button>
    </div>
  );
};