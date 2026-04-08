import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { AddConfigEmpSalary } from "../../Components/ConfigEmpSalaryModal/AddConfigEmpSalary";
import { EditConfigEmpSalary } from "../../Components/ConfigEmpSalaryModal/EditConfigEmpSalary";
import { ViewConfigEmpSalary } from "../../Components/ConfigEmpSalaryModal/ViewConfigEmpSalary";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { RiHistoryLine } from "react-icons/ri";

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
  effective_from: string;
  attendance_base: string;
  salary_month: string;
  description: string;
}

interface ConfigEmpSalaryProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const ConfigEmpSalary = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: ConfigEmpSalaryProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<
    "ADD" | "EDIT" | "DELETE" | "VIEW" | ""
  >("");
  const [pageNo, setPageNo] = useState(1);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null);

  const fetchSalaries = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getsalaries`);
      const sortedSalaries = [...res.data.salaries].sort((a, b) => a.id - b.id);
      setSalaries(sortedSalaries);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  }, []);

  useEffect(() => {
    document.title = "(OMS) CONFIG SALARY";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("CONFIG SALARY"));
    }, 1000);
    fetchSalaries();
  }, [dispatch, fetchSalaries]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  const handleDeleteSalary = async () => {
    if (!selectedSalary) return;
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deletesalaries/${selectedSalary.id}`,
      );
      fetchSalaries();
      setIsOpenModal("");
    } catch (error) {
      console.error("Error deleting salary:", error);
    }
  };

  // Logic for filtering and pagination
  const filteredSalaries = salaries.filter((salary) =>
    salary.employee_name.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredSalaries.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedSalaries = filteredSalaries.slice(startIndex, endIndex);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        {/* Min-width adjusted to 1000px to match UsersDetails */}
        <div className="min-w-[1000px]">
          {/* Header Row */}
          <div className="px-0.5 pt-0.5">
            <div className="grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_1fr_1.2fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span className="text-left">Sr#</span>
              <span className="text-left">Employee Name</span>
              <span className="text-left">Configure Date</span>
              <span className="text-left">Basic Salary</span>
              <span className="text-left">Total Allowances</span>
              <span className="text-left">Deductions</span>
              <span className="text-left">Net Salary</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          <div className="px-0.5 sm:px-1 py-2">
            {paginatedSalaries.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiHistoryLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No configured salary found!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedSalaries.map((salary, index) => {
                  const totalAllowances =
                    (Number(salary.emp_of_mon_allowance) || 0) +
                    (Number(salary.transport_allowance) || 0) +
                    (Number(salary.medical_allowance) || 0);

                  return (
                    <div
                      key={salary.id}
                      className="grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_1fr_1.2fr_auto] items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                    >
                      <span className="text-gray-500 font-medium">
                        {startIndex + index + 1}
                      </span>

                      {/* Name Section - Icons removed */}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-gray-800 text-sm">
                          {salary.employee_name}
                        </span>
                      </div>

                      <div className="text-gray-600 truncate">
                        {new Date(salary.config_date)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </div>

                      <div className="text-gray-600 truncate">
                        {salary.salary_amount}
                      </div>

                      {/* Allowances */}
                      <div className="text-gray-600 truncate">
                        {totalAllowances}
                      </div>

                      {/* Deductions */}
                      <div className="text-gray-600 truncate">
                        {salary.total_loan_deduction || 0}
                      </div>

                      {/* Net Salary */}
                      <div className="text-gray-600 truncate">
                        {salary.net_salary}
                      </div>

                      {/* Actions - Container width matched to UsersDetails */}
                      <div className="flex items-center justify-end gap-1 w-[140px]">
                        <ViewButton
                          handleView={() => {
                            setSelectedSalary(salary);
                            setIsOpenModal("VIEW");
                          }}
                        />
                        <EditButton
                          handleUpdate={() => {
                            setSelectedSalary(salary);
                            setIsOpenModal("EDIT");
                          }}
                        />
                        <DeleteButton
                          handleDelete={() => {
                            setSelectedSalary(salary);
                            setIsOpenModal("DELETE");
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          totalNum={totalNum}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
        />
      </div>

      {/* Modals remain the same */}
      {isOpenModal === "ADD" && (
        <AddConfigEmpSalary
          setModal={() => setIsOpenModal("")}
          refreshSalaries={fetchSalaries}
        />
      )}
      {isOpenModal === "EDIT" && selectedSalary && (
        <EditConfigEmpSalary
          setModal={() => setIsOpenModal("")}
          refreshSalaries={fetchSalaries}
          editData={selectedSalary}
        />
      )}
      {isOpenModal === "VIEW" && selectedSalary && (
        <ViewConfigEmpSalary
          setModal={() => setIsOpenModal("")}
          viewSalary={{
            employeeName: selectedSalary.employee_name,
            employeeSalary: selectedSalary.salary_amount.toString(),
            empMonthAllowance: selectedSalary.emp_of_mon_allowance?.toString(),
            transportAllowance: selectedSalary.transport_allowance?.toString(),
            medicalAllowance: selectedSalary.medical_allowance?.toString(),
            totalSalary: selectedSalary.total_salary?.toString(),
            config_date: selectedSalary.config_date,
            effective_from: selectedSalary.effective_from,
          }}
        />
      )}
      {isOpenModal === "DELETE" && selectedSalary && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("DELETE")}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteSalary}
        />
      )}
    </div>
  );
};
