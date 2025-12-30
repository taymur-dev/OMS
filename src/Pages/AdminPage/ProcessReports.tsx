import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

const itemsPerPageOptions = [10, 25, 50];

export type PROCESST = {
  id: number;
  employee_id: number;
  employeeName: string;
  task: string;
  startDate: string;
  endDate: string;
  deadline: string;
};

export const ProcessReports = () => {
  const dispatch = useAppDispatch();

  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const userId = currentUser?.userId;

  const currentDate = new Date().toISOString().split("T")[0];

  const [reportData, setReportData] = useState({
    startDate: currentDate,
    endDate: currentDate,
    employeeId: "",
  });

  const [allTasks, setAllTasks] = useState<PROCESST[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const getProcessReports = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getTodos`
          : `${BASE_URL}/api/user/getTodo/${userId}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllTasks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to load process report", error);
      setAllTasks([]);
    }
  }, [token, currentUser, userId]);

  const filteredTasks = useMemo(() => {
    return allTasks.filter((item) => {
      const start = item.startDate.slice(0, 10);

      const inDateRange =
        start >= reportData.startDate && start <= reportData.endDate;

      const matchesSearch =
        item.task?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEmployee =
        !reportData.employeeId ||
        item.employee_id === Number(reportData.employeeId);

      return inDateRange && matchesSearch && matchesEmployee;
    });
  }, [allTasks, reportData, searchTerm]);

  const totalItems = filteredTasks.length;
  const startIndex = (pageNo - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = filteredTasks.slice(startIndex, endIndex);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
    setPageNo(1);
  };

  const employeeOptions = useMemo(() => {
    const map = new Map<number, string>();

    allTasks.forEach((t) => {
      map.set(t.employee_id, t.employeeName);
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      label: name,
      value: id,
    }));
  }, [allTasks]);

  const printDiv = () => window.print();

  useEffect(() => {
    document.title = "(OMS) PROCESS REPORTS";
    dispatch(navigationStart());
    getProcessReports();

    setTimeout(() => {
      dispatch(navigationSuccess("PROCESS REPORTS"));
    }, 800);
  }, [dispatch, getProcessReports]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Task Report" activeFile="Process Report" />

      <div className="flex items-center justify-between text-gray-800 py-2 mx-2">
        <div>
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPageNo(1);
              }}
            >
              {itemsPerPageOptions.map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
          </span>
          <span>entries</span>
        </div>

        <TableInputField
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            setPageNo(1);
          }}
        />
      </div>

      <div className="max-h-[58vh] shadow-lg border-t-2 border-indigo-500 bg-white rounded overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mx-2">
          <div className="flex flex-1 py-1 gap-2 items-center justify-center">
            <InputField
              labelName="From"
              type="date"
              name="startDate"
              value={reportData.startDate}
              handlerChange={handleChange}
            />

            <InputField
              labelName="To"
              type="date"
              name="endDate"
              value={reportData.endDate}
              handlerChange={handleChange}
            />

            {currentUser?.role === "admin" && (
              <OptionField
                labelName="Employee"
                name="employeeId"
                value={reportData.employeeId}
                optionData={employeeOptions}
                inital="Select Employee"
                handlerChange={handleChange}
              />
            )}

            <div className="w-full flex justify-end mt-4">
              <div className="flex items-center font-semibold text-gray-800">
                <span className="mr-1">From</span>
                <span className="text-red-500 mr-1">
                  {reportData.startDate}
                </span>
                <span className="mr-1">To</span>
                <span className="text-red-500">{reportData.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div id="myDiv" className="w-full max-h-[28.4rem] overflow-y-auto">
          <div className="grid grid-cols-7 bg-gray-200 font-semibold sticky top-0 p-2">
            <span>Sr#</span>
            <span>Employee</span>
            <span>Task</span>
            <span>Start</span>
            <span>End</span>
            <span>Deadline</span>
          </div>

          {paginatedData.length === 0 ? (
            <div className="text-center py-4 text-gray-600">
              No records found
            </div>
          ) : (
            paginatedData.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-7 border p-2 text-sm hover:bg-gray-100"
              >
                <span>{startIndex + index + 1}</span>
                <span>{item.employeeName}</span>
                <span>{item.task}</span>
                <span>{item.startDate.slice(0, 10)}</span>
                <span>{item.endDate.slice(0, 10)}</span>
                <span>{item.deadline?.slice(0, 10)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={startIndex + 1}
          end={endIndex}
          total={totalItems}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            pageNo * itemsPerPage < totalItems && setPageNo((p) => p + 1)
          }
        />
      </div>

      <div className="flex items-center justify-center mt-4">
        <button
          onClick={printDiv}
          className="bg-green-500 text-white py-2 px-4 rounded 
        font-semibold hover:cursor-pointer"
        >
          Download
        </button>
      </div>
    </div>
  );
};
