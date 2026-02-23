import { useState } from "react";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { TextareaField } from "../InputFields/TextareaField";

type AddCustomerProps = {
  setModal: () => void;
  handleGetAllSupplier: () => void;
};
const initialState = {
  supplierName: "",
  supplierAddress: "",
  supplierContact: "",
  supplierEmail: "",
};

export const AddSupplier = ({
  setModal,
  handleGetAllSupplier,
}: AddCustomerProps) => {
  const [supplierData, setSupplierData] = useState(initialState);

  console.log(supplierData);

  const { currentUser } = useAppSelector((state) => state?.officeState);

  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    let value = e.target.value;

    value = value.replace(/^\s+/, "");

    if (name === "supplierName") {
      value = value.replace(/[^a-zA-Z\s]/g, "");
      value = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      value = value.slice(0, 50);
    }

    if (name === "supplierAddress") {
      value = value.replace(/[^a-zA-Z0-9\s,.-]/g, "");
      value = value.slice(0, 250);
    }

    if (name === "supplierEmail") {
      value = value.toLowerCase();
      value = value.replace(/[^a-z0-9@._%+-]/g, "");
      value = value.slice(0, 100);
    }

    if (name === "supplierContact") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }

    setSupplierData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { supplierName, supplierEmail, supplierContact, supplierAddress } =
      supplierData;

    if (
      !supplierName ||
      !supplierEmail ||
      !supplierContact ||
      !supplierAddress
    ) {
      toast.error("All fields are required", { toastId: "required-fields" });
      return;
    }

    if (!/^\d{11}$/.test(supplierContact)) {
      toast.error("Contact must be 11 digits", { toastId: "contact-length" });
      return;
    }

    if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(supplierEmail)) {
      toast.error("Email must be a valid @gmail.com address", {
        toastId: "valid-domain",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/addSupplier`,
        supplierData,
        { headers: { Authorization: token } },
      );

      toast.success(res.data.message, { toastId: "add-success" });
      handleGetAllSupplier();
      setModal();
      setSupplierData(initialState);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Something went wrong", {
        toastId: "wrong",
      });
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded border  border-indigo-900 ">
        <form
          onSubmit={handlerSubmitted}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="bg-indigo-900 rounded px-6 ">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD SUPPLIER
            </Title>
          </div>
          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 py-2 ">
            <InputField
              labelName="Supplier Name *"
              type="text"
              name="supplierName"
              handlerChange={handlerChange}
              value={supplierData.supplierName}
            />
            <InputField
              labelName="Supplier Email *"
              type="email"
              name="supplierEmail"
              handlerChange={handlerChange}
              value={supplierData.supplierEmail}
            />

            <div className="md:col-span-2">
              <InputField
                labelName="Supplier Contact *"
                type="text"
                name="supplierContact"
                handlerChange={handlerChange}
                value={supplierData.supplierContact}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Supplier Address *"
                name="supplierAddress"
                handlerChange={handlerChange}
                inputVal={supplierData.supplierAddress}
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-3 px-2 py-2 bg-indigo-900 rounded">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
