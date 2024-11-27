import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../store/app-context";
import { removeFriend } from "../../services/user.service";

export const Friends = () => {
    const { userData, setAppState } = useContext(AppContext);
    const [friends, setFriends] = useState(userData?.friends || []);

    useEffect(() => {
        setFriends(userData?.friends || []);
    }, [userData]);

    const getUserInitials = (friend) => {
        if (friend.firstName) {
            const firstNameI = friend.firstName.split(' ');
            const lastNameI = friend.lastName.split(' ');
            const initialOne = firstNameI.map(name => name[0]).join('');
            const initialTwo = lastNameI.map(name => name[0]).join('');
            return (initialOne.toUpperCase() + initialTwo.toUpperCase());
        } else if (friend.handle) {
            return friend.handle[0].toUpperCase();
        }
        return "User";
    };

    const handleRemoveFriend = (friendHandle) => {
        removeFriend(userData.handle, friendHandle);
        setFriends(friends.filter(friend => friend.handle !== friendHandle));
    };

    return (
        <div>
            {friends.length > 0 ? (
                <>
                    <h2>Friends List</h2>
                    <ul>
                        {friends.map((friend, index) => (
                            <div key={index} className="flex items-center space-x-10">
                                <li>
                                    <div className="relative">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                                <span className="text-xl">{getUserInitials(friend)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <p>{friend}</p>
                                <button
                                    className="btn btn-primary">Message</button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleRemoveFriend(friend)}
                                >
                                    Remove as a friend
                                </button>
                            </div>
                        ))}
                    </ul>
                </>
            ) : (
                <p>No friends found</p>
            )}
        </div>
    );
};