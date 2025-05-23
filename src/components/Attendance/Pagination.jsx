import React from 'react';

const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className="flex justify-center mt-12 mb-6">
      <nav className="relative flex items-center bg-black/50 backdrop-blur-sm rounded-full px-2 py-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-500/30">
        {/* Previous Button */}
        <button
          onClick={() => paginate(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`relative flex items-center justify-center mr-1 h-9 w-9 sm:w-auto sm:px-4 rounded-full transition-all duration-300 ${currentPage === 1
            ? 'bg-black/60 text-gray-500 cursor-not-allowed opacity-50'
            : 'bg-black hover:bg-cyan-950 text-cyan-400 hover:text-white hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]'
            }`}
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page Numbers - Dynamic Display */}
        <div className="flex items-center">
          {totalPages <= 7 ? (
            // Show all pages if 7 or fewer
            Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`relative flex items-center justify-center mx-0.5 h-9 w-9 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === i + 1
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.7)]'
                  : 'bg-black hover:bg-cyan-950 text-white hover:text-cyan-300'
                  }`}
                aria-label={`Page ${i + 1}`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))
          ) : (
            // Show limited pages with ellipsis for larger page counts
            <>
              {/* First page */}
              <button
                onClick={() => paginate(1)}
                className={`relative flex items-center justify-center mx-0.5 h-9 w-9 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === 1
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.7)]'
                  : 'bg-black hover:bg-cyan-950 text-white hover:text-cyan-300'
                  }`}
              >
                1
              </button>

              {/* Show ellipsis or page 2 */}
              {currentPage > 3 && (
                <span className="mx-0.5 h-9 w-9 flex items-center justify-center text-cyan-500">
                  ...
                </span>
              )}

              {/* Pages around current page */}
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                return (pageNum !== 1 &&
                  pageNum !== totalPages &&
                  pageNum >= currentPage - 1 &&
                  pageNum <= currentPage + 1) ? (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`relative flex items-center justify-center mx-0.5 h-9 w-9 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === pageNum
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.7)]'
                      : 'bg-black hover:bg-cyan-950 text-white hover:text-cyan-300'
                      }`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                ) : null;
              })}

              {/* Show ellipsis or second last page */}
              {currentPage < totalPages - 2 && (
                <span className="mx-0.5 h-9 w-9 flex items-center justify-center text-cyan-500">
                  ...
                </span>
              )}

              {/* Last page */}
              <button
                onClick={() => paginate(totalPages)}
                className={`relative flex items-center justify-center mx-0.5 h-9 w-9 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === totalPages
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.7)]'
                  : 'bg-black hover:bg-cyan-950 text-white hover:text-cyan-300'
                  }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`relative flex items-center justify-center ml-1 h-9 w-9 sm:w-auto sm:px-4 rounded-full transition-all duration-300 ${currentPage === totalPages
            ? 'bg-black/60 text-gray-500 cursor-not-allowed opacity-50'
            : 'bg-black hover:bg-cyan-950 text-cyan-400 hover:text-white hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]'
            }`}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
