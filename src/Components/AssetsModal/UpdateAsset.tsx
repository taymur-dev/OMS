import React, { useState } from "react";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import { InputField } from "../InputFields/InputField";

import { Title } from "../Title";

import axios from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";

import { toast } from "react-toastify";
import { OptionField } from "../InputFields/OptionField";
import { TextareaField } from "../InputFields/TextareaField";

type AddAttendanceProps = {
  setModal: () => void;
};

const optionData = [
  { id: 1, label: "Approved", value: "approved" },
  { id: 2, label: "Rejected", value: "rejected" },
];

const initialState = {
  assetName: "",
  assetCategory: "",
  description: "",
  date: "",
};
export const UpdateAsset = ({ setModal }: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [updateAsset, setUpdateAsset] = useState(initialState);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUpdateAsset({ ...updateAsset, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/createCatagory`,
        updateAsset,
        {
          headers: { Authorization: token },
        }
      );
      console.log(res.data);

      toast.success(res.data.message);
      setModal();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem]   bg-white mx-auto rounded-xl border  border-indigo-500 ">
          <form onSubmit={handlerSubmitted}>
            <Title setModal={() => setModal()}>Update Asset</Title>
            <div className="mx-2   flex-wrap gap-3  ">
              <InputField
                labelName="Asset Name*"
                placeHolder="Enter the asset name"
                type="text"
                name="assetName"
                inputVal={updateAsset.assetName}
                handlerChange={handlerChange}
              />

              <OptionField
                labelName="Asset Category"
                name=" assetCategory"
                value={updateAsset.assetCategory}
                handlerChange={handlerChange}
                optionData={optionData}
                inital="Pending"
              />

              <TextareaField
                labelName="Description*"
                placeHolder="write the asset description"
                name="description"
                inputVal={updateAsset.description}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Created Date*"
                placeHolder="Enter the  created date"
                type="date"
                name="date"
                inputVal={updateAsset.date}
                handlerChange={handlerChange}
              />
            </div>

            <div className="flex items-center justify-center m-2 gap-2 text-xs ">
              <CancelBtn setModal={() => setModal()} />
              <AddButton label={"update Asset"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
