
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Ban,
    BriefcaseBusiness,
    FileText,
    Handshake,
    Mail,
    Scale,
    ShieldCheck,
    UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
    const lastUpdated = "October 26, 2026";

    const sections = [
        {
            id: "acceptance",
            icon: Scale,
            title: "1. Acceptance of Terms",
            paragraphs: [
                "These Terms and Conditions govern your access to and use of the JobBridge platform.",
                "By accessing or using JobBridge, you agree to follow these terms and applicable laws. If you do not agree, please discontinue use of the platform.",
            ],
        },
        {
            id: "eligibility",
            icon: UserCheck,
            title: "2. User Accounts and Eligibility",
            paragraphs: [
                "You are responsible for providing accurate information when registering and keeping your account details up to date.",
                "Keep your login credentials confidential. You are responsible for activities performed through your account, subject to applicable law.",
                "You must be legally permitted to use the platform and must provide truthful information about your identity and professional background.",
            ],
        },
        {
            id: "candidates",
            icon: FileText,
            title: "3. Candidate Responsibilities",
            paragraphs: [
                "Candidates should provide accurate information in their profiles, resumes, and job applications.",
                "Candidates are responsible for reviewing job descriptions and deciding whether to apply for a position.",
                "Do not submit false qualifications, misleading employment history, another person's documents without permission, or other deceptive application information.",
            ],
        },
        {
            id: "recruiters",
            icon: BriefcaseBusiness,
            title: "4. Recruiter Responsibilities",
            paragraphs: [
                "Recruiters are responsible for the accuracy and legitimacy of the job openings they publish.",
                "Job descriptions should clearly describe the role, relevant requirements, and material employment details.",
                "Recruiters must use candidate information only for legitimate recruitment-related purposes and handle that information in accordance with applicable privacy and employment laws.",
                "Recruiters must not impersonate companies, misrepresent opportunities, or request inappropriate payments or sensitive information from candidates.",
            ],
        },
        {
            id: "applications",
            icon: Handshake,
            title: "5. Jobs and Applications",
            paragraphs: [
                "JobBridge provides tools to help candidates discover opportunities and recruiters manage job listings and applications.",
                "Submitting an application does not guarantee an interview, offer, or employment. Hiring decisions remain with the relevant employer or recruiter.",
                "Job listings, application statuses, and recruitment timelines may change. Users should verify important details directly with the relevant employer.",
            ],
        },
        {
            id: "interviews",
            icon: UserCheck,
            title: "6. Interviews and Communication",
            paragraphs: [
                "Users should provide accurate interview availability and respect scheduled interview arrangements.",
                "Online interview links and related details should be used only for their intended purpose and shared only with authorized participants.",
                "JobBridge cannot guarantee that every interview will take place as scheduled or that third-party meeting services will always be available.",
            ],
        },
        {
            id: "acceptable-use",
            icon: ShieldCheck,
            title: "7. Acceptable Use",
            paragraphs: [
                "You must use JobBridge lawfully and respectfully.",
                "You must not use the platform for fraud, spam, harassment, unauthorized access, malicious activity, or misleading recruitment practices.",
                "You must not attempt to access another user's account, interfere with the platform's operation, or collect other users' information without proper authorization.",
                "You must not upload content that infringes another person's intellectual property or violates applicable law.",
            ],
        },
        {
            id: "content",
            icon: FileText,
            title: "8. User Content",
            paragraphs: [
                "You remain responsible for the content you submit, including resumes, profile details, job descriptions, and messages.",
                "You must have the rights and permissions necessary to upload and share your content.",
                "You should not upload confidential information or personal information belonging to another person unless you have a lawful basis and appropriate permission to do so.",
            ],
        },
        {
            id: "third-party",
            icon: AlertCircle,
            title: "9. Third-Party Services and Links",
            paragraphs: [
                "Certain JobBridge features may rely on third-party services, including location tools, online meeting platforms, hosting providers, or email services.",
                "Third-party services may have separate terms, privacy policies, availability, and technical limitations.",
                "You are responsible for reviewing relevant third-party terms when using those services.",
            ],
        },
        {
            id: "suspension",
            icon: Ban,
            title: "10. Misuse and Account Restrictions",
            paragraphs: [
                "Where permitted by applicable law, JobBridge may investigate suspected misuse and take appropriate action to protect users and the platform.",
                "Possible actions may include removing inappropriate content, restricting features, or suspending access where justified.",
                "Any account restriction or termination process should be handled in accordance with applicable law and any relevant platform procedures.",
            ],
        },
        {
            id: "availability",
            icon: ShieldCheck,
            title: "11. Platform Availability and Limitations",
            paragraphs: [
                "JobBridge is intended to support job discovery and recruitment activities, but uninterrupted availability cannot be guaranteed.",
                "We do not guarantee the accuracy of every job listing, the conduct of every user, the outcome of a recruitment process, or that a particular job will remain available.",
                "To the extent permitted by applicable law, platform services are provided subject to their actual functionality and limitations. Nothing in these terms excludes rights or liabilities that cannot legally be excluded.",
            ],
        },
        {
            id: "changes",
            icon: Scale,
            title: "12. Changes to These Terms",
            paragraphs: [
                "These terms may be updated to reflect changes in platform features, operations, or applicable legal requirements.",
                "The latest version should be published on this page with an updated revision date. Where required, users will be notified of material changes.",
                "Continued use of JobBridge after updated terms take effect is subject to applicable law and any required consent procedures.",
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            {/* HERO SECTION */}
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

                    <div className="mt-8 flex max-w-4xl items-start gap-5">
                        <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 sm:flex">
                            <Scale size={32} />
                        </div>

                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                                <ShieldCheck size={16} />
                                Using JobBridge Responsibly
                            </span>

                            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                                Terms &amp; Conditions
                            </h1>

                            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                                Please read these terms to understand the
                                responsibilities of candidates, recruiters,
                                and other users of the JobBridge platform.
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
                            <BriefcaseBusiness size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Welcome to JobBridge
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                                JobBridge connects job seekers with
                                employment opportunities and provides
                                recruitment tools for recruiters. These terms
                                describe general rules for using the service
                                and should be reviewed against the actual
                                platform functionality and applicable law
                                before publication.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TERMS CONTENT */}
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
                                className="block rounded-lg px-3 py-2.5 text-sm leading-5 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
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

                {/* TERMS SECTIONS */}
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

                                        <div className="mt-5 space-y-4">
                                            {section.paragraphs.map(
                                                (paragraph, index) => (
                                                    <p
                                                        key={index}
                                                        className="text-sm leading-7 text-slate-600 sm:text-base"
                                                    >
                                                        {paragraph}
                                                    </p>
                                                )
                                            )}
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
                                    Have questions about these terms?
                                </h2>

                                <p className="mt-3 text-sm leading-7 text-indigo-100">
                                    Contact the JobBridge support team if
                                    you have questions about the platform
                                    or these terms.
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

                    {/* BOTTOM NAVIGATION */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>

                        <Link
                            to="/privacy"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                        >
                            Privacy Policy
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TermsAndConditions;
