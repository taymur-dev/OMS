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
  value: string;
  label: string;
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

  useEffect(() => {
    if (editData && allUsers.length > 0 && allProjects.length > 0) {
      setFormData({
        employee_id: String(editData.employee_id),
        projectId: String(editData.projectId),
      });
    }
  }, [editData, allUsers, allProjects]);

  const handlerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: token },
      });

      const users: Option[] = res.data.users.map(
        (u: { id: number; name: string; loginStatus?: string }) => ({
          id: u.id,
          name: u.name,
          projectName: "",
          loginStatus: u.loginStatus ?? "Y",
        })
      );

      setAllUsers(users);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const getAllProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
        headers: { Authorization: token },
      });

      const projects: Option[] = res.data.map(
        (p: { id: number; projectName: string }) => ({
          id: p.id,
          name: p.projectName,
          projectName: p.projectName,
          loginStatus: "Y",
        })
      );

      setAllProjects(projects);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

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
          headers: { Authorization: token },
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

  useEffect(() => {
    getAllUsers();
    getAllProjects();
  }, [getAllUsers, getAllProjects]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] max-h-[28rem] bg-white mx-auto rounded-xl border border-indigo-500">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={setModal}>Update Assign Project</Title>

          <div className="mx-2 flex-wrap gap-3">
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

          <div className="flex items-center justify-center m-2 gap-2 text-xs">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update Project" />
          </div>
        </form>
      </div>
    </div>
  );
};
