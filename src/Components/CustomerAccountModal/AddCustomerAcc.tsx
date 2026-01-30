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

type AddCustomerAccountProps = {
  setModal: () => void;
  refreshData: () => void;
};

type Customer = {
  id: number;
  customerName: string;
  customerContact: string;
  customerAddress: string;
};

const paymentMethods = [
  { id: 1, label: "EasyPaisa", value: "easyPaisa" },
  { id: 2, label: "Bank Transfer", value: "bankTransfer" },
  { id: 3, label: "Cash", value: "cash" },
];

const currentDate = new Date().toLocaleDateString("en-CA");


const initialState = {
  selectCustomer: "",
  customerName: "",
  customerContact: "",
  customerAddress: "",
  debit: "",
  credit: "",
  paymentMethod: currentDate,
  paymentDate: "",
};

export const AddCustomerAccount = ({
  setModal,
  refreshData,
}: AddCustomerAccountProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [form, setForm] = useState(initialState);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "selectCustomer") {
        const selectedCustomer = allCustomers.find(
          (c) => c.id === Number(value)
        );
        if (selectedCustomer) {
          updated.customerName = selectedCustomer.customerName;
          updated.customerContact = selectedCustomer.customerContact;
          updated.customerAddress = selectedCustomer.customerAddress;
        }
      }

      return updated;
    });
  };

  const getAllCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCustomers(res.data || []);
    } catch {
      toast.error("Failed to fetch customers");
    }
  }, [token]);

  useEffect(() => {
    getAllCustomers();
  }, [getAllCustomers]);

  const customerOptions = allCustomers.map((c) => ({
    value: c.id.toString(),
    label: c.customerName,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.selectCustomer) {
      toast.error("Please select a customer");
      return;
    }

    try {
      const payload = {
        customerId: Number(form.selectCustomer),
        customerName: form.customerName,
        customerContact: form.customerContact,
        customerAddress: form.customerAddress,
        debit: Number(form.debit || 0),
        credit: Number(form.credit || 0),
        paymentMethod: form.paymentMethod,
        paymentDate: form.paymentDate,
      };

      await axios.post(`${BASE_URL}/api/admin/addCustomerAccount`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Customer account added successfully!");
      setForm(initialState);
      setModal();
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add customer account");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[40rem] bg-white rounded border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD CUSTOMER ACCOUNT
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <UserSelect
              labelName="Select Customer *"
              name="selectCustomer"
              value={form.selectCustomer}
              handlerChange={handlerChange}
              optionData={customerOptions}
            />

            <InputField
              labelName="Customer Name *"
              value={form.customerName}
              readOnly
            />
            <InputField
              labelName="Customer Contact *"
              value={form.customerContact}
              readOnly
            />
            <InputField
              labelName="Customer Address *"
              value={form.customerAddress}
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
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};
