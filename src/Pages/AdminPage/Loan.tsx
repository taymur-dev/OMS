import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { AddLoan } from "../../Components/LoanModal/AddLoan";
import { ViewLoan } from "../../Components/LoanModal/ViewLoan";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { RiInboxArchiveLine } from "react-icons/ri";

type LoanT = "ADD" | "VIEW" | "";

export type ALLLOANT = {
  id: number;
  employee_id: number;
  contact: number;
  employee_name: string;
  applyDate: string;
  refNo: number;
  loanAmount: number;
  deduction: number;
  return_amount: number;
  remainingAmount: number;
};

export type UserLoanSummary = ALLLOANT & {
  allLoans: ALLLOANT[];
};

interface LoanProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Loan = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: LoanProps) => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [allLoans, setAllLoans] = useState<ALLLOANT[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<LoanT>("");
  const [selectedLoan, setSelectedLoan] = useState<UserLoanSummary | null>(
    null,
  );

  const [pageNo, setPageNo] = useState(1);

  const handleGetAllLoans = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getLoans`
          : `${BASE_URL}/api/user/getMyLoans`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllLoans(
        Array.isArray(res.data) ? res.data.sort((a, b) => b.id - a.id) : [],
      );
    } catch (error) {
      console.error("Failed to fetch loans:", error);
      setAllLoans([]);
    }
  }, [token, currentUser]);

  const displayLoans: UserLoanSummary[] =
    currentUser?.role === "admin"
      ? Object.values(
          allLoans.reduce((acc: Record<string, ALLLOANT[]>, loan) => {
            if (!acc[loan.employee_id]) acc[loan.employee_id] = [];

            const isDuplicate = acc[loan.employee_id].some(
              (l) => l.id === loan.id,
            );
            if (!isDuplicate) {
              acc[loan.employee_id].push(loan);
            }
            return acc;
          }, {}),
        ).map((loans) => {
          const firstLoan = loans[0];
          return {
            ...firstLoan,
            loanAmount: loans.reduce(
              (sum, l) => sum + Number(l.loanAmount || 0),
              0,
            ),
            deduction: loans.reduce(
              (sum, l) => sum + Number(l.deduction || 0),
              0,
            ),
            return_amount: loans.reduce(
              (sum, l) => sum + Number(l.return_amount || 0),
              0,
            ),
            remainingAmount: loans.reduce(
              (sum, l) => sum + Number(l.remainingAmount || 0),
              0,
            ),
            allLoans: loans,
          };
        })
      : allLoans.map((loan) => ({ ...loan, allLoans: [loan] }));

  const filteredLoans = displayLoans.filter((l) =>
    l.employee_name?.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalItems = filteredLoans.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedLoans = filteredLoans.slice(startIndex, endIndex);

  useEffect(() => setPageNo(1), [externalSearch, externalPageSize]);

  useEffect(() => {
    handleGetAllLoans();
    document.title = "(OMS) LOAN";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("loan")), 500);
  }, [dispatch, handleGetAllLoans]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {/* Header Section */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs
             tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Employee Name</span>
              <span className="text-left">Contact</span>
              <span className="text-left">Total Loan</span>
              <span className="text-right w-[140px] ">Actions</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedLoans.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedLoans.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[60px_1fr_1fr_1fr_auto] items-center px-3 py-2 gap-3 text-sm bg-white
                     border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="truncate text-gray-800 text-sm">
                        {item.employee_name}
                      </span>
                    </div>

                    {/* Icons removed from following sections */}
                    <div className="text-gray-600 truncate">{item.contact}</div>

                    <div className="text-gray-800 font-medium truncate">
                      {item.loanAmount.toLocaleString()}
                    </div>

                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setSelectedLoan(item);
                          setIsOpenModal("VIEW");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-row items-center justify-between p-1 mt-auto">
        <ShowDataNumber
          start={totalItems === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalItems)}
          total={totalItems}
        />
        <Pagination
          pageNo={pageNo}
          totalNum={filteredLoans.length}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddLoan
          setModal={() => setIsOpenModal("")}
          handleRefresh={handleGetAllLoans}
        />
      )}

      {isOpenModal === "VIEW" && selectedLoan && (
        <ViewLoan
          setIsOpenModal={() => setIsOpenModal("")}
          viewLoan={selectedLoan}
        />
      )}
    </div>
  );
};
