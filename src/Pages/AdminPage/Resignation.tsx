import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

import { AddResignation } from "../../Components/ResignationModal/AddResignation";
import { UpdateResignation } from "../../Components/ResignationModal/UpdateResignation";
import { ViewResignation } from "../../Components/ResignationModal/ViewResignation";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type ResignationT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export type ResignationDataT = {
  id: number;
  employee_name: string;
  designation: string;
  resignation_date: string;
  note: string;
  approval_status: string;
};

export const Resignation = ({ triggerModal }: { triggerModal: number }) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const isAdmin = currentUser?.role === "admin";

  const [isOpenModal, setIsOpenModal] = useState<ResignationT>("");
  const [allResignations, setAllResignations] = useState<ResignationDataT[]>(
    [],
  );
  const [selectedResignation, setSelectedResignation] =
    useState<ResignationDataT | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [selectedValue, setSelectedValue] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleViewModal = (active: ResignationT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleViewClick = (resignation: ResignationDataT) => {
    setSelectedResignation(resignation);
    handleToggleViewModal("VIEW");
  };

  const handleEditClick = (resignation: ResignationDataT) => {
    setSelectedResignation(resignation);
    handleToggleViewModal("EDIT");
  };

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => Math.max(prev - 1, 1));

  const handleGetAllResignations = useCallback(
    async (updatedItem?: ResignationDataT) => {
      if (!token || !currentUser) return;

      try {
        const url =
          currentUser.role === "admin"
            ? `${BASE_URL}/api/admin/getResignations`
            : `${BASE_URL}/api/user/getMyResignations`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let data: ResignationDataT[] = Array.isArray(res.data) ? res.data : [];

        if (updatedItem) {
          data = data.map((item) =>
            item.id === updatedItem.id ? { ...item, ...updatedItem } : item,
          );
        }

        setAllResignations(data.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Failed to fetch resignations:", error);
        setAllResignations([]);
      }
    },
    [token, currentUser],
  );

  const handleDeleteResignation = async () => {
    if (!selectedId || !token) return;

    try {
      await axios.delete(`${BASE_URL}/api/deleteResignation/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleGetAllResignations();
      setIsOpenModal("");
      setSelectedId(null);
    } catch (error) {
      console.error("Failed to delete resignation:", error);
    }
  };

  const filteredResignations = allResignations.filter(
    (res) =>
      res.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.designation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredResignations.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedResignations = filteredResignations.slice(
    startIndex,
    endIndex,
  );

  useEffect(() => {
    handleGetAllResignations();
    document.title = "(OMS) RESIGNATIONS";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("Resignation Request")), 500);
  }, [dispatch, handleGetAllResignations]);

  
    useEffect(() => {
      if (triggerModal > 0) {
        setIsOpenModal("ADD");
      }
    }, [triggerModal]);

  if (loader) return <Loader />;

  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();

    // Map statuses to specific Tailwind classes
    const statusStyles: Record<string, string> = {
      PENDING: "bg-orange-600 text-white border-amber-200",
      APPROVED:  "bg-green-700 text-white border-emerald-200",
      ACCEPTED: "bg-green-700 text-white border-emerald-200", // Handle 'Accepted'
      REJECTED: "bg-red-700 text-white border-rose-200",
    };

    const currentStyle =
      statusStyles[upperStatus] || "bg-gray-100 text-gray-600 border-gray-200";

    return (
      <span
        className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${currentStyle}`}
      >
        {upperStatus}
      </span>
    );
  };

  return (
    <div className="flex flex-col flex-grow  bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col  bg-white">
        

        {/* Top Bar / Filter Row */}
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
        <div className="overflow-auto">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className={`grid ${
                isAdmin ? "grid-cols-6" : "grid-cols-5"
              } bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2`}
            >
              <span>Sr#</span>
              {isAdmin && <span>Employee Name</span>}
              <span>Current Position</span>
              <span>Resignation Date</span>
              <span>Approval</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedResignations.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedResignations.map((res, index) => (
                <div
                  key={res.id}
                  className={`grid ${
                    isAdmin ? "grid-cols-6" : "grid-cols-5"
                  } border-b border-x border-gray-200
                     text-gray-800 items-center text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{startIndex + index + 1}</span>
                   {isAdmin && (
                    <span className="truncate">{res.employee_name}</span>
                  )}
                  <span className="truncate">{res.designation}</span>
                  <span>
                    {new Date(res.resignation_date)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")}
                  </span>
                  <span className="flex items-center">
                    {getStatusBadge(res.approval_status)}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton handleUpdate={() => handleEditClick(res)} />
                    <ViewButton handleView={() => handleViewClick(res)} />
                    <DeleteButton
                      handleDelete={() => {
                        setSelectedId(res.id);
                        handleToggleViewModal("DELETE");
                      }}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={totalItems === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, totalItems)}
            total={totalItems}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADD" && (
        <AddResignation
          setModal={() => handleToggleViewModal("")}
          handleRefresh={handleGetAllResignations}
        />
      )}

      {isOpenModal === "EDIT" && selectedResignation && (
        <UpdateResignation
          setModal={() => handleToggleViewModal("")}
          resignationData={{
            id: String(selectedResignation.id),
            employee_name: selectedResignation.employee_name,
            designation: selectedResignation.designation,
            note: selectedResignation.note,
            date: selectedResignation.resignation_date,
            approval_status: selectedResignation.approval_status,
          }}
          handleRefresh={handleGetAllResignations}
        />
      )}

      {isOpenModal === "VIEW" && selectedResignation && (
        <ViewResignation
          setModal={() => handleToggleViewModal("")}
          resignationData={{
            employee_name: selectedResignation.employee_name,
            designation: selectedResignation.designation,
            note: selectedResignation.note,
            resignation_date: selectedResignation.resignation_date,
            approval_status: selectedResignation.approval_status,
          }}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteResignation}
          message="Are you sure you want to delete this Resignation?"
        />
      )}

     
    </div>
  );
};
