import ProtectedRoute from "./components/ProtectedRoutes";
import {lazy, Suspense} from "react";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const LandingPg = lazy(() => import  ("./LandingPg"));
const InternshipDetails = lazy(() => import("./InternshipDetails"));
const Opportunities = lazy(() => import("./Opportunities"));
const LoginSignup = lazy(() => import("./LoginSignup"));
const CVBuilder = lazy(() => import("./CVBuilder"));
const Guide = lazy(() => import("./Guide"));
const Saved = lazy(() => import("./Saved"));
const Applied = lazy(() => import("./Applied"));
const Profile = lazy(() => import("./Profile"));
  const ForgotPassword = lazy(() => import("./ForgotPassword"));
  const ResetPassword = lazy(() => import("./ResetPassword"));



function App() {
  return (
    <BrowserRouter>

      <Toaster position="top-right" />

      <Suspense fallback={<div className="loading">Loading...</div>}>

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

      </Suspense>

    </BrowserRouter>
  );
}

export default App;