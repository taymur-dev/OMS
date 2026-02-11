import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddSupplierAccountProps = {
  setModal: () => void;
  refreshData: () => void;
};

type Supplier = {
  supplierId: number;
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
};

const paymentMethods = [
  { id: 1, label: "EasyPaisa", value: "easyPaisa" },
  { id: 2, label: "Bank Transfer", value: "bankTransfer" },
  { id: 3, label: "Cash", value: "cash" },
];

const currentDate = new Date().toLocaleDateString("en-CA");

const initialState = {
  selectSupplier: "",
  supplierName: "",
  supplierContact: "",
  supplierAddress: "",
  debit: "",
  credit: "",
  paymentMethod: "",
  paymentDate: currentDate,
};

export const AddSupplierAccount = ({
  setModal,
  refreshData,
}: AddSupplierAccountProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [form, setForm] = useState(initialState);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    let updatedValue = value;

    if (type === "number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    setForm((prev) => {
      const updated = { ...prev, [name]: updatedValue };

      if (name === "selectSupplier") {
        const selectedSupplier = allSuppliers.find(
          (s) => s.supplierId === Number(value),
        );

        if (selectedSupplier) {
          updated.supplierName = selectedSupplier.supplierName;
          updated.supplierContact = selectedSupplier.supplierContact;
          updated.supplierAddress = selectedSupplier.supplierAddress;
        }
      }

      return updated;
    });
  };

  const getAllSuppliers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getSuppliers`, {
        headers: { Authorization: token || "" },
      });

      setAllSuppliers(res.data.data || []);
    } catch {
      toast.error("Failed to fetch suppliers");
    }
  }, [token]);

  useEffect(() => {
    getAllSuppliers();
  }, [getAllSuppliers]);

  const supplierOptions = allSuppliers.map((s) => ({
    value: s.supplierId.toString(),
    label: s.supplierName,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.selectSupplier ||
      !form.supplierName ||
      !form.supplierContact ||
      !form.supplierAddress ||
      !form.debit ||
      !form.credit ||
      !form.paymentMethod ||
      !form.paymentDate
    ) {
      return toast.error("Please fill all required fields", {
        toastId: "supplier-account-validation-supplier",
      });
    }

    setLoading(true);

    try {
      const payload = {
        supplierId: Number(form.selectSupplier),
        supplierName: form.supplierName,
        supplierContact: form.supplierContact,
        supplierAddress: form.supplierAddress,
        debit: Number(form.debit || 0),
        credit: Number(form.credit || 0),
        paymentMethod: form.paymentMethod,
        paymentDate: form.paymentDate,
      };

      await axios.post(`${BASE_URL}/api/admin/addSupplierAcc`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Supplier account added successfully!", {
        toastId: "supplier-account-success",
      });

      setForm(initialState);
      setModal();
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add supplier account", {
        toastId: "supplier-account-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[40rem] bg-white rounded border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD SUPPLIER ACCOUNT
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <UserSelect
              labelName="Select Supplier *"
              name="selectSupplier"
              value={form.selectSupplier}
              handlerChange={handlerChange}
              optionData={supplierOptions}
            />

            <InputField
              labelName="Supplier Name *"
              value={form.supplierName}
              readOnly
            />
            <InputField
              labelName="Supplier Contact *"
              value={form.supplierContact}
              readOnly
            />
            <InputField
              labelName="Supplier Address *"
              value={form.supplierAddress}
              readOnly
            />

            <InputField
              labelName="Debit *"
              name="debit"
              type="number"
              value={form.debit}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Credit *"
              name="credit"
              type="number"
              value={form.credit}
              handlerChange={handlerChange}
            />

            <OptionField
              labelName="Payment Method *"
              name="paymentMethod"
              value={form.paymentMethod}
              handlerChange={handlerChange}
              optionData={paymentMethods}
              inital="Please Select"
            />

            <InputField
              labelName="Payment Date *"
              name="paymentDate"
              type="date"
              value={form.paymentDate}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Saving" : "Save"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
