import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase-config";
import { onValue, ref } from "firebase/database";
import ChatRoom from "../../components/ChatRoom/display-chat";

export default function ChatRoomView() {
  const [messages, setMessages] = useState([]);
  const { id } = useParams(); // Chat room ID from URL

  useEffect(() => {
    const messagesRef = ref(db, `chatRooms/${id}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) { 
        // Convert object to array, if necessary
        const parsedMessages = Object.values(data);
        setMessages(parsedMessages);
      } else {
        setMessages([]); // No messages yet
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [id]);

  return (
    <div>
      <h1>Chat Room</h1>
      <ChatRoom messages={messages} chatRoomId={id} />
    </div>
  );
}
