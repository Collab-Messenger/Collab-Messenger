import { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { removeFriend } from "../../services/user.service";
//import { removeFriend } from "../../services/user.service";

export const Friends = () => {

    const { userData } = useContext(AppContext);

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

    return (
        <div>
            {userData?.friends? (
                <>
                <h2>Friends List</h2>
            <ul>
                
                {userData.friends.map((friend, index) => (
                    <div key={index} className="flex items-center space-x-10">
                        <li>
                        <div className="relative">
                    {friend?.isOnline ? (
                        <div className="avatar online placeholder">
                        <div className="bg-neutral text-neutral-content w-16 rounded-full">
                            <span className="text-xl">{friend ? getUserInitials(friend) : 'User'}</span>
                        </div>
                    </div>
                    ): (
                        <div className="avatar offline placeholder">
                        <div className="bg-neutral text-neutral-content w-16 rounded-full">
                            <span className="text-xl">{friend ? getUserInitials(friend) : 'User'}</span>
                        </div>
                    </div>
                    )}
                </div>
                        </li>
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