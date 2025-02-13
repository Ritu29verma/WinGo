import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const getPageNumbers = () => {
    let pages = [];
    
    if (totalPages <= 6) {
      // Show all numbers if total pages are 6 or less
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Show first 2, last 2, and current range
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages - 1, totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, 2, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, 2, "...", currentPage, currentPage + 1, "...", totalPages - 1, totalPages];
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 text-white">
      {/* Previous Button */}
      <button
        className={`px-3 py-2 rounded-md ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`px-3 py-2 rounded-md ${
            page === "..."
              ? "cursor-default"
              : page === currentPage
              ? "bg-blue-600 text-white font-bold shadow-lg "
              : "hover:bg-gray-200 hover:text-black font-bold"
          }`}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className={`px-3 py-2 rounded-md ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ▶
      </button>
    </div>
  );
};

export default Pagination;
