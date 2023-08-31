import React, { useState } from "react";
import { HiMicrophone } from "react-icons/hi";
import Btn from "./btn";

const MicroPhoneBtn = (props) => {
    const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

    const handleMicrophoneClick = () => {
        if (!isMicrophoneActive) {
            startRecording();
        } else {
            stopRecording();
        }
        setIsMicrophoneActive(!isMicrophoneActive);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    setAudioChunks((chunks) => [...chunks, e.data]);
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
        } catch (error) {
            console.error("Error starting recording:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div>
            <Btn parentClass={props.parentClass} btnProps={{
                onClick: handleMicrophoneClick,
                bg: "bg-white",
                buttonClass: "border-none border-white",
                icon: <HiMicrophone size={props.size} color={isMicrophoneActive ? "red" : "black"} />
            }} />
        </div>
    );
};
export default MicroPhoneBtn;