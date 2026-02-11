import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { OptionField } from "../InputFields/OptionField";
import { toast } from "react-toastify";
import { InputField } from "../InputFields/InputField";

type AddAttendanceProps = {
  setModal: () => void;
  handleGetsales: () => void;
};

type CustomerT = {
  id: number;
  customerName: string;
};

type ProjectT = {
  id: number;
  projectName: string;
};

const initialState = {
  customerId: "",
  projectId: "",
  saleDate: new Date().toLocaleDateString("sv-SE"),
};

export const AddSale = ({ setModal, handleGetsales }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addSale, setAddSale] = useState(initialState);
  const [allProjects, setAllProjects] = useState<ProjectT[] | null>(null);
    const [loading, setLoading] = useState(false);

  const [allCustomers, setAllCustomers] = useState<CustomerT[] | null>(null);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setAddSale({ ...addSale, [name]: value });
  };

  const handleGetProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const getAllCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCustomers(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addSale.customerId || !addSale.projectId || !addSale.saleDate) {
      return toast.error("Customer, Project, and Date are required", {
        toastId: "required-fields",
      });
    }

       setLoading(true);


    try {
      await axios.post(`${BASE_URL}/api/admin/addSale`, addSale, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleGetsales();
      toast.success("Sale added successfully", { toastId: "success" });
      setModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to add sale";
        toast.error(message, { toastId: "add-sale-error" });
      } else {
        toast.error("Something went wrong!", { toastId: "add-sale-error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetProjects();
    getAllCustomers();
  }, [getAllCustomers, handleGetProjects]);

  return (
    <div>
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded border border-indigo-900">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                ADD SALE
              </Title>
            </div>

            <div className="mx-2 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3">
              <OptionField
                labelName="Customer *"
                name="customerId"
                value={addSale.customerId}
                handlerChange={handlerChange}
                optionData={allCustomers?.map((customer) => ({
                  id: customer.id,
                  label: customer.customerName,
                  value: customer.id,
                }))}
                inital="Please Select Customer"
              />

              <OptionField
                labelName="Projects *"
                name="projectId"
                value={addSale.projectId}
                handlerChange={handlerChange}
                optionData={allProjects?.map((project) => ({
                  id: project.id,
                  label: project.projectName,
                  value: project.id,
                }))}
                inital="Please Select Project"
              />

              <div className="flex flex-col my-2 md:col-span-2">
                <label className="text-xs  font-semibold mb-1">Date *</label>
                <InputField
                  type="date"
                  name="saleDate"
                  value={addSale?.saleDate?.slice(0, 10) ?? ""}
                  handlerChange={handlerChange}
                  className="border border-indigo-900 rounded p-1"
                />
              </div>
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
    </div>
  );
};
