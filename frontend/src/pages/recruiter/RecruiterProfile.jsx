import { useEffect, useState } from "react";

import {
    Briefcase,
    Building2,
    FileText,
    Globe,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    User,
} from "lucide-react";

import {
    getMyCompany,
    getRecruiterProfile,
    updateMyCompany,
    updateRecruiterProfile,
} from "../../services/profileService";

const RecruiterProfile = () => {

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [profile, setProfile] =
        useState({
            name: "",
            email: "",
            phone: "",
            designation: "",
        });

    const [company, setCompany] =
        useState({
            name: "",
            description: "",
            website: "",
            location: "",
            logo: "",
        });


    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                recruiterResponse,
                companyResponse,
            ] = await Promise.all([
                getRecruiterProfile(),
                getMyCompany(),
            ]);

            const recruiter =
                recruiterResponse.data.recruiter;

            const companyData =
                companyResponse.data.company;

            setProfile({
                name:
                    recruiter.user?.name || "",

                email:
                    recruiter.user?.email || "",

                phone:
                    recruiter.user?.phone ||
                    recruiter.phone ||
                    "",

                designation:
                    recruiter.designation || "",
            });

            setCompany({
                name:
                    companyData.name || "",

                description:
                    companyData.description || "",

                website:
                    companyData.website || "",

                location:
                    companyData.location || "",

                logo:
                    companyData.logo || "",
            });

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load recruiter profile"
            );

        } finally {
            setLoading(false);
        }
    };


    const handleProfileChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleCompanyChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setCompany((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleSave = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setMessage("");
            setError("");

            await updateRecruiterProfile({
                name: profile.name,
                phone: profile.phone,
                designation:
                    profile.designation,
            });

            await updateMyCompany({
                name: company.name,
                description:
                    company.description,
                website:
                    company.website,
                location:
                    company.location,
                logo:
                    company.logo,
            });

            setMessage(
                "Profile updated successfully."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {
            setSaving(false);
        }
    };


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">

                <Loader2
                    size={30}
                    className="animate-spin"
                />

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">

            <div className="max-w-5xl mx-auto">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Header */}

                    <div className="px-6 py-6 border-b border-gray-200">

                        <div className="flex items-center gap-4">

                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">

                                <Building2
                                    size={30}
                                    className="text-blue-600"
                                />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-gray-900">
                                    Recruiter Profile
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    Manage your recruiter and company information.
                                </p>

                            </div>

                        </div>

                    </div>


                    {(message || error) && (

                        <div className="px-6 pt-5">

                            {message && (
                                <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3">
                                    {error}
                                </div>
                            )}

                        </div>
                    )}


                    <form
                        onSubmit={handleSave}
                        className="p-6 space-y-8"
                    >

                        {/* Recruiter Information */}

                        <section>

                            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                Recruiter Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <InputField
                                    label="Full Name"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    icon={
                                        <User size={18} />
                                    }
                                />

                                <InputField
                                    label="Email"
                                    name="email"
                                    value={profile.email}
                                    disabled
                                    icon={
                                        <Mail size={18} />
                                    }
                                />

                                <InputField
                                    label="Phone"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleProfileChange}
                                    icon={
                                        <Phone size={18} />
                                    }
                                />

                                <InputField
                                    label="Designation"
                                    name="designation"
                                    value={profile.designation}
                                    onChange={handleProfileChange}
                                    icon={
                                        <Briefcase size={18} />
                                    }
                                    placeholder="HR Manager"
                                />

                            </div>

                        </section>


                        {/* Company */}

                        <section>

                            <h2 className="text-lg font-semibold text-gray-900 mb-5">
                                Company Information
                            </h2>

                            <div className="space-y-5">

                                <InputField
                                    label="Company Name"
                                    name="name"
                                    value={company.name}
                                    onChange={handleCompanyChange}
                                    icon={
                                        <Building2 size={18} />
                                    }
                                />


                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={company.description}
                                        onChange={handleCompanyChange}
                                        rows="5"
                                        maxLength="2000"
                                        placeholder="Tell candidates about your company..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />

                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    <InputField
                                        label="Company Website"
                                        name="website"
                                        value={company.website}
                                        onChange={handleCompanyChange}
                                        icon={
                                            <Globe size={18} />
                                        }
                                        placeholder="https://example.com"
                                    />

                                    <InputField
                                        label="Company Location"
                                        name="location"
                                        value={company.location}
                                        onChange={handleCompanyChange}
                                        icon={
                                            <MapPin size={18} />
                                        }
                                        placeholder="Delhi, India"
                                    />

                                </div>


                                <InputField
                                    label="Company Logo URL"
                                    name="logo"
                                    value={company.logo}
                                    onChange={handleCompanyChange}
                                    icon={
                                        <FileText size={18} />
                                    }
                                    placeholder="https://example.com/logo.png"
                                />

                            </div>

                        </section>


                        <div className="flex justify-end pt-2">

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
                            >

                                {saving ? (
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save size={18} />
                                )}

                                {saving
                                    ? "Saving..."
                                    : "Save Profile"
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};


const InputField = ({
    label,
    name,
    value,
    onChange,
    icon,
    disabled = false,
    placeholder = "",
}) => {

    return (
        <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>

            <div className="relative">

                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </div>

                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${
                        disabled
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                    }`}
                />

            </div>

        </div>
    );
};


export default RecruiterProfile;