
import {
    ArrowLeft,
    BookOpen,
    BriefcaseBusiness,
    CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

const CareerResourcePage = ({ resource }) => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">

            {/* NAVBAR — MATCHING JOBBRIDGE HOME */}
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:px-8">

                    {/* LOGO */}
                    <Link
                        to="/"
                        className="flex shrink-0 items-center gap-2"
                        aria-label="JobBridge Home"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                            <BriefcaseBusiness size={22} />
                        </div>

                        <span className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            Job
                            <span className="text-indigo-600">Bridge</span>
                        </span>
                    </Link>


                    {/* ACTION BUTTONS */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/login"
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600 sm:px-4"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:px-5"
                        >
                            <span className="sm:hidden">Join</span>
                            <span className="hidden sm:inline">Get Started</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-5 sm:px-7 sm:py-7 lg:px-8">

                {/* BACK LINK */}
                <Link
                    to="/"
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                >
                    <ArrowLeft size={17} />
                    Back to Home
                </Link>

                {/* PAGE HERO */}
                <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-slate-50 px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl" />

                    <div className="relative max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-indigo-600 shadow-sm">
                            <BookOpen size={16} />
                            JobBridge Career Resources
                        </div>

                        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                            {resource.title}
                        </h1>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
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
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-indigo-100 hover:shadow-md sm:p-6 lg:p-7"
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
                                                        className="mt-1 shrink-0 text-indigo-600"
                                                    />

                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {section.example && (
                                            <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-4 sm:p-5">
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

                    {/* RIGHT SIDEBAR */}
                    <aside className="min-w-0 space-y-4 lg:sticky lg:top-20">

                        {/* CHECKLIST */}
                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
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
                        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="h-1 bg-indigo-600" />

                            <div className="p-5 sm:p-6">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
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
                <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:px-6">
                    <p className="text-sm text-slate-500">
                        Keep learning, keep improving, and keep moving forward.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                    >
                        <ArrowLeft size={16} />
                        Return to Home
                    </Link>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="mt-5 border-t border-slate-200 bg-white">
                <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-2 px-5 py-5 text-center sm:flex-row sm:px-7 sm:text-left lg:px-8">
                    <Link
                        to="/"
                        className="text-lg font-bold tracking-tight text-slate-900"
                    >
                        Job
                        <span className="text-indigo-600">Bridge</span>
                    </Link>

                    <p className="text-xs text-slate-500 sm:text-sm">
                        © {new Date().getFullYear()} JobBridge. Build your career with confidence.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CareerResourcePage;
