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
import { Footer } from "../../Components/Footer";

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
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        <Toaster position="top-center" reverseOrder={false} />

        {/* 1 & 3) Table Title with Add Button - Aligned with UsersDetails */}
        <TableTitle
          tileName="Employee LifeLine"
          rightElement={
            <CustomButton
              label="+ Add Employee"
              handleToggle={() => handleToggleViewModal("ADD")}
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        {/* Control Bar: Show entries and Search */}
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
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-6 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Employee Name</span>
              <span>Contact</span>
              <span>Position</span>
              <span>Date</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedLifeLines.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedLifeLines.map((item: LifeLine, index: number) => (
                <div
                  key={item.id || index}
                  className="grid grid-cols-6 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{item.employeeName}</span>
                  <span>{item.contact}</span>
                  <span>{item.position}</span>
                  <span>
                    {new Date(item.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
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

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row gap-2 items-center justify-between p-2">
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
      </div>

      {/* --- MODALS SECTION --- */}
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
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
