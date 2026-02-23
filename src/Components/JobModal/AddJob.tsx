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
  existingJobs: { job_title: string }[];
};

type AddJobState = {
  job_title: string;
  description: string;
};

const initialState: AddJobState = {
  job_title: "",
  description: "",
};

export const AddJob = ({
  setModal,
  refreshJobs,
  existingJobs,
}: AddJobsProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addJob, setAddJob] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "description") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    if (name === "job_title") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    setAddJob({ ...addJob, [name]: updatedValue });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addJob.job_title || !addJob.description) {
      return toast.error("Please fill all required fields", {
        toastId: "add-job-validation",
      });
    }

    const isDuplicate = existingJobs.some(
      (job) =>
        job.job_title.toLowerCase() === addJob.job_title.trim().toLowerCase(),
    );

    if (isDuplicate) {
      return toast.error("A job with this title already exists", {
        toastId: "duplicate-job-error",
      });
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/admin/addjob`, addJob, {
        headers: { Authorization: token },
      });

      toast.success(res.data.message || "Job added successfully", {
        toastId: "add-job-success",
      });

      refreshJobs();
      setModal();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { toastId: "add-job-error" });
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
      <div className="w-[42rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD JOB
            </Title>
          </div>

          <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <div className="md:col-span-2">
              <InputField
                labelName="Job Title *"
                type="text"
                name="job_title"
                value={addJob.job_title}
                handlerChange={handlerChange}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Job Description *"
                name="description"
                inputVal={addJob.description}
                handlerChange={handlerChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
