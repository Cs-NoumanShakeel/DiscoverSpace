import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/spacecraft.css";

const NASA_API_KEY = "2kLnkbEtjvle8HDxqj5mvTNgSnWLKGMWDQGtFc3t";
const MARS_ROVER_API = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NASA_API_KEY}`;
const SPACECRAFTS_API = "http://localhost:8000/api/spacecrafts/"; // Change this to your backend URL

export default function RoversAndSpacecrafts() {
  const [rovers, setRovers] = useState([]);
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRovers = axios.get(MARS_ROVER_API);
    const fetchSpacecrafts = axios.get(SPACECRAFTS_API);

    Promise.all([fetchRovers, fetchSpacecrafts])
      .then(([roverRes, spacecraftRes]) => {
        setRovers(roverRes.data.photos.slice(0, 9)); 
        setSpacecrafts(spacecraftRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="rovers-spacecrafts-container">
      <h2>Mars Rovers</h2>
      <div className="rovers-grid">
        {rovers.map((rover, index) => (
          <div className="rover-card" key={index}>
            <img src={rover.img_src} alt={`Rover ${rover.rover.name}`} />
            <h4>{rover.rover.name}</h4>
            <p>Camera: {rover.camera.full_name}</p>
            <p>Date: {rover.earth_date}</p>
          </div>
        ))}
      </div>

      <h2>Spacecrafts</h2>
      <div className="spacecrafts-column">
        {spacecrafts.map((craft, index) => (
          <div className="spacecraft-card" key={index}>
            <img src={`http://localhost:8000${craft.image}`} alt={craft.name} />
            <h4>{craft.name}</h4>
            <p><strong>Mission:</strong> {craft.mission}</p>
            <p><strong>Launch Date:</strong> {craft.launch_date}</p>
            <p><strong>Operator:</strong> {craft.operator}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
