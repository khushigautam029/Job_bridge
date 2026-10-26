
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    Mail,
    MessageSquare,
    Send,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setSubmitted(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Please enter your name.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Please enter your email address.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Please enter a subject.";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Please enter your message.";
        } else if (formData.message.trim().length < 10) {
            newErrors.message =
                "Your message must contain at least 10 characters.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // No backend or email service is connected yet.
        // Open the user's email application with the message prepared.
        const mailtoLink = new URL("mailto:support@jobbridge.com");

        mailtoLink.searchParams.set(
            "subject",
            `[JobBridge Support] ${formData.subject.trim()}`
        );

        mailtoLink.searchParams.set(
            "body",
            `Name: ${formData.name.trim()}\n` +
                `Email: ${formData.email.trim()}\n\n` +
                `Message:\n${formData.message.trim()}`
        );

        window.location.href = mailtoLink.toString();
        setSubmitted(true);
    };

    const inputClass =
        "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />
                <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Home
                    </Link>

                    <div className="mt-8 max-w-3xl">
                        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                            <MessageSquare size={17} />
                            Contact JobBridge
                        </span>

                        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            We're here to
                            <span className="block text-indigo-600">
                                help you.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            Have a question about finding jobs, managing
                            applications, or using JobBridge? Send us a message
                            and we'll help you find the right direction.
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTACT CONTENT */}
            <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.85fr_1.4fr] lg:px-10 lg:py-16">
                {/* LEFT INFORMATION */}
                <aside className="space-y-6">
                    <div className="rounded-2xl bg-indigo-600 p-7 text-white shadow-lg shadow-indigo-200 sm:p-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                            <BriefcaseBusiness size={25} />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold">
                            Get in touch
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-indigo-100">
                            We're interested in helping you have a better
                            experience with JobBridge. Choose the contact
                            option below that works best for you.
                        </p>

                        <div className="mt-8 border-t border-white/20 pt-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                    <Mail size={20} />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-semibold">
                                        Email Support
                                    </h3>

                                    <a
                                        href="mailto:support@jobbridge.com"
                                        className="mt-1 block break-all text-sm text-indigo-100 transition hover:text-white"
                                    >
                                        support@jobbridge.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <p className="mt-7 rounded-xl border border-white/20 bg-white/10 p-4 text-sm leading-6 text-indigo-50">
                            Please include enough detail in your message to
                            help explain the question or issue you're facing.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <ShieldCheck size={22} />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Your information matters
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                    Share only the information needed to
                                    explain your request. Avoid including
                                    passwords or other sensitive account
                                    details.
                                </p>

                                <Link
                                    to="/privacy"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                >
                                    Read Privacy Policy
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CONTACT FORM */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900">
                            Send us a message
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Fill in the details below. Fields marked with *
                            are required.
                        </p>
                    </div>

                    {submitted && (
                        <div
                            role="status"
                            className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
                        >
                            Your email application was requested to open.
                            Please review and send the prepared email to
                            contact JobBridge support.
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 space-y-5"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="contact-name"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Full Name *
                                </label>

                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={inputClass}
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={
                                        errors.name
                                            ? "contact-name-error"
                                            : undefined
                                    }
                                />

                                {errors.name && (
                                    <p
                                        id="contact-name-error"
                                        className="mt-2 text-sm text-red-600"
                                    >
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="contact-email"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Email Address *
                                </label>

                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={inputClass}
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={
                                        errors.email
                                            ? "contact-email-error"
                                            : undefined
                                    }
                                />

                                {errors.email && (
                                    <p
                                        id="contact-email-error"
                                        className="mt-2 text-sm text-red-600"
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="contact-subject"
                                className="text-sm font-semibold text-slate-700"
                            >
                                Subject *
                            </label>

                            <input
                                id="contact-subject"
                                name="subject"
                                type="text"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What can we help you with?"
                                className={inputClass}
                                aria-invalid={Boolean(errors.subject)}
                                aria-describedby={
                                    errors.subject
                                        ? "contact-subject-error"
                                        : undefined
                                }
                            />

                            {errors.subject && (
                                <p
                                    id="contact-subject-error"
                                    className="mt-2 text-sm text-red-600"
                                >
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="contact-message"
                                className="text-sm font-semibold text-slate-700"
                            >
                                Your Message *
                            </label>

                            <textarea
                                id="contact-message"
                                name="message"
                                rows={6}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us how we can help..."
                                className={`${inputClass} resize-y`}
                                aria-invalid={Boolean(errors.message)}
                                aria-describedby={
                                    errors.message
                                        ? "contact-message-error"
                                        : undefined
                                }
                            />

                            <div className="mt-2 flex items-center justify-between gap-3">
                                {errors.message ? (
                                    <p
                                        id="contact-message-error"
                                        className="text-sm text-red-600"
                                    >
                                        {errors.message}
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-400">
                                        Minimum 10 characters.
                                    </p>
                                )}

                                <span className="shrink-0 text-xs text-slate-400">
                                    {formData.message.length} characters
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 sm:w-auto"
                        >
                            <Send size={18} />
                            Prepare Email
                        </button>

                        <p className="text-xs leading-6 text-slate-500">
                            Submitting this form opens your default email
                            application with a prepared message. It does not
                            send an email automatically.
                        </p>
                    </form>
                </section>
            </section>

            {/* BOTTOM LINK */}
            <section className="border-t border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
                    <div>
                        <h3 className="font-bold text-slate-900">
                            Explore JobBridge
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Discover opportunities for your next career step.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:self-auto"
                    >
                        <CheckCircle2 size={17} />
                        Back to Home
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default ContactUs;
