import React, { useState } from "react";
import { addChatRoom,isChatRoomNameUnique } from "../../services/chat.service";


//Creation form for chats
const CreateChatRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    setIsLoading(true);

    try {
      // Check if the room name is unique
      const isUnique = await isChatRoomNameUnique(roomName);
      if (!isUnique) {
        setFeedback("Chat room name already exists. Please choose another.");
        setIsLoading(false);
        return;
      }

      // Create the chat room
      const newChatRoom = {
        name: roomName,
        description,
        members: [], // Initially empty; members can be added later
      };

      const chatRoomId = await addChatRoom(newChatRoom);
      setFeedback(`Chat room "${roomName}" created successfully! Room ID: ${chatRoomId}`);
      setRoomName("");
      setDescription("");
    } catch (error) {
      setFeedback("An error occurred while creating the chat room.");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-chat-room">
      <h2>Create a New Chat Room</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="roomName">Room Name:</label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter chat room name"
            required
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter chat room description"
            className="textarea textarea-bordered w-full max-w-xs"
          />
        </div>
        <button
          type="submit"
          className={`btn btn-primary ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Chat Room"}
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default CreateChatRoom;
