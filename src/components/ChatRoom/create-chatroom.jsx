import React, { useState } from "react";
import { createChatRoom } from "../../services/chat.service.js";

const CreateChatRoom = ({ userHandle, friendHandle, onChatRoomCreated }) => {
  const [chatRoomName, setChatRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateChatRoom = async (e) => {
    e.preventDefault();

    if (!chatRoomName.trim()) {
      setError("Chat room name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const chatRoomData = {
        name: chatRoomName.trim(),
        description: description.trim(),
        createdOn: new Date().toISOString(),
      };

      // Call the service to create a chat room
      const newChatRoom = await createChatRoom(userHandle, friendHandle, chatRoomData);

      if (newChatRoom) {
        if (onChatRoomCreated) {
          onChatRoomCreated(newChatRoom);
        }
        setChatRoomName("");
        setDescription("");
      } else {
        setError("Failed to create chat room.");
      }
    } catch (error) {
      setError("Error creating chat room: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-chat-room">
      <h2>Create a New Chat Room</h2>
      <form onSubmit={handleCreateChatRoom}>
        <div className="form-group">
          <label htmlFor="chatRoomName">Chat Room Name</label>
          <input
            type="text"
            id="chatRoomName"
            value={chatRoomName}
            onChange={(e) => setChatRoomName(e.target.value)}
            className="input input-bordered"
            placeholder="Enter chat room name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered"
            placeholder="Enter a brief description of the chat room"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Chat Room"}
        </button>
      </form>
    </div>
  );
};

export default CreateChatRoom;
