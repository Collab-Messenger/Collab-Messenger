import { ToggleMode } from "../ToggleMode/ToggleMode";
import styles from "./Sidebar.module.css";
import CreateChatRoom from "../ChatRoom/chat-room";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();

  const handleCreateChatRoom  = () =>{
        navigate("createChatRoom")
  }
  return (
    <div className={styles.sidebar}>
      <div className="join join-vertical" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <button className="btn join-item">DM's</button>
        <div style={{ marginTop: '50px' }}>
          <button className="btn join-item">Channel 1</button>
          <button className="btn join-item">Channel 2</button>
          <button className="btn join-item">Channel 3</button>
        </div>
        <div className={styles.fixedBottom}>
          <button className="btn join-item" onClick={handleCreateChatRoom}>+</button>
          <ToggleMode />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;