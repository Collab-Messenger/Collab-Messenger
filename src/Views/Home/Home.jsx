import { useContext, useState, useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { AppContext } from "../../store/app-context";
import { addFriendRequestToUser } from "../../services/user.service";
import styles from "./Home.module.css";

/**
 * Home component that displays a list of users and allows the current user to send friend requests.
 * 
 * @returns {JSX.Element} The Home component for the LinkUp app.
 */
export function Home() {
    const location = useLocation(); // React Router location object to access URL state
    const [searchParams] = useSearchParams(); // React Router hook to get query parameters
    const searchQuery = searchParams.get('search') || ''; // Get the 'search' query parameter or use an empty string
    const initialUsers = useMemo(() => location.state?.users || [], [location.state]); // Get initial users from location state
    const { userData } = useContext(AppContext); // Access the current user's data from context
    const [users, setUsers] = useState(initialUsers); // State to store the filtered users list

    /**
     * Effect to filter users based on the search query.
     */
    useEffect(() => {
        if (searchQuery) {
            const normalizedQuery = searchQuery.toLowerCase().trim(); // Normalize search query
            setUsers(
                initialUsers.filter(user =>
                    (user.handle && user.handle.toLowerCase().includes(normalizedQuery)) || // Check handle
                    (user.firstName && user.firstName.toLowerCase().includes(normalizedQuery)) || // Check first name
                    (user.lastName && user.lastName.toLowerCase().includes(normalizedQuery)) // Check last name
                )
            );
        } else {
            setUsers(initialUsers);
        }
    }, [searchQuery, initialUsers]);

    /**
     * Get the initials of a user based on their first and last name or handle.
     *
     * @param {Object} user - The user object.
     * @returns {string} The initials of the user.
     */
    const getUserInitials = (user) => {
        if (user.firstName) {
            const firstNameInitials = user.firstName.split(' ').map(name => name[0]).join(''); // Get initials from first name
            const lastNameInitials = user.lastName.split(' ').map(name => name[0]).join(''); // Get initials from last name
            return (firstNameInitials.toUpperCase() + lastNameInitials.toUpperCase()); // Combine initials
        } else if (user.handle) {
            return user.handle[0].toUpperCase(); // Return the first letter of the handle as initial
        }
        return "U"; // Default to "U" for "User"
    };

    /**
     * Handle sending a friend request to a user.
     *
     * @param {string} handle - The handle of the user to send a friend request to.
     */
    const handleSendFriendRequest = (handle) => {
        if (userData && userData.handle) {
            addFriendRequestToUser(handle, userData.handle); // Call service function to send friend request
            setUsers(users.filter(user => user.handle !== handle)); // Remove the user from the list
            alert('Friend request sent to ' + handle); // Show success alert
        }
    };

    return (
        <div className={styles.homepageContainer}>
            <h1 className={styles.header}>Welcome to the LinkUp App!</h1>
            {users.length > 0 ? (
                <ul>
                    {users
                        .filter(user =>
                            user.uid !== userData?.uid && // Exclude current user
                            (!user.friendRequests || Array.isArray(user.friendRequests) && !user.friendRequests.includes(userData?.handle)) // Check if friendRequests exists and if it includes the current user's handle
                        )
                        .map(user => (
                            <div key={user.uid} className="flex items-center space-x-10">
                                <li>
                                    <div className="relative">
                                        {user?.isOnline ? (
                                            <div className="avatar online placeholder">
                                                <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                                    <span className="text-xl">{getUserInitials(user)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="avatar offline placeholder">
                                                <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                                    <span className="text-xl">{getUserInitials(user)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </li>
                                <p>{user.handle}</p>
                                {userData?.friends && userData.friends.includes(user.handle) ? (
                                    <p>Already friends</p>
                                ) : user.friendRequestSent ? (
                                    <p>Request Sent</p>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            handleSendFriendRequest(user.handle);
                                            setUsers(users.map(u => u.handle === user.handle ? { ...u, friendRequestSent: true } : u)); // Update the user state with friend request sent status
                                        }}
                                    >
                                        Send Friend Request
                                    </button>
                                )}
                            </div>
                        ))}
                </ul>
            ) : (
                <div>
                    <p>We are thrilled to have you here!</p>
                    <p>You are all set to connect with family and friends through videos and message chat.</p>
                    <p>Dive in, explore and start making meaningful connections. Let's chat!</p>
                </div>
            )}
        </div>
    );
}

export default Home;
