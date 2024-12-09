import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams} from "../../services/teams.service";
import { getUserByUid } from "../../services/user.service";
import { AppContext } from "../../store/app-context";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
    const { user } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const [visibleChannels, setVisibleChannels] = useState({});
    const [showTeamsDropdown, setShowTeamsDropdown] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserAndTeams = async () => {
        if (user) {
          try {
            const userData = await getUserByUid(user.uid);
            if (userData && userData.handle) {
              const teamsData = await getTeams(userData.handle);
  
              const userTeams = Object.values(teamsData).filter((team) =>
                team.members && team.members.includes(userData.handle)
              );
  
              const filteredTeams = userTeams.map((team) => {
                if (team.channels) {
                  const filteredChannels = Object.entries(team.channels).filter(([channelId, channelData]) => {
                    return channelData.members && channelData.members.includes(userData.handle);
                  });
  
                  return {
                    ...team,
                    channels: filteredChannels.reduce((acc, [channelId, channelData]) => {
                      acc[channelId] = channelData;
                      return acc;
                    }, {}),
                  };
                }
                return team;
              });
  
              setTeams(filteredTeams || []);
            } else {
              console.error("User handle is missing or undefined.");
            }
          } catch (error) {
            console.error("Error fetching user or teams:", error);
          }
        }
      };
  
      fetchUserAndTeams();
    }, [user]);
  
    const handleCreateTeam = () => {
      navigate("/createTeam");
    };
  
    const handleViewTeam = (teamId) => {
      navigate(`/teams/${teamId}`);
    };
  
    const handleViewChannel = async (teamId, channelId) => {
      try {
        navigate(`/teams/${teamId}/channels/${channelId}`);
      } catch (error) {
        console.error("Error switching channels:", error);
      }
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
            <button className="btn join-item">Channel 2</button>
            <button className="btn join-item" onClick={() => navigate("/videoCall")}>
              Video Call
            </button>
            <button className="btn join-item" onClick={() => navigate("/ChatRoom/:id")}>
              ChatRoom
            </button>
            <button className="btn join-item" onClick={() => navigate("ChatRoomList")}>
              Chat Lists
            </button>
            <button className="btn join-item">Channel 3</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;
  