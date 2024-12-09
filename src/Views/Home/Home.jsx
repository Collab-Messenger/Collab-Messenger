/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../store/app-context";
import { addFriendRequestToUser } from "../../services/user.service";
import styles from "./Home.module.css";

export function Home() {
  const location = useLocation();
  const initialUsers = location.state?.users || [];
  const { userData } = useContext(AppContext);
  const [users, setUsers] = useState(initialUsers);

  const getUserInitials = (user) => {
    if (user.firstName) {
      const firstNameI = user.firstName.split(' ');
      const lastNameI = user.lastName.split(' ');
      const initialOne = firstNameI.map(name => name[0]).join('');
      const initialTwo = lastNameI.map(name => name[0]).join('');
      return (initialOne.toUpperCase() + initialTwo.toUpperCase());
    } else if (user.handle) {
      return user.handle[0].toUpperCase();
    }
    return "User";
  };

  const handleSendFriendRequest = (handle) => {
    addFriendRequestToUser(handle, userData.handle);
    setUsers(users.filter(user => user.handle !== handle));
    alert('Friend request sent to ' + handle);
  };

return (
    <div className={styles.homepageContainer}>
        <h1 className={styles.header}>Welcome to the LinkUp App!</h1>
        {users.length > 0 ? (
            <ul>
                {users
                    .filter((user) => user.uid !== userData?.uid && (!user.friendRequests || (Array.isArray(user.friendRequests) && user.friendRequests.includes(userData?.handle))))
                    .map((user) => (
                        <div key={user.uid} className="flex items-center space-x-10">
                            <li>
                                <div className="relative">
                                    {user?.isOnline ? (
                                        <div className="avatar online placeholder">
                                            <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                                <span className="text-xl">{user ? getUserInitials(user) : 'User'}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="avatar offline placeholder">
                                            <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                                <span className="text-xl">{user ? getUserInitials(user) : 'User'}</span>
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
                                        setUsers(users.map(u => u.handle === user.handle ? { ...u, friendRequestSent: true } : u));
                                    }}
                                >
                                    Send Friend Request
                                </button>
                            )}
                        </div>
                    ))}
            </ul>
        ) : (
            <>
                <p>We are thrilled to have you here!</p>
                <p>You are all set to connect with family and friends through videos and message chat.</p>
                <p>Dive in, explore and start making meaningful connections. Let&apos;s chat!</p>
            </>
        )}
    </div>
);
}

export default Home;
