import { VideoCall } from "../../components/VideoCall/VideoCall";
import { useRef } from "react";
export const VideoCallView = () => {

    

    return (
        <div className="h-screen w-full">
            <VideoCall roomUrl={"https://linkupproject.daily.co/VideoCalls"}/>
        </div>
    );
}