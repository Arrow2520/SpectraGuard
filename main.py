import io
import os
import cv2
import base64
import librosa
import numpy as np
import tensorflow as tf
from pydub import AudioSegment
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# --- THE FFMPEG BYPASS ---
AudioSegment.converter = os.path.abspath("ffmpeg.exe")
AudioSegment.ffmpeg = os.path.abspath("ffmpeg.exe")
# -------------------------

app = FastAPI(title="SpectraGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading VGG19 Model into memory...")
model = tf.keras.models.load_model("SpectraGuard_VGG19_Model.keras", compile=False)
print("Model loaded. Ready to catch deepfakes.")

def process_audio_buffer(audio_bytes):
    temp_wav = "temp_hackathon_audio.wav"
    try:
        # 1. Use Pydub to decode the incoming browser stream or uploaded file
        audio_stream = io.BytesIO(audio_bytes)
        audio_segment = AudioSegment.from_file(audio_stream)
        
        # 2. Export to a temporary, standardized WAV file on disk
        audio_segment.export(temp_wav, format="wav")
        
        # 3. Use the EXACT Colab pipeline (librosa automatically handles resampling and bit-depth!)
        y, sr = librosa.load(temp_wav, sr=16000)
        
        # Cleanup the temp file
        if os.path.exists(temp_wav):
            os.remove(temp_wav)
            
        if len(y) == 0:
            return None, None
            
        # 4. Generate Spectrogram exactly like the training data
        mel_spectrogram = librosa.feature.melspectrogram(
            y=y, sr=sr, n_fft=2048, hop_length=512, n_mels=175
        )
        mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)
        
        norm_image = cv2.normalize(mel_spectrogram_db, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
        norm_image = np.uint8(norm_image)
        
        # Format for AI Prediction
        rgb_image = cv2.cvtColor(norm_image, cv2.COLOR_GRAY2RGB)
        final_image = cv2.resize(rgb_image, (224, 224))
        ai_tensor = np.expand_dims(final_image / 255.0, axis=0)

        # Format for UI Visualizer
        inferno_image = cv2.applyColorMap(norm_image, cv2.COLORMAP_INFERNO)
        inferno_resized = cv2.resize(inferno_image, (400, 200))
        _, buffer = cv2.imencode('.png', inferno_resized)
        b64_image = base64.b64encode(buffer).decode('utf-8')
        
        return ai_tensor, b64_image
    
    except Exception as e:
        print(f"Processing error: {e}")
        if os.path.exists(temp_wav):
            os.remove(temp_wav)
        return None, None

@app.websocket("/ws/audio")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    audio_buffer = b""  
    
    try:
        while True:
            chunk = await websocket.receive_bytes()
            audio_buffer += chunk 
            
            img_array, b64_image = process_audio_buffer(audio_buffer)
            
            if img_array is not None:
                prediction = model.predict(img_array, verbose=0)[0][0]
                is_fake = bool(prediction > 0.5)
                confidence = float(prediction) if is_fake else 1.0 - float(prediction)
                
                await websocket.send_json({
                    "status": "HIGH RISK: SYNTHETIC" if is_fake else "SAFE",
                    "confidence": round(confidence * 100, 2),
                    "is_fake": is_fake,
                    "spectrogram": b64_image
                })
    except WebSocketDisconnect:
        pass