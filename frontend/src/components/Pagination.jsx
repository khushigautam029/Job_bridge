import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE = 20;

export const usePagination = (items, resetKey = "") => {
    const [requestedPage, setRequestedPage] = useState(1);
    const pageCount = Math.ceil(items.length / PAGE_SIZE);
    const currentPage = Math.min(requestedPage, Math.max(pageCount, 1));

    useEffect(() => {
        setRequestedPage(1);
    }, [resetKey]);

    const pageItems = items.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return {
        pageItems,
        currentPage,
        setCurrentPage: setRequestedPage,
        pageCount,
    };
};

const Pagination = ({ totalItems, currentPage, pageCount, onPageChange }) => {
    if (pageCount <= 1) return null;

    const firstItem = (currentPage - 1) * PAGE_SIZE + 1;
    const lastItem = Math.min(currentPage * PAGE_SIZE, totalItems);
    const visiblePages = pageCount <= 7
        ? Array.from({ length: pageCount }, (_, index) => index + 1)
        : [...new Set([1, 2, currentPage - 1, currentPage, currentPage + 1, pageCount])]
            .filter((page) => page >= 1 && page <= pageCount)
            .sort((a, b) => a - b);

    return (
        <nav
            className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row"
            aria-label="Pagination"
        >
            <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{firstItem}–{lastItem}</span> of {totalItems}
            </p>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={17} />
                </button>

                {visiblePages.map((page, index) => (
                    <span key={page} className="flex items-center gap-1">
                        {index > 0 && page - visiblePages[index - 1] > 1 && (
                            <span className="px-1 text-slate-400" aria-hidden="true">…</span>
                        )}
                        <button
                            type="button"
                            onClick={() => onPageChange(page)}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${currentPage === page
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                }`}
                        >
                            {page}
                        </button>
                    </span>
                ))}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === pageCount}
                    aria-label="Next page"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight size={17} />
                </button>
            </div>
        </nav>
    );
};

export default Pagination;
