import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, off, get, push, set } from 'firebase/database';
import {
  removeMemberFromTeam,
  addMemberToTeam,
  leaveTeam,
  changeOwner,
  deleteTeam,
} from '../../services/teams.service';
import { AppContext } from '../../store/app-context';
import { db } from '../../config/firebase-config';
import { getAllUsers, getUserByUid } from '../../services/user.service';
import CreateChannel from '../../components/CreateChannel/CreateChannel';

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
  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false);

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
    const teamRef = ref(db, `teams/${teamId}`);
    const unsubscribe = onValue(teamRef, (snapshot) => {
      if (snapshot.exists()) {
        const teamData = snapshot.val();
        setTeam(teamData);
        setMembers(teamData.members || []);
      } else {
        navigate('/teams');
      }
    });

    return () => {
      off(teamRef);
    };
  }, [teamId, navigate]);

  const isOwner = team?.owner === userHandle;

  const handleKickMember = async (memberHandle) => {
    if (!isOwner) return;
    try {
      await removeMemberFromTeam(teamId, memberHandle);
    } catch (error) {
      console.error('Error kicking member:', error);
    }
  };

  const handleAddMember = async (userHandle) => {
    if (!isOwner) return;
    try {
      await addMemberToTeam(teamId, userHandle);
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.handle !== userHandle));
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
      if (isOwner) {
        const newOwnerHandle = team.members[1];
        if (newOwnerHandle) {
          await changeOwner(teamId, newOwnerHandle);
        } else {
          await deleteTeam(teamId);
          navigate('/teams');
          return;
        }
      }
      await leaveTeam(teamId, userHandle);
      navigate('/teams');
    } catch (error) {
      console.error('Error leaving team:', error);
    }
  };

  const handleChangeOwner = async (newOwnerHandle) => {
    if (!isOwner) return;
    try {
      await changeOwner(teamId, newOwnerHandle);
    } catch (error) {
      console.error('Error changing owner:', error);
    }
  };

  const handleCreateChannel = useCallback(async (channelData) => {
    console.log('handleCreateChannel invoked with data: ', channelData);
  
    try {
      const teamChannelRef = ref(db, `teams/${teamId}/channels`);
      const newChannelRef = push(teamChannelRef);
  

      const teamMembersRef = ref(db, `teams/${teamId}/members`);
      const teamMembersSnapshot = await get(teamMembersRef);
      const teamMembers = teamMembersSnapshot.exists() ? teamMembersSnapshot.val() : [];
  
  
      const fullChannelData = {
        ...channelData,
        members: channelData.isPrivate ? [team.owner] : teamMembers,
      };
  

      await set(newChannelRef, fullChannelData);

      const snapshot = await get(ref(db, `teams/${teamId}`));
      setTeam(snapshot.val());
      setShowCreateChannelForm(false);
  
      console.log('Channel added successfully to the team with members!');
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  }, [teamId, team?.owner]);

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
                  <button onClick={() => handleChangeOwner(handle)}>Change Owner</button>
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

      {isOwner && !showCreateChannelForm && (
        <button onClick={() => setShowCreateChannelForm(true)}>Create Channel</button>
      )}

      {showCreateChannelForm && (
        <CreateChannel
          teamId={teamId}
          teamOwner={team.owner}
          onChannelCreated={handleCreateChannel}
        />
      )}
    </div>
  );
};
