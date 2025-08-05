import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/launches.css";

export default function Launches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);

 function getYouTubeEmbedUrl(videoData) {
  // Handle null, undefined, or empty values first
  if (videoData === null || videoData === undefined || videoData === '') {
    return null;
  }
  
  console.log("getYouTubeEmbedUrl received:", typeof videoData, videoData);
  
  let url = null;
  
  // If it's an object with a 'url' property
  if (videoData && typeof videoData === 'object' && !Array.isArray(videoData) && videoData.url) {
    url = videoData.url;
    console.log("Extracted URL from object:", url);
  }
  
  // If it's a direct string URL
  else if (typeof videoData === 'string') {
    url = videoData;
    console.log("Using direct string URL:", url);
  }
  
  // If it's an array (which might be the case based on your Django code)
  else if (Array.isArray(videoData) && videoData.length > 0) {
    // Try to find the first YouTube URL in the array
    for (const item of videoData) {
      if (typeof item === 'string' && (item.includes("youtube.com") || item.includes("youtu.be"))) {
        url = item;
        break;
      } else if (item && typeof item === 'object' && item.url) {
        if (item.url.includes("youtube.com") || item.url.includes("youtu.be")) {
          url = item.url;
          break;
        }
      }
    }
    console.log("Extracted URL from array:", url);
  }
  
  if (!url || typeof url !== 'string') {
    return null; // Silently return null for missing videos
  }
  
  if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
    return null;
  }
  
  try {
    const parsedUrl = new URL(url);
    let videoId = null;
    
    // Handle youtube.com URLs
    if (parsedUrl.hostname.includes("youtube.com")) {
      videoId = parsedUrl.searchParams.get("v");
    }
    
    // Handle youtu.be URLs
    else if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1);
    }
    
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return embedUrl;
    }
  } catch (err) {
    console.error("Invalid video URL:", videoData, err);
  }
  
  return null;
}


  const fetch_launches = async () => {
    setloading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/launches/");
      setLaunches(res.data);
      console.log("Launch Data: ", res.data);

    } catch (error) {
      console.log("Error fetching data:", error);
      setLaunches([]);
      seterror(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetch_launches();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="launches">
      <h3>Successful Launches Often Take Time</h3>
      <div className="launch-grid">
        {launches.map((launch, index) => (
          <div className="launch-section" key={index}>
            <h3>{launch.name}</h3>
            <h3>Status: </h3>
            <span>{launch.status}</span>
          
            <span>{launch.net}</span>
            <img src={launch.image} alt={launch.name} className="launch-image" />

            <div className="launch-mission">
              <h3>Mission</h3>
              <h3>{launch.mission_name}</h3>
              <h3>Description: </h3>
              <span>{launch.mission_description}</span>
              <h3>Mission Type: </h3>
              <span>{launch.mission_type}</span>
            </div>

            <div className="launch-rocket">
              <h3>Rocket</h3>
              <h3>{launch.rocket_name}</h3>
              <h3>Rocket Family: </h3>
              <span>{launch.rocket_family}</span>
              <h3>Rocket Variant: </h3>
              <span>{launch.rocket_variant}</span>
              <h3>ISP: </h3>
              <span>{launch.isp}</span>
            </div>

            <div className="launch-service">
              <h3>Service Provider</h3>
              <h3>{launch.launch_service_provider}</h3>
            </div>

            <div className="launch-pad">
              <h3>Name: </h3>
              <span>{launch.pad_name}</span>
              <h3>Location: </h3>
              <span>{launch.location_name}</span>
            </div>

            <div className="footage">
              {getYouTubeEmbedUrl(launch.video_url) ? (
  <iframe
    width="100%"
    height="315"
    src={getYouTubeEmbedUrl(launch.video_url)}
    title="YouTube video"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
) : (
  <p>No video available</p>
)}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
