import { Title } from "../Title";
import profilePicture from "../../assets/vector.png";

export interface SupplierViewT {
  supplierId: number;
  supplierName: string;
  supplierEmail: string;
  supplierContact: string;
  supplierAddress: string;
}

type ModalTProps = {
  setModal: () => void;
  supplier: SupplierViewT | null;
};

export const ViewSupplierModal = ({ setModal, supplier }: ModalTProps) => {
  if (!supplier) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-900 rounded p-6 shadow-lg">
           <div className="bg-indigo-900 rounded px-4">
            <div className="text-white">
              <Title setModal={setModal}>Supplier Details</Title>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-white p-6 shadow-md rounded-lg">
            <img
              className="w-24 h-24 rounded-full border-4 border-indigo-900 object-cover"
              src={profilePicture}
              alt="Profile"
            />

            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-800">
                {supplier.supplierName}
              </h2>
              <h4 className="text-sm text-gray-500">Supplier</h4>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Email:
              </span>
              <p className="text-gray-600">{supplier.supplierEmail}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Contact:
              </span>
              <p className="text-gray-600">{supplier.supplierContact}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Address:
              </span>
              <p className="text-gray-600">{supplier.supplierAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
