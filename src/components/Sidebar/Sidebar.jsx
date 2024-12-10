import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../store/app-context";
import { ref, onChildAdded, onChildRemoved, onChildChanged, get } from "firebase/database";
import { db } from "../../config/firebase-config";
import styles from "./Sidebar.module.css";
import { ToggleMode } from "../ToggleMode/ToggleMode";

const Sidebar = () => {
  const { user } = useContext(AppContext); // Access user from context
  const [teams, setTeams] = useState([]);
  const [visibleChannels, setVisibleChannels] = useState({});
  const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.uid) return;

    const userHandleRef = ref(db, `users`);
    let userHandle = null;

    const fetchUserHandleAndTeams = async () => {
      // Fetch the user handle from Firebase
      const handleSnapshot = await get(userHandleRef);
      const allUsers = handleSnapshot.val();

      // Find the handle matching the UID
      userHandle = Object.keys(allUsers).find(
        (handle) => allUsers[handle].uid === user.uid
      );

      if (userHandle) {
        const teamsRef = ref(db, "teams");

        const updateTeams = async (snapshot) => {
          const teamId = snapshot.key;
          const teamData = snapshot.val();
          const members = teamData?.members || {};

          // Check if the team is valid and the user is a member
          if (Object.values(members).includes(userHandle)) {
            setTeams((prevTeams) => {
              const existingTeam = prevTeams.find((team) => team.id === teamId);
              if (existingTeam) {
                // Update existing team
                return prevTeams.map((team) =>
                  team.id === teamId ? { id: teamId, ...teamData } : team
                );
              }
              // Add new team
              return [...prevTeams, { id: teamId, ...teamData }];
            });
          } else {
            // Remove invalid team
            setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
          }
        };

        const removeTeam = (snapshot) => {
          const teamId = snapshot.key;
          setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
        };

        // Listeners
        onChildAdded(teamsRef, updateTeams);
        onChildChanged(teamsRef, updateTeams);
        onChildRemoved(teamsRef, removeTeam);
      }
    };

    fetchUserHandleAndTeams();

    // Cleanup function
    return () => {
      const teamsRef = ref(db, "teams");
      teamsRef.off(); // Detach listeners
    };
  }, [user]);

  const handleCreateTeam = () => {
    navigate("/createTeam");
  };

  const handleViewTeam = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const handleViewChannel = (teamId, channelId) => {
    navigate(`/teams/${teamId}/channels/${channelId}`);
  };

  const toggleChannelsVisibility = (teamId) => {
    setVisibleChannels((prevState) => ({
      ...prevState,
      [teamId]: !prevState[teamId],
    }));
  };

  const toggleTeamsDropdown = () => {
    setShowTeamsDropdown(!showTeamsDropdown);
  };

  return (
    <div className={styles.sidebar}>
      <div className="join join-vertical" style={{ display: "flex", flexDirection: "column" }}>
        <button className="btn join-item">DM's</button>

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
                            {team.channels && Object.entries(team.channels).length > 0 ? (
                              Object.entries(team.channels).map(([channelId, channelData]) => (
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
          <button className="btn join-item" onClick={() => navigate("/ChatRoom/:id")}>
            ChatRoom
          </button>
          <button className="btn join-item" onClick={() => navigate("ChatRoomList")}>
            Chat Lists
          </button>
        </div>

        <div className={styles.fixedBottom}></div>
      </div>
      <div className="">
        <button className="btn join-item" onClick={() => navigate("createChatRoom")}>
          +
        </button>
        <ToggleMode />
      </div>
    </div>
  );
};

export default Sidebar;
