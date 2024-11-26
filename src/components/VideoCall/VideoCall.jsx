import React, { useEffect, useState, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

export const VideoCall = ({ roomUrl }) => {
  const [callFrame, setCallFrame] = useState(null);
  const callFrameRef = useRef(null);

  useEffect(() => {
    if (!callFrameRef.current) {
      const frame = DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
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
    <div>
      <h1>Video Call</h1>
    </div>
  );
};