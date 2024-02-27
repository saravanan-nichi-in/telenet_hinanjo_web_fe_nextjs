import { Tooltip } from "primereact/tooltip";
import React, { useState, useEffect, useContext } from "react";
import { BsFillMicFill } from "react-icons/bs";
import {
  getValueByKeyRecursively as translate,
} from "@/helper";
import { LayoutContext } from "@/layout/context/layoutcontext";

let tooltipIdCounter = 0; // Counter for generating unique IDs

function AudioRecorder({ onAudioRecorded, onRecordingStateChange, disabled, isRecording, customClass, customStyle, customParentClassName }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const { localeJson } = useContext(LayoutContext);
  let audioChunks = [];
  const tooltipId = `mic-tooltip-${tooltipIdCounter++}`;

  useEffect(() => {
    setRecording(isRecording);
  }, [isRecording]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          // const noiseReducedBlob = await applyNoiseReduction(audioBlob); // Apply noise reduction
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

  // Define a noise reduction function
  async function applyNoiseReduction(audioBlob) {
    const audioData = await audioBlob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(audioData);

    // Create a ScriptProcessorNode for real-time processing
    const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);

    // Connect nodes
    scriptNode.connect(audioContext.destination);

    scriptNode.onaudioprocess = function (audioProcessingEvent) {
      const inputBuffer = audioProcessingEvent.inputBuffer.getChannelData(0);
      const outputBuffer = audioProcessingEvent.outputBuffer.getChannelData(0);
    
      const threshold = 0.03; // Adjust this value to set the noise threshold
    
      for (let i = 0; i < inputBuffer.length; i++) {
        const sample = inputBuffer[i];
    
        // Apply noise gate
        if (Math.ceil(sample) < threshold) {
          outputBuffer[i] = 0; // Set sample to zero (mute)
        } else {
          outputBuffer[i] = sample; // Pass through unaffected
        }
      }
    };    
    

    // Create an audio source from the audio buffer
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Connect source to processing node
    source.connect(scriptNode);

    // Start playback
    // source.start();

    // // Wait for processing to complete
    // await new Promise((resolve) => {
    //   source.onended = resolve;
    // });

    // Stop the audio context
    audioContext.close();

    // Convert the processed audio buffer back to a blob
    const processedAudioBlob = new Blob([audioBuffer], { type: "audio/wav" });

    return processedAudioBlob;
  }

  return (
    <>
      <i className={`w-2rem ${customParentClassName}`}>
        <div>
          {!disabled && !recording && (
            <Tooltip target={`#${tooltipId}`} position="top" content={translate(localeJson, "mic_text")} className="shadow-none" />
          )}
          <BsFillMicFill
            id={tooltipId}
            onClick={() => { if (!disabled) { (recording) ? stopRecording() : startRecording() } }}
            cursor={disabled ? "not-allowed" : "pointer"}
            className={`w-full mic-icon  ${recording ? "text-red-700" : ""} ${customClass}`}
            style={customStyle}
          />
        </div>
      </i>
    </>
  );
}

export default AudioRecorder;
