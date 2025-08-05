import axios from "axios";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../../constants";
import "../../styles/upcoming.css";

export default function Upcoming() {
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [missions, setmissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [thought, setThought] = useState("");
  const [thoughtsList, setThoughtsList] = useState([]);
  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    fetchAllMissions();
  }, []);

  useEffect(() => {
    if (selectedMission) fetchThoughts(selectedMission.id);
  }, [selectedMission]);

  const postthought = async (e, id) => {
    e.preventDefault();
    setLoading(true);
    if (!token) return alert("Please sign in first");

    try {
      await axios.post(
        `http://localhost:8000/api/missions/${id}/thoughts/`,
        { message: thought },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Thank you for your feedback!");
      setThought("");
      fetchThoughts(id);
    } catch (error) {
      console.error(error);
      seterror("Failed to post thought.");
    } finally {
      setLoading(false);
    }
  };

  const fetchThoughts = async (missionId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/missions/${missionId}/thoughts/`);
      setThoughtsList(res.data);
    } catch (err) {
      console.error(err);
      setThoughtsList([]);
    }
  };

  const fetchAllMissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/upcoming-missions/");
      if (Array.isArray(res.data)) {
        setmissions(res.data);
        setSelectedMission(res.data[0] || null);
      } else {
        setmissions([]);
        seterror("Invalid data format from server.");
      }
    } catch (err) {
      console.error(err);
      seterror("Unable to fetch missions.");
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  const handleSelectMission = (e) => {
    const selected = missions.find((m) => m.title === e.target.value);
    setSelectedMission(selected || null);
  };

  return (
    <div className="Upcoming">
      <h3>What the Future Holds</h3>

      <div className="select">
        <p>Select a Mission</p>
        <select className="select-box" onChange={handleSelectMission}>
          <option value="">-- Choose a Mission --</option>
          {missions.map((m) => (
            <option key={m.id} value={m.title}>
              {m.title}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {selectedMission && (
        <>
          <div className="mission-cover-wrapper">
            <img
              src={selectedMission.mission_cover}
              alt={selectedMission.title}
              className="mission-cover"
            />
            <div className="mission-gradient-overlay" />
            <div className="mission-title-overlay">
              <h3>{selectedMission.title}</h3>
              <p>{selectedMission.description}</p>
            </div>
          </div>

          <div className="mission-details">
            <div className="detail-row">
              <h3>Mission Type:</h3>
              <span>{selectedMission.mission_type}</span>
            </div>
            <div className="detail-row">
              <h3>Crew Size:</h3>
              <span>{selectedMission.crew_size}</span>
            </div>
            <div className="detail-row">
              <h3>Launch:</h3>
              <span>{selectedMission.launch}</span>
            </div>
            <div className="detail-row">
              <h3>Duration:</h3>
              <span>{selectedMission.duration} Days</span>
            </div>
          </div>

          {selectedMission.images?.length > 0 && (
          <div className="crew-grid">
          <h3>Crew Members:</h3>
          <div className="grid">
          {selectedMission.images.map((member, index) => (
          <div key={index} className="crew-card">
          <img src={member.crew_image} alt={member.crew_name} className="crew-image" />
          <p className="crew-name">{member.crew_name}</p>
         </div>
         ))}
         </div>
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
                style={{ width: "100%", maxWidth: "800px", height: "450px" }}
              ></iframe>
            </div>
          )}

          <form className="thought" onSubmit={(e) => postthought(e, selectedMission.id)}>
            <h3>Thoughts:</h3>
            <input
              type="text"
              placeholder="What are your thoughts?"
              className="input-thought"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
            />
            <button className="input-button" type="submit">
              Post
            </button>
          </form>

          <div className="thought-grid">
            <h3>User Feedback:</h3>
            {thoughtsList.length === 0 ? (
              <p>No thoughts yet.</p>
            ) : (
              thoughtsList.map((t) => (
                <div key={t.id} className="thought-item">
                  <strong>{t.user} says:</strong>
                  <p className="feedback">{t.message}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
