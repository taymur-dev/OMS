import { Title } from "../Title";

export type PaymentDetailT = {
  customerId: string;
  amount: string;
  paymentMethod: string;
  description?: string;
  date: string;
};

type ViewPaymentProps = {
  setIsOpenModal: () => void;
  viewPayment: PaymentDetailT | null;
};

export const ViewPayment = ({
  setIsOpenModal,
  viewPayment,
}: ViewPaymentProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Payment Detail</Title>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Customer:
              </span>
              <p className="text-gray-600">{viewPayment?.customerId}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Amount:
              </span>
              <p className="text-gray-600">{viewPayment?.amount}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Payment Method:
              </span>
              <p className="text-gray-600">{viewPayment?.paymentMethod}</p>
            </div>

            {viewPayment?.description && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Description:
                </span>
                <p className="text-gray-600">{viewPayment.description}</p>
              </div>
            )}

            {viewPayment?.date && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Date:
                </span>
                <p className="text-gray-600">{viewPayment.date.slice(0, 10)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
