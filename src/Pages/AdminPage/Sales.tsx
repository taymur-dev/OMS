import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddSale } from "../../Components/SaleModals/AddSale";
import { ViewSale } from "../../Components/SaleModals/ViewSale";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { Loader } from "../../Components/LoaderComponent/Loader";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { RiInboxArchiveLine } from "react-icons/ri";

type SALET = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

type Sale = {
  id: number;
  projectId: number;
  projectName: string;
  customerId: number;
  customerName: string;
  saleDate: string;
  QTY: number;
  UnitPrice: number;
};

interface SalesProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Sales = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: SalesProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<SALET>("");
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [catchId, setCatchId] = useState<number | null>(null);
  const [pageNo, setPageNo] = useState(1);

  const handleToggleViewModal = (active: SALET) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleGetSales = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const res = await axios.get(`${BASE_URL}/api/admin/getSales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllSales(res.data.sort((a: Sale, b: Sale) => a.id - b.id));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("SALE"));
    }
  }, [dispatch, token]);

  useEffect(() => {
    document.title = "(OMS) SALE";
    handleGetSales();
  }, [handleGetSales]);

  // Sync with Parent triggers
  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const filteredSales = useMemo(() => {
    return allSales.filter(
      (sale) =>
        sale.projectName.toLowerCase().includes(externalSearch.toLowerCase()) ||
        sale.customerName.toLowerCase().includes(externalSearch.toLowerCase()),
    );
  }, [allSales, externalSearch]);

  const totalNum = filteredSales.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedSales = filteredSales.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  const handleIncrementPageButton = () => {
    if (pageNo < Math.ceil(totalNum / externalPageSize))
      setPageNo((p) => p + 1);
  };
  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

  const handleDeleteSale = async () => {
    if (!catchId) return;
    try {
      dispatch(navigationStart());
      await axios.patch(
        `${BASE_URL}/api/admin/deleteSale/${catchId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      handleGetSales();
      handleToggleViewModal("");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("SALE"));
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[1000px]">
          {" "}
          {/* Increased to match UsersDetails min-width */}
          {/* Header Section */}
          <div className="px-0.5 pt-0.5">
            <div className="grid grid-cols-[60px_1.5fr_1.5fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm">
              <span className="text-left">Sr#</span>
              <span className="text-left">Customer Name</span>
              <span className="text-left">Project Name</span>
              <span className="text-left">Sale Date</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>
          {/* Body Section */}
          <div className="px-0.5 py-2">
            {paginatedSales.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedSales.map((sale, index) => (
                  <div
                    key={sale.id}
                    className="grid grid-cols-[60px_1.5fr_1.5fr_1fr_auto] items-center px-3 py-2 gap-3 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Customer - Icons Removed */}
                    <div className="text-gray-800  truncate">
                      {sale.customerName}
                    </div>

                    {/* Project - Icons Removed */}
                    <div className="text-gray-600 truncate">
                      {sale.projectName}
                    </div>

                    {/* Date - Icons Removed */}
                    <div className="text-gray-600 truncate">
                      {new Date(sale.saleDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    {/* Actions - Aligned with UsersDetails style */}
                    <div className="flex items-center justify-end gap-1 w-[140px]">
                      <ViewButton
                        handleView={() => {
                          setSelectedSale(sale);
                          handleToggleViewModal("VIEW");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setCatchId(sale.id);
                          handleToggleViewModal("DELETE");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddSale
          setModal={() => handleToggleViewModal("")}
          handleGetsales={handleGetSales}
        />
      )}
      {isOpenModal === "VIEW" && selectedSale && (
        <ViewSale
          setIsOpenModal={() => handleToggleViewModal("")}
          viewSale={{
            customerName: selectedSale.customerName,
            saleDate: selectedSale.saleDate,
            items: [
              {
                projectName: selectedSale.projectName,
                QTY: selectedSale.QTY,
                UnitPrice: selectedSale.UnitPrice,
              },
            ],
          }}
        />
      )}
      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteSale}
          message="Are you sure you want to delete this sale?"
        />
      )}
    </div>
  );
};
