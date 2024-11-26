import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/firebase-config";
import { onValue,ref } from "firebase/database";
import ChatRoom from "../../components/ChatRoom/display-chat";


export default function chatRoomView () {

    const [message, setMessages] = useState([]);
    const { id } = useParams();


    useEffect (() => {
      const text = onValue(ref(db,`chatRoom/${id}`),(snapshot) => {
        const updateText = snapshot.val();
        setText({
          ...updateText,
          sentBy: Object.keys(updateText.likedBy ?? {})
        })
      })
      return () => text;
    })
    
    return (
        <div>
          <h1>Single Tweet</h1>
          {tweet && <ChatRoom message={message}></ChatRoom>}
        </div>
      )
}