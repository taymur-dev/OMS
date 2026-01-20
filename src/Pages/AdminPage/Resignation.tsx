import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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

export const Resignation = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<ResignationT>("");
  const [allResignations, setAllResignations] = useState<ResignationDataT[]>(
    []
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
    event: React.ChangeEvent<HTMLSelectElement>
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
            item.id === updatedItem.id ? { ...item, ...updatedItem } : item
          );
        }

        setAllResignations(data.sort((a, b) => a.id - b.id));
      } catch (error) {
        console.error("Failed to fetch resignations:", error);
        setAllResignations([]);
      }
    },
    [token, currentUser]
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
      res.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredResignations.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedResignations = filteredResignations.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    handleGetAllResignations();
    document.title = "(OMS) RESIGNATIONS";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("Resignation Request")), 500);
  }, [dispatch, handleGetAllResignations]);

  if (loader) return <Loader />;

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle
  //       tileName="Resignation Request"
  //       activeFile="Resignation Request list"
  //     />

  //     <div
  //       className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
  //      overflow-hidden flex flex-col"
  //     >
  //       <div className="flex text-gray-800 items-center justify-between mx-2">
  //         <span>
  //           Total Resignations:{" "}
  //           <span className="text-2xl text-indigo-900 font-semibold font-sans">
  //             [{totalItems}]
  //           </span>
  //         </span>

  //         <CustomButton
  //           label="Add Resignation"
  //           handleToggle={() => handleToggleViewModal("ADD")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between text-gray-800 mx-2">
  //         <div>
  //           <span>Show</span>
  //           <span className="bg-gray-200 rounded mx-1 p-1">
  //             <select value={selectedValue} onChange={handleChangeShowData}>
  //               {numbers.map((num) => (
  //                 <option key={num} value={num}>
  //                   {num}
  //                 </option>
  //               ))}
  //             </select>
  //           </span>
  //           <span>entries</span>
  //         </div>
  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //         />
  //       </div>

  //       <div className="mx-2 max-h-[28.4rem] overflow-y-auto">
  //         <div
  //           className="grid grid-cols-6 bg-indigo-900 text-white font-semibold border border-gray-600
  //          text-sm sticky top-0 z-10 p-[10px]"
  //         >
  //           <span>Sr#</span>
  //           <span>Employee Name</span>
  //           <span>Designation</span>
  //           <span>Resignation Date</span>
  //           <span>Approval</span>
  //           <span className="text-center w-40">Actions</span>
  //         </div>

  //         {paginatedResignations.map((res, index) => (
  //           <div
  //             key={res.id}
  //             className="grid grid-cols-6 border border-gray-600 text-gray-800 hover:bg-gray-100 transition 
  //             duration-200 text-sm items-center justify-center p-[7px]"
  //           >
  //             <span className="px-2">{startIndex + index + 1}</span>
  //             <span>{res.employee_name}</span>
  //             <span>{res.designation}</span>
  //             <span>
  //               {new Date(res.resignation_date).toLocaleDateString("en-CA")}
  //             </span>
  //             <span>{res.approval_status}</span>
  //             <span className="flex items-center gap-1">
  //               <EditButton handleUpdate={() => handleEditClick(res)} />
  //               <ViewButton handleView={() => handleViewClick(res)} />
  //               <DeleteButton
  //                 handleDelete={() => {
  //                   setSelectedId(res.id);
  //                   handleToggleViewModal("DELETE");
  //                 }}
  //               />
  //             </span>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between mt-2">
  //       <ShowDataNumber
  //         start={startIndex + 1}
  //         end={endIndex}
  //         total={totalItems}
  //       />
  //       <Pagination
  //         pageNo={pageNo}
  //         handleIncrementPageButton={handleIncrementPageButton}
  //         handleDecrementPageButton={handleDecrementPageButton}
  //       />
  //     </div>

  //     {isOpenModal === "ADD" && (
  //       <AddResignation
  //         setModal={() => handleToggleViewModal("")}
  //         handleRefresh={handleGetAllResignations}
  //       />
  //     )}

  //     {isOpenModal === "EDIT" && selectedResignation && (
  //       <UpdateResignation
  //         setModal={() => handleToggleViewModal("")}
  //         resignationData={{
  //           id: String(selectedResignation.id),
  //           employee_name: selectedResignation.employee_name,
  //           designation: selectedResignation.designation,
  //           note: selectedResignation.note,
  //           date: selectedResignation.resignation_date,
  //           approval_status: selectedResignation.approval_status,
  //         }}
  //         handleRefresh={handleGetAllResignations}
  //       />
  //     )}

  //     {isOpenModal === "VIEW" && selectedResignation && (
  //       <ViewResignation
  //         setModal={() => handleToggleViewModal("")}
  //         resignationData={{
  //           employee_name: selectedResignation.employee_name,
  //           designation: selectedResignation.designation,
  //           note: "",
  //           resignation_date: selectedResignation.resignation_date,
  //           approval_status: selectedResignation.approval_status,
  //         }}
  //       />
  //     )}

  //     {isOpenModal === "DELETE" && (
  //       <ConfirmationModal
  //         isOpen={() => {}}
  //         onClose={() => handleToggleViewModal("")}
  //         onConfirm={handleDeleteResignation}
  //         message="Are you sure you want to delete this Resignation?"
  //       />
  //     )}
  //   </div>
  // );
  return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle
      tileName="Resignation Request"
      activeFile="Resignation Request list"
    />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total Resignations :
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
            [{totalItems}]
          </span>
        </span>

        <CustomButton
          handleToggle={() => handleToggleViewModal("ADD")}
          label="Add Resignation"
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
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div
            className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1.5fr]
bg-indigo-900 text-white font-semibold items-center text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Employee Name</span>
            <span>Designation</span>
            <span>Resignation Date</span>
            <span>Approval</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedResignations.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-4">
              No records available at the moment!
            </div>
          ) : (
            paginatedResignations.map((res, index) => (
              <div
                key={res.id}
                className="grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1.5fr]
border border-gray-300 text-gray-800 text-sm p-2
hover:bg-gray-100 transition  items-center"
              >
                <span>{startIndex + index + 1}</span>
                <span className="truncate">{res.employee_name}</span>
                <span>{res.designation}</span>
                <span>
                  {new Date(res.resignation_date).toLocaleDateString("en-CA")}
                </span>
                <span>{res.approval_status}</span>

                {/* Actions */}
                <span className="flex flex-nowrap items-center justify-center gap-1">
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
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
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

    {/* Modals */}
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
          note: "",
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
