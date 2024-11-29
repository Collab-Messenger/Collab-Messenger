
import React, { useState } from "react";
import { addChatRoom } from "../../services/chat.service"; // Assuming the service for creating chat rooms

const CreateChatRoom = ({ currentUserId, friendId, onChatCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback("");

    try {
      // Generate a unique room name based on user IDs or handles
      const roomName = `${currentUserId}-${friendId}`;

      // Create the chat room with both users as members
      const newChatRoom = {
        name: roomName,
        members: [currentUserId, friendId],
      };

      // Call the service to create the chat room
      const chatRoomId = await addChatRoom(newChatRoom);

      // Callback to notify parent that the chat room was created
      onChatCreated(chatRoomId);

      setFeedback(`Chat room created successfully!`);
    } catch (error) {
      setFeedback("An error occurred while creating the chat room.");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`btn btn-primary ${isLoading ? "loading" : ""}`}
      >
        {isLoading ? "Creating..." : "Start Chat"}
      </button>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default CreateChatRoom;
