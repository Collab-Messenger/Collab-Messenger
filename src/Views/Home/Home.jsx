import { useLocation } from "react-router-dom";
import styles from "./Home.module.css";
import searchIcon from "../../assets/icons/icons.svg";

export function Home() {
  const location = useLocation();
  const users = location.state?.users || [];

  return (
    <div className={styles.homepageContainer}>
      <h1 className={styles.header}>Welcome to the Next-Discord App!</h1>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.uid}>{user.handle}</li>
          ))}
        </ul>
      ) : (
        <>
          <p>We are thrilled to have you here!</p>
          <p>You are all set to connect with family and friends through videos and message chat.</p>
          <p>Dive in, explore and start making meaningful connections. Let's chat!</p>
        </>
      )}
    </div>
  );
}