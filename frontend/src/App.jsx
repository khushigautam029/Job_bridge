import { useLayoutEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import HomeJobs from "./pages/HomeJobs";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Applications from "./pages/candidate/Applications";
import ApplyJob from "./pages/candidate/ApplyJob";
import CandidateLayout from "./pages/candidate/CandidateLayout";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateSettings from "./pages/candidate/CandidateSettings";
import FindJobs from "./pages/candidate/FindJobs";
import Interviews from "./pages/candidate/Interviews";
import JobDetails from "./pages/candidate/JobDetails";
import SavedJobs from "./pages/candidate/SavedJobs";

import Candidates from "./pages/recruiter/Candidate";
import Jobs from "./pages/recruiter/Jobs";
import PostJob from "./pages/recruiter/PostJob";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";
import RecruiterJobDetails from "./pages/recruiter/RecruiterJobDetails";
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import RecruiterSetting from "./pages/recruiter/RecruiterSetting";

// Read the existing authentication information.
const getAuthData = () => {
    const storages = [localStorage, sessionStorage];

    for (const storage of storages) {
        const token = storage.getItem("token");
        const storedUser = storage.getItem("user");

        if (!token || !storedUser) continue;

        try {
            const user = JSON.parse(storedUser);

            if (!user || typeof user !== "object") continue;

            const role = String(user.role || "").toUpperCase();

            return {
                token,
                user,
                role,
            };
        } catch {
            // Ignore invalid stored user data and check the next storage.
        }
    }

    return null;
};

// Reusable authentication and role protection.
const ProtectedRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const auth = getAuthData();

    // Not logged in: redirect to login.
    if (!auth) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Logged in, but not authorized for this section.
    if (!allowedRoles.includes(auth.role)) {
        if (auth.role === "CANDIDATE") {
            return <Navigate to="/candidate/jobs" replace />;
        }

        if (auth.role === "RECRUITER") {
            return <Navigate to="/recruiter/jobs" replace />;
        }

        // Unknown or unsupported roles cannot access these sections.
        return <Navigate to="/login" replace />;
    }

    // Authentication and role are valid.
    return <Outlet />;
};

// Scroll to top whenever the URL changes.
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const App = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jobs" element={<HomeJobs />} />

                {/* Candidate Routes: CANDIDATE role only */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["CANDIDATE"]} />
                    }
                >
                    <Route
                        path="/candidate"
                        element={<CandidateLayout />}
                    >
                        <Route
                            index
                            element={
                                <Navigate to="jobs" replace />
                            }
                        />

                        <Route
                            path="jobs"
                            element={<FindJobs />}
                        />

                        <Route
                            path="jobs/:jobId"
                            element={<JobDetails />}
                        />

                        <Route
                            path="jobs/:jobId/apply"
                            element={<ApplyJob />}
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

                        <Route
                            path="profile"
                            element={<CandidateProfile />}
                        />

                        <Route
                            path="settings"
                            element={<CandidateSettings />}
                        />
                    </Route>
                </Route>

                {/* Recruiter Routes: RECRUITER role only */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["RECRUITER"]} />
                    }
                >
                    <Route
                        path="/recruiter"
                        element={<RecruiterLayout />}
                    >
                        <Route
                            index
                            element={
                                <Navigate to="jobs" replace />
                            }
                        />

                        <Route
                            path="jobs"
                            element={<Jobs />}
                        />

                        <Route
                            path="jobs/:jobId"
                            element={<RecruiterJobDetails />}
                        />

                        <Route
                            path="jobs/:jobId/applications"
                            element={<RecruiterApplications />}
                        />

                        <Route
                            path="applications"
                            element={<RecruiterApplications />}
                        />

                        <Route
                            path="candidates"
                            element={<Candidates />}
                        />

                        <Route
                            path="interviews"
                            element={<RecruiterInterviews />}
                        />

                        <Route
                            path="post-job"
                            element={<PostJob />}
                        />

                        <Route
                            path="profile"
                            element={<RecruiterProfile />}
                        />

                        <Route
                            path="settings"
                            element={<RecruiterSetting />}
                        />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
