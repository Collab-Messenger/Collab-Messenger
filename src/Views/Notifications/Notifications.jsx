import { useContext } from "react";
import { AppContext } from "../../store/app-context";


export const Notifications = () => {

    const { userData, setAppState } = useContext(AppContext);

    return (
        <div>
            {userData.friendRequests ? (
                <ul>
                    {userData.friendRequests.map((user) => (
                        <div key={user.uid}>
                            <li>{user}</li>
                            <> </>
                            <button>Accept</button>
                            <> </>
                            <button>Decline</button>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No notifications</p>
            )}
        </div>
    )
}