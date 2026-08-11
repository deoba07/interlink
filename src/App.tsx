import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPg from "./LandingPg";
import InternshipDetails from "./InternshipDetails";
import Opportunities from "./Opportunities";
import LoginSignup from "./LoginSignup";
import CVBuilder from "./CVBuilder";
import Saved from "./Saved";
import Applied from "./Applied";
import Profile from "./Profile";

function App() {
  return (
    <BrowserRouter>

      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<LandingPg />} />
        <Route path="/LoginSignup" element={<LoginSignup />} />
        <Route path="/cv-builder" element={<CVBuilder />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/Applied" element={<Applied />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/internship/:id" element={<InternshipDetails />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;