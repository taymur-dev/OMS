import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { BASE_URL } from "../../Content/URL";

// Components
import { Loader } from "../../Components/LoaderComponent/Loader";
import { AddCustomer } from "../../Components/CustomerComponents/AddCustomerForm";
import { CustomerViewModal } from "../../Components/CustomerComponents/CustomerViewModal";
import { UpdateCustomer } from "../../Components/CustomerComponents/UpdateCustomer";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

// Icons
import {
  RiMapPinLine,
  RiBuilding4Line,
  RiInboxArchiveLine,
  RiUserFill,
} from "react-icons/ri";

type AllcustomerT = {
  id: number;
  customerStatus: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  companyName: string;
  companyAddress: string;
};

interface CustomerDetailProps {
  triggerAdd: number;
  externalSearch: string;
  externalPageSize: number;
}

export const CustomerDetail = ({
  triggerAdd,
  externalSearch,
  externalPageSize,
}: CustomerDetailProps) => {
  const [isOpenModal, setIsOpenModal] = useState<
    "ADD" | "UPDATE" | "VIEW" | "DELETE" | ""
  >("");
  const [allCustomers, setAllCustomers] = useState<AllcustomerT[]>([]);
  const [customerDetail, setCustomerDetail] = useState<AllcustomerT | null>(
    null,
  );
  const [pageNo, setPageNo] = useState(1);
  const [catchId, setCatchId] = useState<number | null>(null);

  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;
  const { loader } = useAppSelector((state) => state?.NavigateState);
  const dispatch = useAppDispatch();

  const handleGetAllCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: { Authorization: token },
      });
      const sorted = res.data.sort(
        (a: AllcustomerT, b: AllcustomerT) => a.id - b.id,
      );
      setAllCustomers(sorted);
    } catch (error) {
      console.error(error);
      toast.error("No customers available yet!");
    }
  }, [token]);

  useEffect(() => {
    document.title = "(OMS) Customer Detail";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("Customer")), 1000);
    handleGetAllCustomers();
  }, [dispatch, handleGetAllCustomers]);

  useEffect(() => {
    if (triggerAdd && triggerAdd > 0) setIsOpenModal("ADD");
  }, [triggerAdd]);

  // Reset page when search or size changes
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  if (loader) return <Loader />;

  const filteredCustomers = allCustomers.filter((customer) => {
    const combined =
      `${customer.customerName} ${customer.customerAddress} ${customer.customerContact} ${customer.companyName}`.toLowerCase();
    return combined.includes(externalSearch.toLowerCase());
  });

  const totalNum = filteredCustomers.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handleDeleteCustomer = async (id: number | null) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteCustomer/${id}`,
        {},
        {
          headers: { Authorization: token },
        },
      );
      handleGetAllCustomers();
      toast.success("Customer deleted successfully");
      setIsOpenModal("");
    } catch (error) {
      console.log(error);

      toast.error("Cannot delete this customer");
    }
  };

  const gridLayout =
    "grid grid-cols-[60px_1.5fr_1.5fr_1.2fr_1.2fr_120px] gap-4 items-center";

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      <div className="overflow-auto">
        <div className="min-w-[1100px]">
          {/* Header Grid */}
          <div className="px-4 pt-0.5">
            <div
              className={`${gridLayout} bg-blue-400 text-white rounded-lg items-center font-bold
    text-xs  tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm`}
            >
              <span>Sr#</span>
              <span>Name & Contact</span>
              <span>Address</span>
              <span>Company</span>
              <span>Comp. Address</span>
              <span className="text-center">Actions</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="px-4 py-2">
            {paginatedCustomers.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    className={`${gridLayout} p-1 text-sm bg-white border border-gray-100 rounded-lg
                     hover:bg-blue-50/30 transition-colors shadow-sm`}
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center
                                    text-white flex-shrink-0 overflow-hidden border-2 border-gray-100 shadow-sm"
                      >
                        <RiUserFill size={28} />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="truncate font-semibold text-gray-800 text-sm">
                          {customer.customerName}
                        </span>
                        <span className="truncate text-gray-400 text-xs">
                          {customer.customerContact}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiMapPinLine
                        className="text-orange-400 flex-shrink-0"
                        size={14}
                      />
                      <span className="truncate">
                        {customer.customerAddress}
                      </span>
                    </div>

                    

                    <div className="flex items-center gap-2 text-gray-600">
                      <RiBuilding4Line
                        className="text-red-400 flex-shrink-0"
                        size={14}
                      />
                      <span className="truncate">{customer.companyName}</span>
                    </div>

                    <div className="truncate text-gray-500 italic">
                      {customer.companyAddress}
                    </div>

                    <div className="flex items-center justify-end gap-1 pr-2">
                      <ViewButton
                        handleView={() => {
                          setCustomerDetail(customer);
                          setIsOpenModal("VIEW");
                        }}
                      />
                      <EditButton
                        handleUpdate={() => {
                          setCustomerDetail(customer);
                          setIsOpenModal("UPDATE");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setCatchId(customer.id);
                          setIsOpenModal("DELETE");
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
      <div className="flex flex-row items-center justify-between py-4 px-4">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() =>
            setPageNo((prev) => Math.max(prev - 1, 1))
          }
          handleIncrementPageButton={() =>
            setPageNo((prev) => (endIndex < totalNum ? prev + 1 : prev))
          }
        />
      </div>

      {/* Modals */}
      {isOpenModal === "ADD" && (
        <AddCustomer
          setIsOpenModal={() => setIsOpenModal("")}
          handleGetAllCustomers={handleGetAllCustomers}
        />
      )}
      {isOpenModal === "UPDATE" && (
        <UpdateCustomer
          setIsOpenModal={() => setIsOpenModal("")}
          handleGetAllCustomers={handleGetAllCustomers}
          customerDetail={customerDetail}
        />
      )}
      {isOpenModal === "VIEW" && (
        <CustomerViewModal
          setIsOpenModal={() => setIsOpenModal("")}
          customerDetail={customerDetail}
        />
      )}
      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("DELETE")}
          onClose={() => setIsOpenModal("")}
          onConfirm={() => handleDeleteCustomer(catchId)}
          message="Are you sure you want to delete this Customer?"
        />
      )}
    </div>
  );
};
