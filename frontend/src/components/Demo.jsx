import React, { useRef } from 'react';
import { useSpectraGuard } from '../hooks/useSpectraGuard';
import './Demo.css';

export default function Demo() {
  const {
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
  } = useSpectraGuard();

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadAudioFile(file);
    }
  };

  return (
    <section id="demo" className="demo-section">
      <div className="demo-card">
        {/* LEFT PANEL: Controls */}
        <div className="demo-left">
          <h2>Live Audio Forensics</h2>
          <p className="demo-subtitle">Monitor and detect synthetic audio in real-time.</p>
          
          <div className="ws-status">
            Server Status: <span className={`status-indicator ${wsStatus.includes('Online') ? 'online' : ''}`}>{wsStatus}</span>
          </div>

          <div className="demo-actions">
            <button 
              className={`btn primary ${isRecording ? 'hidden' : ''}`} 
              onClick={startCall}
              disabled={isRecording}
            >
              🎙️ Start Live Call
            </button>
            <button 
              className={`btn danger ${!isRecording ? 'hidden' : ''}`} 
              onClick={endCall}
              disabled={!isRecording}
            >
              🛑 End Call
            </button>

            <div className="divider"><span>OR</span></div>

            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="audio/*,video/mp4" 
              onChange={handleFileChange} 
            />
            <button className="btn secondary" onClick={handleUploadClick}>
              📁 Test Audio File (Deepfake Check)
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Results */}
        <div className="demo-right">
          <div className="results-container">
            <div className={`alert-box ${isFake ? 'danger' : 'safe'}`}>
              <h3>{status}</h3>
              <p className="confidence-score">AI Confidence: {confidence}%</p>
              {processingTime > 0 && (
                <p className="processing-time" style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'inherit', opacity: 0.8 }}>
                  ⏱️ Latency: {processingTime}ms
                </p>
              )}
            </div>

            <div className="spectrogram-viewer">
              <span className="spec-label">Live Acoustic Analysis (Inferno)</span>
              {spectrogramData ? (
                <img src={`data:image/png;base64,${spectrogramData}`} alt="Spectrogram" className="spectrogram-img" />
              ) : (
                <div className="spectrogram-placeholder">
                  Waiting for audio stream...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
