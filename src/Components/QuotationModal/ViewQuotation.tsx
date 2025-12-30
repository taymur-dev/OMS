import { useMemo } from "react";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[55rem] max-h-[95vh] overflow-y-auto bg-white rounded-2xl ">
        <div className=" bg-indigo-600 text-white p-5 rounded-t-2xl">
          <Title setModal={setModal}>Quotation Details</Title>
          <p className="text-sm opacity-90 mt-1">
            Ref No: <span className="font-semibold">{refNo}</span>
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-500">Customer</p>
              <p className="font-semibold text-gray-800 text-base">
                {customerName}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-500">Quotation Date</p>
              <p className="font-semibold text-gray-800 text-base">
                {formattedDate}
              </p>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-indigo-50 text-sm font-semibold text-center">
              <span className="p-2">Sr</span>
              <span className="p-2">Project</span>
              <span className="p-2">QTY</span>
              <span className="p-2">Unit Price</span>
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-4 text-sm text-center border-t hover:bg-gray-50"
              >
                <span className="p-2">{index + 1}</span>
                <span className="p-2">{item.projectName}</span>
                <span className="p-2">{item.QTY}</span>
                <span className="p-2">{item.UnitPrice}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-sm">
              <div className="flex justify-between bg-gray-100 p-3 rounded">
                <span className="font-semibold">Sub Total</span>
                <span>{subTotal}</span>
              </div>

              <div className="flex justify-between bg-indigo-600 text-white p-3 rounded text-base font-semibold">
                <span>Total Bill</span>
                <span>{totalBill}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <CancelBtn setModal={setModal} />
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
