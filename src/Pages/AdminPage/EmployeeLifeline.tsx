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

type LoanT = "ADD" | "VIEW" | "EDIT" | "";

type LifeLine = {
  id: number;
  employeeName: string;
  email: string;
  contact: string;
  position: string;
  date: string;
};

export const EmployeeLifeline = () => {
  const { loader } = useAppSelector((state) => state.NavigateSate);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<LoanT>("");
  const [selectedEmployee, setSelectedEmployee] = useState<LifeLine | null>(
    null
  );

  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [lifeLines, setLifeLines] = useState<LifeLine[]>([]);

  const [selectedValue, setSelectedValue] = useState(10);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
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
        (a: LifeLine, b: LifeLine) => a.id - b.id
      );

      setLifeLines(sorted);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    fetchLifelines();
  }, [fetchLifelines]);

  // 🔍 FILTERED LIST FOR SEARCH
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

  // 🔹 Pagination calculation
  const totalPages = Math.ceil(filteredLifeLines.length / selectedValue);
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;
  const paginatedLifeLines = filteredLifeLines.slice(startIndex, endIndex);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <Toaster position="top-center" reverseOrder={false} />

      <TableTitle
        tileName="Employee LifeLine"
        activeFile=" Employee LifeLine list"
      />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 
      bg-white overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Employee LifeLine:{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{lifeLines.length}]
            </span>
          </span>

          <CustomButton
            label="Add Employee"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={selectedValue} onChange={handleChangeShowData}>
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

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr] bg-gray-200 text-gray-900 
          font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span className="text-left">Employee Name</span>
            <span className="text-left">Contact</span>
            <span className="text-left">Position</span>
            <span className="text-left">Actions</span>
          </div>

          {paginatedLifeLines.length > 0 ? (
            paginatedLifeLines.map((item: LifeLine, index: number) => (
              <div
                key={item.id || index}
                className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr] border border-gray-600 
                text-gray-800 hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
              >
                <span>{startIndex + index + 1}</span>
                <span>{item.employeeName}</span>
                <span>{item.contact}</span>
                <span>{item.position}</span>

                <span className="flex items-center gap-1">
                  <ViewButton
                    handleView={() => {
                      setSelectedEmployee(item);
                      handleToggleViewModal("VIEW");
                    }}
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No records found
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={paginatedLifeLines.length ? startIndex + 1 : 0}
          end={Math.min(endIndex, filteredLifeLines.length)}
          total={filteredLifeLines.length}
        />

        <Pagination
          handleIncrementPageButton={() =>
            handleIncrementPageButton(totalPages)
          }
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

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
                item.id === updatedEmployee.id ? updatedEmployee : item
              )
            );
            handleToggleViewModal(""); // close modal after edit if needed
          }}
          handleDelete={(id: number) => {
            setLifeLines((prev) => prev.filter((item) => item.id !== id));
            handleToggleViewModal(""); // close modal after delete
          }}
        />
      )}
    </div>
  );
};
