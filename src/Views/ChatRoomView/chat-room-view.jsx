import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase-config";
import { onValue,ref } from "firebase/database";
import ChatRoom from "../../components/ChatRoom/display-chat";


export default function chatRoomView () {
    const [messages, setMessages] = useState([]);
    const { id } = useParams();

    
    return (
        <div>
          <h1>Single Tweet</h1>
          {tweet && <ChatRoom tweet={tweet}></ChatRoom>}
        </div>
      )
}