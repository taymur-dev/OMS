import { RiContactsBookLine, RiMailLine, RiPhoneLine } from "react-icons/ri";

import { Title } from "../Title";
import { CancelBtn } from "../CustomButtons/CancelBtn";

export type BusinessDetailT = {
  name: string;
  email: string;
  contact: string;
  logo?: string;
};

interface ViewBusinessProps {
  viewData: BusinessDetailT | null;
  setModal: () => void;
}

export const ViewBusinessVariable = ({
  viewData,
  setModal,
}: ViewBusinessProps) => {
  if (!viewData) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur px-4 flex items-center justify-center z-50">
      <div className="w-full max-w-md overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <div className="bg-white rounded-xl border-t-5 border-blue-400">
          <Title
            setModal={setModal}
            className="text-white text-lg font-semibold"
          >
            VIEW BUSINESS VARIABLE
          </Title>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-2xl border-4 border-gray-50 shadow-inner flex items-center justify-center overflow-hidden bg-gray-100 mb-3">
              {viewData.logo ? (
                <img
                  src={viewData.logo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <RiContactsBookLine size={40} className="text-gray-300" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{viewData.name}</h3>
           
          </div>

          {/* Details List */}
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-4">
                <RiMailLine size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold">
                  Email Address
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  {viewData.email}
                </span>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="bg-green-100 p-2 rounded-lg text-green-600 mr-4">
                <RiPhoneLine size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-400 font-bold">
                  Contact Number
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  {viewData.contact}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4  shadow-md bg-gray-50 rounded-b-xl">
          <CancelBtn setModal={setModal} />
        </div>
      </div>
    </div>
  );
};
