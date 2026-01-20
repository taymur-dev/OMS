import { useState, useEffect } from "react";
import { InputField } from "../InputFields/InputField";
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

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name } = e.target;
    let value = e.target.value;

    if (
      name === "customerName" ||
      name === "customerAddress" ||
      name === "companyName" ||
      name === "companyAddress"
    ) {
      value = value.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    if (name === "customerContact") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }

    setCustomerData({ ...customerData, [name]: value } as CustomerT);
  };

  useEffect(() => {
    if (customerDetail) {
      setCustomerData(customerDetail);
    }
  }, [customerDetail]);

  const handlerSubmitted = async (
    e: React.FormEvent<HTMLFormElement>,
    customerId: number | null
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
        }
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
      <div className="w-[42rem] max-h-[29rem] bg-white rounded-xl border border-indigo-900 shadow-lg overflow-hidden">
        <form
          onSubmit={(e) => handlerSubmitted(e, customerData?.id ?? null)}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setIsOpenModal}
              className="text-white text-lg font-semibold"
            >
              Update Customer
            </Title>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-4 grid grid-cols-2 sm-grid-cols-2 md-grid-cols-2 gap-4">
            <InputField
              labelName="Customer Name*"
              placeHolder="Enter the Customer Name"
              type="text"
              name="customerName"
              handlerChange={handlerChange}
              value={customerData?.customerName || ""}
            />
            <InputField
              labelName="Customer Address*"
              placeHolder="Enter the Customer Address"
              type="text"
              name="customerAddress"
              handlerChange={handlerChange}
              value={customerData?.customerAddress || ""}
            />
            <InputField
              labelName="Customer Contact*"
              placeHolder="Enter the Contact Number"
              type="number"
              name="customerContact"
              handlerChange={handlerChange}
              value={customerData?.customerContact || ""}
            />
            <InputField
              labelName="Company Name*"
              placeHolder="Enter the Company Name"
              type="text"
              name="companyName"
              handlerChange={handlerChange}
              value={customerData?.companyName || ""}
            />
            <div className="col-span-2">
              <InputField
                labelName="Company Address*"
                placeHolder="Enter the Company Address"
                type="text"
                name="companyAddress"
                handlerChange={handlerChange}
                value={customerData?.companyAddress || ""}
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
