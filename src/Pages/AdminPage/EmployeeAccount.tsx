import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { AddEmployeeAccount } from "../../Components/EmployeeAccountModal/AddEmployeeAccount";
import { ViewEmployeeAccount } from "../../Components/EmployeeAccountModal/ViewEmployeeAccount";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { BASE_URL } from "../../Content/URL";
import { Footer } from "../../Components/Footer";


const numbers = [10, 25, 50, 100];

type EMPLOYEEACCOUNTT = "ADDACCOUNT" | "VIEW" | "";

type ApiUser = {
  id: number;
  name: string;
  email: string;
  contact: string;
  loginStatus: "Y" | "N";
  role: "user" | "admin";
};

type EmployeeAccountRow = {
  id: number;
  name: string;
  email: string;
  contact: string;
};

export const EmployeeAccount = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<EMPLOYEEACCOUNTT>("");
  const [employees, setEmployees] = useState<EmployeeAccountRow[]>([]);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeAccountRow | null>(null);

  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleModal = (active: EMPLOYEEACCOUNTT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const fetchEmployees = useCallback(async () => {
    if (!currentUser) return;

    try {
      setEmployees([]);

      if (currentUser.role === "admin") {
        const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const mapped: EmployeeAccountRow[] = (res.data.users as ApiUser[])
          .filter((u) => u.loginStatus === "Y" && u.role === "user")
          .map((u) => ({
            id: Number(u.id),
            name: u.name,
            email: u.email,
            contact: u.contact,
          }));

        setEmployees(mapped);
      } else {
        setEmployees([
          {
            id: Number(currentUser.id ?? 0),
            name: currentUser.name ?? "",
            email: currentUser.email ?? "",
            contact: currentUser.contact ?? "",
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  }, [token, currentUser]);

  useEffect(() => {
    document.title = "(OMS) EMPLOYEE ACCOUNT";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("EMPLOYEE ACCOUNT"));
    }, 500);
  }, [dispatch]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedEmployees = filteredEmployees.slice(
    (pageNo - 1) * limit,
    pageNo * limit,
  );

  if (loader) return <Loader />;

  
 return (
  <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
    <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
      {/* 1 & 3) Table Title with Add Button as rightElement */}
      <TableTitle
        tileName="Employee Accounts List"
        rightElement={
          currentUser?.role === "admin" && (
            <CustomButton
              label="+ Add Employee Account"
              handleToggle={() => handleToggleModal("ADDACCOUNT")}
            />
          )
        }
      />

      <hr className="border border-b border-gray-200" />

      {/* Top Stats Bar & Filter Row aligned to UsersDetails style */}
      <div className="p-2">
        <div className="flex flex-col gap-2">
          {/* Total Count Display */}
          <div className="text-gray-800 text-sm">
            Total Employees :{" "}
            <span className="ml-1 text-xl text-indigo-900 font-semibold">
              [{filteredEmployees.length}]
            </span>
          </div>

          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPageNo(1);
                  }}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num) => (
                    <option key={num} value={num}>
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
      </div>

      {/* --- MIDDLE SECTION (Scrollable Table) --- */}
      <div className="overflow-auto px-2">
        <div className="min-w-[700px]">
          {/* Sticky Table Header */}
          <div
            className="grid grid-cols-5 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Name</span>
            <span>Email</span>
            <span>Contact</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedEmployees.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-10">
              No records available at the moment!
            </div>
          ) : (
            paginatedEmployees.map((emp, idx) => (
              <div
                key={emp.id}
                className="grid grid-cols-5 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
              >
                <span>{(pageNo - 1) * limit + idx + 1}</span>
                <span className="truncate">{emp.name}</span>
                <span className="truncate">{emp.email}</span>
                <span>{emp.contact}</span>
                <span className="flex flex-nowrap justify-center gap-1">
                  <ViewButton
                    handleView={() => {
                      setSelectedEmployee(emp);
                      handleToggleModal("VIEW");
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
          start={paginatedEmployees.length === 0 ? 0 : (pageNo - 1) * limit + 1}
          end={Math.min(pageNo * limit, filteredEmployees.length)}
          total={filteredEmployees.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() =>
            setPageNo((p) => (p > 1 ? p - 1 : 1))
          }
          handleIncrementPageButton={() =>
            pageNo * limit < filteredEmployees.length && setPageNo((p) => p + 1)
          }
        />
      </div>
    </div>

    {/* --- MODALS SECTION --- */}
    {isOpenModal === "ADDACCOUNT" && (
      <AddEmployeeAccount
        setModal={() => handleToggleModal("")}
        refreshData={fetchEmployees}
      />
    )}

    {isOpenModal === "VIEW" && selectedEmployee && (
      <ViewEmployeeAccount
        setModal={() => handleToggleModal("")}
        employee={selectedEmployee}
      />
    )}

    {/* --- FOOTER SECTION --- */}
    <div className="border border-t-5 border-gray-200">
      <Footer />
    </div>
  </div>
);
};
