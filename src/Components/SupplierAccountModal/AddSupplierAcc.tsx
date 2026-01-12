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

const initialState = {
  selectSupplier: "",
  supplierName: "",
  supplierContact: "",
  supplierAddress: "",
  debit: "",
  credit: "",
  paymentMethod: "",
  paymentDate: "",
};

export const AddSupplierAccount = ({
  setModal,
  refreshData,
}: AddSupplierAccountProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [form, setForm] = useState(initialState);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "selectSupplier") {
        const selectedSupplier = allSuppliers.find(
          (s) => s.supplierId === Number(value)
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

    if (!form.selectSupplier) {
      toast.error("Please select a supplier");
      return;
    }

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

      toast.success("Supplier account added successfully!");
      setForm(initialState);
      setModal();
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add supplier account");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[40rem] bg-white rounded-xl border border-indigo-500">
        <form onSubmit={handleSubmit}>
          <Title setModal={setModal}>Add Supplier Account</Title>

          <div className="mx-2 flex-wrap gap-3">
            <UserSelect
              labelName="Select Supplier*"
              name="selectSupplier"
              value={form.selectSupplier}
              handlerChange={handlerChange}
              optionData={supplierOptions}
            />

            <InputField
              labelName="Supplier Name*"
              value={form.supplierName}
              readOnly
            />
            <InputField
              labelName="Supplier Contact*"
              value={form.supplierContact}
              readOnly
            />
            <InputField
              labelName="Supplier Address*"
              value={form.supplierAddress}
              readOnly
            />

            <InputField
              labelName="Debit*"
              name="debit"
              type="number"
              value={form.debit}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Credit*"
              name="credit"
              type="number"
              value={form.credit}
              handlerChange={handlerChange}
            />

            <OptionField
              labelName="Payment Method*"
              name="paymentMethod"
              value={form.paymentMethod}
              handlerChange={handlerChange}
              optionData={paymentMethods}
              inital="Please Select"
            />

            <InputField
              labelName="Payment Date*"
              name="paymentDate"
              type="date"
              value={form.paymentDate}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex justify-center gap-2 m-2">
            <CancelBtn setModal={setModal} />
            <AddButton label="Add Account" />
          </div>
        </form>
      </div>
    </div>
  );
};
