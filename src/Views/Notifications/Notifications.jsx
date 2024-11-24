import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { acceptFriendRequest, declineFriendRequest } from "../../services/user.service";

export const Notifications = () => {
  const { userData } = useContext(AppContext);

  return (
    <div>
      {userData?.friendRequests && userData.friendRequests.length > 0 ? (
        <ul>
          {userData.friendRequests.map((friendRequest, index) => (
            <div key={index} className="flex items-center space-x-10">
              <li>{friendRequest}</li>
              <button
              className="btn btn-primary" 
              onClick={() => acceptFriendRequest(userData.handle, friendRequest)}>Accept</button>
              <button 
              className="btn btn-primary"
              onClick={() => declineFriendRequest(userData.handle, friendRequest)}>Decline</button>
            </div>
          ))}
        </ul>
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
};