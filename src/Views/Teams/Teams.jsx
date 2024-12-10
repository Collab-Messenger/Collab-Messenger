// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { getTeams } from "../../services/teams.service.js";
// import { getUserByUid } from "../../services/user.service.js";
// import { AppContext } from "../../store/app-context.js";

// export const Teams = () => {
//   const { user } = useContext(AppContext);
//   const [teams, setTeams] = useState([]);
//   const [userHandle, setUserHandle] = useState(null);
//   const [visibleChannels, setVisibleChannels] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserAndTeams = async () => {
//       if (user) {
//         try {
//           const userData = await getUserByUid(user.uid);
//           if (userData && userData.handle) {
//             setUserHandle(userData.handle);

//             const teamsData = await getTeams(userData.handle);

//             const userTeams = Object.values(teamsData).filter(team =>
//               team.members && team.members.includes(userData.handle)
//             );

//             const filteredTeams = userTeams.map(team => {
//               if (team.channels) {
//                 const filteredChannels = Object.entries(team.channels).filter(([channelId, channelData]) => {
//                   return channelData.members && channelData.members.includes(userData.handle);
//                 });

//                 return {
//                   ...team,
//                   channels: filteredChannels.reduce((acc, [channelId, channelData]) => {
//                     acc[channelId] = channelData;
//                     return acc;
//                   }, {}),
//                 };
//               }
//               return team;
//             });

//             setTeams(filteredTeams || []);
//           } else {
//             console.error("User handle is missing or undefined.");
//           }
//         } catch (error) {
//           console.error("Error fetching user or teams:", error);
//         }
//       }
//     };

//     fetchUserAndTeams();
//   }, [user]);

//   const handleCreateTeam = () => {
//     navigate("/createTeam");
//   };

//   const handleViewTeam = (teamId) => {
//     navigate(`/teams/${teamId}`);
//   };

//   const handleViewChannel = (teamId, channelId) => {
//     navigate(`/teams/${teamId}/channels/${channelId}`);
//   };

//   const toggleChannelsVisibility = (teamId) => {
//     setVisibleChannels((prevState) => ({
//       ...prevState,
//       [teamId]: !prevState[teamId],
//     }));
//   };

//   if (!user) {
//     return <div>Please log in to view your teams.</div>;
//   }

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Teams</h1>
//         <button className="btn btn-primary" onClick={handleCreateTeam}>
//           Create New Team
//         </button>
//       </div>

//       {teams.length === 0 ? (
//         <div>You are not a member of any teams.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {teams.map((team) => (
//             <div key={team.id} className="card bg-base-100 w-96 shadow-xl">
//               <div className="card-body items-center text-center">
//                 <h2 className="card-title">{team.name}</h2>

//                 <div className="card-actions justify-center mt-4 space-x-2">
//                   <button
//                     className="btn btn-primary"
//                     onClick={() => toggleChannelsVisibility(team.id)}
//                   >
//                     {visibleChannels[team.id] ? "Hide Channels" : "Show Channels"}
//                   </button>
//                   <button
//                     className="btn btn-ghost"
//                     onClick={() => handleViewTeam(team.id)}
//                   >
//                     ⋮
//                   </button>
//                 </div>

//                 {visibleChannels[team.id] && (
//                   <div className="channels mt-4">
//                     {team.channels && Object.entries(team.channels).length > 0 ? (
//                       Object.entries(team.channels).map(([channelId, channelData]) => (
//                         <div
//                           key={channelId}
//                           className="channel p-2 bg-gray-100 rounded-lg mb-2 cursor-pointer"
//                           onClick={() => handleViewChannel(team.id, channelId)}
//                         >
//                           <h3 className="text-lg font-semibold">{channelData.name}</h3>
//                           <p className="text-sm text-gray-600">{channelData.description}</p>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-sm text-gray-500">No channels available</p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
