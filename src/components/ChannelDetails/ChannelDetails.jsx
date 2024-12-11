import React, { useContext, useEffect, useState } from "react";
import { ref, onValue, push, get } from "firebase/database"; // Import ref, onValue, push, and get
import { db } from "../../config/firebase-config.js"; // Ensure this points to your Firebase configuration
import { AppContext } from "../../store/app-context";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendMessageChannel,
  leaveChannel,
  deleteChannel,
  addMemberToChannel,
  removeMemberFromChannel,
} from "../../services/channel.service";

/**
 * ChannelDetails component for displaying and managing channel messages and members
 * 
 * @component
 */
const ChannelDetails = () => {
  const { teamId, channelId } = useParams();
  const { userData } = useContext(AppContext);
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setMessages] = useState([]);
  const [channelMembers, setChannelMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [channelInfo, setChannelInfo] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [invitee, setInvitee] = useState("");
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetches and sets the messages for the channel.
   */
  useEffect(() => {
    const messagesRef = ref(db, `teams/${teamId}/channels/${channelId}/messages`);

    setMessages([]);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.entries(data).map(async ([id, message]) => {
          const senderRef = ref(db, `teams/${teamId}/channels/${channelId}/messages/${id}/sender`);
          const senderSnapshot = await get(senderRef);
          const senderName = senderSnapshot.exists() ? senderSnapshot.val() : "Unknown";
          return {
            id,
            ...message,
            senderName,
          };
        });

        Promise.all(messagesArray).then((resolvedMessages) => {
          setMessages(resolvedMessages);
        });
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [teamId, channelId]);

  /**
   * Fetches and sets the members for the channel.
   */
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
      unsubscribe();
    };
  }, [teamId, channelId]);

  /**
   * Fetches and sets the team members.
   */
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
      unsubscribe();
    };
  }, [teamId]);

  /**
   * Fetches and sets the channel info (name and description).
   */
  useEffect(() => {
    const channelRef = ref(db, `teams/${teamId}/channels/${channelId}`);
    
    const unsubscribe = onValue(channelRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setChannelInfo({
          name: data.name,
          description: data.description,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [teamId, channelId]);

  /**
   * Sets the user data loaded state when userData changes.
   */
  useEffect(() => {
    if (userData) {
      setIsUserDataLoaded(true);
    }
  }, [userData]);

  /**
   * Checks if the current user is the owner of the channel.
   * 
   * @returns {boolean} - True if the user is the owner, false otherwise.
   */
  const isOwner =
    channelMembers && channelMembers.length > 0 && channelMembers[0] === userData?.handle;

  /**
   * Handles sending a new message in the channel.
   * 
   * @param {Event} e - The submit event of the message form.
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userData || !userData.handle) return;
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

  /**
   * Handles leaving the channel.
   */
  const handleLeaveChannel = async () => {
    try {
      await leaveChannel(teamId, channelId, userData.handle);
      const membersRef = ref(db, `teams/${teamId}/channels/${channelId}/members`);
      const membersSnapshot = await get(membersRef);
      const updatedMembers = membersSnapshot.val() || [];

      if (updatedMembers.length === 0) {
        await deleteChannel(teamId, channelId);
      }

      navigate("/");
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  /**
   * Handles kicking a member from the channel.
   * 
   * @param {string} member - The handle of the member to be kicked.
   */
  const handleKickMember = async (member) => {
    if (!isOwner) return;
    try {
      await removeMemberFromChannel(teamId, channelId, member);
    } catch (error) {
      console.error("Error kicking member from channel:", error);
    }
  };

  /**
   * Handles inviting a new member to the channel.
   */
  const handleInvite = async () => {
    if (!invitee) return;
    try {
      await addMemberToChannel(teamId, channelId, invitee);
      setInvitee("");
    } catch (error) {
      console.error("Error inviting member:", error);
    }
  };

  if (!isUserDataLoaded) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8" style={{ marginTop: '10px' }}>
      {/* Left: Member Controls */}
      <div className="member-controls md:w-2/5" style={{ marginLeft: '50px', marginTop: '100px'}}>
      
        {/* Channel Information */}
        <div className="channel-info mb-4">
          <h1 className="text-3xl font-bold" style={{marginBottom: '10px'}}>{channelInfo.name}</h1>
          <p className="text-lg" style={{marginBottom: '10px'}}>{channelInfo.description}</p>
        </div>
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
                      className="ml-2 btn btn-sm btn-danger"
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
              {teamMembers.map(
                (member, index) =>
                  !channelMembers.includes(member) && (
                    <option key={index} value={member}>
                      {member}
                    </option>
                  )
              )}
            </select>
            <button onClick={handleInvite} className="btn btn-primary">
              Add
            </button>
          </div>
        </div>

        <div className="leave-channel mt-4">
          <button onClick={handleLeaveChannel} className="btn btn-danger">
            Leave Channel
          </button>
        </div>
      </div>

      {/* Right: Chat Room */}
      <div className="chat-room md:w-3/5" style={{ marginLeft: '300px', marginTop: '100px'}}>
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
                  <time className="text-xs opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</time>
                  <div className="text-xs opacity-50" style={{ marginTop: "2px" }}>{msg.senderName}</div>
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
    </div>
  );
};

export default ChannelDetails;
