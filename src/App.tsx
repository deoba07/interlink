import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPg from "./LandingPg";
import InternshipDetails from "./InternshipDetails";
import Opportunities from "./Opportunities";
import LoginSignup from "./LoginSignup";
import CVBuilder from "./CVBuilder";
import Guide from "./Guide";
import Saved from "./Saved";
import Applied from "./Applied";
import Profile from "./Profile";
import ProtectedRoute from "./components/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>

      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<LandingPg />} />
        <Route path="/LoginSignup" element={<LoginSignup />} />
        <Route path="/cv-builder" element={<ProtectedRoute><CVBuilder /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
        <Route path="/Guide" element={<Guide />} />
        <Route path="/Applied" element={<ProtectedRoute><Applied /></ProtectedRoute>} />
        <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/internship/:id" element={<InternshipDetails />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;