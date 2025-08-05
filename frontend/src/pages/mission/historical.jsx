import axios from 'axios';
import { useEffect, useState } from 'react';
import "../../styles/historical.css";

export default function Historical() {
  const [missions, setMissions] = useState([]); // all missions
  const [selectedMission, setSelectedMission] = useState(null); // selected mission
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0); // For image slider

  useEffect(() => {
    fetchAllMissions();
  }, []);

  // Reset slide when mission changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedMission]);

  const fetchAllMissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/historical-missions/`);
      
      console.log("API response:", res.data);
      

      if (Array.isArray(res.data)) {
       setMissions(res.data);
      if (res.data.length > 0) {
    setSelectedMission(res.data[0]); // Set default mission
     }
     } else {
     console.error("Expected array but got:", res.data);
     setMissions([]);
     setError("Invalid data format from server.");
     }

    } catch (err) {
      setError('Unable to fetch missions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e) => {
    const selected = missions.find((m) => m.title === e.target.value);
    setSelectedMission(selected || null);
  };


  const nextSlide = () => {
    if (selectedMission?.images && selectedMission.images.length > 0) {
      setCurrentSlide((prev) => 
        prev === selectedMission.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevSlide = () => {
    if (selectedMission?.images && selectedMission.images.length > 0) {
      setCurrentSlide((prev) => 
        prev === 0 ? selectedMission.images.length - 1 : prev - 1
      );
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Function to convert Django media URL to proper format
  const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  // Handle youtu.be short links
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Handle full YouTube links
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get("v");
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return null; // Not a YouTube URL
};


  return (
    <div className="historical">
      <h3>Delve into NASA Ventures</h3>

      <div className="select">
        <p className="select_info">Select a mission</p>
        <select className="select_box" onChange={handleSelectChange}>
          <option value="">-- Choose a mission --</option>
          {missions.map((m) => (
            <option key={m.id} value={m.title}>
              {m.title}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedMission && (
        <>
          <div className="mission_description">
            <h3>{selectedMission.title}</h3>
            <p>{selectedMission.overview}</p>
          </div>

          <div className="mission-info">
            <h3>Mission Type:</h3>
            <span>{selectedMission.mission_type}</span>
            <h3>Crew:</h3>
            <span>{selectedMission.crew}</span>
          </div>

          <div className="mission_duration">
            <h3>Launch:</h3>
            <span>{selectedMission.launch}</span>
            <h3>Splash Down:</h3>
            <span>{selectedMission.splash_down}</span>
          </div>

          {/* Image Slider */}
          {selectedMission.images && selectedMission.images.length > 0 && (
            <div className="mission_slider">
              <div className="slider-container">
                <div 
                  className="slider-track" 
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {selectedMission.images.map((img, idx) => (
                    <div key={idx} className="slide">
                      <img 
                        src={img.image.startsWith('http') ? img.image : `http://localhost:8000${img.image}`} 
                        alt="mission visual" 
                      />
                      <p>{img.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedMission.images.length > 1 && (
                <div className="slider-nav">
                  <button 
                    className="slider-btn" 
                    onClick={prevSlide}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  
                  <div className="slider-indicators">
                    {selectedMission.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button 
                    className="slider-btn" 
                    onClick={nextSlide}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          )}

      
         {selectedMission.video_url && (
  <div className="footage">
    <iframe
      src={getYouTubeEmbedUrl(selectedMission.video_url)}
      title="Mission Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="mission-video"
      style={{ width: '100%', maxWidth: '800px', height: '450px' }}
    ></iframe>
  </div>
)}

        </>
      )}
    </div>
  );
}