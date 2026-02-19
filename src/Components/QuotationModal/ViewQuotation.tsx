import { useMemo } from "react";
import { Title } from "../Title";
import {
  FaFileInvoice,
  FaUser,
  FaCalendarAlt,
  FaCalculator,
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center z-50">
      <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-indigo-900 px-4 sm:px-6 ">
          <div className="text-white text-sm sm:text-base">
            <Title setModal={setModal}>VIEW QUOTATION DETAILS</Title>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* General Info */}
          <div className="border border-gray-200 rounded-lg p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
              General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                  <FaFileInvoice /> Reference No
                </label>
                <p className="text-gray-800 font-medium break-words">{refNo}</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                  <FaCalendarAlt /> Quotation Date
                </label>
                <p className="text-gray-800 font-medium">{formattedDate}</p>
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                  <FaUser /> Customer Name
                </label>
                <p className="text-gray-800 font-medium break-words">
                  {customerName}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-200 rounded-lg p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Project Items
            </h3>

            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[600px] border border-gray-100 rounded-md">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-indigo-900 text-white text-xs font-semibold p-2">
                  <span className="col-span-1 text-center">#</span>
                  <span className="col-span-5">Project</span>
                  <span className="col-span-2 text-center">QTY</span>
                  <span className="col-span-2 text-right">Unit</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>

                {/* Table Body */}
                <div className="divide-y">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 text-sm p-2 hover:bg-gray-50"
                    >
                      <span className="col-span-1 text-center text-gray-400">
                        {index + 1}
                      </span>
                      <span className="col-span-5 font-medium break-words">
                        {item.projectName}
                      </span>
                      <span className="col-span-2 text-center">{item.QTY}</span>
                      <span className="col-span-2 text-right">
                        {item.UnitPrice.toLocaleString()}
                      </span>
                      <span className="col-span-2 text-right font-semibold">
                        {(item.QTY * item.UnitPrice).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="border border-gray-200 rounded-lg p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Billing Summary
            </h3>

            <div className="pt-4 flex justify-end">
              <div className="w-full sm:w-80 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-600 uppercase">
                    Sub Total
                  </span>
                  <span className="font-medium">
                    {subTotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-md border border-indigo-200">
                  <span className="flex items-center gap-2 font-bold text-indigo-900 uppercase text-sm">
                    <FaCalculator /> Grand Total
                  </span>
                  <span className="text-indigo-900 font-bold text-lg">
                    {totalBill.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Footer */}
        <div className="bg-indigo-900 p-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={setModal}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2 px-6 rounded-md transition"
          >
            Close
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-6 rounded-md transition"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};
