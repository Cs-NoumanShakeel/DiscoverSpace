import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import { useLoggedInUser } from "../pages/context/LoginContext";






function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { loggedInUserId, setloggedInUserId } = useLoggedInUser();
  const [error,seterror] = useState(null)

  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload =
      method === "login"
        ? { username, password }
        : { username, email, password };

    const res = await api.post(route, payload);
    console.log("Login response:", res.data); 

    if (method === "login") {
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
    }

    navigate("/home");
    setloggedInUserId(res.data.user.id); // ✅ Now it will work
    localStorage.setItem("LOGGED_IN_USER_ID", res.data.user.id);


  } catch (err) {
     seterror(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>

        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit">
          {name}
        </button>

        <div className="form-links">
          <Link to="/login">Already have an account?</Link>
          <Link to="/register">Make an Account</Link>
        </div>
      </form>
    </div>
  );
}

export default Form;
