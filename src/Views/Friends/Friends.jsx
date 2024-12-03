import { useContext,useState } from "react";
import { AppContext } from "../../store/app-context";
import { removeFriend } from "../../services/user.service";
//import { removeFriend } from "../../services/user.service";
import { getChatRoomById } from "../../services/chat.service";
import CreateChatRoom from "../../components/ChatRoom/create-chatroom";
import ChatRoom from "../../components/ChatRoom/display-chat";

export const Friends = () => {

    const { userData } = useContext(AppContext);
    const [friends,setFriends] = useState(userData?.friend || [])
    const [selectedChatRoomId, setSelectedChatRoomId] = useState();
    const [currentFriend , setCurrentFriend] = useState(null)
    const [loading, setLoading] = useState(false)
    

    const getUserInitials = (friend) => {
        if (friend.firstName) {
            const firstNameI = friend.firstName.split(' ');
            const lastNameI = friend.lastName.split(' ');
            const initialOne = firstNameI.map(name => name[0]).join('');
            const initialTwo = lastNameI.map(name => name[0]).join('');
            return (initialOne.toUpperCase() + initialTwo.toUpperCase());
        } else if (friend.handle) {
            return friend.handle[0].toUpperCase();
        }
        return "User";
    };

    const handleRemoveFriend = (friendHandle) => {
        removeFriend(userData.handle, friendHandle);
        setFriends(friends.filter(friend => friend.handle !== friendHandle));
    };

    const handleStartChat = async (friend) => {
        try {
          setLoading(true);
    
          // Generate a unique chatRoomId based on the user handles
          const chatRoomId = `${userData.handle}_${friend.handle}`; // Optional: Customize this logic to fit your needs
    
          // Attempt to retrieve an existing chatroom
          const chatRoom = await getChatRoomById(chatRoomId);
    
          if (chatRoom) {
            // Chatroom exists, proceed with it
            setSelectedChatRoomId(chatRoomId);
            setCurrentFriend(friend);
          } else {
            console.warn("Chatroom does not exist. Creating a new one...");
    
            // Create a new chatroom
            const newChatRoom = await createChatRoom(userData.handle, friend.handle);
    
            if (newChatRoom) {
              console.log("New chatroom created:", newChatRoom);
              setSelectedChatRoomId(newChatRoom.id); // Use the new chatroom ID
              setCurrentFriend(friend);
            } else {
              console.error("Failed to create a new chatroom.");
            }
          }
        } catch (error) {
          console.error("Error retrieving or creating chatroom:", error.message);
        } finally {
          setLoading(false);
        }
      };
      
      const handleBack = () => {
        setSelectedChatRoomId(null);
        setCurrentFriend(null);
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
                        lassName="btn btn-primary"
                        onClick={() => handleStartChat(friend)}>Message</button>
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
    );
};