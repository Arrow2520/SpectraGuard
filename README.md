# 🛡️ SpectraGuard: Real-Time Deepfake Audio Forensics

SpectraGuard is a zero-day deepfake audio detection system built for financial institutions. It abandons traditional NLP and linguistic heuristics, instead utilizing Computer Vision (VGG19) to analyze the microscopic, physical anomalies left behind by AI voice-cloning algorithms (vocoders).

---

## 🧠 The "Physics Over Linguistics" Approach

Modern voice cloning systems such as ElevenLabs and XTTS can convincingly replicate pitch, accent, and emotional tone. This makes traditional detection methods ineffective.

However, these systems still leave behind subtle digital artifacts:

- **Barcode Harmonics**  
  Unnaturally rigid, perfectly aligned high-frequency spectral lines.

- **Absolute-Zero Pauses**  
  Absence of natural background noise or room tone during silence.

SpectraGuard converts real-time audio streams into high-resolution **Mel-spectrograms** using the *Inferno* colormap. A Convolutional Neural Network (CNN) then analyzes these spectrograms to detect synthetic artifacts, typically in under one second.

---

## 🏗️ Architecture & Tech Stack

- **Deep Learning Inference:** TensorFlow / Keras (VGG19)  
- **Backend API & Streaming:** FastAPI, WebSockets, Python  
- **Acoustic Preprocessing:** Librosa, Pydub, FFmpeg  
- **Frontend Dashboard:** HTML, CSS, Vanilla JavaScript  

---

## 🚀 Setup & Installation (For Teammates)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd SpectraGuard_Backend
```

### 2. Set Up the Python Environment

```bash
python -m venv .venv
source .venv/Scripts/activate  # On Windows
# source .venv/bin/activate    # On Mac/Linux

pip install -r requirements.txt
```

### 3. Windows FFmpeg Requirement

Because `pydub` requires FFmpeg to decode live browser audio streams, Windows users must manually configure it:

1. Download **FFmpeg Essentials for Windows**
2. Extract the ZIP file
3. Navigate to the `bin/` folder
4. Copy the following files into the project root (same folder as `main.py`):
   - `ffmpeg.exe`
   - `ffprobe.exe`

---

## 💻 Running the Application

> ⚠️ Browser security blocks microphone access for `file:///` URLs. You must run a local server.

### Terminal 1: Start the AI Backend

```bash
uvicorn main:app --reload
```

### Terminal 2: Start the Frontend Server

```bash
python -m http.server 8080
```

Open your browser and go to:

```
http://localhost:8080
```

---

## 🧪 Testing Guidelines (CRITICAL)

To ensure accurate detection, avoid the following common pitfalls:

### ❌ Do NOT:

- Play deepfake audio through a physical speaker into your microphone  
  → This introduces real-world acoustic effects ("analog wash"), making fake audio appear real.

- Use `.mp3` or `.mp4` files  
  → Lossy compression removes critical spectral artifacts needed for detection.

### ✅ Recommended Testing Method:

- Use the **"Test Audio File"** feature  
- Upload clean, uncompressed `.wav` files  
- Prefer deepfakes generated directly from tools like ElevenLabs or Hugging Face  

---

## 🛠️ Next Steps / TODOs

### Frontend & Full-Stack Improvements

- [ ] **UI Overhaul**  
      Convert `index.html` into a modern React / Next.js interface for a professional call-center experience.

- [ ] **Spectrogram Visual Enhancement**  
      Improve styling of Inferno spectrograms to resemble advanced forensic visualization tools.

- [ ] **Database Integration**  
      Store call logs, prediction confidence scores, and timestamps using PostgreSQL or MongoDB for audit and review.

---

## 📌 Summary

SpectraGuard focuses on **physical signal inconsistencies rather than linguistic content**, making it resilient against increasingly sophisticated AI voice cloning systems.

It is designed to operate in **real-time**, scale across financial infrastructure, and provide **interpretable forensic signals** for high-stakes environments.