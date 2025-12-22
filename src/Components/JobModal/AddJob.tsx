import React, { useState } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { InputField } from "../InputFields/InputField";

import { Title } from "../Title";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";

import { toast } from "react-toastify";
import { OptionField } from "../InputFields/OptionField";

type AddAttendanceProps = {
  setModal: () => void;
};

const optionData = [
  { id: 1, label: "Approved", value: "approved" },
  { id: 2, label: "Rejected", value: "rejected" },
];

const initialState = {
  jobCreated: "",
  jobTitle: "",
  date: "",
  status: "",
};
export const AddJob = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [addJob, setAddJob] = useState(initialState);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setAddJob({ ...addJob, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/admin/createCatagory`, addJob, {
        headers: { Authorization: token },
      });
      console.log(res.data);

      toast.success(res.data.message);
      setModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem]   bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Add Job</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              <InputField
                labelName="Created By*"
                placeHolder="Enter the applicant name"
                type="text"
                name="jobCreated"
                inputVal={currentUser?.name}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Job Title*"
                placeHolder="Enter the job title"
                type="text"
                name=" jobTitle"
                inputVal={addJob.jobTitle}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Created Date*"
                placeHolder="Enter the  created date"
                type="date"
                name="date"
                inputVal={addJob.date}
                handlerChange={handlerChange}
              />

              <OptionField
                labelName="Status"
                name="status"
                value={addJob.status}
                handlerChange={handlerChange}
                optionData={optionData}
                inital="Pending"
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Job"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
