import React, { useContext, useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../services/chat.service";
import { AppContext } from "../../store/app-context";

const ChatRoom = ({ messages, chatRoomId }) => {
  const [newMessage, setNewMessage] = useState("");
  const [allMessages,setMessages] = useState([])
  const {userData} = useContext(AppContext)
  // console.log(userData);
  // console.log("messagesFromDB",allMessages)
  // console.log("messagesAllR",allMessagesReversed)

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: userData.handle, // Replace with actual user ID
        timestamp: new Date().toISOString(),
      };
      await sendMessage(chatRoomId, message);
      setNewMessage(""); // Clear input field
    }
  };

  useEffect(()=>{
    getMessages(chatRoomId).then(setMessages)

  },[messages])

  const allMessagesReversed = Object.values(allMessages);

  return (
    <div className="chat-room">
      <h2>Chat Room</h2>
      <div className="messages">
        {allMessagesReversed.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          allMessagesReversed?.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "currentUserId" ? "sent" : "received"}`}
            >
              <p>{msg.text}</p>
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
