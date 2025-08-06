import axios from "axios";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import { useLoggedInUser } from "./context/LoginContext";
import "../styles/contribute.css";

export default function Contribute() {
  const { loggedInUserId } = useLoggedInUser();

  const [name, setname] = useState('');
  const [country, setcountry] = useState('');
  const [age, setage] = useState(0);
  const [title, settitle] = useState('');
  const [purpose, setpurpose] = useState('');
  const [type, settype] = useState('');
  const [image, setimage] = useState(null);
  const [video, setvideo] = useState(null);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  const [suggestions, setsuggestions] = useState([]);
  const [editingId, setEditingId] = useState(null); // ← for edit mode

  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setloading(true);
    try {
      const res = await axios.get('https://discoverspace.onrender.com/api/suggestions/');
      setsuggestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      seterror("Failed to load suggestions");
    } finally {
      setloading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const data = new FormData();
      data.append("name", name);
      data.append("age", age);
      data.append("country", country);
      data.append("title", title);
      data.append("purpose", purpose);
      data.append("type", type);
      if (image) data.append("image", image);
      if (video) data.append("video", video);

      const url = editingId
        ? `https://discoverspace.onrender.com/api/suggestions/${editingId}/update/`
        : `https://discoverspace.onrender.com/api/suggestions/create/`;

      const method = editingId ? "patch" : "post";

      await axios[method](url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      // Reset form
      setEditingId(null);
      setname('');
      setage(0);
      setcountry('');
      settitle('');
      setpurpose('');
      settype('');
      setimage(null);
      setvideo(null);
      fetchSuggestions();

    } catch (err) {
      seterror("Failed to submit suggestion");
      console.error(err);
    } finally {
      setloading(false);
    }
  };

  const handleDelete = async (id) => {
    setloading(true);
    try {
      await axios.delete(`https://discoverspace.onrender.com/api/suggestions/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setsuggestions(suggestions.filter(s => s.id !== id));
    } catch (err) {
      seterror('Something went wrong deleting');
    } finally {
      setloading(false);
    }
  };

  const populateFormForEdit = (suggestion) => {
    setname(suggestion.name);
    setage(suggestion.age);
    setcountry(suggestion.country);
    settitle(suggestion.title);
    setpurpose(suggestion.purpose);
    settype(suggestion.type);
    setimage(null); 
    setvideo(null); 
    setEditingId(suggestion.id);
  };

  return (
    <>
      <form className="suggestion" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit your suggestion" : "Submit a new suggestion"}</h3>

        <div className="person">
          <input type="text" placeholder="Name" className="input_name" value={name} onChange={(e) => setname(e.target.value)} />
          <input type='number' placeholder="Age" className="input_age" value={age} onChange={(e) => setage(e.target.value)} />
          <input type="text" placeholder="Country" className="input_country" value={country} onChange={(e) => setcountry(e.target.value)} />
        </div>

        <div className="suggestion_box">
          <input type="text" placeholder="Title" className="input_title" value={title} onChange={(e) => settitle(e.target.value)} />
          <input type='text' placeholder="Purpose" className="input_purpose" value={purpose} onChange={(e) => setpurpose(e.target.value)} />

          <p>Select a Type</p>
          <select className="select_box" value={type} onChange={(e) => settype(e.target.value)}>
            <option value="">-- Choose a Type --</option>
            <option value="suggestion">General Suggestion</option>
            <option value="satellite">Satellite Mission</option>
            <option value="manned">Manned Mission</option>
            <option value="unmanned">Unmanned Mission</option>
            <option value="research">Research Mission</option>
            <option value="other">Other</option>
          </select>

          <p>Upload Image</p>
          <input type="file" accept="image/*" onChange={(e) => setimage(e.target.files[0])} />

          <p>Upload Video</p>
          <input type="file" accept="video/*" onChange={(e) => setvideo(e.target.files[0])} />
        </div>

        <button type="submit" className="submit-btn">{editingId ? "Update" : "Submit"}</button>
      </form>

      <div className="suggestion-grid">
        <h3>User Feedback:</h3>
        {suggestions.length === 0 ? (
          <p>No suggestions yet.</p>
        ) : (
          suggestions.map((s) => (
            <div key={s.id} className="suggestion-item">
              <strong>{s.name} says:</strong>
              {loggedInUserId === s.user && (
                <div className="buttons">
                  <button onClick={() => populateFormForEdit(s)} className="user_btn">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="user_btn">Delete</button>
                </div>
              )}
              <h3>{s.title}</h3>
              <p>{s.purpose}</p>
              <p>{s.type}</p>

              {s.image && <img src={s.image} alt={s.title} className="uploaded_image" />}
              <p>Footage</p>
              {s.video && (
                <video controls className="uploaded-video">
                  <source src={s.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <p><em>{s.submitted_at}</em></p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
