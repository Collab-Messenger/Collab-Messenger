import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { acceptFriendRequest, declineFriendRequest } from "../../services/user.service";

export const Notifications = () => {
    const { userData } = useContext(AppContext);

    const getUserInitials = (user) => {
        if (user) {
            const firstNameI = user.split(' ');
            const initialOne = firstNameI.map(name => name[0]).join('');
            return (initialOne.toUpperCase());
        } else  {
            return user[0].toUpperCase();
        }
    };

    return (
        <div>
            {userData?.friendRequests && userData.friendRequests.length > 0 ? (
                <ul>
                    {userData.friendRequests.map((friendRequest, index) => (
                        <div key={index} className="flex items-center space-x-10">
                            <li>
                                <div className="relative">
                                    {friendRequest?.isOnline ? (
                                        <div className="avatar online placeholder">
                                            <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                                <span className="text-xl">{friendRequest ? getUserInitials(friendRequest) : 'User'}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="avatar offline placeholder">
                                            <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                                <span className="text-xl">{friendRequest ? getUserInitials(friendRequest) : 'User'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                                <p>{friendRequest} wants to be your friend</p>
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