import React, { useEffect, useState, useCallback } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { Title } from "../Title";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { TextareaField } from "../InputFields/TextareaField";

import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
  handleGetPayments: () => void;
};

type CustomerT = {
  id: number;
  customerName: string;
};

const today = new Date();
const currentDate = today.toLocaleDateString("en-CA");

const initialState = {
  paymentMethod: "cash",
  customerId: "",
  description: "",
  amount: "",
  date: currentDate,
};
export const AddPayment = ({
  setModal,
  handleGetPayments,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addProgress, setAddProgress] = useState(initialState);

  console.log(addProgress);

  const [allCustomers, setAllCustomers] = useState<CustomerT[] | null>(null);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    e.preventDefault();

    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "amount") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    if (name === "description") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    setAddProgress({ ...addProgress, [name]: updatedValue });
  };

  const getAllCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllCustomers(res?.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !addProgress.customerId ||
      !addProgress.amount ||
      !addProgress.date ||
      !addProgress.description
    ) {
      return toast.error(
        "Customer, Amount, Date, and Description are required",
        { toastId: "required-fields" },
      );
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addPayment`,
        addProgress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);
      handleGetPayments();
      toast.success("Payment added successfully", {
        toastId: "payment-success",
      });

      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add payment", {
          toastId: "payment-error",
        });
      } else {
        toast.error("Something went wrong!", { toastId: "payment-error" });
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, [getAllCustomers]);
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs px-4   flex items-center justify-center z-50">
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded border  border-indigo-900 ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD PAYMENT
              </Title>
            </div>

            <div className="mx-3  pt-3 py-2 flex lg:flex-row flex-cols items-center  text-gray-800  ">
              <h1 className="text-lg font-semibold underline ">
                Account Type *
              </h1>
              <div className=" ml-5 lg:space-x-2 space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="radio border-gray-500 text-indigo-900"
                  value={"cash"}
                  checked={addProgress?.paymentMethod === "cash"}
                  onChange={handlerChange}
                />
                <label>Cash</label>
                <input
                  type="radio"
                  name="paymentMethod"
                  className="radio border-gray-500 text-indigo-900"
                  value={"bankTransfer"}
                  checked={addProgress?.paymentMethod === "bankTransfer"}
                  onChange={handlerChange}
                />
                <label>Bank Transfer</label>
              </div>
            </div>
            <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3  ">
              <OptionField
                labelName="Select Customer *"
                name="customerId"
                handlerChange={handlerChange}
                value={addProgress.customerId}
                optionData={allCustomers?.map((customer) => ({
                  id: customer.id,
                  label: customer.customerName,
                  value: customer.id,
                }))}
                inital="Please Select Customer"
              />

              <InputField
                labelName="Amount *"
                name="amount"
                handlerChange={handlerChange}
                value={addProgress.amount}
              />

              <InputField
                labelName="Date *"
                name="date"
                type="date"
                handlerChange={handlerChange}
                value={addProgress.date}
              />

              <TextareaField
                labelName="Description *"
                name="description"
                handlerChange={handlerChange}
                inputVal={addProgress.description}
              />
            </div>

            <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
