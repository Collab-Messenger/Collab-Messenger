import { useState, useEffect } from 'react';
import { db } from '../../config/firebase-config';
import { ref, get, child } from 'firebase/database';
import styles from './Anonymous.module.css';

/**
 * Anonymous component to display platform statistics.
 *
 * @returns {JSX.Element} The Anonymous component displaying user and team counts.
 */
export function Anonymous() {
    const [userCount, setUserCount] = useState(0); // State to store the total number of users
    const [teamCount, setTeamCount] = useState(0); // State to store the total number of teams

    useEffect(() => {
        /**
         * Fetch the total number of users from the Firebase database.
         */
        const fetchUserCount = async () => {
            try {
                const dbRef = ref(db); // Reference to the Firebase database
                const snapshot = await get(child(dbRef, 'users')); // Get data from 'users' path
                if (snapshot.exists()) {
                    const users = snapshot.val(); // Get users data
                    setUserCount(Object.keys(users).length); // Set user count based on the number of keys (users)
                }
            } catch (error) {
                console.error("Error fetching user count:", error); // Log any errors
            }
        };

        /**
         * Fetch the total number of teams from the Firebase database.
         */
        const fetchTeamCount = async () => {
            try {
                const dbRef = ref(db); // Reference to the Firebase database
                const snapshot = await get(child(dbRef, 'teams')); // Get data from 'teams' path
                if (snapshot.exists()) {
                    const teams = snapshot.val(); // Get teams data
                    setTeamCount(Object.keys(teams).length); // Set team count based on the number of keys (teams)
                }
            } catch (error) {
                console.error("Error fetching team count:", error); // Log any errors
            }
        };

        // Invoke fetch functions when the component mounts
        fetchUserCount();
        fetchTeamCount();
    }, []); // Empty dependency array means the effect runs only once when the component mounts

    return (
        <div className={styles.container}>
            <div className={styles.caption}>Welcome to the LinkUp App!</div>
            <div className={styles['platform-statistics']}>
                <h2>Platform Statistics</h2>
                <div className={styles.stats}>
                    <p>Users: {userCount}</p>
                    <p>Teams: {teamCount}</p>
                </div>
            </div>
        </div>
    );
}
