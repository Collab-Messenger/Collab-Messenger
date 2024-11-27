import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-context";
import { acceptFriendRequest, declineFriendRequest } from "../../services/user.service";

export const Notifications = () => {
  const { userData, setAppState } = useContext(AppContext);
  const [friendRequests, setFriendRequests] = useState(userData?.friendRequests || []);

  useEffect(() => {
    setFriendRequests(userData?.friendRequests || []);
  }, [userData]);

  const handleAcceptFriendRequest = (friendRequest) => {
    acceptFriendRequest(userData.handle, friendRequest);
    setFriendRequests(friendRequests.filter(request => request !== friendRequest));
  };

  const handleDeclineFriendRequest = (friendRequest) => {
    declineFriendRequest(userData.handle, friendRequest);
    setFriendRequests(friendRequests.filter(request => request !== friendRequest));
  };

  return (
    <div>
      {friendRequests.length > 0 ? (
        <ul>
          {friendRequests.map((friendRequest, index) => (
            <div key={index} className="flex items-center space-x-10">
              <p>{friendRequest} wants to be your friend</p>
              <button
                className="btn btn-primary"
                onClick={() => handleAcceptFriendRequest(friendRequest)}
              >
                Accept
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleDeclineFriendRequest(friendRequest)}
              >
                Decline
              </button>
            </div>
          ))}
        </ul>
      ) : (
        <p>No friend requests</p>
      )}
    </div>
  );
};