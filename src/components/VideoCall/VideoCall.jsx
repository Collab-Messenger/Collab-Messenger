import React, { useEffect, useState, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

export const VideoCall = ({ roomUrl }) => {
    const [callFrame, setCallFrame] = useState(null);
    const callFrameRef = useRef(null);

    
    useEffect(() => {
        const container = document.getElementById('videoContainer');
        console.log(container);
        if (container) {
            const frame = DailyIframe.createFrame(container, {
                showLeaveButton: true,
                iframeStyle: {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'black',
                    blockSize: 'cover',
                },
            });
            setCallFrame(frame);
            callFrameRef.current = frame;
        }
    }, []);

    // ... rest of the component

    useEffect(() => {
        if (callFrame) {
            callFrame.join({ url: roomUrl });
        }

        return () => {

            callFrame?.destroy();
        };
    }, [callFrame, roomUrl]);



    return (
        <div id='videoContainer' className="relative w-full h-full border border-red border-solid">

        </div>
    );
};