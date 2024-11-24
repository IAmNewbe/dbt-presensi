import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageSelect: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageSelect,
}) => {
  const getVisiblePages = (): number[] => {
    const visiblePages: number[] = [];

    if (totalPages <= 7) {
      // If total pages are small, show all
      for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
    } else {
      // Always show first, last, current, and a few neighbors
      visiblePages.push(1); // First page
      if (currentPage > 3) visiblePages.push(-1); // Ellipsis

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        visiblePages.push(i);
      }

      if (currentPage < totalPages - 2) visiblePages.push(-1); // Ellipsis
      visiblePages.push(totalPages); // Last page
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center mt-4">
      <ul className="inline-flex -space-x-px text-sm md:text-base">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageSelect(Math.max(currentPage - 1, 1))}
            className="px-2 md:px-3 py-2 bg-white border border-blueeazy dark:bg-boxdark rounded-l-md text-blueeazy hover:bg-blueeazy hover:text-white disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {visiblePages.map((page, idx) =>
          page === -1 ? (
            // Render Ellipsis
            <li key={idx} className="px-2 md:px-3 py-2 bg-white border dark:bg-boxdark border-blueeazy text-blueeazy">
              ...
            </li>
          ) : (
            // Render Page Number
            <li key={idx}>
              <button
                onClick={() => onPageSelect(page)}
                className={`px-2 md:px-3 py-2 border border-blueeazy ${
                  currentPage === page
                    ? "bg-blueeazy dark:bg-boxdark text-white"
                    : "bg-white dark:bg-boxdark text-blueeazy hover:bg-blueeazy hover:text-white"
                }`}
              >
                {page}
              </button>
            </li>
          )
        )}

        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageSelect(Math.min(currentPage + 1, totalPages))}
            className="px-2 md:px-3 py-2 bg-white border dark:bg-boxdark border-blueeazy rounded-r-md text-blueeazy hover:bg-blueeazy hover:text-white disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
