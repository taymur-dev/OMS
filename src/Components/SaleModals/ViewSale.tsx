import { Title } from "../Title";
import { FaRegBuilding, FaUserTie, FaCalendarAlt } from "react-icons/fa";

export type SaleDetailT = {
  projectName: string;
  customerName: string;
  saleDate: string;
};

type ViewSaleProps = {
  setIsOpenModal: () => void;
  viewSale: SaleDetailT | null;
};

export const ViewSale = ({ setIsOpenModal, viewSale }: ViewSaleProps) => {
  const formatDate = (date: string) =>
    date
      ? new Date(date)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-")
      : "N/A";

  if (!viewSale) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl border border-gray-300">
        {/* Header */}
        <div className="bg-indigo-900 px-4">
          <div className="text-white">
            <Title setModal={setIsOpenModal}>SALE DETAILS</Title>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Section 1: Project Information */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Project Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaRegBuilding className="text-gray-400" /> Project Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewSale.projectName}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Customer & Timeline */}
          <div className="border border-gray-200 rounded-md p-4 relative">
            <h3 className="absolute -top-3 left-3 bg-white px-2 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
              Customer & Timeline
            </h3>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaUserTie className="text-gray-400" /> Customer Name
                </label>
                <p className="text-gray-800 font-medium">
                  {viewSale.customerName}
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                  <FaCalendarAlt className="text-gray-400" /> Sale Date
                </label>
                <p className="text-gray-800 font-medium">
                  {formatDate(viewSale.saleDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-indigo-900 p-3 flex justify-end">
          <button
            onClick={setIsOpenModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold py-1 px-8 rounded shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
