import { useState } from "react";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddCustomerProps = {
  setIsOpenModal: () => void;
  handleGetAllCustomers: () => void;
};

const initialState = {
  customerName: "",
  customerAddress: "",
  customerContact: "",
  companyName: "",
  companyAddress: "",
};

export const AddCustomer = ({
  setIsOpenModal,
  handleGetAllCustomers,
}: AddCustomerProps) => {
  const [customerData, setCustomerData] = useState(initialState);
  const { currentUser } = useAppSelector((state) => state?.officeState);
  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (newValue.startsWith(" ")) {
      newValue = newValue.trimStart();
    }

    if (
      name === "customerName" ||
      name === "customerAddress" ||
      name === "companyName" ||
      name === "companyAddress"
    ) {
      newValue = newValue.replace(/\d/g, "");
      newValue = newValue.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    if (name === "customerContact") {
      newValue = newValue.replace(/\D/g, "");
      if (newValue.length > 11) newValue = newValue.slice(0, 11);
    }

    setCustomerData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanedData = {
      customerName: customerData.customerName.trim(),
      customerAddress: customerData.customerAddress.trim(),
      customerContact: customerData.customerContact.trim(),
      companyName: customerData.companyName.trim(),
      companyAddress: customerData.companyAddress.trim(),
    };

    if (
      !cleanedData.customerName ||
      !cleanedData.customerAddress ||
      !cleanedData.customerContact
    ) {
      return toast.error("Customer Name, Address and Contact are required");
    }

    if (!/^\d{11}$/.test(cleanedData.customerContact)) {
      return toast.error("Contact number must be 11 digits");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addCustomer`,
        cleanedData,
        { headers: { Authorization: token } }
      );

      toast.success(res.data.message);
      handleGetAllCustomers();
      setCustomerData(initialState);
      setIsOpenModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-xl border border-blue-600 shadow-lg overflow-y-auto">
        <form onSubmit={handlerSubmitted} className="flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 rounded-t-xl px-6">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              Add Customer
            </Title>
          </div>

          {/* Form Body */}
          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              labelName="Customer Name*"
              placeHolder="Enter the Customer Name"
              type="text"
              name="customerName"
              handlerChange={handlerChange}
              value={customerData.customerName}
            />
            <InputField
              labelName="Customer Address*"
              placeHolder="Enter the Customer Address"
              type="text"
              name="customerAddress"
              handlerChange={handlerChange}
              value={customerData.customerAddress}
            />
            <InputField
              labelName="Customer Contact*"
              placeHolder="Enter Contact Number"
              type="text"
              name="customerContact"
              handlerChange={handlerChange}
              value={customerData.customerContact}
            />
            <InputField
              labelName="Company Name*"
              placeHolder="Enter Company Name"
              type="text"
              name="companyName"
              handlerChange={handlerChange}
              value={customerData.companyName}
            />
            <div className="md:col-span-2">
              <InputField
                labelName="Company Address*"
                placeHolder="Enter Company Address"
                type="text"
                name="companyAddress"
                handlerChange={handlerChange}
                value={customerData.companyAddress}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-3 px-6 py-4 bg-blue-600 rounded-b-xl">
            <CancelBtn setModal={setIsOpenModal} />
            <AddButton
              label={loading ? "Adding..." : "Add Customer"}
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
