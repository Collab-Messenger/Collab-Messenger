import { useContext,useState } from "react";
import { AppContext } from "../../store/app-context";
import { getUserByHandle, removeFriend } from "../../services/user.service";
//import { removeFriend } from "../../services/user.service";
import { getChatRoomById,createChatRoom } from "../../services/chat.service";
import CreateChatRoom from "../../components/ChatRoom/create-chatroom";
import ChatRoom from "../../components/ChatRoom/display-chat";

export const Friends = () => {

    const { userData } = useContext(AppContext);
    const [friends,setFriends] = useState(userData?.friend || [])
    const [selectedChatRoomId, setSelectedChatRoomId] = useState();
    const [currentFriend , setCurrentFriend] = useState(null)
    const [loading, setLoading] = useState(false)
    const [creatingChatRoom, setCreatingChatRoom] = useState(false);

    const handleRemoveFriend = (friendHandle) => {
        removeFriend(userData.handle, friendHandle);
        setFriends(friends.filter(friend => friend.handle !== friendHandle));
    };

    const handleStartChat = async (friendHandle) => {
      try {
        setLoading(true);
        setCreatingChatRoom(false);
    
        console.log("userData.handle:", userData.handle);
        console.log("friendHandle:", friendHandle);
    
        const chatRoom = await createChatRoom(userData.handle, friendHandle);
    
        if (chatRoom) {
          // Chat room exists or was created, set it as selected
          setSelectedChatRoomId(chatRoom.id);
          setCurrentFriend({ handle: friendHandle });  // Store the friend handle as currentFriend
        }
      } catch (error) {
        console.error("Error creating or retrieving chat room:", error.message);
      } finally {
        setLoading(false);
      }
    };
      
      const handleBack = () => {
        setSelectedChatRoomId(null);
        setCurrentFriend(null);
      };

      return (
        <div className="ml-40 self-center">
         {selectedChatRoomId && currentFriend ? (
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
                            {/* {friend?.isOnline ? (
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
                            )} */}
                          </div>
                        </li>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleStartChat(friend)}
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
