import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Today from "./pages/apod/today";
import Archive from "./pages/apod/Archive";
import Historical from "./pages/mission/historical";
import Register from "./pages/register";
import Login from "./pages/login";
import Upcoming from "./pages/mission/upcoming";
import Planets from "./pages/planet/planets";
import RoversAndSpacecrafts from "./pages/spacecraftlaunches/spacecraft";
import Launches from "./pages/spacecraftlaunches/launches";
import Contribute from "./pages/contribute";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/apod/today" element={<Today />} />
        <Route path="/apod/archive" element={<Archive  />} />
        <Route path="/register" element={<Register  />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/mission/historical" element={<Historical  />} />
        <Route path="/mission/upcoming" element={<Upcoming  />} />
        <Route path="/planet/Planets" element={<Planets  />} />
        <Route path="/contribute" element={<Contribute  />} />
        <Route path="/spacecraftlaunches/spacecraft" element={<RoversAndSpacecrafts  />} />
        <Route path="/spacecraftlaunches/launches" element={<Launches  />} />
      </Routes>
    </BrowserRouter>
  );
}
