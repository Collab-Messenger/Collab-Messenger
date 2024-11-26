import React, { useState } from "react";
import { sendMessage } from "../../services/chat.service";

const ChatRoom = ({ messages, chatRoomId }) => {
  const [newMessage, setNewMessage] = useState("");
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: "currentUserId", // Replace with actual user ID
        timestamp: new Date().toISOString(),
      };
      await sendMessage(chatRoomId, message);
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
