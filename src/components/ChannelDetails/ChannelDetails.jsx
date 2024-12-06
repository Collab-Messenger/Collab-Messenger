import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../store/app-context";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, off, get, update } from "firebase/database";
import { db } from "../../config/firebase-config";
import { sendMessageChannel, leaveChannel, deleteChannel, addMemberToChannel, removeMemberFromChannel } from "../../services/channel.service";

const ChannelDetails = () => {
  const { teamId, channelId } = useParams();
  const { userData } = useContext(AppContext);
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setMessages] = useState([]);
  const [channelMembers, setChannelMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [invitee, setInvitee] = useState("");
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const messagesRef = ref(db, `teams/${teamId}/channels/${channelId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.entries(data).map(([id, message]) => ({
          id,
          ...message,
        }));
        setMessages(messagesArray);
      }
      setLoading(false);
    });

    return () => {
      off(messagesRef);
    };
  }, [teamId, channelId]);

  useEffect(() => {
    const membersRef = ref(db, `teams/${teamId}/channels/${channelId}/members`);

    const unsubscribe = onValue(membersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setChannelMembers(Object.values(data));
      } else {
        setChannelMembers([]);
      }
    });

    return () => {
      off(membersRef);
    };
  }, [teamId, channelId]);

  useEffect(() => {
    const teamMembersRef = ref(db, `teams/${teamId}/members`);

    const unsubscribe = onValue(teamMembersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTeamMembers(Object.values(data));
      } else {
        setTeamMembers([]);
      }
    });

    return () => {
      off(teamMembersRef);
    };
  }, [teamId]);

  useEffect(() => {
    if (userData) {
      setIsUserDataLoaded(true);
    }
  }, [userData]);

  const isOwner = channelMembers && channelMembers.length > 0 && channelMembers[0] === userData.handle;

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!userData || !userData.handle) {
      console.error("User data is not available or handle is missing");
      return;
    }

    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: userData.handle,
        timestamp: new Date().toISOString(),
      };

      await sendMessageChannel(teamId, channelId, message);
      setNewMessage("");
    }
  };

  const handleLeaveChannel = async () => {
    try {
      await leaveChannel(teamId, channelId, userData.handle);
      const membersRef = ref(db, `teams/${teamId}/channels/${channelId}/members`);
      const membersSnapshot = await get(membersRef);
      const updatedMembers = membersSnapshot.val() || [];

      if (updatedMembers.length === 0) {
        await deleteChannel(teamId, channelId);
      }

      navigate("/teams");
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };
  const handleKickMember = async (member) => {
    if (!isOwner) return;
    try {
      await removeMemberFromChannel(teamId, channelId, member);
    } catch (error) {
      console.error("Error kicking member from channel:", error);
    }
  };
  

  const handleEditMessage = (msg) => {
    setEditingMessage(msg);
  };

  const handleCancelEditing = () => {
    setEditingMessage(null);
  };

  const handleSaveMessage = async (messageId) => {
    try {
      const messageRef = ref(db, `teams/${teamId}/channels/${channelId}/messages/${messageId}`);
      await update(messageRef, { text: editingMessage.text });
      setEditingMessage(null);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleInvite = async () => {
    if (!invitee) return;

    try {
      await addMemberToChannel(teamId, channelId, invitee);
      setInvitee("");
    } catch (error) {
      console.error("Error inviting member:", error);
      alert(error.message);
    }
  };


  if (!isUserDataLoaded) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="chat-room">
      <button onClick={() => navigate("/teams")} className="btn btn-secondary mb-4">
        Back
      </button>
      <h2 className="text-2xl font-semibold mb-4">Channel Details</h2>

      <div className="channel-members mb-4">
        <h3 className="text-lg font-semibold">Members:</h3>
        {channelMembers.length > 0 ? (
          <ul className="list-disc list-inside">
            {channelMembers.map((member, index) => (
              <li key={index}>
                {member}
                {isOwner && member !== userData.handle && (
                  <button
                    onClick={() => handleKickMember(member)}
                    className="btn btn-link text-blue-500 ml-2"
                  >
                    Kick
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No members in this channel.</p>
        )}
      </div>

      <div className="invite-member mt-4">
        <h3 className="text-lg font-semibold">Add Team Member:</h3>
        <div className="flex gap-2 items-center">
          <select
            value={invitee}
            onChange={(e) => setInvitee(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">Select a member</option>
            {teamMembers.map((member, index) => (
              !channelMembers.includes(member) && (
                <option key={index} value={member}>
                  {member}
                </option>
              )
            ))}
          </select>
          <button onClick={handleInvite} className="btn btn-primary">
            Add
          </button>
        </div>
      </div>

      <div className="messages space-y-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : allMessages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          allMessages.map((msg) => (
            <div key={msg.id} className="message p-4 rounded-lg shadow">
              {editingMessage?.id === msg.id ? (
                <div>
                  <input
                    type="text"
                    value={editingMessage.text}
                    onChange={(e) =>
                      setEditingMessage({ ...editingMessage, text: e.target.value })
                    }
                    className="input input-bordered w-full mb-2"
                  />
                  <button
                    onClick={() => handleSaveMessage(msg.id)}
                    className="btn btn-primary mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEditing}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p>{msg.text}</p>
                  <small className="text-sm text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                  {msg.sender === userData.handle && (
                    <button
                      onClick={() => handleEditMessage(msg)}
                      className="btn btn-link text-blue-500 ml-2"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
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
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>

      <div className="leave-channel mt-4">
        <button onClick={handleLeaveChannel} className="btn btn-danger">
          Leave Channel
        </button>
      </div>
    </div>
  );
};

export default ChannelDetails;
