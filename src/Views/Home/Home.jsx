import styles from "./Home.module.css";
import searchIcon from "../../assets/icons/icons.svg";

export function Home() {
  return (
    <div className={styles.homepageContainer}>
      <h1 className={styles.header}>Welcome to the Next-Discord App!</h1>
      <p>We are thrilled to have you here!</p>
      <p>You are all set to connect with family and friends through videos and message chat.</p>
      <p>Dive in, explore and start making meaningful connections. Let's chat!</p>
      <button className={styles.searchButton}>
        Search for Friends
        <img className={styles.searchIcon} src={searchIcon} alt="Search" />
        <div className={styles.tooltip}>Search</div>
      </button>
    </div>
  );
}