import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddAdvanceSalary } from "../../Components/AdvanceSalaryModal/AddAdvanceSalary";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { EditAdvanceSalary } from "../../Components/AdvanceSalaryModal/EditAdvanceSalary";
import { ViewAdvanceSalary } from "../../Components/AdvanceSalaryModal/ViewAdvanceSalary";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type AdvanceSalaryT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export type AdvanceSalaryType = {
  id: number;
  employee_id: number;
  employee_name: string;
  date: string;
  amount: number;
  approvalStatus: string;
  description: string;
};

export const AdvanceSalary = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allAdvance, setAllAdvance] = useState<AdvanceSalaryType[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<AdvanceSalaryT>("");
  const [selectedAdvance, setSelectedAdvance] =
    useState<AdvanceSalaryType | null>(null);

  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleViewModal = (
    active: AdvanceSalaryT,
    advance?: AdvanceSalaryType
  ) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));

    if (active === "EDIT" || active === "VIEW" || active === "DELETE") {
      setSelectedAdvance(advance ?? null);
    } else {
      setSelectedAdvance(null);
    }
  };

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleGetAllAdvance = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getAdvanceSalary`
          : `${BASE_URL}/api/user/getMyAdvanceSalary`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllAdvance(
        Array.isArray(res.data) ? res.data.sort((a, b) => b.id - a.id) : []
      );
    } catch (error) {
      console.error("Failed to fetch advance salary:", error);
      setAllAdvance([]);
    }
  }, [token, currentUser]);

  const handleDeleteAdvance = async () => {
    if (!selectedAdvance?.id || !token) return;

    try {
      await axios.delete(
        `${BASE_URL}/api/admin/deleteAdvanceSalary/${selectedAdvance.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      handleGetAllAdvance();
      setIsOpenModal("");
      setSelectedAdvance(null);
    } catch (error) {
      console.error("Failed to delete advance salary:", error);
    }
  };

  useEffect(() => {
    handleGetAllAdvance();
    document.title = "(OMS) ADVANCE SALARY";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("ADVANCE SALARY")), 500);
  }, [dispatch, handleGetAllAdvance]);

  if (loader) return <Loader />;

  const filteredAdvance = allAdvance.filter(
    (a) =>
      a.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredAdvance.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedAdvance = filteredAdvance.slice(startIndex, endIndex);

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle tileName="Advance Salary" activeFile="Advance Salary list" />

  //     <div
  //       className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
  //      overflow-hidden flex flex-col"
  //     >
  //       <div className="flex text-gray-800 items-center justify-between mx-2">
  //         <span>
  //           Total number of Advance Salary Applications :{" "}
  //           <span className="text-2xl text-indigo-900 font-semibold font-sans">
  //             [{totalItems}]
  //           </span>
  //         </span>
  //         <CustomButton
  //           label="Advance Salary"
  //           handleToggle={() => handleToggleViewModal("ADD")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between text-gray-800 mx-2">
  //         <div>
  //           <span>Show</span>
  //           <span className="bg-gray-200 rounded mx-1 p-1">
  //             <select value={selectedValue} onChange={handleChangeShowData}>
  //               {numbers.map((num, index) => (
  //                 <option key={index} value={num}>
  //                   {num}
  //                 </option>
  //               ))}
  //             </select>
  //           </span>
  //           <span>entries</span>
  //         </div>
  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={(term) => {
  //             setSearchTerm(term);
  //             setPageNo(1);
  //           }}
  //         />
  //       </div>

  //       <div className="max-h-[28.6rem] overflow-hidden  mx-2">
  //         <div
  //           className="grid grid-cols-6 bg-indigo-900 text-white font-semibold border border-gray-600
  //          text-sm sticky top-0 z-10 p-[10px]"
  //         >
  //           <span>Sr#</span>
  //           <span>Employee Name</span>
  //           <span>Date</span>
  //           <span>Amount</span>
  //           <span>Approval</span>
  //           <span className="text-center">Actions</span>
  //         </div>

  //         {paginatedAdvance.map((item, index) => (
  //           <div
  //             key={item.id}
  //             className="grid grid-cols-6 border border-gray-600 text-gray-800 hover:bg-gray-100 transition
  //              duration-200 text-sm items-center justify-center p-[5px]"
  //           >
  //             <span className="px-2">{startIndex + index + 1}</span>
  //             <span>{item.employee_name}</span>
  //             <span>{new Date(item.date).toLocaleDateString("en-CA")}</span>
  //             <span>{item.amount}</span>
  //             <span className=" p-1">
  //               <span className=" p-2 rounded-full">{item.approvalStatus}</span>
  //             </span>
  //             <span className="flex gap-1 justify-center">
  //               <EditButton
  //                 handleUpdate={() => handleToggleViewModal("EDIT", item)}
  //               />
  //               <ViewButton
  //                 handleView={() => handleToggleViewModal("VIEW", item)}
  //               />
  //               {currentUser?.role === "admin" && (
  //                 <DeleteButton
  //                   handleDelete={() => {
  //                     setSelectedAdvance(item);
  //                     setIsOpenModal("DELETE");
  //                   }}
  //                 />
  //               )}
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
  //         handleDecrementPageButton={handleDecrementPageButton}
  //         handleIncrementPageButton={handleIncrementPageButton}
  //       />
  //     </div>

  //     {isOpenModal === "ADD" && (
  //       <AddAdvanceSalary
  //         setModal={() => handleToggleViewModal("")}
  //         handleRefresh={handleGetAllAdvance}
  //       />
  //     )}

  //     {isOpenModal === "EDIT" && selectedAdvance && (
  //       <EditAdvanceSalary
  //         setModal={() => handleToggleViewModal("")}
  //         handleRefresh={handleGetAllAdvance}
  //         advanceData={selectedAdvance}
  //       />
  //     )}

  //     {isOpenModal === "VIEW" && selectedAdvance && (
  //       <ViewAdvanceSalary
  //         setIsOpenModal={() => handleToggleViewModal("")}
  //         viewAdvance={selectedAdvance}
  //       />
  //     )}

  //     {isOpenModal === "DELETE" && selectedAdvance && (
  //       <ConfirmationModal
  //         isOpen={() => {}}
  //         onClose={() => setIsOpenModal("")}
  //         onConfirm={handleDeleteAdvance}
  //       />
  //     )}
  //   </div>
  // );

   return (
  <div className="w-full px-2 sm:px-4">
    <TableTitle tileName="Advance Salary" activeFile="Advance Salary list" />

    <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
        <span className="text-sm sm:text-base">
          Total number of Advance Salary Applications :{" "}
          <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold font-sans">
            [{totalItems}]
          </span>
        </span>

        <CustomButton
          label="Advance Salary"
          handleToggle={() => handleToggleViewModal("ADD")}
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
        <div className="text-sm flex items-center gap-1">
          <span>Show</span>
          <select
            value={selectedValue}
            onChange={handleChangeShowData}
            className="bg-gray-200 rounded p-1 outline-none"
          >
            {numbers.map((num, index) => (
              <option key={index} value={num}>
                {num}
              </option>
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

      {/* Table Wrapper */}
      <div className="mx-2 mt-2 overflow-x-auto max-h-[28.6rem]">
        <div className="min-w-[900px]">
          {/* Table Header */}
          <div className="grid grid-cols-6 bg-indigo-900 items-center text-white font-semibold 
          text-sm sticky top-0 z-10 p-2">
            <span>Sr#</span>
            <span>Employee Name</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Approval</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedAdvance.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-4">
              No records available at the moment!
            </div>
          ) : (
            paginatedAdvance.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-6 border border-gray-300 text-gray-800 items-center text-sm p-2
                 hover:bg-gray-100 transition items-center"
              >
                <span className="px-2">{startIndex + index + 1}</span>
                <span className="truncate">{item.employee_name}</span>
                <span>{new Date(item.date).toLocaleDateString("en-CA")}</span>
                <span>{item.amount}</span>
                <span className="">
                  <span className="rounded-full">{item.approvalStatus}</span>
                </span>
                <span className="flex gap-1 justify-center flex-wrap">
                  <EditButton
                    handleUpdate={() => handleToggleViewModal("EDIT", item)}
                  />
                  <ViewButton
                    handleView={() => handleToggleViewModal("VIEW", item)}
                  />
                  {currentUser?.role === "admin" && (
                    <DeleteButton
                      handleDelete={() => {
                        setSelectedAdvance(item);
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
    </div>

    {/* Pagination */}
    <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
      <ShowDataNumber
        start={startIndex + 1}
        end={endIndex}
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
      <AddAdvanceSalary
        setModal={() => handleToggleViewModal("")}
        handleRefresh={handleGetAllAdvance}
      />
    )}
    {isOpenModal === "EDIT" && selectedAdvance && (
      <EditAdvanceSalary
        setModal={() => handleToggleViewModal("")}
        handleRefresh={handleGetAllAdvance}
        advanceData={selectedAdvance}
      />
    )}
    {isOpenModal === "VIEW" && selectedAdvance && (
      <ViewAdvanceSalary
        setIsOpenModal={() => handleToggleViewModal("")}
        viewAdvance={selectedAdvance}
      />
    )}
    {isOpenModal === "DELETE" && selectedAdvance && (
      <ConfirmationModal
        isOpen={() => {}}
        onClose={() => setIsOpenModal("")}
        onConfirm={handleDeleteAdvance}
      />
    )}
  </div>
);


};
