import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

import { AddRejoining } from "../../Components/RejoinModal/AddRejoining";
import { UpdateRejoining } from "../../Components/RejoinModal/UpdateRejoining";
import { ViewRejoin } from "../../Components/RejoinModal/ViewRejoin";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { Footer } from "../../Components/Footer";

import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

const numbers = [10, 25, 50, 100];

type MODAL_T = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export type REJOIN_T = {
  id: number;
  employee_id: number;
  employee_name: string;
  designation: string;
  resignation_date: string;
  rejoinRequest_date: string;
  approval_status: string;
};

export const Rejoin = () => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const isAdmin = currentUser?.role === "admin";

  const [rejoinList, setRejoinList] = useState<REJOIN_T[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<MODAL_T>("");

  const [selectedRejoin, setSelectedRejoin] = useState<REJOIN_T | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleGetRejoinRequests = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getAllRejoinRequests`
          : `${BASE_URL}/api/user/getMyRejoinRequests`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRejoinList(
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : [],
      );
    } catch (error) {
      console.error("Failed to fetch rejoin requests:", error);
      setRejoinList([]);
    }
  }, [token, currentUser]);

  const handleDeleteRejoin = async () => {
    if (!selectedId || !token) return;

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteRejoin/${selectedId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      handleGetRejoinRequests();
      setIsOpenModal("");
      setSelectedId(null);
    } catch (error) {
      console.error("Failed to delete rejoin request:", error);
    }
  };

  const filteredData = rejoinList.filter(
    (r) =>
      r.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.designation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredData.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    document.title = "(OMS) REJOIN";
    dispatch(navigationStart());
    handleGetRejoinRequests();
    setTimeout(() => dispatch(navigationSuccess("REJOIN")), 500);
  }, [dispatch, handleGetRejoinRequests]);

  if (loader) return <Loader />;

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-700 text-white border-green-200";
      case "rejected":
        return "bg-red-700 text-white border-red-200";
      default:
        return "bg-orange-600 text-white border-orange-200"; // For "Pending"
    }
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Button as the rightElement */}
        <TableTitle
          tileName="Rejoining"
          rightElement={
            <CustomButton
              label="+ Add Rejoin"
              handleToggle={() => setIsOpenModal("ADD")}
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        {/* Stats and Filter Section */}
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
                  {numbers.map((num, index) => (
                    <option key={index} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </span>
              <span className="hidden xs:inline">entries</span>
              {/* Total Count Badge matching UsersDetails feel */}
            </div>

            {/* Right Side: Search Input */}
            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={(term) => {
                setSearchTerm(term);
                setPageNo(1);
              }}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header - Using grid-cols-7 to match dimension*/}
            <div
              className={`grid ${
                isAdmin ? "grid-cols-7" : "grid-cols-6"
              } bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2`}
            >
              <span>Sr#</span>
              {isAdmin && <span>Employee Name</span>}
              <span>Current Position</span>
              <span>Resignation</span>
              <span>Rejoin Date</span>
              <span>Status</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedData.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedData.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid ${
                    isAdmin ? "grid-cols-7" : "grid-cols-6"
                  } border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{startIndex + index + 1}</span>
                  {isAdmin && (
                    <span className="truncate">{item.employee_name}</span>
                  )}
                  <span className="truncate">{item.designation}</span>
                  <span>{formatDate(item.resignation_date)}</span>
                  <span>{formatDate(item.rejoinRequest_date)}</span>
                  <span className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(
                        item.approval_status,
                      )}`}
                    >
                      {item.approval_status || "Pending"}
                    </span>
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => {
                        setSelectedRejoin(item);
                        setIsOpenModal("EDIT");
                      }}
                    />
                    <ViewButton
                      handleView={() => {
                        setSelectedRejoin(item);
                        setIsOpenModal("VIEW");
                      }}
                    />
                    {currentUser?.role === "admin" && (
                      <DeleteButton
                        handleDelete={() => {
                          setSelectedId(item.id);
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
        <div className="flex flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={totalItems === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, totalItems)}
            total={totalItems}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
            handleIncrementPageButton={() =>
              pageNo * selectedValue < totalItems && setPageNo((p) => p + 1)
            }
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddRejoining
          setModal={() => setIsOpenModal("")}
          handleRefresh={handleGetRejoinRequests}
        />
      )}

      {isOpenModal === "EDIT" && selectedRejoin && (
        <UpdateRejoining
          setModal={() => setIsOpenModal("")}
          rejoinData={selectedRejoin}
          handleRefresh={handleGetRejoinRequests}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeleteRejoin}
          message="Are you sure you want to delete this rejoining request?"
        />
      )}

      {isOpenModal === "VIEW" && selectedRejoin && (
        <ViewRejoin
          setIsOpenModal={() => setIsOpenModal("")}
          viewRejoin={selectedRejoin}
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
