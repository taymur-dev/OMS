import { useEffect, useState, useCallback } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { navigationStart, navigationSuccess } from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

const itemsPerPageOptions = [10, 25, 50];

type PAYMENTMETHODT = {
  id: number;
  customerName: string;
  customerId: string;
  amount: string;
  date: string;
};

export const PaymentsReports = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;
  const currentDate = new Date().toISOString().split("T")[0];

  const initialState = { startDate: currentDate, endDate: currentDate, selectCustomer: "" };
  const [reportData, setReportData] = useState(initialState);

  const [allPayment, setAllPayment] = useState<PAYMENTMETHODT[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReportData(prev => ({ ...prev, [name]: value }));
  };

  const handleIncrementPageButton = () => setPageNo(prev => prev + 1);
  const handleDecrementPageButton = () => setPageNo(prev => (prev > 1 ? prev - 1 : 1));

  // Fetch payments dynamically
  const fetchPayments = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getPayments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filtered = res.data as PAYMENTMETHODT[];

      // Filter by date
      filtered = filtered.filter(payment => {
        const paymentDate = payment.date.slice(0, 10);
        return paymentDate >= reportData.startDate && paymentDate <= reportData.endDate;
      });

      // Filter by customer if selected
      if (reportData.selectCustomer) {
        filtered = filtered.filter(payment =>
          payment.customerId.toLowerCase().includes(reportData.selectCustomer.toLowerCase())
        );
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(payment =>
          payment.customerId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setAllPayment(filtered);
    } catch (error) {
      console.log(error);
    }
  }, [token, reportData, searchTerm]);

  useEffect(() => {
    document.title = "(OMS) PAYMENT REPORTS";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("PAYMENT REPORTS")), 1000);
    fetchPayments();
  }, [dispatch, fetchPayments]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Payment Report" activeFile="Payment Report" />

      {/* Top Controls */}
      <div className="flex items-center justify-between text-gray-800 py-2 mx-2">
        <div>
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select>
              {itemsPerPageOptions.map((num, index) => (
                <option key={index} value={num}>{num}</option>
              ))}
            </select>
          </span>
          <span>entries</span>
        </div>
        <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Report Filters */}
      <div className="max-h-[58vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col">
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div className="flex flex-1 px-6 py-2 gap-2 items-center justify-between">
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
            <InputField
              labelName="Customers"
              value={reportData.selectCustomer}
              handlerChange={handleChange}
              name="selectCustomer"
            />
            <div className="mt-4">
              <div className="text-gray-800 flex items-center justify-end mx-7 py-2 font-semibold">
                <span className="mr-1">From</span>
                <span className="text-red-500 mr-1">{reportData.startDate}</span>
                <span className="mr-1">To</span>
                <span className="text-red-500">{reportData.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div id="myDiv" className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div className="grid grid-cols-4 bg-gray-200 text-gray-900 font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[7px]">
            <span>Sr#</span>
            <span>Customer Name</span>
            <span>Payment Amount</span>
            <span>Date</span>
          </div>

          {allPayment.length === 0 ? (
            <div className="p-2 text-center">No data found</div>
          ) : (
            allPayment.map((payment, index) => (
              <div
                className="grid grid-cols-4 border border-gray-600 text-gray-800 hover:bg-gray-100 transition duration-200 text-xs items-center justify-center p-[5px]"
                key={payment.id}
              >
                <span className="px-2">{index + 1}</span>
                <span>{payment.customerId}</span>
                <span>{payment.amount}</span>
                <span>{payment.date.slice(0, 10)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination and Footer */}
      <div className="flex items-center justify-between">
        <ShowDataNumber start={1} total={allPayment.length} end={allPayment.length} />
        <Pagination pageNo={pageNo} handleDecrementPageButton={handleDecrementPageButton} handleIncrementPageButton={handleIncrementPageButton} />
      </div>
    </div>
  );
};
