import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type PAYMENTMETHODT = {
  id: number;
  customerId: string;
  amount: string;
  paymentMethod: string;
  description: string;
  date: string;
};

type CustomerT = {
  id: number;
  customerName: string;
};

type EditPaymentProps = {
  setModal: () => void;
  selectPayment: PAYMENTMETHODT | null;
  handleGetPayments: () => void;
};

export const EditPayment = ({
  setModal,
  selectPayment,
  handleGetPayments,
}: EditPaymentProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [updatePayment, setUpdatePayment] = useState<PAYMENTMETHODT>({
    id: selectPayment?.id || 0,
    customerId: selectPayment?.customerId?.toString() || "",
    amount: selectPayment?.amount || "",
    paymentMethod: selectPayment?.paymentMethod || "cash",
    description: selectPayment?.description || "",
    date: selectPayment?.date ? selectPayment.date.split("T")[0] : "",
  });

  const [allCustomers, setAllCustomers] = useState<CustomerT[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUpdatePayment((prev) => ({ ...prev, [name]: value }));
  };

  const getAllCustomers = useCallback(async () => {
    try {
      setLoadingCustomers(true);
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCustomers(res.data);
    } catch (error) {
      console.error("Fetch Customers Error:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoadingCustomers(false);
    }
  }, [token]);

  useEffect(() => {
    getAllCustomers();
  }, [getAllCustomers]);

  useEffect(() => {
    if (selectPayment && allCustomers.length) {
      setUpdatePayment((prev) => ({
        ...prev,
        customerId: selectPayment.customerId.toString(),
      }));
    }
  }, [selectPayment, allCustomers]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formattedDate = updatePayment.date
        ? updatePayment.date.split("T")[0]
        : null;

      await axios.put(
        `${BASE_URL}/api/admin/updatePayment/${updatePayment.id}`,
        {
          ...updatePayment,
          customerId: Number(updatePayment.customerId),
          date: formattedDate,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Payment updated successfully");
      handleGetPayments();
      setModal();
    } catch (error) {
      console.error("Update Payment Error:", error);
      toast.error("Failed to update payment");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[80rem] bg-white mx-auto rounded-xl border border-indigo-900 overflow-y-auto">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Edit Payment
            </Title>
          </div>

          <div className="mx-3 pt-3 flex lg:flex-row flex-col items-center text-gray-800">
            <h1 className="text-lg font-semibold underline">Account Type*</h1>
            <div className="ml-5 lg:space-x-2 py-2 space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={updatePayment.paymentMethod === "cash"}
                onChange={handlerChange}
              />
              <label>Cash</label>

              <input
                type="radio"
                name="paymentMethod"
                value="bankTransfer"
                checked={updatePayment.paymentMethod === "bankTransfer"}
                onChange={handlerChange}
              />
              <label>Bank Transfer</label>
            </div>
          </div>

          <div className="mx-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            {!loadingCustomers && (
              <OptionField
                labelName="Select Customer"
                name="customerId"
                value={updatePayment.customerId}
                handlerChange={handlerChange}
                optionData={
                  loadingCustomers
                    ? [{ id: 0, label: "Loading customers...", value: "" }]
                    : allCustomers.map((customer) => ({
                        id: customer.id,
                        label: customer.customerName,
                        value: customer.id.toString(),
                      }))
                }
                inital={
                  loadingCustomers ? "Loading..." : "Please Select Customer"
                }
              />
            )}

            <InputField
              labelName="Description*"
              name="description"
              value={updatePayment.description}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Amount*"
              name="amount"
              value={updatePayment.amount}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Date*"
              name="date"
              type="date"
              value={updatePayment.date}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};
