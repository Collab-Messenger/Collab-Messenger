import { useContext,useState } from "react";
import { AppContext } from "../../store/app-context";
import { removeFriend } from "../../services/user.service";
import { getChatRoomById ,createChatRoom} from "../../services/chat.service";
import CreateChatRoom from "../../components/ChatRoom/create-chatroom";
import ChatRoom from "../../components/ChatRoom/display-chat";

export const Friends = () => {

    const { userData } = useContext(AppContext);
    const [friends,setFriends] = useState(userData?.friends || [])
    console.log("userData:",userData)
    console.log("Friends",friends)
    const [selectedChatRoomId, setSelectedChatRoomId] = useState();
    const [currentFriend , setCurrentFriend] = useState(null)
    const [loading, setLoading] = useState(false)
    const [creatingChatRoom, setCreatingChatRoom] = useState(false);
    

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
const x = 0;
    const handleRemoveFriend = async (friendHandle) => {
      try {
        await removeFriend(userData.handle, friendHandle);
        setFriends(friends.filter((friend) => friend.handle !== friendHandle));
      } catch (error) {
        console.error("Error removing friend:", error.message);
      }
    };

    const handleStartChat = async (friend) => {
      try {
        setLoading(true);
        setCreatingChatRoom(false);
  
        // Generate a unique chatRoomId based on user and friend handles
        const chatRoomId = `${userData.handle}_${friend.handle}`; // Friends is in userData > friends get current
  
        // Attempt to retrieve an existing chatroom
        const chatRoom = await getChatRoomById(chatRoomId);
  
        if (chatRoom) {
          // Chatroom exists, set it as the selected one
          setSelectedChatRoomId(chatRoomId);
          setCurrentFriend(friend);
        } else {
          // Chatroom does not exist, trigger chat room creation
          setCreatingChatRoom(true);
          setCurrentFriend(friend);
        }
      } catch (error) {
        console.error("Error retrieving or creating chatroom:", error.message);
      } finally {
        setLoading(false);
      }
    };
      
    const handleChatRoomCreated = (newChatRoom) => {
      // When a new chat room is created, set it as the selected one
      setSelectedChatRoomId(newChatRoom.id);
      setCurrentFriend(newChatRoom);
      setCreatingChatRoom(false);
    };

    const handleBack = () => {
    setSelectedChatRoomId(null);
    setCurrentFriend(null);
    setCreatingChatRoom(false);
  };

  return (
  <div>
    {creatingChatRoom ? (
      <CreateChatRoom
        userHandle={userData.handle}
        friendHandle={currentFriend.handle}
        onChatRoomCreated={handleChatRoomCreated}
      />
    ) : selectedChatRoomId && currentFriend ? (
      <ChatRoom chatRoomId={selectedChatRoomId} friend={currentFriend} onBack={handleBack} />
    ) : (
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
                    onClick={() => handleRemoveFriend(friend.handle)}
                  >
                    Remove as a friend
                  </button>
                </div>
              ))}
            </ul>
          </>
        ) : (
          <p>No friends found</p>
        )}
      </div>
    )}
  </div>
);
}