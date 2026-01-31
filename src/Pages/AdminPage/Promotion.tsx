import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { AddPromotion } from "../../Components/PromotionModal/AddPromotion";
import { UpdatePromotion } from "../../Components/PromotionModal/UpdatePromotion";
import { ViewPromotion } from "../../Components/PromotionModal/ViewPromotion";

import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Footer } from "../../Components/Footer";

const numbers = [10, 25, 50, 100];

type PromotionT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

export type ALLPROMOTION = {
  id: number;
  employee_id: number;
  employee_name: string;
  current_designation: string;
  requested_designation: string;
  approval: string;
  note: string;
  date: string;
};

export const Promotion = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const isAdmin = currentUser?.role === "admin";

  const [allPromotions, setAllPromotions] = useState<ALLPROMOTION[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<PromotionT>("");
  const [selectedPromotion, setSelectedPromotion] =
    useState<ALLPROMOTION | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleGetAllPromotions = useCallback(async () => {
    if (!token || !currentUser) return;
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/getPromotions`
          : `${BASE_URL}/api/user/getMyPromotions`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllPromotions(
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : [],
      );
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      setAllPromotions([]);
    }
  }, [token, currentUser]);

  const handleDeletePromotion = async () => {
    if (!selectedId || !token) return;
    try {
      const url =
        currentUser.role === "admin"
          ? `${BASE_URL}/api/admin/deletePromotion/${selectedId}`
          : `${BASE_URL}/api/user/deletePromotion/${selectedId}`;

      await axios.patch(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      handleGetAllPromotions();
      setIsOpenModal("");
      setSelectedId(null);
    } catch (error) {
      console.error("Failed to delete promotion:", error);
    }
  };

  const handleEdit = (promotion: ALLPROMOTION) => {
    setSelectedPromotion(promotion);
    setIsOpenModal("EDIT");
  };

  const handleView = (promotion: ALLPROMOTION) => {
    setSelectedPromotion(promotion);
    setIsOpenModal("VIEW");
  };

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    setPageNo(1);
  };

  const filteredPromotions = allPromotions.filter(
    (p) =>
      p.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.current_designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.requested_designation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalItems = filteredPromotions.length;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(startIndex + selectedValue, totalItems);
  const paginatedPromotions = filteredPromotions.slice(startIndex, endIndex);

  useEffect(() => {
    handleGetAllPromotions();
    document.title = "(OMS) PROMOTION";

    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("Promotion")), 500);
  }, [dispatch, handleGetAllPromotions]);

  if (loader) return <Loader />;

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase(); // Matching your OptionField values

    // Define base and specific styles
    const baseClasses =
      "px-2.5 py-1 rounded-full text-xs font-semibold uppercase border shadow-sm";

    const styles: Record<string, string> = {
      ACCEPTED: "bg-green-700 text-white border-green-200",
      REJECTED: "bg-red-700 text-white border-red-200",
      PENDING: "bg-orange-600 text-white border-orange-200",
      DEFAULT: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const selectedStyle = styles[s] || styles.DEFAULT;

    return (
      <span className={`${baseClasses} ${selectedStyle}`}>
        {status || "PENDING"}
      </span>
    );
  };

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Promotion button as the rightElement */}
        <TableTitle
          tileName="Promotion Request"
          rightElement={
            <CustomButton
              handleToggle={() => setIsOpenModal("ADD")}
              label="+ Add Promotion"
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
            {/* Sticky Table Header */}
            <div
              className={`grid ${
                isAdmin ? "grid-cols-6" : "grid-cols-5"
              } bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2`}
            >
              <span>Sr#</span>
              {isAdmin && <span>Employee Name</span>}
              <span>Current Designation</span>
              <span>Requested Designation</span>
              <span>Approval</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedPromotions.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedPromotions.map((promotion, index) => (
                <div
                  key={promotion.id}
                  className={`grid ${
                    isAdmin ? "grid-cols-6" : "grid-cols-5"
                  } border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition`}
                >
                  <span>{startIndex + index + 1}</span>
                  {isAdmin && (
                    <span className="truncate">{promotion.employee_name}</span>
                  )}
                  <span className="truncate">
                    {promotion.current_designation}
                  </span>
                  <span className="truncate">
                    {promotion.requested_designation}
                  </span>
                  <span className="flex items-center">
                    {getStatusBadge(promotion.approval)}
                  </span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton handleUpdate={() => handleEdit(promotion)} />
                    <ViewButton handleView={() => handleView(promotion)} />
                    <DeleteButton
                      handleDelete={() => {
                        setSelectedId(promotion.id);
                        setIsOpenModal("DELETE");
                      }}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between">
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
        <AddPromotion
          setModal={() => setIsOpenModal("")}
          handleRefresh={handleGetAllPromotions}
        />
      )}

      {isOpenModal === "EDIT" && selectedPromotion && (
        <UpdatePromotion
          setModal={() => setIsOpenModal("")}
          promotionData={selectedPromotion}
          handleRefresh={handleGetAllPromotions}
        />
      )}

      {isOpenModal === "VIEW" && selectedPromotion && (
        <ViewPromotion
          setModal={() => setIsOpenModal("")}
          promotionData={selectedPromotion}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => {}}
          onClose={() => setIsOpenModal("")}
          onConfirm={handleDeletePromotion}
          message="Are you sure you want to delete this promotion?"
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
