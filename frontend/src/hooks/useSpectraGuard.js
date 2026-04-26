import { useState, useRef, useEffect, useCallback } from 'react';

export function useSpectraGuard() {
  const [status, setStatus] = useState("Waiting...");
  const [confidence, setConfidence] = useState(0);
  const [isFake, setIsFake] = useState(false);
  const [spectrogramData, setSpectrogramData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [wsStatus, setWsStatus] = useState("Offline");
  const [processingTime, setProcessingTime] = useState(0);

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const lastChunkTimeRef = useRef(null);

  const initWebSocket = useCallback((onReady) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      if (onReady) onReady();
      return;
    }
    
    setWsStatus("Connecting...");
    const ws = new WebSocket("ws://localhost:8000/ws/audio");
    
    ws.onopen = () => {
      setWsStatus("Online 🟢");
      if (onReady) onReady();
    };
    
    ws.onmessage = (event) => {
      if (lastChunkTimeRef.current) {
        setProcessingTime(Math.round(performance.now() - lastChunkTimeRef.current));
      }
      const data = JSON.parse(event.data);
      setStatus(data.status);
      setConfidence(data.confidence);
      setIsFake(data.is_fake);
      if (data.spectrogram) {
        setSpectrogramData(data.spectrogram);
      }
    };
    
    ws.onclose = () => {
      setWsStatus("Offline 🔴");
      setStatus("Waiting...");
    };

    wsRef.current = ws;
  }, []);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      
      initWebSocket(() => {
        setWsStatus("Online & Recording 🟢");
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            lastChunkTimeRef.current = performance.now();
            wsRef.current.send(event.data);
          }
        };
        mediaRecorder.start(250);
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      });
    } catch (err) {
      alert("Microphone access denied or error occurred.");
      console.error(err);
    }
  };

  const endCall = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (wsRef.current) wsRef.current.close();
    setIsRecording(false);
  };

  const uploadAudioFile = (file) => {
    if (!file) return;
    initWebSocket(() => {
      setWsStatus("Analyzing File... 🟢");
      setStatus("Processing...");
      const reader = new FileReader();
      reader.onload = (e) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          lastChunkTimeRef.current = performance.now();
          wsRef.current.send(e.target.result);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    status,
    confidence,
    isFake,
    spectrogramData,
    isRecording,
    wsStatus,
    processingTime,
    startCall,
    endCall,
    uploadAudioFile
  };
}
