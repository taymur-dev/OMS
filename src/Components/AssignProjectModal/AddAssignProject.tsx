import React, { FormEvent, useEffect, useState, useCallback } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { Title } from "../Title";

import { UserSelect } from "../InputFields/UserSelect";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";
import { OptionField } from "../InputFields/OptionField";

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

type AddAttendanceProps = {
  setModal: () => void;
  handleGetAllAssignProjects: () => void;
};

const initialState = {
  userId: "",
  projectId: "",
};

export const AddAssignProject = ({
  setModal,
  handleGetAllAssignProjects,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const [addProject, setAddProject] = useState(initialState);

  const [allUsers, setAllUsers] = useState([]);

  const [allProjects, setAllProjects] = useState<ProjectT[] | null>(null);

  const token = currentUser?.token;

  const handlerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    setAddProject({ ...addProject, [name]: value });
  };

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      });

      const filteredUsers = res?.data?.users
        .filter(
          (user: UserOption) => user.role === "user" && user.loginStatus === "Y"
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
        headers: {
          Authorization: token,
        },
      });
      setAllProjects(res.data);
      console.log(res.data);
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
        date: new Date().toISOString(),
      };

      const res = await axios.post(
        `${BASE_URL}/api/admin/assignProject`,
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log(res.data);
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
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded-xl border  border-indigo-900 ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded-t-xl px-6">
              <Title
                setModal={setModal}
                className="text-white text-lg font-semibold"
              >
                Assign Project
              </Title>
            </div>
            <div className="mx-2 grid grid-cols-1 gap-3 py-5  ">
              <UserSelect
                labelName="Employees*"
                name="userId"
                value={addProject.userId}
                handlerChange={handlerChange}
                optionData={allUsers}
              />

              <OptionField
                labelName="Project"
                name="projectId"
                handlerChange={handlerChange}
                value={addProject?.projectId}
                optionData={allProjects?.map((project) => ({
                  id: project.id,
                  label: project.projectName,
                  value: project.id,
                }))}
                inital="Please Select Project"
              />
            </div>
            <div className="flex justify-end gap-3 px-4 rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-500">
              <CancelBtn setModal={setModal} />
              <AddButton label="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
