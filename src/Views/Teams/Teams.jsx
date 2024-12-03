import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams } from "../../services/teams.service.js";
import { getUserByUid } from "../../services/user.service.js";
import { AppContext } from "../../store/app-context.js";

export const Teams = () => {
  const { user } = useContext(AppContext);
  const [teams, setTeams] = useState([]);
  const [userHandle, setUserHandle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndTeams = async () => {
      if (user) {
        const userData = await getUserByUid(user.uid);
        if (userData && userData.handle) {
          setUserHandle(userData.handle);

          // Fetch teams data with proper structure
          const teamsData = await getTeams(userData.handle);
          console.log("Fetched Teams:", teamsData);

          // If teamsData is in a format like { teamId: {name: "Team1", ...}, ... }
          // You might need to modify the structure of teamsData based on your database
          setTeams(teamsData || []);
        } else {
          console.error("User handle is missing or undefined.");
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

  const handleViewChannel = (teamId, channelId) => {
    navigate(`/teams/${teamId}/channels/${channelId}`);
  };

  if (!user) {
    return <div>Please log in to view your teams.</div>;
  }

  return (
    <div>
      <h1>Teams</h1>
      {teams.length === 0 ? (
        <div>You are not a member of any teams.</div>
      ) : (
        <div>
          {teams.map((team) => (
            <div key={team.id} className="team">
              <h2 onClick={() => handleViewTeam(team.id)}>
                {team.name} {/* Display the team name */}
              </h2>
              <div className="channels">
                {team.channels ? (
                  Object.entries(team.channels).map(([channelId, channelData]) => (
                    <div
                      key={channelId}
                      className="channel"
                      onClick={() => handleViewChannel(team.id, channelId)}
                    >
                      <h3>Channel: {channelData.name}</h3> {/* Display channel name */}
                      <p>Description: {channelData.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No channels available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleCreateTeam}>Create New Team</button>
    </div>
  );
};
