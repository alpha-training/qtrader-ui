type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
  };
  
  export default function Pagination({
    currentPage,
    totalPages,
    onPrev,
    onNext,
  }: PaginationProps) {
    return (
      <div className="flex items-center gap-3 mt-4">
        {/* Previous */}
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`px-4 py-1 rounded-md border border-gray-600 text-gray-300 
            transition ${
              currentPage === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#1b1f23]"
            }`}
        >
          Previous
        </button>
  
        {/* Next */}
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-1 rounded-md border border-gray-600 text-gray-300 
            transition ${
              currentPage === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#1b1f23]"
            }`}
        >
          Next
        </button>
      </div>
    );
  }
  