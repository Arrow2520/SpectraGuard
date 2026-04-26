import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-container">
      <div className="hero-card">
        <h1 className="hero-title left">Protection</h1>
        <p className="hero-subtitle">against live audio</p>
        <h1 className="hero-title right">Deepfakes</h1>
        
        <div className="hero-scroll">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="7" ry="7"></rect>
            <path d="M12 6v4"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}
