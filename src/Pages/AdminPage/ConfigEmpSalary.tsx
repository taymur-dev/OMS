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
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { BASE_URL } from "../../Content/URL";

type CONFIGT = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

interface Salary {
  id: number;
  employee_name: string;
  salary_amount: number;
  total_salary: number;
  config_date: string;
}

const numbers = [10, 25, 50, 100];

export const ConfigEmpSalary = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<CONFIGT>("");
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSalaryId, setSelectedSalaryId] = useState<number | null>(null);

  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  const handleToggleViewModal = (active: CONFIGT) =>
    setIsOpenModal((prev) => (prev === active ? "" : active));

  const fetchSalaries = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getsalaries`, {
        params: { page: pageNo, search: searchTerm },
      });
      setSalaries(res.data.salaries);
      setTotalRecords(res.data.total);
      console.log("API salaries:", res.data.salaries);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  }, [pageNo, searchTerm]);

  const handleDeleteSalary = async () => {
    if (!selectedSalaryId) return;

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deletesalaries/${selectedSalaryId}`
      );
      setSalaries((prev) => prev.filter((s) => s.id !== selectedSalaryId));
      setTotalRecords((prev) => prev - 1);
      handleToggleViewModal("");
    } catch (error) {
      console.error("Error deleting salary:", error);
    }
  };

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

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Salaries" activeFile="Salaries list" />
      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white
       overflow-hidden flex flex-col"
      >
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
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select>
                {numbers.map((num) => (
                  <option key={num}>{num}</option>
                ))}
              </select>
            </span>
            <span>entries</span>
          </div>
          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-6 bg-gray-200 text-gray-900 font-semibold border border-gray-600
           text-sm sticky top-0 z-10 p-[10px]"
          >
            <span className="px-2 ">Sr#</span>
            <span>Employee Name</span>
            <span>Salary of Month</span>
            <span>Total Salary</span>
            <span>Date</span>
            <span>Action</span>
          </div>
          {salaries.map((salary, idx) => (
            <div
              key={salary.id}
              className="grid grid-cols-6 border border-gray-600 text-gray-800 hover:bg-gray-100 transition
               duration-200 text-sm items-center justify-center p-[7px]"
            >
              <span>{idx + 1}</span>
              <span>{salary.employee_name}</span>
              <span>{salary.salary_amount}</span>
              <span>{salary.total_salary}</span>
              <span>{salary.config_date}</span>
              <span className="flex items-center gap-1">
                <EditButton
                  handleUpdate={() => handleToggleViewModal("EDIT")}
                />
                <ViewButton
                  handleView={() => {
                    setSelectedSalaryId(salary.id);
                    handleToggleViewModal("VIEW");
                  }}
                />
                <DeleteButton
                  handleDelete={() => {
                    setSelectedSalaryId(salary.id);
                    handleToggleViewModal("DELETE");
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={(pageNo - 1) * 10 + 1}
          total={totalRecords}
          end={pageNo * 10}
        />
        <Pagination
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddConfigEmpSalary
          setModal={() => handleToggleViewModal("")}
          onSuccess={fetchSalaries}
        />
      )}
      {isOpenModal === "EDIT" && (
        <EditConfigEmpSalary setModal={() => handleToggleViewModal("")} />
      )}
      {isOpenModal === "VIEW" && selectedSalaryId && (
        <ViewConfigEmpSalary
          setModal={() => handleToggleViewModal("")}
          salaryId={selectedSalaryId}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETE")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteSalary}
        />
      )}
    </div>
  );
};
