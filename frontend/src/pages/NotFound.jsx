import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
            <div className="w-full max-w-lg text-center">

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                        <SearchX
                            size={40}
                            className="text-blue-600"
                        />
                    </div>
                </div>

                {/* 404 */}
                <h1 className="text-7xl font-bold text-slate-800">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-semibold text-slate-800">
                    Page Not Found
                </h2>

                <p className="mt-3 text-slate-500 leading-relaxed">
                    Sorry, the page you are looking for doesn't exist
                    or may have been moved.
                </p>

                {/* Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-100 transition"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                        <Home size={18} />
                        Go Home
                    </button>

                </div>
            </div>
        </div>
    );
};

export default NotFound;

