import { useState, useEffect } from "react";
import "../../styles/archive.css";

export default function Archive() {
  const [start_date, setstart_date] = useState("");
  const [end_date, setend_date] = useState("");
  const [error, seterror] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState(new Set());

  useEffect(() => {
    fetcharchives();
  }, []);

  const fetcharchives = () => {
    let start = start_date;
    let end = end_date;

    if (!start && !end) {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 12);

      start = lastWeek.toISOString().split("T")[0];
      end = today.toISOString().split("T")[0];
    }

    setLoading(true);
    seterror("");

    fetch(
      `https://api.nasa.gov/planetary/apod?start_date=${start}&end_date=${end}&api_key=2kLnkbEtjvle8HDxqj5mvTNgSnWLKGMWDQGtFc3t`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 400 || json.error) {
          seterror("Invalid date or data not available");
          setdata([]);
        } else {
          setdata(json.reverse()); // latest first
        }
        setLoading(false);
      })
      .catch((err) => {
        seterror("Error fetching data");
        setLoading(false);
      });
  };

  const toggleExpand = (index) => {
    const newSet = new Set(expandedIndexes);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedIndexes(newSet);
  };

  return (
    <div className="archive-container">
      <h2>📦 NASA APOD Archive</h2>

      <div className="date-controls">
        <input
          type="date"
          value={start_date}
          onChange={(e) => setstart_date(e.target.value)}
        />
        <input
          type="date"
          value={end_date}
          onChange={(e) => setend_date(e.target.value)}
        />
        <button onClick={fetcharchives}>Fetch Archive</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="archive-grid">
        {data.map((item, index) => (
          <div className="apod-card" key={item.date}>
            {item.media_type === "image" ? (
              <img
                src={item.url}
                alt={item.title}
                className="apod-img"
                style={{ objectFit: "cover" }}
              />
            ) : item.media_type === "video" ? (
              <iframe
                src={item.url}
                title={item.title}
                frameBorder="0"
                allow="encrypted-media"
                allowFullScreen
                className="apod-img"
                style={{ objectFit: "cover" }}
              ></iframe>
            ) : (
              <p style={{ color: "red" }}>Media Type not supported</p>
            )}

            <h3>{item.title}</h3>
            <p>{item.date}</p>
            <button onClick={() => toggleExpand(index)}>
              {expandedIndexes.has(index)
                ? "Hide Description"
                : "Show Description"}
            </button>
            {expandedIndexes.has(index) && (
              <p className="apod-description">{item.explanation}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
