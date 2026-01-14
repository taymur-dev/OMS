import { Title } from "../Title";
import profilePicture from "../../assets/vector.png";
type CustomerDetailT = {
  id: number;
  customerStatus: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  companyName: string;
  companyAddress: string;
};

type CustomerDetailProps = {
  customerDetail: CustomerDetailT | null;
  setIsOpenModal: () => void;
};
export const CustomerViewModal = ({
  customerDetail,
  setIsOpenModal,
}: CustomerDetailProps) => {
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
         <div className="bg-blue-600 rounded-t-xl px-4">
            <div className="text-white">
              <Title setModal={setIsOpenModal}>CUSTOMER DETAILS</Title>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-white p-6 shadow-md rounded-lg">
            <img
              className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
              src={profilePicture}
              alt="Profile"
            />

            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-800">
                {customerDetail?.customerName}
              </h2>
              <h4 className="text-sm text-gray-500">{"customer"}</h4>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Customer Address:
              </span>
              <p className="text-gray-600">{customerDetail?.customerAddress}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Customer#:
              </span>
              <p className="text-gray-600">{customerDetail?.customerContact}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Company Name:
              </span>
              <p className="text-gray-600">{customerDetail?.companyName}</p>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Company Address:
              </span>
              <p className="text-gray-600">{customerDetail?.companyAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
