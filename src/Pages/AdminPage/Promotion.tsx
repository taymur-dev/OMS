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
        Array.isArray(res.data) ? res.data.sort((a, b) => a.id - b.id) : []
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
        { headers: { Authorization: `Bearer ${token}` } }
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
      p.requested_designation.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="w-full mx-2">
      <TableTitle
        tileName="Promotion Request"
        activeFile="Promotion Request List"
      />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white
  overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mx-2">
          <span>
            Total Promotions:{" "}
            <span className="text-2xl text-blue-500 font-semibold">
              {totalItems}
            </span>
          </span>
          <CustomButton
            label="Add Promotion"
            handleToggle={() => setIsOpenModal("ADD")}
          />
        </div>

        <div className="flex justify-between mx-2">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={selectedValue}
              onChange={handleChangeShowData}
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

        <div className="mx-2 flex-1 overflow-y-auto">
          <div
            className={`grid grid-cols-6 bg-gray-200 font-semibold p-2 sticky top-0`}
          >
            <span>Sr#</span>
            <span>Employee Name</span>
            <span>Current Designation</span>
            <span>Requested Designation</span>
            <span>Approval</span>
            <span className="text-center">Actions</span>
          </div>

          {paginatedPromotions.map((promotion, index) => (
            <div
              key={promotion.id}
              className="grid grid-cols-6 p-2 border hover:bg-gray-100"
            >
              <span>{startIndex + index + 1}</span>
              <span>{promotion.employee_name}</span>
              <span>{promotion.current_designation}</span>
              <span>{promotion.requested_designation}</span>
              <span>{promotion.approval}</span>
              <span className="flex justify-center gap-1">
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
    </div>
  );
};
