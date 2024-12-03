import React, { useState } from "react";

const CreateChannel = ({ onChannelCreated }) => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateChannel = async (e) => {
    e.preventDefault();

    if (!channelName.trim()) {
      setError("Channel name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const channelData = {
        name: channelName.trim(),
        description: description.trim(),
        createdOn: new Date().toISOString(),
      };

      const newChannel = await onChannelCreated(channelData);

      if (newChannel) {
        setChannelName("");
        setDescription("");
      } else {
        setError("Failed to create channel.");
      }
    } catch (error) {
      setError("Error creating channel: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-channel">
      <h2>Create a New Channel</h2>
      <form onSubmit={handleCreateChannel}>
        <div className="form-group">
          <label htmlFor="channelName">Channel Name</label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="input input-bordered"
            placeholder="Enter channel name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered"
            placeholder="Enter a brief description of the channel"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Channel"}
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;
