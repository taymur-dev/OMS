import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";

type PaginationT = {
  handleIncrementPageButton?: () => void;
  handleDecrementPageButton?: () => void;
  pageNo?: number;
};

export const Pagination = ({
  handleIncrementPageButton,
  handleDecrementPageButton,
  pageNo,
}: PaginationT) => {
  const slimBtnClass = "join-item btn bg-white rounded-xl text-indigo-900 border-indigo-900 hover:bg-indigo-50 min-h-0 h-7 md:h-9 px-2 py-0";
  const activeBtnClass = "join-item btn bg-indigo-900 rounded-xl text-white border-white whitespace-nowrap cursor-default min-h-0 h-7 md:h-9 px-2 py-0";

  return (
    <div>
      <div className="join flex items-center justify-end mt-2 gap-1 sm:gap-2 mr-2">
        <button
          className={slimBtnClass}
          onClick={handleDecrementPageButton}
          aria-label="Previous Page"
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} className="text-xs md:text-sm" />
        </button>

        <button className={activeBtnClass}>
          <span className="text-xs md:text-sm">Page {pageNo}</span>
        </button>

        <button
          className={slimBtnClass}
          onClick={handleIncrementPageButton}
          aria-label="Next Page"
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} className="text-xs md:text-sm" />
        </button>
      </div>
    </div>
  );
};