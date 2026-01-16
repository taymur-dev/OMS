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
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    (pageNo - 1) * limit,
    pageNo * limit
  );

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle
        tileName="Employee Accounts List"
        activeFile="Employee Accounts List"
      />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white 
      overflow-hidden flex flex-col">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total Employees :{" "}
            <span className="text-2xl text-indigo-900 font-semibold">
              [{filteredEmployees.length}]
            </span>
          </span>

          {currentUser?.role === "admin" && (
            <CustomButton
              label="Add Employee Account"
              handleToggle={() => handleToggleModal("ADDACCOUNT")}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2 my-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPageNo(1);
                }}
              >
                {numbers.map((num) => (
                  <option key={num} value={num}>
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

        <div className=" max-h-[28.4rem] overflow-y-auto mx-2">
          <div className="grid grid-cols-5 bg-indigo-900 text-white font-semibold border border-gray-600
           text-sm sticky top-0 z-10 p-[10px]">
            <span>Sr#</span>
            <span>Name</span>
            <span>Email</span>
            <span>Contact</span>
            <span className="text-center">Actions</span>
          </div>

          {paginatedEmployees.map((emp, idx) => (
            <div
              key={emp.id}
              className="grid grid-cols-5 border border-gray-600 text-gray-800 hover:bg-gray-100 transition
               text-sm items-center p-[7px]"
            >
              <span className="px-2">
                {(pageNo - 1) * limit + idx + 1}
              </span>
              <span>{emp.name}</span>
              <span>{emp.email}</span>
              <span>{emp.contact}</span>
              <span className="flex justify-center">
                <ViewButton
                  handleView={() => {
                    setSelectedEmployee(emp);
                    handleToggleModal("VIEW");
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between my-2">
        <ShowDataNumber
          start={(pageNo - 1) * limit + 1}
          end={Math.min(pageNo * limit, filteredEmployees.length)}
          total={filteredEmployees.length}
        />
        <Pagination
          handleIncrementPageButton={() =>
            pageNo * limit < filteredEmployees.length &&
            setPageNo((p) => p + 1)
          }
          handleDecrementPageButton={() =>
            setPageNo((p) => (p > 1 ? p - 1 : 1))
          }
          pageNo={pageNo}
        />
      </div>

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
    </div>
  );
};
