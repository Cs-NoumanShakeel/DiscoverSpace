import axios from "axios";
import { useEffect, useState } from "react";
import "../../styles/planets.css";
export default function Planets() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlanets = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://discoverspace.onrender.com/api/planets/");
      if (Array.isArray(res.data)) {
        setPlanets(res.data);
      } else {
        setError("Server sent wrong data");
        setPlanets([]);
      }
    } catch (err) {
      setError("Unable to fetch planets");
      console.error("Something went wrong:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="planets">
      <h3>View our Gallery of Planets</h3>
      <div className="planet-columngrid">
        {planets.map((planet, index) => (
          <div className="planet-section" key={index}>
            <h3>{planet.title}</h3>
            <p>{planet.introduction}</p>
            {planet.image && (
              <img
                src={`https://discoverspace.onrender.com${planet.image}`}
                alt={planet.title}
                className="planet-image"
              />
            )}
            <div className="planet-info">
              <h4>NameSake:</h4>
              <span>{planet.namesake}</span>
              <h4>Potential for Life:</h4>
              <span>{planet.potential}</span>
              <h4>Distance and Speed:</h4>
              <span>{planet.metrics}</span>
              <h4>Moons:</h4>
              <span>{planet.moons}</span>
              <h4>Rings:</h4>
              <span>{planet.rings}</span>
              <h4>Orbits and Rotation:</h4>
              <span>{planet.rotation}</span>
              <h4>Formation:</h4>
              <span>{planet.formation}</span>
              <h4>Structure:</h4>
              <span>{planet.structure}</span>
              <h4>Atmosphere:</h4>
              <span>{planet.atmosphere}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
