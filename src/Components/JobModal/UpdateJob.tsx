import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { Title } from "../Title";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type Job = {
  id: number;
  job_title: string;
  description: string;
};

type UpdateJobProps = {
  job: Job;
  setModal: () => void;
  refreshJobs: () => void;
};

export const UpdateJob: React.FC<UpdateJobProps> = ({
  job,
  setModal,
  refreshJobs,
}) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [formData, setFormData] = useState({
    job_title: "",
    description: "",
  });

  useEffect(() => {
    setFormData({
      job_title: job.job_title,
      description: job.description,
    });
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.job_title || !formData.description) {
      toast.error("All fields are required");
      return;
    }

    try {
      const payload = {
        job_title: formData.job_title,
        description: formData.description,
      };

      const res = await axios.put(
        `${BASE_URL}/api/admin/updatejob/${job.id}`,
        payload,
        {
          headers: { Authorization: token },
        }
      );

      toast.success(res.data.message || "Job updated successfully");
      refreshJobs();
      setModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handleSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT JOB
            </Title>
          </div>

          <div className="mx-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <InputField
              labelName="Job Title *"
              type="text"
              name="job_title"
              value={formData.job_title}
              handlerChange={handleChange}
            />

            <TextareaField
              labelName="Job Description *"
              name="description"
              inputVal={formData.description}
              handlerChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};
