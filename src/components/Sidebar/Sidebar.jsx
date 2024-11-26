import { ToggleMode } from "../ToggleMode/ToggleMode";
import styles from "./Sidebar.module.css";
import CreateChatRoom from "../ChatRoom/chat-room";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {

    const navigate = useNavigate();

    const handleCreateChatRoom = () => {
        navigate("createChatRoom")
    }
    const handleChatRoom = () => {
        navigate("/ChatRoom/:id")
    }
    const chatRoomList = () => {
        navigate("ChatRoomList")
    }
    const handleViewTeams = () => {
        navigate("teams");
    };

    const handleVideoCall = () => {
        navigate("/videoCall");
    }
    return (
        <div className={styles.sidebar}>
            <div className="join join-vertical" style={{ display: 'flex', flexDirection: 'column'}}>
                <button className="btn join-item">DM's</button>
                <button className="btn join-item" onClick={handleViewTeams}>Teams</button>
                <div style={{ marginTop: '50px' }}>
                    <button className="btn join-item">Channel 1</button>
                    <button className="btn join-item">Channel 2</button>
                    <button className="btn join-item" onClick={handleVideoCall}>Video Call</button>
                    <button className="btn join-item" onClick={handleChatRoom}>ChatRoom</button>
                    <button className="btn join-item" onClick={chatRoomList}> Chat Lists</button>
                    <button className="btn join-item">Channel 3</button>
                </div>
                <div className={styles.fixedBottom}>
                </div>
            </div>
            <div className=''>
                    <button className="btn join-item" onClick={handleCreateChatRoom}>+</button>
                    <ToggleMode />
                </div>
        </div>
    );
};

export default Sidebar;