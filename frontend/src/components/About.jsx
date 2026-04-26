import './About.css';

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-content">
        <p>
          In an era where digital deception can erode trust, SpectraGuard provides
          cutting-edge audio forensics. We move beyond linguistic analysis, using 
          Computer Vision on high-resolution Mel-spectrograms to identify the microscopic 
          physical signatures of AI voice-cloning vocoders in real-time.
        </p>
        <p>
          Here is our demo where you can record yourself live and upload an AI 
          deepfake voice. Observe how SpectraGuard detects unnatural spectral rigidities 
          and absolute-zero pauses instantly.
        </p>
      </div>
    </section>
  );
}
