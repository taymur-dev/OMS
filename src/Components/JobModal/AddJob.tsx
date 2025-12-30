import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { Title } from "../Title";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddJobsProps = {
  setModal: () => void;
  refreshJobs: () => void;
};

type AddJobState = {
  job_title: string;
  description: string;
};

const initialState: AddJobState = {
  job_title: "",
  description: "",
};

export const AddJob = ({ setModal, refreshJobs }: AddJobsProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addJob, setAddJob] = useState(initialState);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddJob({ ...addJob, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addJob.job_title || !addJob.description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/admin/addjob`, addJob, {
        headers: { Authorization: token },
      });

      toast.success(res.data.message || "Job added successfully");
      refreshJobs();
      setModal();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Add Job</Title>

          <div className="mx-4 flex flex-col gap-3">
            <InputField
              labelName="Job Title*"
              placeHolder="Enter job title"
              type="text"
              name="job_title"
              value={addJob.job_title}
              handlerChange={handlerChange}
            />

            <TextareaField
              labelName="Job Description*"
              placeHolder="Enter job description"
              name="description"
              inputVal={addJob.description}
              handlerChange={handlerChange}
            />
          </div>

          <div className="flex items-center justify-center m-4 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save Job" />
          </div>
        </form>
      </div>
    </div>
  );
};
