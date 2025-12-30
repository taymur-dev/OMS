import { Title } from "../Title";

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
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Sale Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Project Name:
              </span>
              <p className="text-gray-600">{viewSale?.projectName}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Customer Name:
              </span>
              <p className="text-gray-600">{viewSale?.customerName}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">Date:</span>
              <p className="text-gray-600">
                {viewSale ? formatDate(viewSale.saleDate) : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
