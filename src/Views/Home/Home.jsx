/* eslint-disable no-unused-vars */
import { useLocation } from "react-router-dom";
import styles from "./Home.module.css";
import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { addFriendRequestToUser } from "../../services/user.service";

export function Home() {
  const location = useLocation();
  const users = location.state?.users || [];
  const { userData } = useContext(AppContext);

  return (
    <div className={styles.homepageContainer}>
      <h1 className={styles.header}>Welcome to the LinkUp App!</h1>
      {users.length > 0 ? (
        <ul>
          {users
            .filter((user) => user.uid !== userData?.uid && (!user.friendRequests || (Array.isArray(user.friendRequests) && user.friendRequests.includes(userData?.handle))))
            .map((user) => (
              <div key={user.uid} className="flex items-center space-x-10">
                <li>{user.handle}</li>
                {userData?.friends && userData.friends.includes(user.handle) ? (
                  <p>Already friends</p>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => addFriendRequestToUser(user.handle, userData.handle)}
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
