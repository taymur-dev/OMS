import React, { useEffect, useState, useCallback } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { Title } from "../Title";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";
import { OptionField } from "../InputFields/OptionField";

type ADDSALET = {
  id: number;
  projectId: number;
  projectName: string;
  customerId: number;
  customerName: string;
  saleDate: string;
};

type CustomerT = {
  id: number;
  customerName: string;
};

type ProjectT = {
  id: number;
  projectName: string;
};

type AddAttendanceProps = {
  setModal: () => void;
  seleteSale: ADDSALET | null;
  handleGetsales: () => void;
};

export const EditSale = ({
  setModal,
  seleteSale,
  handleGetsales,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [updateSale, setUpdateSale] = useState(seleteSale);

  const [allProjects, setAllProjects] = useState<ProjectT[] | null>(null);

  const [allCustomers, setAllCustomers] = useState<CustomerT[] | null>(null);

  console.log({ updateSale });

  const token = currentUser?.token;

  useEffect(() => {
    if (seleteSale) {
      setUpdateSale(seleteSale);
    }
  }, [seleteSale]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    e.preventDefault();

    const { name, value } = e.target;

    setUpdateSale({ ...updateSale, [name]: value } as ADDSALET);
  };

  const handleGetProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
        headers: {
          Authorization: token,
        },
      });
      setAllProjects(res?.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const getAllCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllCustomers(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/updateSalesData/${updateSale?.id}`,
        updateSale,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data);
      handleGetsales();
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
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Update Sale</Title>
            <div className="mx-2 flex-wrap gap-3  ">
              <OptionField
                labelName="Customer*"
                name="customerId"
                value={updateSale?.customerId ?? ""}
                handlerChange={handlerChange}
                optionData={allCustomers?.map((customer) => ({
                  id: customer.id,
                  label: customer.customerName,
                  value: customer.id,
                }))}
                inital="Please Select Customer"
              />

              <OptionField
                labelName="Project*"
                name="projectId"
                value={updateSale?.projectId ?? ""}
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
                  value={updateSale?.saleDate?.slice(0, 10) ?? ""}
                  onChange={handlerChange}
                  className="border rounded p-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Update Sale"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
