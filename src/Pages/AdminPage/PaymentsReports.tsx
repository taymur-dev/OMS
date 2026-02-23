import { useEffect, useState, useCallback, useMemo } from "react";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { Loader } from "../../Components/LoaderComponent/Loader";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { navigationStart, navigationSuccess } from "../../redux/NavigationSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPrint } from "@fortawesome/free-solid-svg-icons";

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

export const PaymentsReports = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [selectedValue] = useState(10);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<PaymentT[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleIncrementPageButton = () => setPageNo((p) => p + 1);
  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

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
        customerName: getCustomers.find((c) => c.id.toString() === p.customerId)?.customerName || p.customerId,
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
      .filter((p) =>
        searchTerm === "" ||
        p.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((p) =>
        appliedFilters.customerId ? p.customerId === appliedFilters.customerId : true
      )
      .filter((p) =>
        p.date >= appliedFilters.startDate && p.date <= appliedFilters.endDate
      );
  }, [payments, searchTerm, appliedFilters]);

  const printDiv = () => {
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
  <div className="flex flex-col flex-grow bg-gray overflow-hidden">
    <div className="min-h-screen w-full flex flex-col  bg-white">


      {/* --- FILTER SECTION --- */}
      <div className="p-2 bg-white">
        <div className="flex flex-wrap items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow min-w-[300px]">
          
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
              optionData={getCustomers?.map((customer) => ({
                id: customer.id,
                label: customer.customerName,
                value: customer.id.toString(),
              }))}
              inital="Please Select Customer"
              handlerChange={handleChange}
            />
          </div>

          {/* Buttons Container: Matches Sales Report wrapping logic */}
          <div className="flex gap-2 flex-grow lg:flex-grow-0 min-w-full lg:min-w-fit">
            <button
              onClick={handleSearch}
              className="bg-indigo-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center justify-center whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Search
            </button>

            <button
              onClick={printDiv}
              className="bg-blue-900 text-white px-6 py-3 rounded-xl shadow flex-1 flex items-center justify-center whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* --- SUB-HEADER SECTION (Search & Info) --- */}
      <div className="p-2">
        <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
          <div className="text-sm font-bold text-gray-600">
            From: <span className="text-black">{appliedFilters.startDate}</span>{" "}
            To: <span className="text-black">{appliedFilters.endDate}</span>
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      {/* --- MIDDLE SECTION (Scrollable Table) --- */}
      <div className="overflow-auto">
        <div id="myDiv" className="min-w-[800px]">
          {/* Sticky Table Header */}
          <div className="grid grid-cols-4 bg-indigo-900 text-white items-center font-semibold text-sm sticky top-0 z-10 p-2">
            <span>Sr#</span>
            <span>Customer</span>
            <span>Payment Amount</span>
            <span>Date</span>
          </div>

          {/* Table Body */}
          {filteredPayments.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-10 border-x border-b border-gray-200">
              No records available at the moment!
            </div>
          ) : (
            filteredPayments
              .slice((pageNo - 1) * selectedValue, pageNo * selectedValue)
              .map((payment, index) => (
                <div
                  key={payment.id}
                  className="grid grid-cols-4 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                  <span className="truncate">{payment.customerName}</span>
                  <span className="truncate">{payment.amount}</span>
                  <span>{payment.date}</span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
        <ShowDataNumber
          start={
            filteredPayments.length === 0
              ? 0
              : (pageNo - 1) * selectedValue + 1
          }
          end={Math.min(pageNo * selectedValue, filteredPayments.length)}
          total={filteredPayments.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>
    </div>

   
  </div>
);
};