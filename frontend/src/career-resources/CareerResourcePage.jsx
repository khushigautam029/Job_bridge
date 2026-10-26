
import {
    ArrowLeft,
    BookOpen,
    BriefcaseBusiness,
    CheckCircle2
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const CareerResourcePage = ({ resource }) => {
    const pageRef = useRef(null);

    // Reveal cards and sections when they enter the screen.
    useEffect(() => {
        const page = pageRef.current;

        if (!page) return;

        const elements = page.querySelectorAll(".jb-reveal");

        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) =>
                element.classList.add("jb-visible")
            );
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("jb-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -25px 0px",
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [resource]);

    return (
        <div
            ref={pageRef}
            className="jobbridge-home flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800"
        >
            {/* ANIMATIONS — MATCHING HOME PAGE */}
            <style>{`
                @keyframes jb-fade-up {
                    from {
                        opacity: 0;
                        transform: translate3d(0, 24px, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }

                @keyframes jb-fade-down {
                    from {
                        opacity: 0;
                        transform: translate3d(0, -12px, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }

                @keyframes jb-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes jb-float {
                    0%, 100% {
                        transform: translate3d(0, 0, 0);
                    }
                    50% {
                        transform: translate3d(0, -12px, 0);
                    }
                }

                @keyframes jb-ring {
                    0% {
                        transform: scale(.8);
                        opacity: .65;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }

                @keyframes jb-shine {
                    0% {
                        transform: translateX(-160%) skewX(-18deg);
                    }
                    55%, 100% {
                        transform: translateX(220%) skewX(-18deg);
                    }
                }

                @keyframes jb-bob {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-7px) rotate(3deg);
                    }
                }

                @keyframes jb-gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .jobbridge-home .jb-enter {
                    opacity: 0;
                    animation: jb-fade-up .7s cubic-bezier(.2,.75,.25,1) forwards;
                }

                .jobbridge-home .jb-enter-down {
                    opacity: 0;
                    animation: jb-fade-down .5s ease-out forwards;
                }

                .jobbridge-home .jb-delay-1 { animation-delay: .10s; }
                .jobbridge-home .jb-delay-2 { animation-delay: .20s; }
                .jobbridge-home .jb-delay-3 { animation-delay: .30s; }

                .jobbridge-home .jb-float {
                    animation: jb-float 7s ease-in-out infinite;
                }

                .jobbridge-home .jb-reveal {
                    opacity: 0;
                    transform: translateY(22px);
                    transition:
                        opacity .65s ease,
                        transform .65s cubic-bezier(.2,.75,.25,1);
                }

                .jobbridge-home .jb-reveal.jb-visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .jobbridge-home .jb-reveal:nth-child(4n + 1) {
                    transition-delay: .04s;
                }

                .jobbridge-home .jb-reveal:nth-child(4n + 2) {
                    transition-delay: .10s;
                }

                .jobbridge-home .jb-reveal:nth-child(4n + 3) {
                    transition-delay: .16s;
                }

                .jobbridge-home .jb-reveal:nth-child(4n + 4) {
                    transition-delay: .22s;
                }

                .jobbridge-home .jb-card {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    transition:
                        transform .28s cubic-bezier(.2,.75,.25,1),
                        box-shadow .28s ease,
                        border-color .28s ease;
                }

                .jobbridge-home .jb-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 18px 35px -22px rgba(30,41,59,.35);
                }

                .jobbridge-home .jb-card::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 42%;
                    background: linear-gradient(
                        100deg,
                        transparent,
                        rgba(255,255,255,.52),
                        transparent
                    );
                    transform: translateX(-160%) skewX(-18deg);
                    pointer-events: none;
                    z-index: 0;
                }

                .jobbridge-home .jb-card:hover::after {
                    animation: jb-shine .8s ease;
                }

                .jobbridge-home .jb-card > * {
                    position: relative;
                    z-index: 1;
                }

                .jobbridge-home .jb-icon-tile {
                    transition:
                        transform .25s ease,
                        background-color .25s ease;
                }

                .jobbridge-home .jb-card:hover .jb-icon-tile {
                    transform: rotate(-4deg) scale(1.06);
                }

                .jobbridge-home .jb-feature-icon {
                    transition: transform .3s ease;
                }

                .jobbridge-home .jb-card:hover .jb-feature-icon {
                    animation: jb-bob .65s ease-in-out;
                }

                .jobbridge-home .jb-button {
                    transition:
                        transform .2s ease,
                        box-shadow .2s ease,
                        background-color .2s ease;
                }

                .jobbridge-home .jb-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px -10px rgba(79,70,229,.55);
                }

                .jobbridge-home .jb-button:active {
                    transform: translateY(0) scale(.98);
                }

                .jobbridge-home .jb-logo-mark {
                    position: relative;
                    isolation: isolate;
                    transition:
                        transform .35s cubic-bezier(.2,.75,.25,1),
                        box-shadow .35s ease;
                }

                .jobbridge-home .jb-logo-mark::after {
                    content: "";
                    position: absolute;
                    inset: -4px;
                    border: 1px solid rgba(99,102,241,.35);
                    border-radius: 12px;
                    z-index: -1;
                    animation: jb-ring 2.8s ease-out infinite;
                }

                .jobbridge-home .jb-brand:hover .jb-logo-mark {
                    transform: rotate(-7deg) scale(1.08);
                    box-shadow: 0 8px 20px -8px rgba(79,70,229,.7);
                }

                .jobbridge-home .jb-section-kicker {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .jobbridge-home .jb-section-kicker::before {
                    content: "";
                    width: 22px;
                    height: 2px;
                    border-radius: 99px;
                    background: currentColor;
                }

                .jobbridge-home .jb-hero-orb {
                    animation: jb-float 7s ease-in-out infinite;
                }

                .jobbridge-home .jb-gradient-text {
                    color: transparent;
                    background: linear-gradient(
                        100deg,
                        #4f46e5 10%,
                        #818cf8 35%,
                        #2563eb 55%,
                        #4f46e5 80%
                    );
                    background-size: 220% auto;
                    background-clip: text;
                    -webkit-background-clip: text;
                    animation: jb-gradient-shift 6s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .jobbridge-home *,
                    .jobbridge-home *::before,
                    .jobbridge-home *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                    }

                    .jobbridge-home .jb-enter,
                    .jobbridge-home .jb-enter-down {
                        opacity: 1;
                    }

                    .jobbridge-home .jb-reveal {
                        opacity: 1;
                        transform: none;
                    }
                }
            `}</style>

            {/* NAVBAR */}
            <header className="jb-enter-down sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-8">
                    <Link
                        to="/"
                        className="jb-brand flex shrink-0 items-center gap-2"
                        aria-label="JobBridge Home"
                    >
                        <div className="jb-logo-mark flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={19} />
                        </div>

                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            Job<span className="text-indigo-600">Bridge</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/login"
                            className="jb-button rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 sm:px-4"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="jb-button rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-5"
                        >
                            <span className="sm:hidden">Join</span>
                            <span className="hidden sm:inline">Get Started</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-5 sm:px-7 sm:py-7 lg:px-8">
                <Link
                    to="/"
                    className="jb-enter mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                >
                    <ArrowLeft size={17} />
                    Back to Home
                </Link>

                {/* HERO */}
                {/* HERO */}
                <section className="jb-enter jb-delay-1 relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-slate-50 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                    <div className="jb-hero-orb pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-indigo-100/60 blur-3xl" />

                    <div className="relative max-w-4xl">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                            <BookOpen size={13} />
                            JobBridge Career Resources
                        </div>

                        <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                            {resource.title}
                        </h1>

                        <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-600 sm:text-sm sm:leading-7">
                            {resource.description}
                        </p>
                    </div>
                </section>

                {/* ADVICE AND CHECKLIST */}
                <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                    {/* ADVICE SECTIONS */}
                    <div className="min-w-0 space-y-4">
                        {resource.sections.map((section, index) => (
                            <section
                                key={section.heading}
                                className="jb-card jb-reveal rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7"
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-lg font-bold leading-7 text-slate-900 sm:text-xl">
                                            {section.heading}
                                        </h2>

                                        {section.intro && (
                                            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                                                {section.intro}
                                            </p>
                                        )}

                                        <ul className="mt-4 space-y-3">
                                            {section.points.map((point) => (
                                                <li
                                                    key={point}
                                                    className="flex items-start gap-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7"
                                                >
                                                    <CheckCircle2
                                                        size={18}
                                                        className="jb-feature-icon mt-1 shrink-0 text-indigo-600"
                                                    />
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {section.example && (
                                            <div className="jb-reveal mt-5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
                                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                                    Practical Example
                                                </p>

                                                <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-slate-700 sm:text-base">
                                                    {section.example}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* SIDEBAR */}
                    <aside className="min-w-0 space-y-4 lg:sticky lg:top-20">
                        {/* CHECKLIST */}
                        <section className="jb-card jb-reveal rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="jb-icon-tile flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    <CheckCircle2 size={21} />
                                </div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    Your Checklist
                                </h2>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                Use this checklist to review the important points before taking your next step.
                            </p>

                            <ul className="mt-5 space-y-4">
                                {resource.checklist.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                                    >
                                        <CheckCircle2
                                            size={18}
                                            className="mt-0.5 shrink-0 text-emerald-600"
                                        />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* FIND JOBS CARD */}
                        <section className="jb-card jb-reveal overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="h-1 bg-indigo-600" />

                            <div className="p-5 sm:p-6">
                                <div className="jb-icon-tile flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <BriefcaseBusiness size={23} />
                                </div>

                                <h2 className="mt-4 text-xl font-bold leading-7 text-slate-900">
                                    Ready for your next opportunity?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Put what you have learned into practice and explore jobs that match your skills.
                                </p>
                            </div>
                        </section>
                    </aside>
                </div>

                {/* BOTTOM NAVIGATION */}
                <div className="jb-card jb-reveal mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:px-6">
                    <p className="text-sm text-slate-500">
                        Keep learning, keep improving, and keep moving forward.
                    </p>

                    <Link
                        to="/"
                        className="jb-button inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                        <ArrowLeft size={16} />
                        Return to Home
                    </Link>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="mt-auto border-t border-slate-200 bg-white">
                <div className="mx-auto w-full max-w-[1400px] px-5 py-10 sm:px-7 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* BRAND */}
                        <div className="jb-reveal sm:col-span-2 lg:col-span-2">
                            <Link to="/" className="jb-brand inline-flex items-center gap-3">
                                <div className="jb-logo-mark flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                                    <BriefcaseBusiness size={21} />
                                </div>

                                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                                    Job<span className="text-indigo-600">Bridge</span>
                                </span>
                            </Link>

                            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                                Connecting talented people with meaningful career
                                opportunities. Find jobs, discover companies, and take
                                the next step in your professional journey with JobBridge.
                            </p>
                        </div>

                        {/* QUICK LINKS */}
                        <div className="jb-reveal">
                            <h3 className="text-sm font-bold text-slate-900">
                                Quick Links
                            </h3>

                            <ul className="mt-4 space-y-3 text-sm text-slate-500">
                                <li>
                                    <Link
                                        to="/#features"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/#features"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Our Features
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Home
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* SUPPORT */}
                        <div className="jb-reveal">
                            <h3 className="text-sm font-bold text-slate-900">
                                Support
                            </h3>

                            <ul className="mt-4 space-y-3 text-sm text-slate-500">
                                <li>
                                    <a
                                        href="mailto:support@jobbridge.com"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/privacy"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/terms"
                                        className="transition-colors hover:text-indigo-600"
                                    >
                                        Terms &amp; Conditions
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* FOOTER BOTTOM BAR */}
                    <div className="jb-reveal mt-9 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-500">
                            © {new Date().getFullYear()} JobBridge. All rights reserved.
                        </p>

                        <p className="text-xs text-slate-500">
                            Built to connect talent with opportunity.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CareerResourcePage;
