import React, { useContext, useEffect, useState } from "react";
import { getMessages, sendMessage } from "../../services/chat.service";
import { AppContext } from "../../store/app-context";

const ChatRoom = ({ chatRoomId, onBack }) => {
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setMessages] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages(chatRoomId);
      setMessages(messages); // Update state with fetched messages
    };

    fetchMessages();

    // Optional: Add real-time updates with `onValue`
    // return unsubscribe function if using listeners

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

      // Fetch the updated messages (or rely on real-time updates)
      const updatedMessages = await getMessages(chatRoomId);
      setMessages(updatedMessages);
    }
  };

  return (
    <div className="chat-room">
      <button onClick={onBack} className="btn btn-secondary">
        Back
      </button>
      <h2>Chat Room</h2>
      <div className="messages">
        {allMessages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          allMessages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === userData.handle ? "sent" : "received"}`}
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
        <button type="submit" className="btn btn-primary">
          Send
        </button>
        <button className="btn btn-primary"> Video Call</button>
      </form>
    </div>
  );
};

export default ChatRoom;
