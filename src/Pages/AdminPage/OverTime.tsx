import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddOverTime } from "../../Components/OvertimeModals/AddOvertime";
import { UpdateOverTime } from "../../Components/OvertimeModals/UpdateOverTime";
import { ViewOverTimeModal } from "../../Components/OvertimeModals/ViewOverTime";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type OVERTIMET = {
  id: number;
  employee_id: number;
  name: string;
  date: string;
  totalTime: string;
  approvalStatus: string;
};

type MODALT = "ADD" | "VIEW" | "UPDATE" | "DELETE" | "";

export const OverTime = () => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<MODALT>("");
  const [allOvertime, setAllOvertime] = useState<OVERTIMET[]>([]);
  const [selectedOvertime, setSelectedOvertime] = useState<OVERTIMET | null>(
    null,
  );
  const [viewOvertime, setViewOvertime] = useState<OVERTIMET | null>(null);

  const [selectedValue, setSelectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleGetOvertime = useCallback(async () => {
    if (!currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getAllOvertime`
          : `${BASE_URL}/api/user/getMyOvertime`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllOvertime(res.data || []);
    } catch (error) {
      console.error("Error fetching overtime:", error);
      setAllOvertime([]);
    }
  }, [currentUser, token]);

  const handleDeleteOvertime = async () => {
    if (!selectedOvertime || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/deleteOvertime/${selectedOvertime.id}`
          : `${BASE_URL}/api/user/deleteOvertime/${selectedOvertime.id}`;

      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllOvertime((prev) =>
        prev.filter((o) => o.id !== selectedOvertime.id),
      );
      setIsOpenModal("");
      setSelectedOvertime(null);
    } catch (error) {
      console.error("Error deleting overtime:", error);
    }
  };

  useEffect(() => {
    document.title = "(OMS) OVER TIME";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("OVER TIME")), 1000);
  }, [dispatch]);

  useEffect(() => {
    handleGetOvertime();
  }, [handleGetOvertime]);

  const filteredOvertime = useMemo(() => {
    return allOvertime.filter(
      (o) =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.approvalStatus.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [allOvertime, searchTerm]);

  const paginatedOvertime = useMemo(() => {
    const start = (pageNo - 1) * selectedValue;
    return filteredOvertime.slice(start, start + selectedValue);
  }, [filteredOvertime, pageNo, selectedValue]);

  const startIndex = (pageNo - 1) * selectedValue;

  if (loader) return <Loader />;

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-2 py-1 rounded-full text-xs font-semibold capitalize";

    switch (status.toLowerCase()) {
      case "approved":
      case "accepted":
        return (
          <span
            className={`${baseClasses} bg-green-700 text-white border border-green-200`}
          >
            {status}
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-red-700 text-white border`}>
            {status}
          </span>
        );
      case "rejected":
      case "declined":
        return (
          <span
            className={`${baseClasses} bg-red-100 text-red-700 border border-red-200`}
          >
            {status}
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add button as the rightElement */}
        <TableTitle
          tileName="Over Time"
          rightElement={
            <CustomButton
              label="+ Add Time"
              handleToggle={() => setIsOpenModal("ADD")}
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={selectedValue}
                  onChange={(e) => {
                    setSelectedValue(Number(e.target.value));
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

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className={`grid ${
                currentUser?.role === "admin" ? "grid-cols-6" : "grid-cols-5"
              } bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2`}
            >
              <span>Sr#</span>
              {currentUser?.role === "admin" && <span>Employee Name</span>}
              <span>Date</span>
              <span>Over Time</span>
              <span>Approval</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedOvertime.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedOvertime.map((ot, index) => (
                <div
                  key={ot.id}
                  className={`grid ${
                    currentUser?.role === "admin"
                      ? "grid-cols-6"
                      : "grid-cols-5"
                  } border-b border-x border-gray-200 text-gray-800 items-center text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{startIndex + index + 1}</span>
                  {currentUser?.role === "admin" && (
                    <span className="truncate">{ot.name}</span>
                  )}
                  <span>
                    {new Date(ot.date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span>{ot.totalTime}</span>
                  <span className="flex items-center">
                    {getStatusBadge(ot.approvalStatus)}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    {(currentUser?.role === "admin" ||
                      ot.name === currentUser?.name) && (
                      <EditButton
                        handleUpdate={() => {
                          setSelectedOvertime(ot);
                          setIsOpenModal("UPDATE");
                        }}
                      />
                    )}
                    <ViewButton
                      handleView={() => {
                        setViewOvertime(ot);
                        setIsOpenModal("VIEW");
                      }}
                    />
                    {(currentUser?.role === "admin" ||
                      ot.name === currentUser?.name) && (
                      <DeleteButton
                        handleDelete={() => {
                          setSelectedOvertime(ot);
                          setIsOpenModal("DELETE");
                        }}
                      />
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row items-center justify-between p-2">
          <ShowDataNumber
            start={paginatedOvertime.length === 0 ? 0 : startIndex + 1}
            end={Math.min(startIndex + selectedValue, filteredOvertime.length)}
            total={filteredOvertime.length}
          />
          <Pagination
            pageNo={pageNo}
            handleIncrementPageButton={() =>
              setPageNo((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredOvertime.length / selectedValue),
                ),
              )
            }
            handleDecrementPageButton={() =>
              setPageNo((prev) => Math.max(prev - 1, 1))
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddOverTime
          setModal={() => setIsOpenModal("")}
          refreshOvertime={handleGetOvertime}
        />
      )}

      {isOpenModal === "UPDATE" && selectedOvertime && (
        <UpdateOverTime
          setModal={() => setIsOpenModal("")}
          EditOvertime={{
            id: selectedOvertime.id,
            employeeId: selectedOvertime.employee_id,
            time: selectedOvertime.totalTime,
            date: selectedOvertime.date,
            description: "",
            status: selectedOvertime.approvalStatus,
          }}
          refreshOvertimes={handleGetOvertime}
        />
      )}

      {isOpenModal === "VIEW" && viewOvertime && (
        <ViewOverTimeModal
          setModal={() => setIsOpenModal("")}
          data={viewOvertime}
        />
      )}

      {isOpenModal === "DELETE" && selectedOvertime && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("")}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteOvertime}
          message="Are you sure you want to delete this overtime record?"
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
