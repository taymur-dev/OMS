import React, { FormEvent, useEffect, useState, useCallback } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { OptionField } from "../InputFields/OptionField";
import { Title } from "../Title";
import { TextareaField } from "../InputFields/TextareaField";
import axios from "axios";
import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";

type AddProjectProps = {
  setModal: () => void;
  handleGetAllProjects: () => void;
};

const currentDate = new Date().toISOString().split("T")[0];

type AllCategoryT = {
  id: number;
  categoryName: string;
};

const initialState = {
  projectName: "",
  projectCategory: "",
  description: "",
  startDate: currentDate,
  endDate: currentDate,
};

export const AddProject = ({
  setModal,
  handleGetAllProjects,
}: AddProjectProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const [addProject, setAddProject] = useState(initialState);
  const [categories, setCategories] = useState<AllCategoryT[] | null>(null);
  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAddProject({ ...addProject, [name]: value });
  };

  const handleGetAllCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCategory`, {
        headers: { Authorization: token },
      });
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const handlerSubmitted = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/admin/addProject`, addProject, {
        headers: { Authorization: token },
      });
      handleGetAllProjects();
      setModal();
      toast.success("Project submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit project!");
    }
  };

  useEffect(() => {
    handleGetAllCategories();
  }, [handleGetAllCategories]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-indigo-500 overflow-hidden">
        <form onSubmit={handlerSubmitted}>
          {/* Header */}
          <div className="bg-blue-600 px-6 ">
            <Title
              setModal={setModal}
              className="text-white text-xl font-semibold"
            >
              Add Project
            </Title>
          </div>

          {/* Body */}
          <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <OptionField
              labelName="Project Category*"
              name="projectCategory"
              value={addProject.projectCategory}
              handlerChange={handlerChange}
              optionData={categories?.map((category) => ({
                id: category.id,
                label: category.categoryName,
                value: category.categoryName,
              }))}
              inital="Select Project Category"
            />

            <InputField
              labelName="Project Name*"
              placeHolder="Enter the Project Name"
              type="text"
              name="projectName"
              value={addProject.projectName}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="Start Date*"
              placeHolder="Enter Start Date"
              type="date"
              name="startDate"
              value={addProject.startDate}
              handlerChange={handlerChange}
            />

            <InputField
              labelName="End Date*"
              placeHolder="Enter End Date"
              type="date"
              name="endDate"
              value={addProject.endDate}
              handlerChange={handlerChange}
            />

            <TextareaField
              labelName="Project Description"
              name="description"
              placeHolder="Enter Project Description..."
              handlerChange={handlerChange}
              inputVal={addProject.description}
              className="col-span-1 md:col-span-2"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 bg-blue-600 border-t border-indigo-500 rounded-b-xl">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};
