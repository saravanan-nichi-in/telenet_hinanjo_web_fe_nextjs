import React, { useState } from "react";
import { BsFillMicFill } from "react-icons/bs";

function AudioRecorder({ onAudioRecorded, onRecordingStateChange }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  let audioChunks = [];

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          onAudioRecorded(audioBlob);
          audioChunks = [];
        };
        recorder.start();
        setRecording(true);
        setMediaRecorder(recorder);
        onRecordingStateChange(true); // Notify parent of recording start
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
      onRecordingStateChange(false); // Notify parent of recording stop
    }
  };

  return (
    <div className="flex justify-content-center align-items-center h-full">
      <div>
        <BsFillMicFill
          onClick={recording ? stopRecording : startRecording}
          className={`w-full  ${recording ? "text-red-700" : ""}`}
          size={28}
        />
      </div>
    </div>
  );
}

export default AudioRecorder;
