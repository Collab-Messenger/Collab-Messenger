import { useContext } from "react";
import { AppContext } from "../../store/app-context";

export const Friends = () => {

    const { userData } = useContext(AppContext);

    return (
        <div>
            {userData.friends? (
                <>
                <h2>Friends List</h2>
            <ul>
                {userData.friends.map((friend, index) => (
                    <li key={index}>{friend}</li>
                ))}
            </ul>
                </>
            ):(
                <p>No friends found</p>
            )}

            
        </div>
    )
}