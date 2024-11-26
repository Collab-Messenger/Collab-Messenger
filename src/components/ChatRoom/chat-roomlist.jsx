import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllChatRooms } from "../../services/chat.service";

//component to show the list of chat rooms:
const ChatRoomList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatRooms = async () => {
      const rooms = await getAllChatRooms();
      console.log('Fetched ChatRooms', rooms)
      setChatRooms(rooms);
    };
    fetchChatRooms();
  }, []);

  return (
    <div className="chat-room-list">
      <h2>Available Chat Rooms</h2>
      {chatRooms.length === 0 ? (
        <p>No chat rooms available. Create one to get started!</p>
      ) : (
        <ul>
          {chatRooms.map((room) => (
           
            <li key={room.id}>

              <button onClick={() => navigate(`/chatRooms/${room.id}`)} className="btn btn-secondary">
                {room.name}
              </button>
            </li>
            
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatRoomList;
