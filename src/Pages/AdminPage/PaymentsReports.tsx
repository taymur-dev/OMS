import { useEffect, useState, useCallback, useMemo } from "react";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
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

const itemsPerPageOptions = [10, 25, 50, 100];

export const PaymentsReports = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [selectedValue, setSelectedValue] = useState(10);
  const [getCustomers, setGetCustomers] = useState<CustomerT[]>([]);
  const [reportData, setReportData] = useState({
    startDate: new Date().toLocaleDateString("sv-SE"),
    endDate: new Date().toLocaleDateString("sv-SE"),
    customerId: "",
  });
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState<PaymentT[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
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

      // Map customerName from customer list
      const mappedPayments = res.data.map((p: PaymentT) => ({
        ...p,
        customerName:
          getCustomers.find((c) => c.id.toString() === p.customerId)?.customerName ||
          p.customerId,
        date: new Date(p.date).toLocaleDateString("sv-SE"),
      }));

      setPayments(mappedPayments);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("PAYMENT REPORTS"));
    }
  }, [dispatch, token, getCustomers]);

  // Fetch customers first, then payments
  useEffect(() => {
    const fetchData = async () => {
      await fetchCustomers();
    };
    fetchData();
  }, [fetchCustomers]);

  useEffect(() => {
    if (getCustomers.length > 0) {
      fetchPayments();
    }
  }, [getCustomers, fetchPayments]);

  const filteredPayments = useMemo(() => {
    return payments
      .filter((p) =>
        !reportData.customerId || p.customerId === reportData.customerId
      )
      .filter(
        (p) =>
          p.date >= reportData.startDate && p.date <= reportData.endDate
      )
      .filter(
        (p) =>
          searchTerm === "" ||
          p.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [payments, reportData, searchTerm]);

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
      .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10pt; padding: 10px 0; border-top: 1px solid #ccc; }
      @media print { .no-print { display: none; } }
    `;
    const content = document.getElementById("myDiv")?.outerHTML || "";
    document.body.innerHTML = `
      <div class="print-container">
        <div class="print-header">
          <h1>Office Management System</h1>
          <h2>Payment Report</h2>
        </div>
        <div class="date-range">
          <strong>From: ${reportData.startDate}</strong>
          <strong>To: ${reportData.endDate}</strong>
        </div>
        ${content}
        <div class="footer"></div>
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
    <div className="w-full mx-2">
      <TableTitle tileName="Payment Report" activeFile="Payment Report" />

      <div className="flex items-center justify-between text-gray-800 py-2 mx-2">
        <div>
          <span>Show</span>
          <span className="bg-gray-200 rounded mx-1 p-1">
            <select value={selectedValue} onChange={handleChangeShowData}>
              {itemsPerPageOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </span>
          <span>entries</span>
        </div>
        <TableInputField searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="max-h-[58vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div className="flex flex-1 py-1 gap-1 items-center justify-center">
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
              optionData={getCustomers.map((customer) => ({
                id: customer.id,
                label: customer.customerName,
                value: customer.id.toString(),
              }))}
              inital="Please Select Customer"
              handlerChange={handleChange}
            />
            <div className="w-full flex justify-end mt-4">
              <div className="text-gray-800 flex items-center py-2 font-semibold">
                <span className="mr-1">From</span>
                <span className="text-red-500 mr-1">{reportData.startDate}</span>
                <span className="mr-1">To</span>
                <span className="text-red-500">{reportData.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div id="myDiv" className=" max-h-[28.4rem] overflow-y-auto mx-2">
          <div className="grid grid-cols-4 bg-indigo-900 text-white font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[7px]">
            <span>Sr#</span>
            <span>Customer</span>
            <span>Payment Amount</span>
            <span>Date</span>
          </div>

          {filteredPayments
            .slice((pageNo - 1) * selectedValue, pageNo * selectedValue)
            .map((payment, index) => (
              <div
                key={payment.id}
                className="grid grid-cols-4 border border-gray-600 text-gray-800 hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[5px]"
              >
                <span>{(pageNo - 1) * selectedValue + index + 1}</span>
                <span>{payment.customerName}</span>
                <span>{payment.amount}</span>
                <span>{payment.date}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber
          start={(pageNo - 1) * selectedValue + 1}
          end={Math.min(pageNo * selectedValue, filteredPayments.length)}
          total={filteredPayments.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

      <div className="flex items-center justify-center mt-4">
        <button
          onClick={printDiv}
          className="bg-green-500 text-white py-2 px-4 rounded font-semibold hover:cursor-pointer"
        >
          Download
        </button>
      </div>
    </div>
  );
};
