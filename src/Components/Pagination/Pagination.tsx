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
  const activeClass = `${baseClass} bg-blue-500 text-white border-blue-400`;
  const inactiveClass = `${baseClass} bg-white text-slate-500 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="flex items-center justify-end mt-2 gap-1 md:gap-2 mr-2">
      {/* Previous Button */}
      <button
        className={inactiveClass}
        onClick={handleDecrementPageButton}
        disabled={pageNo <= 1}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* Single Current Page Number */}
      <div className={activeClass}>
        {pageNo}
      </div>

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