


import { useEffect, useState } from "react";
import "../../styles/today.css"; 

export default function Today() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.nasa.gov/planetary/apod?api_key=2kLnkbEtjvle8HDxqj5mvTNgSnWLKGMWDQGtFc3t")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch APOD:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading today's APOD...</p>;
  if (!data) return <p>Error loading APOD.</p>;

  return (
    <div className="today-apod">
      <h1>{data.title}</h1>
      <p><strong>Date:</strong> {data.date}</p>
      
      {data.media_type === "image" ? (
        <img src={data.url} alt={data.title} className="apod-image" />
      ) :  data.media_type === 'video'? (
          
        <iframe
          src={data.url}
          title="APOD Video"
          frameBorder="0"
          allow="encrypted-media"
          allowFullScreen
          className="apod-video"
        ></iframe>
      ): <p style={{color:'red'}}>Media Type not supported</p> }
     
      
      <p className="apod-explanation">{data.explanation}</p>
    </div>
  );
}
