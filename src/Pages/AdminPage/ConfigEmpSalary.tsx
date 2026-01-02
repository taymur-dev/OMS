import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
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
import { navigationStart, navigationSuccess } from "../../redux/NavigationSlice";

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
  config_date: string;
}

const numbers = [10, 25, 50, 100];

export const ConfigEmpSalary = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<CONFIGT>("");
  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10); // Added limit for entries per page
  const [searchTerm, setSearchTerm] = useState("");

  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null);

  // Pagination handlers
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

  // Initial page setup
  useEffect(() => {
    document.title = "(OMS) CONFIG SALARY";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("CONFIG SALARY"));
    }, 1000);
  }, [dispatch]);

  // Fetch salaries when page, limit, or search changes
  useEffect(() => {
    fetchSalaries();
  }, [fetchSalaries]);

  // Delete salary
  const handleDeleteSalary = async () => {
    if (!selectedSalary) return;

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deletesalaries/${selectedSalary.id}`
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
    <div className="w-full mx-2">
      <TableTitle tileName="Salaries" activeFile="Salaries list" />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col">
        {/* Top controls */}
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Salaries:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{totalRecords}]
            </span>
          </span>
          <CustomButton
            label="Add Salaries"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        {/* Search & entries */}
        <div className="flex items-center justify-between text-gray-800 mx-2 my-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                {numbers.map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </span>
            <span>entries</span>
          </div>
          <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Table */}
        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          {/* Table Header */}
          <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] bg-gray-200 text-gray-900 font-semibold border border-gray-600 text-sm sticky top-0 z-10 py-2 px-1">
            <span className="px-2 ">Sr#</span>
            <span>Employee Name</span>
            <span>Monthly Pay</span>
            <span>House Rent</span>
            <span>Transport</span>
            <span>Medical</span>
            <span>Total Salary</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          {/* Table Rows */}
          {salaries.map((salary, idx) => (
            <div
              key={salary.id}
              className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1.2fr_1.2fr_1fr] border border-gray-600 text-gray-800 hover:bg-gray-100 transition duration-200 text-sm items-center py-1 px-1"
            >
              <span>{(pageNo - 1) * limit + idx + 1}</span>
              <span>{salary.employee_name}</span>
              <span>{salary.salary_amount}</span>
              <span>{Number(salary.emp_of_mon_allowance) || 0}</span>
              <span>{Number(salary.transport_allowance) || 0}</span>
              <span>{Number(salary.medical_allowance) || 0}</span>
              <span>{salary.total_salary}</span>
              <span>{new Date(salary.config_date).toLocaleDateString("en-CA")}</span>
              <span className="flex items-center justify-center gap-1">
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
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between my-2">
        <ShowDataNumber
          start={(pageNo - 1) * limit + 1}
          total={totalRecords}
          end={Math.min(pageNo * limit, totalRecords)}
        />
        <Pagination
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddConfigEmpSalary setModal={() => handleToggleViewModal("")} refreshSalaries={fetchSalaries} />
      )}
      {isOpenModal === "EDIT" && selectedSalary && (
        <EditConfigEmpSalary
          setModal={() => handleToggleViewModal("")}
          refreshSalaries={fetchSalaries}
          editData={selectedSalary}
        />
      )}
      {isOpenModal === "VIEW" && selectedSalary && (
        <ViewConfigEmpSalary setModal={() => handleToggleViewModal("")} salaryId={selectedSalary.id} />
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
