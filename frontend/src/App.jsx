import { useEffect, useLayoutEffect } from "react";
import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
    useLocation,
    useNavigationType,
} from "react-router-dom";

import FreshersCareerGuide from "./career-resources/FreshersCareerGuide";
import InterviewPreparation from "./career-resources/InterviewPreparation";
import ResumeWritingTips from "./career-resources/ResumeWritingTips";
import TechnicalInterviewTips from "./career-resources/TechnicalInterviewTips";

import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Features from "./pages/Features";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";

import Applications from "./pages/candidate/Applications";
import ApplyJob from "./pages/candidate/ApplyJob";
import CandidateLayout from "./pages/candidate/CandidateLayout";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateSettings from "./pages/candidate/CandidateSettings";
import FindJobs from "./pages/candidate/FindJobs";
import Interviews from "./pages/candidate/Interviews";
import JobDetails from "./pages/candidate/JobDetails";
import SavedJobs from "./pages/candidate/SavedJobs";

import Home from "./pages/Home";
import HomeJobs from "./pages/HomeJobs";
import NotFound from "./pages/NotFound";

import Candidates from "./pages/recruiter/Candidate";
import Jobs from "./pages/recruiter/Jobs";
import PostJob from "./pages/recruiter/PostJob";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";
import RecruiterJobDetails from "./pages/recruiter/RecruiterJobDetails";
import RecruiterLayout from "./pages/recruiter/RecruiterLayout";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import RecruiterSetting from "./pages/recruiter/RecruiterSetting";

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

const scrollPositions = new Map();

// Start new history entries at the top, and restore the prior position when
// the user goes back or forward. Anchors handle pages whose content loads
// asynchronously and changes the document height.
const ScrollToTop = () => {
    const location = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        const previousRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        return () => {
            window.history.scrollRestoration = previousRestoration;
        };
    }, []);

    useEffect(() => {
        const savePosition = () => {
            const anchorLine = Math.min(120, window.innerHeight * 0.25);
            const anchor = [...document.querySelectorAll("[data-scroll-anchor]")]
                .find((element) => {
                    const bounds = element.getBoundingClientRect();
                    return bounds.top <= anchorLine && bounds.bottom > anchorLine;
                });

            scrollPositions.set(location.key, {
                y: window.scrollY,
                anchorId: anchor?.id || null,
                anchorOffset: anchor?.getBoundingClientRect().top ?? null,
            });
        };

        savePosition();
        window.addEventListener("scroll", savePosition, { passive: true });
        return () => window.removeEventListener("scroll", savePosition);
    }, [location.key]);

    useLayoutEffect(() => {
        const savedPosition = scrollPositions.get(location.key);
        if (navigationType !== "POP" || !savedPosition) {
            window.scrollTo(0, 0);
            return undefined;
        }

        let timeoutId;
        let observer;
        let restored = false;
        const restorePosition = () => {
            if (restored) return true;
            const anchor = savedPosition.anchorId
                ? document.getElementById(savedPosition.anchorId)
                : null;

            if (anchor) {
                window.scrollTo(
                    0,
                    window.scrollY + anchor.getBoundingClientRect().top - savedPosition.anchorOffset
                );
                restored = true;
                observer?.disconnect();
                window.clearTimeout(timeoutId);
                return true;
            }

            if (!savedPosition.anchorId) {
                window.scrollTo(0, savedPosition.y);
                restored = true;
                return true;
            }
            return false;
        };

        if (!restorePosition()) {
            window.scrollTo(0, 0);
            observer = new MutationObserver(restorePosition);
            observer.observe(document.body, { childList: true, subtree: true });
            timeoutId = window.setTimeout(() => {
                observer.disconnect();
                if (!restored) window.scrollTo(0, savedPosition.y);
            }, 5000);
        }

        return () => {
            observer?.disconnect();
            window.clearTimeout(timeoutId);
        };
    }, [location.key, navigationType]);

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

                {/* About and Footer Pages */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/features" element={<Features />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route
                    path="/terms"
                    element={<TermsAndConditions />}
                />

                {/* Career Resources */}
                <Route
                    path="/career-resources/resume-writing-tips"
                    element={<ResumeWritingTips />}
                />
                <Route
                    path="/career-resources/interview-preparation"
                    element={<InterviewPreparation />}
                />
                <Route
                    path="/career-resources/freshers-career-guide"
                    element={<FreshersCareerGuide />}
                />
                <Route
                    path="/career-resources/technical-interview-tips"
                    element={<TechnicalInterviewTips />}
                />

                {/* Authentication Routes */}
                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

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
                            element={<Navigate to="jobs" replace />}
                        />
                        <Route path="jobs" element={<FindJobs />} />
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
                            element={<Navigate to="jobs" replace />}
                        />
                        <Route path="jobs" element={<Jobs />} />
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
