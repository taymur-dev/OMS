import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";

import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import toast, { Toaster } from "react-hot-toast";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { AddEmployeeLifeLine } from "../../Components/EmpLifeLine/AddEmployeeLifeLine";
import { ViewEmployeeLifeLine } from "../../Components/EmpLifeLine/ViewEmployeeLifeLine";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { Loader } from "../../Components/LoaderComponent/Loader";

const numbers = [10, 25, 50, 100];

type LoanT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

type LifeLine = {
  id: number;
  employeeName: string;
  email: string;
  contact: string;
  position: string;
  date: string;
};

export const EmployeeLifeline = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<LoanT>("");
  const [selectedEmployee, setSelectedEmployee] = useState<LifeLine | null>(
    null,
  );

  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [lifeLines, setLifeLines] = useState<LifeLine[]>([]);

  const [selectedValue, setSelectedValue] = useState(10);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = (totalPages: number) => {
    setPageNo((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => Math.max(prev - 1, 1));
  };

  const handleToggleViewModal = (active: LoanT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleAddLifeLine = (newLifeLine: LifeLine) => {
    setLifeLines((prev) => [...prev, newLifeLine]);
    toast.success("Employee added successfully!");
  };

  useEffect(() => {
    document.title = "(OMS)LifeLine";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Employee lifeline"));
    }, 1000);
  }, [dispatch]);

  const token = useAppSelector((state) => state.officeState.currentUser?.token);

  const fetchLifelines = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getEmpll`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.data.sort(
        (a: LifeLine, b: LifeLine) => a.id - b.id,
      );

      setLifeLines(sorted);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchLifelines();
  }, [fetchLifelines]);

  const filteredLifeLines = lifeLines.filter((item) => {
    const name = item.employeeName?.toLowerCase() || "";
    const contact = item.contact?.toLowerCase() || "";
    const position = item.position?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) ||
      contact.includes(search) ||
      position.includes(search)
    );
  });

  const totalPages = Math.ceil(filteredLifeLines.length / selectedValue);
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;
  const paginatedLifeLines = filteredLifeLines.slice(startIndex, endIndex);

  if (loader) return <Loader />;

  return (
    <div className="w-full px-2 sm:px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <TableTitle
        tileName="Employee LifeLine"
        activeFile="Employee LifeLine list"
      />

      <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
          <span className="text-sm sm:text-base">
            Total number of Employee LifeLine:
            <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
              [{lifeLines.length}]
            </span>
          </span>

          <CustomButton
            label="Add Employee"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
          <div className="text-sm">
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={selectedValue}
                onChange={handleChangeShowData}
                className="bg-transparent outline-none"
              >
                {numbers.map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
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

        {/* Table Wrapper */}
        <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
          <div className="min-w-[700px]">
            {/* Table Header */}
            <div className="grid grid-cols-6 items-center bg-indigo-900 text-white font-semibold text-sm sticky top-0 z-10 p-2">
              <span>Sr#</span>
              <span className="text-left">Employee Name</span>
              <span className="text-left">Contact</span>
              <span className="text-left">Position</span>
              <span className="text-left">Date</span>
              <span className="text-left">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedLifeLines.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-4">
                No records found
              </div>
            ) : (
              paginatedLifeLines.map((item: LifeLine, index: number) => (
                <div
                  key={item.id || index}
                  className="grid grid-cols-6 items-center border border-gray-300 text-gray-800 text-sm p-2 hover:bg-gray-100 transition items-center"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{item.employeeName}</span>
                  <span>{item.contact}</span>
                  <span>{item.position}</span>
                  <span>{new Date(item.date).toLocaleDateString("sv-SE")}</span>

                  {/* Action column */}
                  <span className="flex flex-col items-start gap-1">
                    <ViewButton
                      handleView={() => {
                        setSelectedEmployee(item);
                        handleToggleViewModal("VIEW");
                      }}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
        <ShowDataNumber
          start={paginatedLifeLines.length ? startIndex + 1 : 0}
          end={Math.min(endIndex, filteredLifeLines.length)}
          total={filteredLifeLines.length}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={() =>
            handleIncrementPageButton(totalPages)
          }
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddEmployeeLifeLine
          setModal={() => handleToggleViewModal("")}
          onAdd={handleAddLifeLine}
        />
      )}

      {isOpenModal === "VIEW" && selectedEmployee && (
        <ViewEmployeeLifeLine
          setIsOpenModal={() => handleToggleViewModal("")}
          employeeData={selectedEmployee}
          handleEdit={(updatedEmployee: LifeLine) => {
            setLifeLines((prev) =>
              prev.map((item) =>
                item.id === updatedEmployee.id ? updatedEmployee : item,
              ),
            );
            handleToggleViewModal("");
          }}
          handleDelete={(id: number) => {
            setLifeLines((prev) => prev.filter((item) => item.id !== id));
            handleToggleViewModal("");
          }}
        />
      )}
    </div>
  );
};
