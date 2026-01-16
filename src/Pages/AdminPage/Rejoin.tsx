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
    return `${year}-${month}-${day}`;
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
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : []
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
        { headers: { Authorization: `Bearer ${token}` } }
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
      r.designation.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Rejoining" activeFile="Rejoining list" />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mx-2">
          <span>
            Total Rejoining Requests:{" "}
            <span className="text-2xl text-indigo-900 font-semibold">
              [{totalItems}]
            </span>
          </span>

          <CustomButton
            label="Add Rejoin"
            handleToggle={() => setIsOpenModal("ADD")}
          />
        </div>

        <div className="flex justify-between mx-2">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={selectedValue}
              onChange={(e) => {
                setSelectedValue(Number(e.target.value));
                setPageNo(1);
              }}
              className="bg-gray-200 rounded px-2 py-1"
            >
              {numbers.map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
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

        <div className="flex-1 mx-2 overflow-y-auto">
          <div className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr] bg-indigo-900 text-white font-semibold p-2 sticky top-0">
            <span>Sr#</span>
            <span>Employee</span>
            <span>Designation</span>
            <span>Resignation Date</span>
            <span>Rejoin Date</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          {paginatedData.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr] p-2 border hover:bg-gray-100"
            >
              <span>{startIndex + index + 1}</span>
              <span>{item.employee_name}</span>
              <span>{item.designation}</span>
              <span>{formatDate(item.resignation_date)}</span>
              <span>{formatDate(item.rejoinRequest_date)}</span>
              <span>{item.approval_status}</span>

              <span className="flex justify-center gap-1">
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
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <ShowDataNumber
          start={startIndex + 1}
          end={endIndex}
          total={totalItems}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            pageNo * selectedValue < totalItems && setPageNo((p) => p + 1)
          }
        />
      </div>

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
    </div>
  );
};
