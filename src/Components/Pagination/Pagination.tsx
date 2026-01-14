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
  return (
    <div>
      <div className="join flex items-center justify-end my-2 gap-2 ">
        <button
          className="join-item btn bg-indigo-900 text-white border-indigo-600"
          onClick={handleDecrementPageButton}
        >
          «
        </button>
        <button className="join-item btn bg-white text-gray-800 border-indigo-600">
          Page {pageNo}
        </button>
        <button
          className="join-item btn bg-indigo-900 text-white border-indigo-600"
          onClick={handleIncrementPageButton}
        >
          »
        </button>
      </div>
    </div>
  );
};
