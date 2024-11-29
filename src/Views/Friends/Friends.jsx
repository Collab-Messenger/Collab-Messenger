import { useContext,useState } from "react";
import { AppContext } from "../../store/app-context";
import { removeFriend } from "../../services/user.service";
//import { removeFriend } from "../../services/user.service";
import ChatRoom from "../../components/ChatRoom/display-chat";
import { getMessages } from "../../services/chat.service";
import { getChatRoomById } from "../../services/chat.service";


export const Friends = () => {

    const { userData } = useContext(AppContext);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState();
    const [currentFriend , setCurrentFriend] = useState(null)
    const [loading, setLoading] = useState(false)

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

    const handleStartChat = async (friend) => {
        try {
            setLoading(true); // Show loading state
            const chatRoomId = `${userData.handle}_${friend.handle}`; // Generate chatRoomId (custom logic)
            const chatRoom = await getChatRoomById(chatRoomId);

            if (chatRoom) {
                setSelectedChatRoomId(chatRoomId);
                setCurrentFriend(friend);
            } else {
                console.error("Chat room does not exist.");
                // Optionally, handle logic for creating a chat room if it doesn't exist
            }
        } catch (error) {
            console.error("Failed to retrieve chat room:", error);
        } finally {
            setLoading(false); // Hide loading state
        }
    };


    return (
        <div>
            {userData?.friends ? (
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
                                        ) : (
                                            <div className="avatar offline placeholder">
                                                <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                                    <span className="text-xl">{friend ? getUserInitials(friend) : 'User'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </li>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleStartChat(friend.handle)}
                                >
                                    Message
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => removeFriend(userData.handle, friend)}
                                >Remove as a friend</button>
                            </div>
                        ))}

                    </ul>
                </>
            ) : (
                <p>No friends found</p>
            )}


        </div>
    )
}