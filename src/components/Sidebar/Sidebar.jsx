import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/app-context";
import { ref, onChildAdded, onChildRemoved, onChildChanged, get } from "firebase/database";
import { db } from "../../config/firebase-config";
import styles from "./Sidebar.module.css";
import { ToggleMode } from "../ToggleMode/ToggleMode";

/**
 * Sidebar component for user teams and channels management.
 */
const Sidebar = () => {
  const { user } = useContext(AppContext);
  const [teams, setTeams] = useState([]); // State for storing user's teams
  const [channels, setChannels] = useState({}); // State for storing channels by team
  const [visibleChannels, setVisibleChannels] = useState({}); // State for managing visibility of channels
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false); // State for toggling teams dropdown visibility
  const [listeners, setListeners] = useState([]); // State for managing firebase listeners
  const navigate = useNavigate();

  /**
   * Fetches user handle and their associated teams from Firebase database.
   */
  useEffect(() => {
    if (!user || !user.uid) return;

    const userHandleRef = ref(db, `users`);
    let userHandle = null;

    /**
     * Fetch user handle and teams from Firebase.
     */
    const fetchUserHandleAndTeams = async () => {
      const handleSnapshot = await get(userHandleRef);
      const allUsers = handleSnapshot.val();

      userHandle = Object.keys(allUsers).find(
        (handle) => allUsers[handle].uid === user.uid
      );

      if (userHandle) {
        const teamsRef = ref(db, "teams");

        /**
         * Update teams and channels based on firebase snapshot.
         */
        const updateTeams = async (snapshot) => {
          const teamId = snapshot.key;
          const teamData = snapshot.val();
          const members = teamData?.members || {};

          // If user is a member of this team
          if (Object.values(members).includes(userHandle)) {
            setTeams((prevTeams) => {
              const existingTeam = prevTeams.find((team) => team.id === teamId);
              if (existingTeam) {
                return prevTeams.map((team) =>
                  team.id === teamId ? { id: teamId, ...teamData } : team
                );
              }

              return [...prevTeams, { id: teamId, ...teamData }];
            });

            // Fetch and set team channels
            const teamChannelsRef = ref(db, `teams/${teamId}/channels`);
            const channelsSnapshot = await get(teamChannelsRef);
            if (channelsSnapshot.exists()) {
              const teamChannels = channelsSnapshot.val();
              const filteredChannels = Object.fromEntries(
                Object.entries(teamChannels).filter(([channelId, channelData]) => 
                  channelData.members.includes(userHandle)
                )
              );
              setChannels((prevChannels) => ({
                ...prevChannels,
                [teamId]: filteredChannels,
              }));
            }

            // Listen to channel changes
            const onChannelAdded = (snapshot) => {
              const channelId = snapshot.key;
              const channelData = snapshot.val();

              if (channelData.members && channelData.members.includes(userHandle)) {
                setChannels((prevChannels) => ({
                  ...prevChannels,
                  [teamId]: {
                    ...prevChannels[teamId],
                    [channelId]: channelData,
                  },
                }));
              }
            };

            const onChannelChanged = (snapshot) => {
              const channelId = snapshot.key;
              const channelData = snapshot.val();

              if (channelData.members && channelData.members.includes(userHandle)) {
                setChannels((prevChannels) => ({
                  ...prevChannels,
                  [teamId]: {
                    ...prevChannels[teamId],
                    [channelId]: channelData,
                  },
                }));
              }
            };

            const onChannelRemoved = (snapshot) => {
              const channelId = snapshot.key;
              setChannels((prevChannels) => {
                const updatedChannels = { ...prevChannels };
                delete updatedChannels[teamId][channelId];
                return updatedChannels;
              });
            };

            const channelListeners = [
              onChildAdded(teamChannelsRef, onChannelAdded),
              onChildChanged(teamChannelsRef, onChannelChanged),
              onChildRemoved(teamChannelsRef, onChannelRemoved),
            ];
            setListeners((prevListeners) => [...prevListeners, ...channelListeners]);
          } else {
            // Remove team and its channels if user is no longer a member
            setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
            setChannels((prevChannels) => {
              const updatedChannels = { ...prevChannels };
              delete updatedChannels[teamId];
              return updatedChannels;
            });
          }
        };

        // Listeners for teams
        const teamListeners = [
          onChildAdded(teamsRef, updateTeams),
          onChildChanged(teamsRef, updateTeams),
          onChildRemoved(teamsRef, (snapshot) => {
            const teamId = snapshot.key;
            setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
            setChannels((prevChannels) => {
              const updatedChannels = { ...prevChannels };
              delete updatedChannels[teamId];
              return updatedChannels;
            });
          }),
        ];
        setListeners((prevListeners) => [...prevListeners, ...teamListeners]);
      }
    };

    fetchUserHandleAndTeams();

    return () => {
      listeners.forEach((listener) => {
        if (listener && typeof listener.off === 'function') {
          listener.off();
        }
      });
    };
  }, [user, listeners]);

  /**
   * Navigate to the team creation page.
   */
  const handleCreateTeam = () => {
    navigate("/createTeam");
  };

  /**
   * Navigate to a specific team's page.
   * @param {string} teamId - The ID of the team to view.
   */
  const handleViewTeam = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  /**
   * Navigate to a specific channel within a team.
   * @param {string} teamId - The ID of the team.
   * @param {string} channelId - The ID of the channel to view.
   */
  const handleViewChannel = (teamId, channelId) => {
    navigate(`/teams/${teamId}/channels/${channelId}`);
  };

  /**
   * Toggle the visibility of channels for a team.
   * @param {string} teamId - The ID of the team.
   */
  const toggleChannelsVisibility = (teamId) => {
    setVisibleChannels((prevState) => ({
      ...prevState,
      [teamId]: !prevState[teamId],
    }));
  };

  /**
   * Toggle the visibility of the teams dropdown.
   */
  const toggleTeamsDropdown = () => {
    setShowTeamsDropdown(!showTeamsDropdown);
  };

  return (
    <div className={styles.sidebar}>
      <div className="join join-vertical" style={{ display: "flex", flexDirection: "column" }}>
        {/* <button className="btn join-item">DM's</button> */}

        <div className={styles.sidebar}>
          <div className="join join-vertical" style={{ display: "flex", flexDirection: "column" }}>
            <button className="btn join-item teams-button" onClick={toggleTeamsDropdown}>
              Teams
            </button>
            {showTeamsDropdown && (
              <div className="dropdown">
                {teams.length > 0 ? (
                  <ul className="menu bg-base-100 w-full p-2 rounded-box shadow">
                    {teams.map((team) => (
                      <li key={team.id} className="team-item">
                        <div className="flex justify-between items-center">
                          <button
                            className="flex-grow text-left"
                            onClick={() => toggleChannelsVisibility(team.id)}
                          >
                            {team.name}
                          </button>
                          <button
                            className="w-2 h-8 flex items-center justify-center rounded-full"
                            onClick={() => handleViewTeam(team.id)}
                          >
                            ⋮
                          </button>
                        </div>
                        {visibleChannels[team.id] && (
                          <ul>
                            {channels[team.id] && Object.entries(channels[team.id]).length > 0 ? (
                              Object.entries(channels[team.id]).map(([channelId, channelData]) => (
                                <li key={channelId} className="channel-item">
                                  <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => handleViewChannel(team.id, channelId)}
                                  >
                                    {channelData.name}
                                  </button>
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500 channel-item">
                                No channels available
                              </li>
                            )}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 p-2">You are not a member of any teams.</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: "50px" }}>
          <button className="btn join-item" onClick={handleCreateTeam}>
            Create Team
          </button>
          <button className="btn join-item" onClick={() => navigate("/videoCall")}>
            Video Call
          </button>
        </div>

        <div className={styles.fixedBottom}></div>
      </div>
      <div className="">
        {/* <button className="btn join-item" onClick={() => navigate("createChatRoom")}>
          +
        </button> */}
        <ToggleMode />
      </div>
    </div>
  );
};

export default Sidebar;
