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
  existingJobs: Job[];
};

export const UpdateJob: React.FC<UpdateJobProps> = ({
  job,
  setModal,
  refreshJobs,
  existingJobs,
}) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [loading, setLoading] = useState(false);

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
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.job_title || !formData.description) {
      return toast.error("All fields are required", {
        toastId: "update-job-validation",
      });
    }

    const isDuplicate = existingJobs.some(
      (j) =>
        j.job_title.toLowerCase() === formData.job_title.trim().toLowerCase() &&
        j.id !== job.id,
    );

    if (isDuplicate) {
      return toast.error("Another job with this title already exists");
    }

    setLoading(true);

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
        },
      );

      toast.success(res.data.message || "Job updated successfully", {
        toastId: "update-job-success",
      });

      refreshJobs();
      setModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job", { toastId: "update-job-error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
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
            <div className="md:col-span-2">
              <InputField
                labelName="Job Title *"
                type="text"
                name="job_title"
                value={formData.job_title}
                handlerChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <TextareaField
                labelName="Job Description *"
                name="description"
                inputVal={formData.description}
                handlerChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton
              loading={loading}
              label={loading ? "Updating" : "Update"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
