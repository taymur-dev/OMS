import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";

import { useEffect, useState, useCallback } from "react";
import { AddQuotation } from "../../Components/QuotationModal/AddQuotation";
import { ViewQuotation } from "../../Components/QuotationModal/ViewQuotation";
import { CartItem } from "../../Components/QuotationModal/ViewQuotation";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

const numbers = [10, 25, 50, 100];

type QuotationItem = {
  id: string;
  refNo: string;
  customerName: string;
  date: string;
  items: CartItem[];
  subTotal: number;
  totalBill: number;
  createdAt?: string;
  updatedAt?: string;
};

type QuotationT = "ADD" | "VIEW" | "";

export const Quotation = () => {
  const dispatch = useAppDispatch();

  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<QuotationT>("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationItem | null>(null);

  const [quotations, setQuotations] = useState<QuotationItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValue(Number(event.target.value));
  };

  const handleIncrementPageButton = () => {
    setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleToggleViewModal = (active: QuotationT) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleViewQuotation = async (id: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getQuotation/${id}`, {
        headers: { Authorization: token },
      });

      setSelectedQuotation(res.data);
      handleToggleViewModal("VIEW");
    } catch (error) {
      console.error("Failed to fetch quotation:", error);
    }
  };

  const handleGetQuotations = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getQuotations`, {
        headers: {
          Authorization: token,
        },
      });

      setQuotations(res.data?.data || []);
      setTotalCount(res.data?.data?.length || 0);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    document.title = "(OMS) QUOTATION";
    dispatch(navigationStart());

    setTimeout(() => {
      dispatch(navigationSuccess("QUOTATION"));
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      handleGetQuotations();
    }
  }, [token, handleGetQuotations]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Quotation" activeFile="All Quotation list" />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white
       overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Quotations :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [{totalCount}]
            </span>
          </span>

          <CustomButton
            label="Add Quotation"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={selectedValue} onChange={handleChangeShowData}>
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

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-4 bg-gray-200 text-gray-900 font-semibold border border-gray-600
           text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr</span>
            <span>Ref</span>
            <span>Customer</span>
            <span className="text-center w-28">Actions</span>
          </div>

          {quotations.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-4 border border-gray-600 text-gray-800 hover:bg-gray-100 transition
               duration-200 text-sm items-center p-[7px]"
            >
              <span className="px-2">{index + 1}</span>
              <span>{item.refNo}</span>
              <span>{item.customerName}</span>

              <span className="flex items-center gap-1 justify-center">
                <ViewButton handleView={() => handleViewQuotation(item.id)} />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber start={1} total={totalCount} end={selectedValue} />
        <Pagination
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddQuotation
          setModal={() => handleToggleViewModal("")}
          onAdded={handleGetQuotations}
        />
      )}

      {isOpenModal === "VIEW" && selectedQuotation && (
        <ViewQuotation
          setModal={() => handleToggleViewModal("")}
          quotation={selectedQuotation}
        />
      )}
    </div>
  );
};
