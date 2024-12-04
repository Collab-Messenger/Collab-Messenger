import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/app-context";
import { useParams } from "react-router-dom";
import { ref, onValue, off } from "firebase/database";
import { db } from "../../config/firebase-config";
import { sendMessageChannel } from "../../services/channel.service";

const ChannelDetails = ({ onBack }) => {
  const { teamId, channelId } = useParams(); // Get teamId and channelId from URL params
  const { userData } = useContext(AppContext); // Get user data from context
  const [newMessage, setNewMessage] = useState(""); // State for new message input
  const [allMessages, setMessages] = useState([]); // State for storing messages
  const [channelMembers, setChannelMembers] = useState([]); // State for channel members
  const [loading, setLoading] = useState(true); // Loading state for messages
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

  // Fetch channel members in real-time when component mounts or channelId changes
  useEffect(() => {
    const membersRef = ref(db, `teams/${teamId}/channels/${channelId}/members`);

    const unsubscribe = onValue(membersRef, (snapshot) => {
      if (snapshot.exists()) {
        setChannelMembers(snapshot.val()); // Update channel members state
      } else {
        setChannelMembers([]); // No members
      }
    });

    // Cleanup listener when component unmounts or channel changes
    return () => {
      off(membersRef);
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

      {/* Display channel members */}
      <div className="channel-members mb-4">
        <h3 className="text-lg font-semibold">Members:</h3>
        {channelMembers.length > 0 ? (
          <ul className="list-disc list-inside">
            {channelMembers.map((member, index) => (
              <li key={index}>{member}</li> // Replace with user-friendly display names if available
            ))}
          </ul>
        ) : (
          <p>No members in this channel.</p>
        )}
      </div>

      {/* Display messages */}
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

      {/* Message input form */}
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
