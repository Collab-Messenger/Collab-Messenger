import React, { useState } from "react";

const CreateChannel = ({ teamId, teamOwner, onChannelCreated }) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const channelData = {
      name: channelName.trim(),
      description: description.trim(),
      createdBy: teamOwner,
      createdOn: new Date().toISOString(),
      isPrivate,
    };

    try {
      console.log("Submitting channel:", channelData);

      setError("");
      onChannelCreated(channelData);

    } catch (error) {
      setError("Error creating channel: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-channel p-4 bg-grey shadow-lg rounded-lg max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Create a New Channel</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label htmlFor="channelName" className="block text-sm font-medium text-gray-700">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="input input-bordered w-full p-2 border rounded-md"
            placeholder="Enter channel name"
            required
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full p-2 border rounded-md"
            placeholder="Enter a brief description of the channel"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="isPrivate" className="block text-sm font-medium text-gray-700">
            Private Channel
          </label>
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="mr-2"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="btn btn-primary w-full p-2 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Channel"}
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;
