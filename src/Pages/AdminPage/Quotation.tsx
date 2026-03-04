import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

import { Loader } from "../../Components/LoaderComponent/Loader";
import { Pagination } from "../../Components/Pagination/Pagination";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { AddQuotation } from "../../Components/QuotationModal/AddQuotation";
import {
  ViewQuotation,
  CartItem,
} from "../../Components/QuotationModal/ViewQuotation";

import { RiInboxArchiveLine } from "react-icons/ri";

type QuotationItem = {
  id: string;
  refNo: string;
  customerName: string;
  invoiceNo: string;
  date: string;
  items: CartItem[];
  subTotal: number;
  totalBill: number;
  createdAt?: string;
  updatedAt?: string;
};

type QuotationT = "ADD" | "VIEW" | "";

interface QuotationProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Quotation = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: QuotationProps) => {
  const dispatch = useAppDispatch();
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<QuotationT>("");
  const [pageNo, setPageNo] = useState(1);
  const [quotations, setQuotations] = useState<QuotationItem[]>([]);
  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationItem | null>(null);

  const handleGetQuotations = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getQuotations`, {
        headers: { Authorization: token },
      });

      setQuotations(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch quotations:", error);
    }
  }, [token]);

  useEffect(() => {
    document.title = "(OMS) QUOTATION";
    dispatch(navigationStart());
    handleGetQuotations().finally(() => {
      dispatch(navigationSuccess("QUOTATION"));
    });
  }, [dispatch, handleGetQuotations]);

  // Reset page number when search or page size changes
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) setIsOpenModal("ADD");
  }, [triggerModal]);

  const handleViewQuotation = async (id: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getQuotation/${id}`, {
        headers: { Authorization: token },
      });
      setSelectedQuotation(res.data);
      setIsOpenModal("VIEW");
    } catch (error) {
      console.error("Failed to fetch quotation details:", error);
    }
  };

  // Logic: Filtering and Pagination
  const filteredQuotations = quotations.filter((item) => {
    const search = externalSearch.toLowerCase();

    return (
      item.refNo.toLowerCase().includes(search) ||
      item.customerName.toLowerCase().includes(search) ||
      item.invoiceNo?.toLowerCase().includes(search)
    );
  });

  const totalNum = filteredQuotations.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedData = filteredQuotations.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    if (pageNo < Math.ceil(totalNum / externalPageSize))
      setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[800px]">
          {/* 1. Header Section - Aligned with UsersDetails */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[60px_1fr_1fr_1fr_auto] bg-blue-400 text-white rounded-lg items-center
           font-bold text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Customer Name</span>
              <span className="text-left">Invoice No</span>
              <span className="text-left">Ref Number</span>
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          {/* 2. Body Section */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedData.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No quotations found!</p>
                <p className="text-sm">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedData.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[60px_1fr_1fr_1fr_auto] items-center px-3 py-2 gap-3 text-sm bg-white border
                   border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-600 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <span className="text-gray-600 truncate">
                      {item.customerName}
                    </span>

                    <span className="text-gray-600 truncate">
                      {item.invoiceNo}
                    </span>

                    <span className=" text-gray-600 truncate">
                      {item.refNo}
                    </span>

                    <div className="flex items-center justify-end gap-1 w-[140px] pr-5">
                      <ViewButton
                        handleView={() => handleViewQuotation(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Pagination Footer */}
      <div className="flex flex-row items-center justify-between p-1 mt-auto border-t border-gray-50">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      {/* --- MODALS --- */}
      {isOpenModal === "ADD" && (
        <AddQuotation
          setModal={() => setIsOpenModal("")}
          onAdded={handleGetQuotations}
        />
      )}

      {isOpenModal === "VIEW" && selectedQuotation && (
        <ViewQuotation
          setModal={() => setIsOpenModal("")}
          quotation={selectedQuotation}
        />
      )}
    </div>
  );
};
