import React, { useContext, useEffect, useState } from "react";
import { ref, onValue, push } from "firebase/database"; // Import ref, onValue, and push
import { db } from "../../config/firebase-config.js"; // Ensure this points to your Firebase configuration
import { AppContext } from "../../store/app-context";

const ChatRoom = ({ chatRoomId, friend, onBack }) => {
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setMessages] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    // Reference to the messages in the Realtime Database
    const messagesRef = ref(db, `chatRooms/${chatRoomId}/messages`);

    // Listen for changes in the messages using onValue
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        messages.push({ id: childSnapshot.key, ...message });
      });
      setMessages(messages); // Update state with real-time messages
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [chatRoomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: userData.handle,
        timestamp: new Date().toISOString(),
      };
      // Push the new message to Firebase
      const messagesRef = ref(db, `chatRooms/${chatRoomId}/messages`);
      await push(messagesRef, message);
      setNewMessage(""); // Clear input field
    }
  };

  return (
    <div
      className="chat-room"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <button onClick={onBack} className="btn btn-secondary">
        Back
      </button>
      <h2>Chat with {friend?.firstName || friend?.handle}</h2>

      <div
        className="chat-container"
        style={{
          width: "100%",
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        {allMessages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          allMessages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${msg.sender === userData.handle ? "chat-end" : "chat-start"}`}
              style={{
                marginBottom: "10px",
                display: "flex",
                flexDirection: msg.sender === userData.handle ? "row-reverse" : "row",
              }}
            >
              <div className="chat-image avatar">
                <div className="w-12 h-12 rounded-full">
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <div className="chat-header">
                {msg.sender === userData.handle ? "You" : friend?.firstName || friend?.handle}
                <time className="text-xs opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</time>
              </div>
              <div className="chat-bubble" style={{ fontSize: "1.2rem", padding: "10px 15px" }}>
                {msg.text}
              </div>
              <div className="chat-footer opacity-50">
                {msg.sender === userData.handle ? "Sent" : "Received"}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-form" style={{ width: "100%" }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input input-bordered"
          style={{
            fontSize: "1.2rem",
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;

