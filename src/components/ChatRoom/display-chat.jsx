import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getMessages,sendMessage } from "../../services/chat.service";

//component to display messages and send new ones
const ChatRoom = () => {
//   const { id } = useParams(); //Needs to happen in view 
//   const location = useLocation();
//   console.log(location)
//   console.log("IDinChatRoom",id)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Fetch messages in real-time
    getMessages(id, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: "currentUserId", // Replace with logged-in user's ID
        timestamp: new Date().toISOString(),
      };
      await sendMessage(id, message);
      setNewMessage(""); // Clear input field
    }
  };

  return (
    <div className="chat-room">
      <h2>Chat Room</h2>
      <div className="messages">
        {messages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === "currentUserId" ? "sent" : "received"}`}>
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
