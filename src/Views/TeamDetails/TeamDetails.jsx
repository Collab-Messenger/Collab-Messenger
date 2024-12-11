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
import styles from './TeamDetails.module.css';

/**
 * Component for displaying team details including members, channels, and managing team settings.
 *
 * @returns {JSX.Element} The TeamDetails component for managing teams in the LinkUp app.
 */
export const TeamDetails = () => {
    const { user } = useContext(AppContext);
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [userHandle, setUserHandle] = useState(null);
    const [activeSection, setActiveSection] = useState(null); // New single state for active section

    /**
     * Fetch the user handle for the current user.
     */
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

    /**
     * Set up real-time listener for the team data from Firebase.
     */
    useEffect(() => {
        const teamRef = ref(db, `teams/${teamId}`);
        const unsubscribe = onValue(teamRef, (snapshot) => {
            if (snapshot.exists()) {
                const teamData = snapshot.val();
                setTeam(teamData);
                setMembers(teamData.members || []);
            } else {
                navigate('/');
            }
        });

        return () => {
            off(teamRef);
        };
    }, [teamId, navigate]);

    /**
     * Check if the current user is the owner of the team.
     */
    const isOwner = team?.owner === userHandle;

    /**
     * Handle removing a member from the team.
     *
     * @param {string} memberHandle - The handle of the member to remove.
     */
    const handleKickMember = async (memberHandle) => {
        if (!isOwner) return;
        try {
            await removeMemberFromTeam(teamId, memberHandle);
        } catch (error) {
            console.error('Error kicking member:', error);
        }
    };

    /**
     * Handle adding a member to the team.
     *
     * @param {string} userHandle - The handle of the user to add.
     */
    const handleAddMember = async (userHandle) => {
        if (!isOwner) return;
        try {
            await addMemberToTeam(teamId, userHandle);
            setAllUsers((prevUsers) => prevUsers.filter((user) => user.handle !== userHandle));
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    /**
     * Fetch and show the list of all users who are not yet members of the team.
     */
    const handleShowUsers = async () => {
        if (!isOwner) return;
        if (activeSection !== 'users') {
            try {
                const usersData = await getAllUsers();
                const nonMembers = usersData.filter(
                    (user) => team && team.members && !team.members.includes(user.handle)
                );
                setAllUsers(nonMembers);
            } catch (error) {
                console.error('Error fetching all users:', error);
            }
        }
        setActiveSection(activeSection === 'users' ? null : 'users');
    };

    /**
     * Handle changing the owner of the team.
     *
     * @param {string} newOwnerHandle - The handle of the new owner.
     */
    const handleChangeOwner = async (newOwnerHandle) => {
        if (!isOwner) return;
        try {
            await changeOwner(teamId, newOwnerHandle);
        } catch (error) {
            console.error('Error changing owner:', error);
        }
    };

    /**
     * Handle leaving the team.
     */
    const handleLeaveTeam = async () => {
        try {
            if (isOwner) {
                const newOwnerHandle = team.members[1];
                if (newOwnerHandle) {
                    await changeOwner(teamId, newOwnerHandle);
                } else {
                    await deleteTeam(teamId);
                    navigate('/');
                    return;
                }
            }
            await leaveTeam(teamId, userHandle);
            navigate('/');
        } catch (error) {
            console.error('Error leaving team:', error);
        }
    };

    /**
     * Handle creating a new channel in the team.
     *
     * @param {Object} channelData - The data for the new channel.
     */
    const handleCreateChannel = useCallback(async (channelData) => {
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
            setActiveSection(null); // Close form after creating channel
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    }, [teamId, team?.owner]);

    if (!team || !userHandle) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.teamName}>{team.name}</h1>

            <h2 className={styles.subtitle}>
                {isOwner ? 'You are the owner' : `Owner: ${team.owner}`}
            </h2>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.button}
                    onClick={() => setActiveSection(activeSection === 'members' ? null : 'members')}
                >
                    {activeSection === 'members' ? 'Hide Members' : 'Show Members'}
                </button>

                {isOwner && (
                    <button className={styles.button} onClick={handleShowUsers}>
                        {activeSection === 'users' ? 'Hide All Users' : 'Show All Users'}
                    </button>
                )}

                <button className={styles.button} onClick={handleLeaveTeam}>
                    Leave Team
                </button>

                {isOwner && (
                    <button
                        className={styles.button}
                        onClick={() => setActiveSection(activeSection === 'createChannel' ? null : 'createChannel')}
                    >
                        {activeSection === 'createChannel' ? 'Hide Create Channel' : 'Create Channel'}
                    </button>
                )}
            </div>

            {activeSection === 'members' && (
                <div className={`${styles.section} ${styles.membersList}`}>
                    <h2>Members:</h2>
                    <div>
                        {members.map((handle, index) => (
                            <div key={`member-${handle}-${index}`} className={styles.listItem}>
                                {handle}
                                {isOwner && handle !== userHandle && (
                                    <div className={styles.memberActions}>
                                        <button className={styles.redButton} onClick={() => handleKickMember(handle)}>
                                            Kick user
                                        </button>
                                        <button className={styles.yellowButton} onClick={() => handleChangeOwner(handle)}>
                                            Make Owner
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isOwner && activeSection === 'users' && (
                <div className={`${styles.section} ${styles.usersList}`}>
                    <h2>All Users:</h2>
                    <div>
                        {allUsers.length === 0 ? (
                            <p>No users available</p>
                        ) : (
                            allUsers.map((user, index) => (
                                <div key={`user-${user.handle}-${index}`} className={styles.listItem}>
                                    {user.handle}
                                    <button onClick={() => handleAddMember(user.handle)}>Add to Team</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeSection === 'createChannel' && (
                <CreateChannel
                    teamId={teamId}
                    teamOwner={team.owner}
                    onChannelCreated={handleCreateChannel}
                />
            )}
        </div>
    );
};

