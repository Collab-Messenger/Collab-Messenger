import React, { useContext, useEffect, useState } from "react";
import { getMessages } from "../../services/chat.service";  // Ensure correct imports for sendMessageChannel and getMessages
import { AppContext } from "../../store/app-context";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase-config";  // Firebase configuration import
import { ref, onValue, off } from "firebase/database"; // Firebase functions
import { sendMessageChannel } from "../../services/channel.service"; // Ensure correct imports for sendMessageChannel and getMessages

const ChannelDetails = ({ onBack }) => {
  const { teamId, channelId } = useParams(); // Get teamId and channelId from URL params
  const { userData } = useContext(AppContext); // Get user data from context
  const [newMessage, setNewMessage] = useState(""); // State for new message input
  const [allMessages, setMessages] = useState([]); // State for storing messages
  const [loading, setLoading] = useState(true); // Loading state
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false); // To track if userData is loaded

  // Fetch messages for the current channel when component mounts or channelId changes
  useEffect(() => {
    const messagesRef = ref(db, `teams/${teamId}/channels/${channelId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.entries(data).map(([id, message]) => ({
          id,
          ...message,
        }));
        setMessages(messagesArray); // Update the messages state
      }
      setLoading(false); // Set loading to false after fetching messages
    });

    // Cleanup listener when component unmounts or team/channel changes
    return () => {
      off(messagesRef);
    };
  }, [teamId, channelId]);

  // Ensure userData is loaded before allowing message sending
  useEffect(() => {
    if (userData) {
      setIsUserDataLoaded(true);
    }
  }, [userData]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Ensure userData and userData.handle are available before attempting to send a message
    if (!userData || !userData.handle) {
      console.error("User data is not available or handle is missing");
      return; // Don't send the message if userData is not available
    }

    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: userData.handle, // Use the logged-in user's handle
        timestamp: new Date().toISOString(),
      };

      await sendMessageChannel(teamId, channelId, message); // Send message to Firebase under the specific channel
      setNewMessage(""); // Clear the message input field

      // Optionally, we can re-fetch messages or rely on real-time updates
      // const updatedMessages = await getMessages(teamId, channelId);
      // setMessages(updatedMessages); 
    }
  };

  // Return a fallback UI if userData is still loading or missing
  if (!isUserDataLoaded) {
    return <div>Loading user data...</div>; // Show a loading state or redirect to login if needed
  }

  return (
    <div className="chat-room">
      <button onClick={onBack} className="btn btn-secondary mb-4">
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Channel Details</h2>

      <div className="messages space-y-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : allMessages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          allMessages.map((msg) => (
            <div
              key={msg.id}
              className="message p-4 rounded-lg shadow"
            >
              <p>{msg.text}</p>
              <small className="text-sm text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-form mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};

export default ChannelDetails;
