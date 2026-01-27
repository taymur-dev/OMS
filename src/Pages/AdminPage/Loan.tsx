import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

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

export const Loan = () => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(10);

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

  // Combine loans for admin or keep individual loans for user
  const displayLoans: UserLoanSummary[] =
    currentUser?.role === "admin"
      ? Object.values(
          allLoans.reduce((acc: Record<string, ALLLOANT[]>, loan) => {
            if (!acc[loan.employee_id]) acc[loan.employee_id] = [];
            acc[loan.employee_id].push(loan);
            return acc;
          }, {}),
        ).map((loans) => {
          const firstLoan = loans[0];
          const totalLoan = loans.reduce((sum, l) => sum + l.loanAmount, 0);
          const totalDeduction = loans.reduce((sum, l) => sum + l.deduction, 0);
          const totalReturn = loans.reduce(
            (sum, l) => sum + l.return_amount,
            0,
          );
          const totalRemaining = loans.reduce(
            (sum, l) => sum + l.remainingAmount,
            0,
          );

          return {
            ...firstLoan,
            loanAmount: totalLoan,
            deduction: totalDeduction,
            return_amount: totalReturn,
            remainingAmount: totalRemaining,
            allLoans: loans,
          };
        })
      : allLoans.map((loan) => ({ ...loan, allLoans: [loan] }));

  // Filter loans by search term
  const filteredLoans = displayLoans.filter((l) =>
    l.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const totalItems = filteredLoans.length;
  const totalPages = Math.ceil(totalItems / selectedValue);
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedLoans = filteredLoans.slice(startIndex, endIndex);

  // Reset pageNo if searchTerm or selectedValue changes
  useEffect(() => setPageNo(1), [searchTerm, selectedValue]);

  useEffect(() => {
    handleGetAllLoans();
    document.title = "(OMS) LOAN";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("loan")), 500);
  }, [dispatch, handleGetAllLoans]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Loan button */}
        <TableTitle
          tileName="Loan"
          rightElement={
            <CustomButton
              handleToggle={() => setIsOpenModal("ADD")}
              label="+ Add Loan"
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={selectedValue}
                  onChange={(e) => {
                    setSelectedValue(Number(e.target.value));
                    setPageNo(1);
                  }}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num, index) => (
                    <option key={index} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </span>
              <span className="hidden xs:inline">entries</span>
            </div>

            {/* Right Side: Search Input */}
            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header - Adjusted to 7 columns to match UserDetails dimensions */}
            <div
              className="grid grid-cols-4 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Employee</span>
              <span>Contact</span>
           
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedLoans.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedLoans.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-4 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className=" truncate">
                    {item.employee_name}
                  </span>
                  <span>{item.contact}</span>

                  <span className="flex flex-nowrap justify-center gap-1">
                    <ViewButton
                      handleView={() => {
                        setSelectedLoan(item);
                        setIsOpenModal("VIEW");
                      }}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={totalItems === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, totalItems)}
            total={totalItems}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
            handleIncrementPageButton={() =>
              pageNo < totalPages && setPageNo((p) => p + 1)
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
