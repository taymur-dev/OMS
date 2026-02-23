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
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    let value = e.target.value;

    // remove leading spaces
    value = value.replace(/^\s+/, "");

    if (name === "customerName") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      value = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      value = value.slice(0, 50); // ✅ limit
    }

    if (name === "companyName") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      value = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      value = value.slice(0, 50); // ✅ limit
    }

    if (name === "customerAddress") {
      value = value.replace(/[^a-zA-Z0-9\s,.-]/g, "");
      value = value.slice(0, 250); // ✅ limit
    }

    if (name === "companyAddress") {
      value = value.replace(/[^a-zA-Z0-9\s,.-]/g, "");
      value = value.slice(0, 250); // ✅ limit
    }

    if (name === "customerContact") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }

    setCustomerData(
      (prev) =>
        ({
          ...prev,
          [name]: value,
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
      toast.error("All fields are required", { toastId: "required-fields" });
      return;
    }

    if (!/^\d{11}$/.test(customerContact)) {
      toast.error("Contact must be 11 digits", { toastId: "contact-length" });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/admin/updateCustomer/${customerId}`,
        customerData,
        {
          headers: { Authorization: token || "" },
        },
      );
      toast.success(res.data.message, { toastId: "updated-success" });
      setIsOpenModal();
      handleGetAllCustomers();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message = axiosError.response?.data.message || "";

      if (axiosError.response?.status === 409) {
        if (message.includes("contact")) {
          toast.error("This contact number already exists", {
            toastId: "customer_contact-exists",
          });
        } else {
          toast.error(message, { toastId: "contact-already" });
        }
      } else {
        toast.error(message || "Something went wrong", { toastId: "wrong" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex px-4 items-center justify-center z-50">
      <div className="w-[42rem] max-h-[50rem] bg-white rounded border border-indigo-900 shadow-lg overflow-hidden">
        <form
          onSubmit={(e) => handlerSubmitted(e, customerData?.id ?? null)}
          className="flex flex-col h-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
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

            <div className="md:col-span-2">
              <InputField
                labelName="Company Name *"
                type="text"
                name="companyName"
                handlerChange={handlerChange}
                value={customerData?.companyName || ""}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Customer Address *"
                name="customerAddress"
                handlerChange={handlerChange}
                inputVal={customerData?.customerAddress || ""}
              />
            </div>

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
            <AddButton
              loading={loading}
              label={loading ? "Updating" : "Update"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
