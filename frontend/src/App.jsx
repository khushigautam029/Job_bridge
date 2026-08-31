import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Applications from "./pages/candidate/Applications";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateLayout from "./pages/candidate/CandidateLayout";
import FindJobs from "./pages/candidate/FindJobs";
import Interviews from "./pages/candidate/Interviews";
import SavedJobs from "./pages/candidate/SavedJobs";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate */}
        <Route path="/candidate" element={<CandidateLayout />}>
          <Route
            path="dashboard"
            element={<CandidateDashboard />}
          />

          <Route
            path="jobs"
            element={<FindJobs />}
          />

          <Route
            path="applications"
            element={<Applications />}
          />

          <Route
            path="saved-jobs"
            element={<SavedJobs />}
          />

          <Route
            path="interviews"
            element={<Interviews />}
          />
        </Route>

        {/* Recruiter */}
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;