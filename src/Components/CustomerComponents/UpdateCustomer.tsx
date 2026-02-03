import { useState, useEffect } from "react";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";

import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import axios from "axios";
import { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
type CustomerT = {
  id: number;
  customerStatus: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  companyName: string;
  companyAddress: string;
};
type AddCustomerProps = {
  setIsOpenModal: () => void;
  handleGetAllCustomers: () => void;
  customerDetail: CustomerT | null;
};

export const UpdateCustomer = ({
  setIsOpenModal,
  handleGetAllCustomers,
  customerDetail,
}: AddCustomerProps) => {
  const [customerData, setCustomerData] = useState<CustomerT | null>(null);
  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;

  // Change the type of 'e' to accept both Input and TextArea
  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // e.preventDefault(); // Note: preventDefault is usually not needed for onChange
    const { name, value } = e.target;
    let updatedValue = value;

    if (
      name === "customerName" ||
      name === "customerAddress" ||
      name === "companyName" ||
      name === "companyAddress"
    ) {
      updatedValue = updatedValue.replace(/\b\w/g, (char) =>
        char.toUpperCase(),
      );
    }

    if (name === "customerContact") {
      updatedValue = updatedValue.replace(/\D/g, "").slice(0, 11);
    }

    setCustomerData(
      (prev) =>
        ({
          ...prev,
          [name]: updatedValue,
        }) as CustomerT,
    );
  };

  useEffect(() => {
    if (customerDetail) {
      setCustomerData(customerDetail);
    }
  }, [customerDetail]);

  const handlerSubmitted = async (
    e: React.FormEvent<HTMLFormElement>,
    customerId: number | null,
  ) => {
    e.preventDefault();

    if (!customerData) return;

    const {
      customerName,
      customerAddress,
      customerContact,
      companyName,
      companyAddress,
    } = customerData;

    if (
      !customerName ||
      !customerAddress ||
      !customerContact ||
      !companyName ||
      !companyAddress
    ) {
      toast.error("All fields are required");
      return;
    }

    if (!/^\d{11}$/.test(customerContact)) {
      toast.error("Contact must be 11 digits");
      return;
    }

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/admin/updateCustomer/${customerId}`,
        customerData,
        {
          headers: { Authorization: token || "" },
        },
      );
      toast.success(res.data.message);
      setIsOpenModal();
      handleGetAllCustomers();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex px-4 items-center justify-center z-50">
      <div className="w-[42rem] max-h-[50rem] bg-white rounded border border-indigo-900 shadow-lg overflow-hidden">
        <form
          onSubmit={(e) => handlerSubmitted(e, customerData?.id ?? null)}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              EDIT CUSTOMER
            </Title>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              labelName="Customer Name *"
              type="text"
              name="customerName"
              handlerChange={handlerChange}
              value={customerData?.customerName || ""}
            />

            <InputField
              labelName="Customer Contact *"
              type="number"
              name="customerContact"
              handlerChange={handlerChange}
              value={customerData?.customerContact || ""}
            />
            <InputField
              labelName="Company Name *"
              type="text"
              name="companyName"
              handlerChange={handlerChange}
              value={customerData?.companyName || ""}
            />

            <TextareaField
              labelName="Customer Address *"
              name="customerAddress"
              handlerChange={handlerChange}
              inputVal={customerData?.customerAddress || ""}
            />
            
            <div className="col-span-1 sm:col-span-2">
              <TextareaField
                labelName="Company Address *"
                name="companyAddress"
                handlerChange={handlerChange}
                inputVal={customerData?.companyAddress || ""}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-4 py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setIsOpenModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};
