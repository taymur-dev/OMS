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

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  let newValue = value;

  // Name and Address fields: no numbers, capitalize first letter, trim spaces at start
  if (
    name === "customerName" ||
    name === "customerAddress" ||
    name === "companyName" ||
    name === "companyAddress"
  ) {
    // Remove digits
    newValue = newValue.replace(/\d/g, "");
    // Remove leading spaces
    newValue = newValue.replace(/^\s+/, "");
    // Capitalize first letter
    newValue = capitalizeFirstLetter(newValue);
  }

  // Customer Contact: only digits, max 11, no spaces
  if (name === "customerContact") {
    newValue = newValue.replace(/\D/g, ""); // remove anything that's not a digit
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
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={() => setIsOpenModal()}>Add Customer</Title>

          <div className="mx-2 flex-wrap gap-3">
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
              placeHolder="Enter the Contact Number"
              type="text" 
              name="customerContact"
              handlerChange={handlerChange}
              value={customerData.customerContact}
            />

            <InputField
              labelName="Company Name*"
              placeHolder="Enter the Company Name"
              type="text"
              name="companyName"
              handlerChange={handlerChange}
              value={customerData.companyName}
            />
          </div>

          <div className="px-2">
            <InputField
              labelName="Company Address*"
              placeHolder="Enter the Company Address"
              type="text"
              name="companyAddress"
              handlerChange={handlerChange}
              value={customerData.companyAddress}
            />
          </div>

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={() => setIsOpenModal()} />
            <AddButton label="Add Customer" loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
};
