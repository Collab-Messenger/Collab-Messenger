import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-context";
import { acceptFriendRequest, declineFriendRequest } from "../../services/user.service";

/**
 * Notifications component that displays the current user's friend requests and allows them to accept or decline them.
 * 
 * @returns {JSX.Element} The Notifications component for managing friend requests in the LinkUp app.
 */
export const Notifications = () => {
    const { userData, setAppState } = useContext(AppContext); // Access the AppContext for user data and state setter
    const [friendRequests, setFriendRequests] = useState(userData?.friendRequests || []); // State to store the list of friend requests

    /**
     * Effect hook to update the list of friend requests when the user data changes.
     */
    useEffect(() => {
        setFriendRequests(userData?.friendRequests || []); // Update friend requests based on current user data
    }, [userData]);

    /**
     * Handle accepting a friend request.
     *
     * @param {string} friendRequest - The handle of the user sending the friend request.
     */
    const handleAcceptFriendRequest = (friendRequest) => {
        acceptFriendRequest(userData.handle, friendRequest); // Service call to accept friend request
        setFriendRequests(friendRequests.filter(request => request !== friendRequest)); // Remove the accepted request from the list
    };

    /**
     * Handle declining a friend request.
     *
     * @param {string} friendRequest - The handle of the user sending the friend request.
     */
    const handleDeclineFriendRequest = (friendRequest) => {
        declineFriendRequest(userData.handle, friendRequest); // Service call to decline friend request
        setFriendRequests(friendRequests.filter(request => request !== friendRequest)); // Remove the declined request from the list
    };

    return (
        <div className="ml-[700px] self-center">
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
                <h1 className="text-2xl font-bold mb-4">No friend requests</h1>
            )}
        </div>
    );
};

export default Notifications;
