import React, { useContext, useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../services/chat.service";
import { AppContext } from "../../store/app-context";

const ChatRoom = ({ chatRoomId, friend, onBack }) => {
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setMessages] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(chatRoomId);
      setMessages(messages); // Update state with fetched messages
    };

    fetchMessages();
  }, [chatRoomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: userData.handle,
        timestamp: new Date().toISOString(),
      };
      await sendMessage(chatRoomId, message);
      setNewMessage(""); // Clear input field

      // Fetch updated messages (or rely on real-time updates)
      const updatedMessages = await getMessages(chatRoomId);
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="chat-room">
      <button onClick={onBack} className="btn btn-secondary">
        Back
      </button>
      <h2>Chat with {friend?.firstName || friend?.handle}</h2>
      
      {/* Chat container */}
      <div className="chat-container" style={{ maxHeight: "80vh", overflowY: "auto", padding: "10px" }}>
        {/* Map over messages to display them */}
        {allMessages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          allMessages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${msg.sender === userData.handle ? "chat-end" : "chat-start"}`}
              style={{ marginBottom: "20px" }} // Add space between messages
            >
              <div className="chat-image avatar">
                <div className="w-12 h-12 rounded-full"> {/* Increase avatar size */}
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" // Update to dynamic avatar if needed
                  />
                </div>
              </div>
              <div className="chat-header">
                {msg.sender === userData.handle ? userData.firstName : friend?.firstName}
                <time className="text-xs opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</time>
              </div>
              <div
                className="chat-bubble"
                style={{
                  fontSize: "1.2rem", // Increase font size
                  padding: "10px 15px", // Increase padding for bigger bubbles
                  maxWidth: "80%", // You can set the max width as per your design
                }}
              >
                {msg.text}
              </div>
              <div className="chat-footer opacity-50">
                {msg.sender === userData.handle ? "Sent" : "Received"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input input-bordered"
          style={{ fontSize: "1.2rem", padding: "10px" }} // Larger text input
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;

