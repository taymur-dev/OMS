import React, { useState, useEffect } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

interface Applicant {
  id: number;
  applicant_name: string;
  fatherName?: string;
  email?: string;
  applicant_contact: string;
  applied_date: string;
  job: string;
  interviewPhase?: string;
  status: "pending" | "approved" | "rejected";
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type UpdateApplicantProps = {
  setModal: () => void;
  applicant?: Applicant;
  refreshApplicants: () => void;
};

const defaultState = {
  id: 0,
  applicant_name: "",
  fatherName: "",
  email: "",
  applicant_contact: "",
  applied_date: "",
  job: "",
  interviewPhase: "",
  applicant_status: "pending" as "pending" | "approved" | "rejected",
};

export const UpdateApplicant = ({
  setModal,
  applicant,
  refreshApplicants,
}: UpdateApplicantProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [loading, setLoading] = useState(false);

  const token = currentUser?.token;

  const [updateApplicant, setUpdateApplicant] = useState({
    ...defaultState,
    ...(applicant && {
      id: applicant.id,
      applicant_name: applicant.applicant_name,
      fatherName: applicant.fatherName,
      email: applicant.email,
      applicant_contact: applicant.applicant_contact,
      applied_date: applicant.applied_date,
      job: applicant.job,
      interviewPhase: applicant.interviewPhase,
      applicant_status: applicant.status,
    }),
  });

  useEffect(() => {
  if (applicant) {
    // This helper ensures we get YYYY-MM-DD without timezone shifting
    const formatDate = (dateInput: string) => {
      if (!dateInput) return "";
      const date = new Date(dateInput);
      const year = date.getFullYear();
      // getMonth() is 0-indexed, so we add 1
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setUpdateApplicant({
      ...defaultState,
      id: applicant.id,
      applicant_name: applicant.applicant_name,
      fatherName: applicant.fatherName || "",
      email: applicant.email || "",
      applicant_contact: applicant.applicant_contact,
      applied_date: formatDate(applicant.applied_date), // Use the helper here
      job: applicant.job,
      interviewPhase: applicant.interviewPhase || "",
      applicant_status: applicant.status,
    });
  }
}, [applicant]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    let updatedValue = value;

    if (name === "applicant_name") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    if (name === "fatherName") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    if (name === "email") {
      updatedValue = value.replace(/\s/g, "").toLowerCase().slice(0, 80);
    }

    if (type === "number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 11);
    }

    if (name === "job_id") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    if (name === "interviewPhase") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    setUpdateApplicant((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      applicant_name,
      fatherName,
      email,
      applicant_contact,
      applied_date,
      job,
      interviewPhase,
    } = updateApplicant;

    if (
      !applicant_name?.trim() ||
      !applicant_contact?.trim() ||
      !fatherName?.trim() ||
      !email?.trim() ||
      !applied_date?.trim() ||
      !job?.trim() ||
      !interviewPhase?.trim() ||
      !applicant_contact?.trim()
    ) {
      return toast.error("Please fill in all required fields", {
        toastId: "add-applicant-validation",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Invalid email format (e.g., name@example.com)", {
        toastId: "add-applicant-email",
      });
    }

    if (applicant_contact.length !== 11) {
      return toast.error("Contact number must be exactly 11 digits", {
        toastId: "add-applicant-contact",
      });
    }

    setLoading(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/admin/updateapplicant/${updateApplicant.id}`,
        updateApplicant,
        { headers: { Authorization: token } },
      );

      toast.success(res.data.message, { toastId: "add-applicant-success" });

      refreshApplicants();
      setModal();
    } catch (error: unknown) {
      console.error(error);

      const err = error as AxiosErrorResponse;
      const errorMessage =
        err.response?.data?.message || "Failed to update applicant";

      toast.error(errorMessage, {
        toastId: "update-applicant-error",
      });
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
        <form onSubmit={handlerSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT APPLICANT
            </Title>
          </div>
          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            <InputField
              labelName="Applicant Name *"
              type="text"
              name="applicant_name"
              value={updateApplicant.applicant_name}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Father Name *"
              type="text"
              name="fatherName"
              value={updateApplicant.fatherName}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Email *"
              type="email"
              name="email"
              value={updateApplicant.email}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Applicant Contact *"
              type="number"
              name="applicant_contact"
              value={updateApplicant.applicant_contact}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Job Title *"
              type="text"
              name="job"
              value={updateApplicant.job}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Applied Date *"
              type="date"
              name="applied_date"
              value={updateApplicant.applied_date}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Interview Phase *"
              type="text"
              name="interviewPhase"
              value={updateApplicant.interviewPhase}
              handlerChange={handlerChange}
            />

            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-xs font-semibold">
                Applicant Status *
              </label>
              <select
                name="applicant_status"
                value={updateApplicant.applicant_status}
                onChange={handlerChange}
                className="border rounded-md p-2 text-sm"
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
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
