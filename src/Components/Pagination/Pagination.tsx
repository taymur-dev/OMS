import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

type PaginationT = {
  handleIncrementPageButton: () => void;
  handleDecrementPageButton: () => void;
  pageNo: number;
};

export const Pagination = ({
  handleIncrementPageButton,
  handleDecrementPageButton,
  pageNo = 1,
}: PaginationT) => {
  const baseClass = "flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg border text-xs md:text-sm transition-all";
  const activeClass = `${baseClass} bg-slate-800 text-white border-slate-800`;
  const inactiveClass = `${baseClass} bg-white text-slate-500 border-gray-200 hover:bg-gray-50`;

  // Without totalPages, we show the current page and the next two options
  const pageButtons = [pageNo, pageNo + 1, pageNo + 2];

  return (
    <div className="flex items-center justify-end mt-2 gap-1 md:gap-2 mr-2">
      {/* Previous Button */}
      <button
        className={inactiveClass}
        onClick={handleDecrementPageButton}
        disabled={pageNo === 1}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* Numbered Buttons */}
      {pageButtons.map((num) => (
        <button
          key={num}
          className={num === pageNo ? activeClass : inactiveClass}
          // Note: Since we don't have a direct "jump to" function passed, 
          // these buttons only visually represent the sequence.
        >
          {num}
        </button>
      ))}

      {/* Ellipsis to show more exist */}
      <span className="text-slate-400 px-1">...</span>

      {/* Next Button */}
      <button
        className={inactiveClass}
        onClick={handleIncrementPageButton}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};