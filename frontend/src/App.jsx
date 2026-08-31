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
import Candidates from "./pages/recruiter/Candidate";
import Jobs from "./pages/recruiter/Jobs";
import PostJob from "./pages/recruiter/PostJob";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";

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
        <Route path="/recruiter" element={<RecruiterLayout />}>

          <Route
            path="dashboard"
            element={<RecruiterDashboard />}
          />
          <Route
            path="/recruiter/jobs"
            element={<Jobs />}
          />
          <Route
            path="/recruiter/applications"
            element={<RecruiterApplications />}
          />

          <Route
            path="/recruiter/candidates"
            element={<Candidates />}
          />

          <Route
            path="/recruiter/interviews"
            element={<RecruiterInterviews />}
          />
          <Route path="/recruiter/post-job" element={<PostJob />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;