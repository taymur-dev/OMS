import React, { useState } from "react";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { useAppSelector } from "../../redux/Hooks";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { toast } from "react-toastify";

type AddAttendanceProps = {
  setModal: () => void;
  handleGetAllHodidays: () => void;
};

const currentDate = new Date().toLocaleDateString("sv-SE");


const initialState = {
  date: currentDate,
  holiday: "",
};

export const AddHoliday = ({
  setModal,
  handleGetAllHodidays,
}: AddAttendanceProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;

  const [holiday, setHoliday] = useState(initialState);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setHoliday({ ...holiday, [name]: value });
  };

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/configHolidays`,
        holiday,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("add", res.data);

      toast.success(res.data.message);
      setModal();
      handleGetAllHodidays();
      setHoliday(initialState);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
        <div className="w-[42rem] max-h-[29rem] bg-white mx-auto rounded-xl border  border-indigo-900 ">
          <form onSubmit={handlerSubmitted}>
            <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Add Holiday
            </Title>
          </div>
            <div className="mx-2 grid grid-cols-2  py-6 gap-3  ">
              <InputField
                labelName="Holiday*"
                placeHolder="Enter the holiday notification"
                type="text"
                name="holiday"
                value={holiday.holiday}
                handlerChange={handlerChange}
              />

              <InputField
                labelName="Date*"
                placeHolder="Enter the Company Name"
                type="Date"
                name="date"
                value={holiday.date}
                handlerChange={handlerChange}
              />
            </div>

           <div className="flex justify-end gap-3 px-4  rounded-b-xl py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};
