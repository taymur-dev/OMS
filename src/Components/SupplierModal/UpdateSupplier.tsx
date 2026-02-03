import { useState, useEffect } from "react";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { TextareaField } from "../InputFields/TextareaField";

type UpdateSupplierProps = {
  setModal: () => void;
  supplierData: {
    supplierId: number;
    supplierName: string;
    supplierEmail: string;
    supplierContact: string;
    supplierAddress: string;
  };
  refreshSuppliers: () => void;
};

export const UpdateSupplier = ({
  setModal,
  supplierData,
  refreshSuppliers,
}: UpdateSupplierProps) => {
  const [updateSupplier, setUpdateSupplier] = useState(supplierData);
  const { currentUser } = useAppSelector((state) => state?.officeState);
  const token = currentUser?.token;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdateSupplier(supplierData);
  }, [supplierData]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    let value = e.target.value;

    if (name === "supplierName" || name === "supplierAddress") {
      value = value.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    if (name === "supplierEmail") {
      value = value.toLowerCase();
    }

    if (name === "supplierContact") {
      value = value.replace(/\D/g, "").slice(0, 11);
    }

    setUpdateSupplier({ ...updateSupplier, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { supplierName, supplierEmail, supplierContact, supplierAddress } =
      updateSupplier;

    if (
      !supplierName ||
      !supplierEmail ||
      !supplierContact ||
      !supplierAddress
    ) {
      toast.error("All fields are required");
      return;
    }

    if (!/^\d{11}$/.test(supplierContact)) {
      toast.error("Contact must be 11 digits");
      return;
    }

    if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(supplierEmail)) {
      toast.error("Email must be a valid @gmail.com address");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/updateSupplier`,
        updateSupplier,
        { headers: { Authorization: token || "" } }
      );

      toast.success(res.data.message);
      refreshSuppliers();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded px-6 ">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT SUPPLIER
            </Title>
          </div>
          <div className="mx-2 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
            <InputField
              labelName="Supplier Name *"
              type="text"
              name="supplierName"
              handlerChange={handlerChange}
              value={updateSupplier.supplierName}
            />
            <InputField
              labelName="Supplier Email *"
              type="email"
              name="supplierEmail"
              handlerChange={handlerChange}
              value={updateSupplier.supplierEmail}
            />
            <InputField
              labelName="Supplier Contact *"
              type="text"
              name="supplierContact"
              handlerChange={handlerChange}
              value={updateSupplier.supplierContact}
            />
            <TextareaField
              labelName="Supplier Address *"
              name="supplierAddress"
              handlerChange={handlerChange}
              inputVal={updateSupplier.supplierAddress}
            />
          </div>

           <div className="flex justify-end gap-3 px-4 py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal}  />
            <AddButton label="Update" loading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
};
