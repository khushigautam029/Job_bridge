import {
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    HeartHandshake,
    Target,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description:
                "To make job searching easier and help candidates discover opportunities that match their skills, interests, and career goals.",
        },
        {
            icon: Users,
            title: "Our Community",
            description:
                "We bring candidates, recruiters, and companies together on one platform to make the hiring process more accessible.",
        },
        {
            icon: HeartHandshake,
            title: "Our Commitment",
            description:
                "We aim to provide a straightforward and useful experience for candidates looking for jobs and recruiters searching for talent.",
        },
    ];

    const benefits = [
        "Discover opportunities across different companies.",
        "Create a professional profile and manage your applications.",
        "Help recruiters connect with relevant candidates.",
        "Keep track of interviews and application updates.",
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-white">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
                <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                            <BriefcaseBusiness size={17} />
                            About JobBridge
                        </span>

                        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            Connecting talent
                            <span className="block text-indigo-600">
                                with opportunity.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                            JobBridge is a job portal designed to bring job
                            seekers and recruiters together. Our goal is to
                            simplify the job search, make applications easier
                            to manage, and help people take their next career
                            step with confidence.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                            >
                                Explore JobBridge
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/candidate/jobs"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                Find Jobs
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                                    <BriefcaseBusiness size={28} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Your next opportunity
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Starts with a connection.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-5">
                                {[
                                    {
                                        title: "Discover opportunities",
                                        detail: "Explore jobs that match your goals.",
                                    },
                                    {
                                        title: "Connect with recruiters",
                                        detail: "Bring candidates and employers together.",
                                    },
                                    {
                                        title: "Manage your journey",
                                        detail: "Track applications and interviews.",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-slate-800">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                                {item.detail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="absolute -bottom-5 -right-3 -z-0 h-24 w-24 rounded-3xl bg-indigo-100 sm:-right-5" />
                    </div>
                </div>
            </section>

            {/* MISSION SECTION */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                        Who We Are
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Making career connections simpler
                    </h2>

                    <p className="mt-5 text-base leading-8 text-slate-600">
                        Finding the right job or the right candidate can take
                        time. JobBridge brings important parts of the hiring
                        journey into one place, helping candidates explore
                        openings and recruiters manage their hiring activities.
                        We want to make the process clearer, more organized,
                        and easier to navigate.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {values.map((value) => {
                        const Icon = value.icon;

                        return (
                            <article
                                key={value.title}
                                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Icon size={24} />
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-slate-900">
                                    {value.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {value.description}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* WHAT WE OFFER */}
            <section className="border-y border-slate-200 bg-white">
                <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-20">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                            Why JobBridge
                        </p>

                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            A better organized job search
                        </h2>

                        <p className="mt-5 leading-8 text-slate-600">
                            Whether you are searching for your first
                            opportunity or looking for suitable candidates,
                            JobBridge provides tools to support your journey.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-6 sm:p-8">
                        <ul className="space-y-5">
                            {benefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle2
                                        size={21}
                                        className="mt-0.5 shrink-0 text-emerald-600"
                                    />
                                    <span className="text-sm leading-7 text-slate-700 sm:text-base">
                                        {benefit}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
                <div className="rounded-3xl bg-indigo-600 px-6 py-12 text-center shadow-xl shadow-indigo-200 sm:px-12 sm:py-16">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Your next chapter starts here.
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-indigo-100">
                        Explore opportunities, discover talent, and take the
                        next step with JobBridge.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        >
                            Back to Home
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/candidate/jobs"
                            className="inline-flex items-center rounded-xl border border-indigo-300 px-6 py-3.5 font-semibold text-white transition hover:bg-indigo-500"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
