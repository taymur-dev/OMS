import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";


import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { OptionField } from "../InputFields/OptionField";
import { InputField } from "../InputFields/InputField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type Option = {
  id: number;
  name: string;
  label: string;
  value: string;
  projectName: string;
  loginStatus: string;
};

type EditAssignProjectProps = {
  setModal: () => void;
  editData: {
    id: number;
    employee_id: number;
    name: string;
    projectName: string;
    projectId: number;
    date: string;
  };
  onUpdate: (updated: {
    id: number;
    employee_id: number;
    name: string;
    projectName: string;
    projectId: number;
    date: string;
  }) => void;
};

type FormState = {
  employee_id: string;
  projectId: string;
  date: string;
};

export const EditAssignProject = ({
  setModal,
  editData,
  onUpdate,
}: EditAssignProjectProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [formData, setFormData] = useState<FormState>({
    employee_id: "",
    projectId: "",
    date: "", // 🔥 initialize date
  });

  const [allUsers, setAllUsers] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);

  const [allProjects, setAllProjects] = useState<Option[]>([]);

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (editData && allUsers.length > 0 && allProjects.length > 0) {
      setFormData({
        employee_id: String(editData.employee_id),
        projectId: String(editData.projectId),
        date: editData.date ? editData.date.split("T")[0] : "",
      });
    }
  }, [editData, allUsers, allProjects]);

  /* ================= HANDLER ================= */
  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= USERS ================= */
  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });

      const users: Option[] = res.data.users.map(
        (u: { id: number; name: string; loginStatus?: string }) => ({
          id: u.id,
          name: u.name,
          label: u.name,
          value: String(u.id),
          projectName: "",
          loginStatus: u.loginStatus ?? "Y",
        }),
      );

      setAllUsers(users);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  /* ================= PROJECTS ================= */
  const getAllProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
        headers: { Authorization: token },
      });

      const projects: Option[] = res.data.map(
        (p: { id: number; projectName: string }) => ({
          id: p.id,
          name: p.projectName,
          label: p.projectName,
          value: String(p.id),
          projectName: p.projectName,
          loginStatus: "Y",
        }),
      );

      setAllProjects(projects);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  /* ================= SUBMIT ================= */
  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employee_id || !formData.projectId || !formData.date) {
    return toast.error(
      "Employee, Project, and Date are required",
      { toastId: "required-fields" }
    );
  }

      setLoading(true);


    try {
      await axios.put(
        `${BASE_URL}/api/admin/editAssignProject/${editData.id}`,
        {
          employee_id: Number(formData.employee_id),
          projectId: Number(formData.projectId),
          date: formData.date, // 🔥 send date to backend
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const selectedUser = allUsers.find(
        (u) => u.id === Number(formData.employee_id),
      );
      const selectedProject = allProjects.find(
        (p) => p.id === Number(formData.projectId),
      );

      onUpdate({
        id: editData.id,
        employee_id: Number(formData.employee_id),
        projectId: Number(formData.projectId),
        name: selectedUser?.name || "",
        projectName: selectedProject?.projectName || "",
        date: formData.date, // 
      });

      toast.success("Assigned project updated successfully!", {
      toastId: "update-success",
    });

      setModal();
    } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to update project!";
      toast.error(message, { toastId: "update-error" });
    } else {
      toast.error("Something went wrong!", { toastId: "update-error" });
    }
  }finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    getAllUsers();
    getAllProjects();
  }, [getAllUsers, getAllProjects]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded border border-indigo-900">
        <form
          onSubmit={handlerSubmitted}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT ASSIGNED PROJECT
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 py-4">
            <UserSelect
              labelName="Employees *"
              name="employee_id"
              value={formData.employee_id}
              handlerChange={handlerChange}
              optionData={allUsers}
            />

            <OptionField
              labelName="Project *"
              name="projectId"
              value={formData.projectId}
              handlerChange={handlerChange}
              optionData={allProjects}
            />

            {/* 🔥 Date Input */}
            <div className="flex flex-col mb-3 md:col-span-2">
              <label className="text-sm font-medium text-black">Date *</label>

              <InputField
                type="date"
                name="date"
                value={formData.date}
                handlerChange={handlerChange}
                className="border border-indigo-900 rounded px-2 py-2 mt-1"
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
