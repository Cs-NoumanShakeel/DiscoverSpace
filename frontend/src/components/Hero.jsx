import earthmp4 from '../assets/earth.mp4'
import "../styles/hero.css"; 
export default function Hero() {
  return (
    <div className="hero-section">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hero-video"
      >
        <source src={earthmp4} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay">
       <h1>Space Missions Discovery</h1>
       <p>Explore legendary space missions and cosmic discoveries</p>
      </div>


    </div>
  );
}
