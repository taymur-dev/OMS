import React, { useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { OptionField } from "../InputFields/OptionField";
import { toast } from "react-toastify";

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
  saleDate: new Date().toLocaleDateString('sv-SE'),
};

export const AddSale = ({ setModal, handleGetsales }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addSale, setAddSale] = useState(initialState);
  const [allProjects, setAllProjects] = useState<ProjectT[] | null>(null);
  const [allCustomers, setAllCustomers] = useState<CustomerT[] | null>(null);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
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
    try {
      await axios.post(`${BASE_URL}/api/admin/addSale`, addSale, {
        headers: { Authorization: `Bearer ${token}` },
      });
      handleGetsales();
      toast.success("Sale added successfully");
      setModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetProjects();
    getAllCustomers();
  }, [getAllCustomers, handleGetProjects]);

  return (
    <div>
      <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-900">
          <form onSubmit={handlerSubmitted}>

             <div className="bg-indigo-900 rounded-t-xl px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Add Sale
              </Title>
            </div>

            <div className="mx-2 py-2 flex-wrap gap-3">
              <OptionField
                labelName="Customer*"
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
                labelName="Projects*"
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

              <div className="flex flex-col my-2">
                <label className="text-sm font-medium mb-1">Date*</label>
                <input
                  type="date"
                  name="saleDate"
                  value={addSale?.saleDate?.slice(0, 10) ?? ""}
                  onChange={handlerChange}
                  className="border rounded p-1"
                />
              </div>
            </div>

             <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
