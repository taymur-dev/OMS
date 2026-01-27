import React, { FormEvent, useEffect, useState, useCallback } from "react";
import axios from "axios";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { UserSelect } from "../InputFields/UserSelect";
import { OptionField } from "../InputFields/OptionField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type UserOption = {
  id: number;
  name: string;
  loginStatus: string;
  projectName: string;
  role: string;
};

type ProjectT = {
  id: number;
  projectName: string;
  projectCategory: string;
  description: string;
  startDate: string;
  endDate: string;
};

const currentDate = new Date().toLocaleDateString("en-CA");

type AddAttendanceProps = {
  setModal: () => void;
  handleGetAllAssignProjects: () => void;
};

const initialState = {
  userId: "",
  projectId: "",
  date: currentDate,
};

export const AddAssignProject = ({
  setModal,
  handleGetAllAssignProjects,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addProject, setAddProject] = useState(initialState);
  const [allUsers, setAllUsers] = useState([]);
  const [allProjects, setAllProjects] = useState<ProjectT[] | null>(null);

  const handlerChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setAddProject({ ...addProject, [name]: value });
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredUsers = res?.data?.users
        .filter(
          (user: UserOption) =>
            user.role === "user" && user.loginStatus === "Y",
        )
        .map((user: UserOption) => ({
          value: user.id,
          label: user.name,
        }));

      setAllUsers(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const getAllProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlerSubmitted = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        employee_id: addProject.userId,
        projectId: addProject.projectId,
        date: addProject.date,
      };

      await axios.post(`${BASE_URL}/api/admin/assignProject`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleGetAllAssignProjects();
      setModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
    getAllProjects();
  }, [getAllProjects, getAllUsers]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[30rem] bg-white mx-auto rounded-lg border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ASSIGN PROJECT
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  gap-3 py-5">
            <UserSelect
              labelName="Employees *"
              name="userId"
              value={addProject.userId}
              handlerChange={handlerChange}
              optionData={allUsers}
            />

            <OptionField
              labelName="Project *"
              name="projectId"
              handlerChange={handlerChange}
              value={addProject.projectId}
              optionData={allProjects?.map((project) => ({
                id: project.id,
                label: project.projectName,
                value: project.id,
              }))}
              inital="Please Select Project"
            />

            <div className="flex flex-col">
              <label className="text-sm font-medium text-black  ">Date *</label>
              <input
                type="date"
                name="date"
                value={addProject.date}
                onChange={handlerChange}
                className="border border-indigo-900 rounded p-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};
