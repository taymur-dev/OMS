import { useMemo } from "react";
import { Title } from "../Title";
import { 
  FaFileInvoice, 
  FaUser, 
  FaCalendarAlt, 
  FaCalculator 
} from "react-icons/fa";

export type CartItem = {
  id: string;
  projectName: string;
  description: string;
  QTY: number;
  UnitPrice: number;
};

type ViewQuotationProps = {
  setModal: () => void;
  quotation: {
    refNo: string;
    customerName: string;
    date: string;
    items: CartItem[];
    subTotal: number;
    totalBill: number;
  };
};

export const ViewQuotation = ({ setModal, quotation }: ViewQuotationProps) => {
  const { refNo, customerName, date, items, subTotal, totalBill } = quotation;

  const formattedDate = useMemo(() => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }, [date]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-300">
        
        {/* Header Section */}
        <div className="bg-indigo-900 rounded px-4">
          <div className="text-white">
            <Title setModal={setModal}>VIEW QUOTATION DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Basic Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              General Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaFileInvoice className="text-gray-400" /> Reference No
                </label>
                <p className="text-gray-800 font-medium">{refNo}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Quotation Date
                </label>
                <p className="text-gray-800 font-medium">{formattedDate}</p>
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUser className="text-gray-400" /> Customer Name
                </label>
                <p className="text-gray-800 font-medium">{customerName}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Items Table */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Project Items
            </h3>
            <div className="mt-2 overflow-hidden border border-gray-100 rounded">
              <div className="grid grid-cols-12 bg-indigo-900 border-b text-white border-gray-200 text-[10px] font-bold text-indigo-900 p-2">
                <span className="col-span-1 text-center">Sr.</span>
                <span className="col-span-5 flex items-center gap-1"> Project Name</span>
                <span className="col-span-2 text-center">QTY</span>
                <span className="col-span-2 text-right">Unit Price</span>
                <span className="col-span-2 text-right">Total</span>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 text-sm p-2 text-gray-700 hover:bg-gray-50 transition-colors">
                    <span className="col-span-1 text-center text-gray-400 font-mono">{index + 1}</span>
                    <span className="col-span-5 font-medium">{item.projectName}</span>
                    <span className="col-span-2 text-center">{item.QTY}</span>
                    <span className="col-span-2 text-right">{item.UnitPrice.toLocaleString()}</span>
                    <span className="col-span-2 text-right font-semibold">{(item.QTY * item.UnitPrice).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Summary */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Billing Summary
            </h3>
            <div className="flex flex-col items-end space-y-2 pt-2">
              <div className="w-full max-w-xs flex justify-between items-center">
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                   Sub Total
                </label>
                <p className="text-gray-800 font-medium">{subTotal.toLocaleString()}</p>
              </div>
              <div className="w-full max-w-xs flex justify-between items-center bg-indigo-50 p-2 rounded border border-indigo-100">
                <label className="flex items-center gap-2 text-[10px] font-bold text-indigo-900 uppercase">
                  <FaCalculator className="text-indigo-400" /> Grand Total
                </label>
                <p className="text-indigo-900 font-bold text-lg">{totalBill.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-indigo-900 p-3 flex justify-end gap-3">
          <button
            onClick={setModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};