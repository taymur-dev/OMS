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
    null
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
        Array.isArray(res.data) ? res.data.sort((a, b) => b.id - a.id) : []
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
            acc[loan.employee_id].push(loan);
            return acc;
          }, {})
        ).map((loans) => {
          const firstLoan = loans[0];
          const totalLoan = loans.reduce((sum, l) => sum + l.loanAmount, 0);
          const totalDeduction = loans.reduce((sum, l) => sum + l.deduction, 0);
          const totalReturn = loans.reduce(
            (sum, l) => sum + l.return_amount,
            0
          );
          const totalRemaining = loans.reduce(
            (sum, l) => sum + l.remainingAmount,
            0
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

  const filteredLoans = displayLoans.filter((l) =>
    l.employee_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredLoans.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedLoans = filteredLoans.slice(startIndex, endIndex);

  useEffect(() => {
    handleGetAllLoans();
    document.title = "(OMS) LOAN";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("loan")), 500);
  }, [dispatch, handleGetAllLoans]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Loan" activeFile="Loan list" />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mx-2 my-2">
          <span>
            Total Loan Applications :
            <span className="text-2xl text-blue-500 font-semibold">
              [{totalItems}]
            </span>
          </span>
          <CustomButton
            label="Add Loan"
            handleToggle={() => setIsOpenModal("ADD")}
          />
        </div>

        <div className="flex justify-between mx-2 mb-2">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={selectedValue}
              onChange={(e) => {
                setSelectedValue(Number(e.target.value));
                setPageNo(1);
              }}
              className="bg-gray-200 rounded px-2 py-1"
            >
              {numbers.map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
              setSearchTerm(term);
              setPageNo(1);
            }}
          />
        </div>

        <div className="flex-1  overflow-y-auto">
          <div className="grid grid-cols-4 items-center bg-gray-200 font-semibold p-2 sticky top-0 z-10">
            <span>Sr#</span>
            {currentUser?.role === "admin" && <span>Employee</span>}
            <span>Contact</span>
            <span className="text-center">Actions</span>
          </div>

          {paginatedLoans.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-4 items-center p-2 border-b hover:bg-gray-100"
            >
              <span>{startIndex + index + 1}</span>
              {currentUser?.role === "admin" && (
                <span>{item.employee_name}</span>
              )}
              <span>{item.contact}</span>
              <span className="flex justify-center">
                <ViewButton
                  handleView={() => {
                    setSelectedLoan(item);
                    setIsOpenModal("VIEW");
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={totalItems ? startIndex + 1 : 0}
          end={endIndex}
          total={totalItems}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            pageNo * selectedValue < totalItems && setPageNo((p) => p + 1)
          }
        />
      </div>

      {isOpenModal === "VIEW" && selectedLoan && (
        <ViewLoan
          setIsOpenModal={() => setIsOpenModal("")}
          viewLoan={selectedLoan}
        />
      )}
      {isOpenModal === "ADD" && (
        <AddLoan
          setModal={() => setIsOpenModal("")}
          handleRefresh={handleGetAllLoans}
        />
      )}
    </div>
  );
};
