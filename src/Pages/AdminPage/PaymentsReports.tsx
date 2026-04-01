import { useEffect, useState, useCallback, useMemo } from "react";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { Loader } from "../../Components/LoaderComponent/Loader";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  RiInboxArchiveLine,
  RiCalendarLine,
  RiUserFill,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

type CustomerT = {
  id: number;
  customerName: string;
};

type PaymentT = {
  id: number;
  customerId: string;
  customerName?: string;
  amount: string;
  date: string;
};

interface PaymentsReportsProps {
  externalSearch?: string;
  externalPageSize?: number;
}

export const PaymentsReports = ({
  externalSearch = "",
  externalPageSize = 10,
}: PaymentsReportsProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [getCustomers, setGetCustomers] = useState<CustomerT[]>([]);
  const [reportData, setReportData] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    customerId: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    customerId: "",
  });

  const [pageNo, setPageNo] = useState(1);
  const [payments, setPayments] = useState<PaymentT[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({
      startDate: reportData.startDate,
      endDate: reportData.endDate,
      customerId: reportData.customerId,
    });
    setPageNo(1);
  };

  // Reset page when search or page size changes from parent
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: { Authorization: token },
      });
      setGetCustomers(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const fetchPayments = useCallback(async () => {
    try {
      dispatch(navigationStart());
      const res = await axios.get(`${BASE_URL}/api/admin/getPayments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedPayments = res.data.map((p: PaymentT) => ({
        ...p,
        customerName:
          getCustomers.find((c) => c.id.toString() === p.customerId)
            ?.customerName || p.customerId,
        date: new Date(p.date).toLocaleDateString("sv-SE"),
      }));

      setPayments(mappedPayments);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("PAYMENT REPORTS"));
    }
  }, [dispatch, token, getCustomers]);

  useEffect(() => {
    fetchCustomers();
    document.title = "(OMS) PAYMENT REPORTS";
  }, [fetchCustomers]);

  useEffect(() => {
    if (getCustomers.length > 0) {
      fetchPayments();
    }
  }, [getCustomers, fetchPayments]);

  const filteredPayments = useMemo(() => {
    return payments
      .filter(
        (p) =>
          externalSearch === "" ||
          p.customerName
            ?.toLowerCase()
            .includes(externalSearch.toLowerCase()) ||
          p.amount.includes(externalSearch),
      )
      .filter((p) =>
        appliedFilters.customerId
          ? p.customerId === appliedFilters.customerId
          : true,
      )
      .filter(
        (p) =>
          p.date >= appliedFilters.startDate &&
          p.date <= appliedFilters.endDate,
      );
  }, [payments, externalSearch, appliedFilters]);

  const totalNum = filteredPayments.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + externalPageSize,
  );

  const printDiv = () => {
    // ... (Keep your existing printDiv logic here)
    const printStyles = `
      @page { size: A4 portrait; }
      body { font-family: Arial, sans-serif; font-size: 11pt; color: #000; }
      .print-container { width: 100%; padding: 0; }
      .print-header { text-align: center; }
      .print-header h1 { font-size: 25pt; font-weight: bold; }
      .print-header h2 { font-size: 20pt; font-weight: normal; }
      .date-range { text-align: left; font-size: 14pt; display: flex; justify-content: space-between; }
      table { width: 100%; border-collapse: collapse; border: 2px solid #000; }
      thead { background-color: #ccc; color: #000; }
      thead th, tbody td { border: 2px solid #000; font-size: 10pt; text-align: left; }
      tbody tr:nth-child(even) { background-color: #f9f9f9; }
      @media print { .no-print { display: none; } }
    `;
    const content = document.getElementById("myDiv")?.outerHTML || "";
    document.body.innerHTML = `
      <div class="print-container">
        <div class="print-header"><h1>Office Management System</h1><h2>Payment Report</h2></div>
        <div class="date-range"><strong>From: ${appliedFilters.startDate}</strong><strong>To: ${appliedFilters.endDate}</strong></div>
        ${content}
      </div>
    `;
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(printStyles));
    document.head.appendChild(style);
    window.print();
    location.reload();
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* --- FILTER SECTION --- */}
      <div className="p-3 bg-white border-b border-gray-100">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
            <InputField
              labelName="From"
              type="date"
              value={reportData.startDate}
              handlerChange={handleChange}
              name="startDate"
            />
            <InputField
              labelName="To"
              type="date"
              value={reportData.endDate}
              handlerChange={handleChange}
              name="endDate"
            />
            <OptionField
              labelName="Customer"
              name="customerId"
              value={reportData.customerId}
              optionData={getCustomers?.map((c) => ({
                id: c.id,
                label: c.customerName,
                value: c.id.toString(),
              }))}
              inital="Please Select Customer"
              handlerChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-grow lg:flex-grow-0 min-w-full lg:min-w-fit">
            <button
              onClick={handleSearch}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg shadow flex-1 flex items-center justify-center
               whitespace-nowrap text-sm font-bold"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" /> Search
            </button>
            <button
              onClick={printDiv}
              className="bg-blue-400 text-white px-6 py-3 rounded-lg shadow flex-1 flex items-center justify-center
               whitespace-nowrap text-sm font-bold"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* --- TABLE AREA --- */}
      <div className="overflow-auto px-3 sm:px-0 flex-grow mt-2">
        <div className="min-w-[1000px]">
          {/* Header Row */}
          <div className="px-0.5 pt-0.5">
            <div className="grid grid-cols-[80px_1fr_1fr_1fr] bg-blue-400 text-white rounded-lg items-center font-bold text-xs tracking-wider sticky top-0 z-10 gap-4 px-4 py-3 shadow-sm">
              <span>Sr#</span>
              <span>Customer Name</span>
              <span>Amount Paid</span>
              <span>Payment Date</span>
            </div>
          </div>

          {/* Body Rows */}
          <div className="px-0.5 sm:px-1 py-2">
            {paginatedPayments.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">
                  Try adjusting your date range or search term.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2" id="myDiv">
                {paginatedPayments.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="grid grid-cols-[80px_1fr_1fr_1fr] items-center p-1.5 gap-4 text-sm bg-white border border-gray-100 rounded-lg hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="pl-2 text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <RiUserFill size={16} />
                      </div>
                      <span className="font-semibold text-gray-800">
                        {payment.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 font-bold">
                      <RiMoneyDollarCircleLine
                        className="text-green-500"
                        size={18}
                      />
                      <span>{payment.amount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <RiCalendarLine className="text-blue-400" size={16} />
                      <span>{payment.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="flex flex-row items-center justify-between p-2 border-t border-gray-100">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(startIndex + externalPageSize, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          totalNum={totalNum}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
        />
      </div>
    </div>
  );
};
