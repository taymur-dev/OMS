import React, { FormEvent, useEffect, useState, useCallback } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { Title } from "../Title";

import { UserSelect } from "../InputFields/UserSelect";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";
import { OptionField } from "../InputFields/OptionField";

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
          Authorization: token,
        },
      });
      setAllUsers(res?.data?.users);
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
        <div className="w-[42rem] max-h-[28rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Add Assign Project</Title>
            <div className="mx-2 flex-wrap gap-3  ">
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
            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"Save Project"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
