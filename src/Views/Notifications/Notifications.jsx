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
            <div key={index}>
              <li>{friendRequest}</li>
              <button onClick={() => acceptFriendRequest(userData.handle, friendRequest)}>Accept</button>
              <button onClick={() => declineFriendRequest(userData.handle, friendRequest)}>Decline</button>
            </div>
          ))}
        </ul>
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
};