import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";

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
  };
  onUpdate: (updated: {
    id: number;
    employee_id: number;
    name: string;
    projectName: string;
    projectId: number;
  }) => void;
};

type FormState = {
  employee_id: string;
  projectId: string;
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
  });

  const [allUsers, setAllUsers] = useState<Option[]>([]);
  const [allProjects, setAllProjects] = useState<Option[]>([]);

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (editData && allUsers.length > 0 && allProjects.length > 0) {
      setFormData({
        employee_id: String(editData.employee_id),
        projectId: String(editData.projectId),
      });
    }
  }, [editData, allUsers, allProjects]);

  /* ================= HANDLER ================= */
  const handlerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
          value: String(u.id), // 🔥 required for prefill
          projectName: "",
          loginStatus: u.loginStatus ?? "Y",
        })
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
          value: String(p.id), // 🔥 required for prefill
          projectName: p.projectName,
          loginStatus: "Y",
        })
      );

      setAllProjects(projects);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  /* ================= SUBMIT ================= */
  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employee_id || !formData.projectId) {
      alert("Please select employee and project");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/admin/editAssignProject/${editData.id}`,
        {
          employee_id: Number(formData.employee_id),
          projectId: Number(formData.projectId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const selectedUser = allUsers.find(
        (u) => u.id === Number(formData.employee_id)
      );
      const selectedProject = allProjects.find(
        (p) => p.id === Number(formData.projectId)
      );

      onUpdate({
        id: editData.id,
        employee_id: Number(formData.employee_id),
        projectId: Number(formData.projectId),
        name: selectedUser?.name || "",
        projectName: selectedProject?.projectName || "",
      });

      setModal();
    } catch (error) {
      console.log(error);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    getAllUsers();
    getAllProjects();
  }, [getAllUsers, getAllProjects]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Edit Assign Project
            </Title>
          </div>

          <div className="mx-2 flex-wrap gap-3 py-4">
            <UserSelect
              labelName="Employees*"
              name="employee_id"
              value={formData.employee_id}
              handlerChange={handlerChange}
              optionData={allUsers}
            />

            <UserSelect
              labelName="Project*"
              name="projectId"
              value={formData.projectId}
              handlerChange={handlerChange}
              optionData={allProjects}
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};
