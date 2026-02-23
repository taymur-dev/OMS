import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { AddConfigEmpSalary } from "../../Components/ConfigEmpSalaryModal/AddConfigEmpSalary";
import { EditConfigEmpSalary } from "../../Components/ConfigEmpSalaryModal/EditConfigEmpSalary";
import { ViewConfigEmpSalary } from "../../Components/ConfigEmpSalaryModal/ViewConfigEmpSalary";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { BASE_URL } from "../../Content/URL";

type CONFIGT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

interface Salary {
  id: number;
  employee_id: number;
  employee_name: string;
  salary_amount: number;
  emp_of_mon_allowance: number;
  transport_allowance: number;
  medical_allowance: number;
  total_salary: number;
  total_loan_deduction: number;
  net_salary: number;
  config_date: string;
}

const numbers = [10, 25, 50, 100];

export const ConfigEmpSalary = ({ triggerModal }: { triggerModal: number }) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<CONFIGT>("");
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null);

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleToggleViewModal = (active: CONFIGT) =>
    setIsOpenModal((prev) => (prev === active ? "" : active));

  const fetchSalaries = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getsalaries`);
      setSalaries(res.data.salaries);
      setTotalRecords(res.data.total);
      console.log("API salaries:", res.data.salaries);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  }, []);

  useEffect(() => {
    setPageNo(1);
  }, [setPageNo]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  useEffect(() => {
    document.title = "(OMS) CONFIG SALARY";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("CONFIG SALARY"));
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    fetchSalaries();
  }, [fetchSalaries]);

  const handleDeleteSalary = async () => {
    if (!selectedSalary) return;

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deletesalaries/${selectedSalary.id}`,
      );
      setSalaries((prev) => prev.filter((s) => s.id !== selectedSalary.id));
      setTotalRecords((prev) => prev - 1);
      handleToggleViewModal("");
    } catch (error) {
      console.error("Error deleting salary:", error);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow  bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col  bg-white">
        {/* Top Bar / Filter Row */}
        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num, idx) => (
                    <option key={idx} value={num}>
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
        <div className="overflow-auto">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr] 
            bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Employee Name</span>
              <span>Monthly Pay</span>
              <span>House Rent</span>
              <span>Transport</span>
              <span>Medical</span>
              <span>Total Salary</span>
              <span>Loan Deduction</span>
              <span>Net Salary</span>
              <span>Date</span>
              <span className="text-center">Action</span>
            </div>

            {/* Table Body */}
            {salaries.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              salaries.map((salary, idx) => (
                <div
                  key={salary.id}
                  className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr] 
                border-b border-x border-gray-200 text-gray-800 items-center text-sm p-2 
                hover:bg-gray-50 transition"
                >
                  <span>{(pageNo - 1) * limit + idx + 1}</span>
                  <span className="truncate">{salary.employee_name}</span>
                  <span className="truncate">{salary.salary_amount}</span>
                  <span className="truncate">
                    {Number(salary.emp_of_mon_allowance) || 0}
                  </span>
                  <span className="truncate">
                    {Number(salary.transport_allowance) || 0}
                  </span>
                  <span className="truncate">
                    {Number(salary.medical_allowance) || 0}
                  </span>
                  <span className="truncate">
                    {Number(salary.total_salary) || 0}
                  </span>
                  <span className="truncate">
                    {salary.total_loan_deduction || 0}
                  </span>
                  <span className="truncate font-semibold text-green-600">
                    {salary.net_salary || 0}
                  </span>
                  <span className="truncate">
                    {new Date(salary.config_date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>

                  {/* Actions */}
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => {
                        setSelectedSalary(salary);
                        handleToggleViewModal("EDIT");
                      }}
                    />
                    <ViewButton
                      handleView={() => {
                        setSelectedSalary(salary);
                        handleToggleViewModal("VIEW");
                      }}
                    />
                    <DeleteButton
                      handleDelete={() => {
                        setSelectedSalary(salary);
                        handleToggleViewModal("DELETE");
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
            start={salaries.length === 0 ? 0 : (pageNo - 1) * limit + 1}
            end={Math.min(pageNo * limit, totalRecords)}
            total={totalRecords}
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
        <AddConfigEmpSalary
          setModal={() => handleToggleViewModal("")}
          refreshSalaries={fetchSalaries}
        />
      )}
      {isOpenModal === "EDIT" && selectedSalary && (
        <EditConfigEmpSalary
          setModal={() => handleToggleViewModal("")}
          refreshSalaries={fetchSalaries}
          editData={selectedSalary}
        />
      )}
      {isOpenModal === "VIEW" && selectedSalary && (
        <ViewConfigEmpSalary
          setModal={() => handleToggleViewModal("")}
          viewSalary={{
            employeeName: selectedSalary.employee_name,
            employeeSalary: selectedSalary.salary_amount.toString(),
            empMonthAllowance: selectedSalary.emp_of_mon_allowance?.toString(),
            transportAllowance: selectedSalary.transport_allowance?.toString(),
            medicalAllowance: selectedSalary.medical_allowance?.toString(),
            totalSalary: selectedSalary.total_salary?.toString(),
            date: selectedSalary.config_date,
          }}
        />
      )}
      {isOpenModal === "DELETE" && selectedSalary && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETE")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteSalary}
        />
      )}
    </div>
  );
};
