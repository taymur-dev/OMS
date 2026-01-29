import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddAdvanceSalary } from "../../Components/AdvanceSalaryModal/AddAdvanceSalary";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { EditAdvanceSalary } from "../../Components/AdvanceSalaryModal/EditAdvanceSalary";
import { ViewAdvanceSalary } from "../../Components/AdvanceSalaryModal/ViewAdvanceSalary";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Footer } from "../../Components/Footer";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type AdvanceSalaryT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export type AdvanceSalaryType = {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  amount: number;
  approvalStatus: string;
  description: string;
};

export const AdvanceSalary = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [allAdvance, setAllAdvance] = useState<AdvanceSalaryType[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<AdvanceSalaryT>("");
  const [selectedAdvance, setSelectedAdvance] =
    useState<AdvanceSalaryType | null>(null);

  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleViewModal = (
    active: AdvanceSalaryT,
    advance?: AdvanceSalaryType,
  ) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));

    if (active === "EDIT" || active === "VIEW" || active === "DELETE") {
      setSelectedAdvance(advance ?? null);
    } else {
      setSelectedAdvance(null);
    }
  };

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleGetAllAdvance = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getAdvanceSalary`
          : `${BASE_URL}/api/user/getMyAdvanceSalary`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllAdvance(
        Array.isArray(res.data) ? res.data.sort((a, b) => b.id - a.id) : [],
      );
    } catch (error) {
      console.error("Failed to fetch advance salary:", error);
      setAllAdvance([]);
    }
  }, [token, currentUser]);

  const handleDeleteAdvance = async () => {
    if (!selectedAdvance?.id || !token) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/admin/deleteAdvanceSalary/${selectedAdvance.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      handleGetAllAdvance();
      setIsOpenModal("");
      setSelectedAdvance(null);
    } catch (error) {
      console.error("Failed to delete advance salary:", error);
    }
  };

  useEffect(() => {
    handleGetAllAdvance();
    document.title = "(OMS) ADVANCE SALARY";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("ADVANCE SALARY")), 500);
  }, [dispatch, handleGetAllAdvance]);

  if (loader) return <Loader />;

  const filteredAdvance = allAdvance.filter(
    (a) =>
      a.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredAdvance.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedAdvance = filteredAdvance.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();

    let colors = "bg-gray-100 text-gray-800"; // Default

    if (statusLower === "approved")
      colors = "bg-green-100 text-green-800 border-green-200";
    if (statusLower === "pending")
      colors = "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (statusLower === "rejected")
      colors = "bg-red-100 text-red-800 border-red-200";

    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Button */}
        <TableTitle
          tileName="Advance Salary"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleViewModal("ADD")}
              label="+ Advance Salary"
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
                  onChange={handleChangeShowData}
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
              setSearchTerm={(term) => {
                setSearchTerm(term);
                setPageNo(1);
              }}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className={`grid ${
                isAdmin ? "grid-cols-6" : "grid-cols-5"
              } bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2`}
            >
              <span>Sr#</span>
              {isAdmin && <span>Employee Name</span>}
              <span>Date</span>
              <span>Amount</span>
              <span>Approval</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedAdvance.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedAdvance.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid ${
                    isAdmin ? "grid-cols-6" : "grid-cols-5"
                  } border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{startIndex + index + 1}</span>
                  {isAdmin && (
                    <span className="truncate">{item.employee_name}</span>
                  )}
                  <span>
                    {new Date(item.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span>{item.amount}</span>
                  <span className="flex items-center">
                    {getStatusBadge(item.approvalStatus)}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleToggleViewModal("EDIT", item)}
                    />
                    <ViewButton
                      handleView={() => handleToggleViewModal("VIEW", item)}
                    />
                    {currentUser?.role === "admin" && (
                      <DeleteButton
                        handleDelete={() => {
                          setSelectedAdvance(item);
                          setIsOpenModal("DELETE");
                        }}
                      />
                    )}
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
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddAdvanceSalary
          setModal={() => handleToggleViewModal("")}
          handleRefresh={handleGetAllAdvance}
        />
      )}
      {isOpenModal === "EDIT" && selectedAdvance && (
        <EditAdvanceSalary
          setModal={() => handleToggleViewModal("")}
          handleRefresh={handleGetAllAdvance}
          advanceData={selectedAdvance}
        />
      )}
      {isOpenModal === "VIEW" && selectedAdvance && (
        <ViewAdvanceSalary
          setIsOpenModal={() => handleToggleViewModal("")}
          viewAdvance={selectedAdvance}
        />
      )}
      {isOpenModal === "DELETE" && selectedAdvance && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteAdvance}
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
