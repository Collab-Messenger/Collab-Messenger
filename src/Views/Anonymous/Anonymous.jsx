import { useState, useEffect } from 'react';
import { db } from '../../config/firebase-config';
import { ref, get, child } from 'firebase/database';
import styles from './Anonymous.module.css';

export function Anonymous() {
    const [userCount, setUserCount] = useState(0);
    const [teamCount, setTeamCount] = useState(0);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const dbRef = ref(db);
                const snapshot = await get(child(dbRef, 'users'));
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    setUserCount(Object.keys(users).length);
                }
            } catch (error) {
                console.error(error);
            }
        };
        const fetchTeamCount = async () => {
            try {
                const dbRef = ref(db);
                const snapshot = await get(child(dbRef, 'teams'));
                if (snapshot.exists()) {
                    const teams = snapshot.val();
                    setTeamCount(Object.keys(teams).length);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserCount();
        fetchTeamCount();
    }, []);

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