
import {
    ArrowLeft,
    ArrowRight,
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    Database,
    FileText,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    const lastUpdated = "October 26, 2026";

    const sections = [
        {
            id: "information",
            icon: UserRound,
            title: "1. Information We May Collect",
            content: [
                {
                    heading: "Account information",
                    text: "When you create an account, JobBridge may collect information such as your name, email address, phone number, password credentials, and account role.",
                },
                {
                    heading: "Profile and professional information",
                    text: "Depending on the features you use, your profile may include education, skills, work experience, resume details, company information, and other professional details you choose to provide.",
                },
                {
                    heading: "Job and application information",
                    text: "When candidates apply for jobs, information associated with their applications may be processed so recruiters can review and manage applications.",
                },
            ],
        },
        {
            id: "usage",
            icon: Database,
            title: "2. How Information Is Used",
            content: [
                {
                    heading: "Providing platform services",
                    text: "Information may be used to operate JobBridge accounts, display relevant job listings, manage job postings, and support application workflows.",
                },
                {
                    heading: "Recruitment activities",
                    text: "Candidate application details may be made available to the relevant recruiter to support the recruitment process.",
                },
                {
                    heading: "Platform improvements",
                    text: "Information may be used to troubleshoot issues, maintain platform functionality, and improve the user experience where appropriate.",
                },
            ],
        },
        {
            id: "visibility",
            icon: BriefcaseBusiness,
            title: "3. Profile Visibility and Information Sharing",
            content: [
                {
                    heading: "Candidate information",
                    text: "Information included in a job application may be accessible to the recruiter responsible for that job. Avoid including unnecessary sensitive information in your profile or resume.",
                },
                {
                    heading: "Recruiter information",
                    text: "Recruiter profiles, company details, and job postings may be displayed to candidates where the platform functionality makes them available.",
                },
                {
                    heading: "Company visibility settings",
                    text: "Certain company visibility preferences may affect how company information is presented in supported areas of JobBridge. These settings should not be assumed to hide all information in every situation.",
                },
            ],
        },
        {
            id: "resumes",
            icon: FileText,
            title: "4. Resumes and Documents",
            content: [
                {
                    heading: "Resume uploads",
                    text: "If you upload a resume, it may be stored and processed to support your profile and job applications.",
                },
                {
                    heading: "Responsible sharing",
                    text: "Only upload documents you have permission to share. Check that your resume does not contain passwords, financial account details, or other information that recruiters do not need.",
                },
            ],
        },
        {
            id: "interviews",
            icon: CalendarDays,
            title: "5. Interviews and Notifications",
            content: [
                {
                    heading: "Interview details",
                    text: "Information such as interview schedules, formats, meeting links, and related status updates may be processed to coordinate interviews between candidates and recruiters.",
                },
                {
                    heading: "Notifications",
                    text: "JobBridge may use notification features to display relevant updates about applications, interviews, and other supported activities.",
                },
            ],
        },
        {
            id: "security",
            icon: LockKeyhole,
            title: "6. Data Security",
            content: [
                {
                    heading: "Account protection",
                    text: "Users should keep their login credentials confidential and use a strong, unique password.",
                },
                {
                    heading: "Reasonable safeguards",
                    text: "Appropriate technical and organizational safeguards should be used to protect personal information. However, no online service can guarantee absolute security.",
                },
                {
                    heading: "Report concerns",
                    text: "If you believe your account has been accessed without permission, contact the JobBridge support team promptly.",
                },
            ],
        },
        {
            id: "retention",
            icon: Database,
            title: "7. Data Retention and Deletion",
            content: [
                {
                    heading: "Keeping information",
                    text: "Information may be retained for as long as necessary to provide the service, maintain records, resolve disputes, or meet applicable legal obligations.",
                },
                {
                    heading: "Deletion requests",
                    text: "If you want to request access to, correction of, or deletion of your personal information, contact support. Whether a request can be fulfilled may depend on applicable law and the technical capabilities of the platform.",
                },
            ],
        },
        {
            id: "third-party",
            icon: BriefcaseBusiness,
            title: "8. Third-Party Services",
            content: [
                {
                    heading: "External services",
                    text: "Some features may depend on third-party services, such as location autocomplete, file storage, email delivery, or online meeting providers.",
                },
                {
                    heading: "External policies",
                    text: "Third-party services may process information under their own privacy policies and terms. Review those policies when using their services.",
                },
            ],
        },
        {
            id: "changes",
            icon: Bell,
            title: "9. Changes to This Policy",
            content: [
                {
                    heading: "Policy updates",
                    text: "This policy may be updated when JobBridge features, data practices, or applicable legal requirements change.",
                },
                {
                    heading: "Reviewing updates",
                    text: "The latest version should be published on this page with an updated revision date.",
                },
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            {/* HEADER */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Home
                    </Link>

                    <div className="mt-8 flex max-w-4xl items-start gap-4 sm:gap-6">
                        <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 sm:flex">
                            <ShieldCheck size={32} />
                        </div>

                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                                <ShieldCheck size={16} />
                                Your Privacy Matters
                            </span>

                            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Privacy Policy
                            </h1>

                            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                                This policy explains how JobBridge may collect,
                                use, and share information when you use our
                                job-search and recruitment platform.
                            </p>

                            <p className="mt-4 text-sm text-slate-500">
                                Last updated: {lastUpdated}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                            <LockKeyhole size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                About this policy
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                                JobBridge is intended to help candidates
                                discover employment opportunities and help
                                recruiters manage hiring activities. This page
                                describes general information-handling
                                practices. The final published policy should
                                be checked against the actual systems,
                                services, and applicable legal requirements
                                used by JobBridge.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* POLICY CONTENT */}
            <section className="mx-auto grid max-w-7xl items-start gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10 lg:pb-20">
                {/* TABLE OF CONTENTS */}
                <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
                    <h2 className="font-bold text-slate-900">
                        On this page
                    </h2>

                    <nav className="mt-4 space-y-1">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                {section.title}
                            </a>
                        ))}
                    </nav>

                    <div className="mt-5 border-t border-slate-100 pt-5">
                        <a
                            href="mailto:support@jobbridge.com"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                            <Mail size={16} />
                            Contact Support
                        </a>
                    </div>
                </aside>

                {/* POLICY SECTIONS */}
                <div className="min-w-0 space-y-6">
                    {sections.map((section) => {
                        const Icon = section.icon;

                        return (
                            <article
                                key={section.id}
                                id={section.id}
                                className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Icon size={22} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                                            {section.title}
                                        </h2>

                                        <div className="mt-6 space-y-6">
                                            {section.content.map((item) => (
                                                <div key={item.heading}>
                                                    <h3 className="font-semibold text-slate-800">
                                                        {item.heading}
                                                    </h3>

                                                    <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}

                    {/* CONTACT SUPPORT */}
                    <div className="rounded-2xl bg-indigo-600 p-6 text-white sm:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                <Mail size={22} />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">
                                    Questions about your privacy?
                                </h2>

                                <p className="mt-3 text-sm leading-7 text-indigo-100">
                                    Contact JobBridge support for questions
                                    about this policy or to make a request
                                    concerning your personal information.
                                </p>

                                <a
                                    href="mailto:support@jobbridge.com"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                                >
                                    Contact Support
                                    <ArrowRight size={17} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>

                        <Link
                            to="/terms"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                        >
                            Terms &amp; Conditions
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PrivacyPolicy;
