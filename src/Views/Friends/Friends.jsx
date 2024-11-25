import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { removeFriend } from "../../services/user.service";
//import { removeFriend } from "../../services/user.service";

export const Friends = () => {

    const { userData } = useContext(AppContext);

    return (
        <div>
            {userData?.friends? (
                <>
                <h2>Friends List</h2>
            <ul>
                
                {userData.friends.map((friend, index) => (
                    <div key={index} className="flex items-center space-x-10">
                        <li>{friend}</li>
                        <button
                        className="btn btn-primary">Message</button>
                        <button
                    className="btn btn-primary"
                    onClick={() => removeFriend(userData.handle, friend)}
                  >Remove as a friend</button>
                    </div>
                ))}
                
            </ul>
                </>
            ):(
                <p>No friends found</p>
            )}

            
        </div>
    )
}