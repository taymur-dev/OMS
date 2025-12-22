import { useEffect, useState } from "react";

import { InputField } from "../InputFields/InputField";

import { Title } from "../Title";

import { AddButton } from "../CustomButtons/AddButton";

import { CancelBtn } from "../CustomButtons/CancelBtn";

import axios, { AxiosError } from "axios";

import { BASE_URL } from "../../Content/URL";

import { useAppSelector } from "../../redux/Hooks";

import { toast } from "react-toastify";
import { UserSelect } from "../InputFields/UserSelect";
import { TextareaField } from "../InputFields/TextareaField";
import { OptionField } from "../InputFields/OptionField";

const currentDate = new Date().toISOString().split("T")[0];

type updatePromotionProps = {
  setModal: () => void;
};

const ApprovalOptions = [
  {
    id: 1,
    label: "Pending",
    value: "pending",
  },
  {
    id: 2,
    label: "Accepted",
    value: "accepted",
  },
  {
    id: 3,
    label: "Rejected",
    value: "rejected",
  },
];

const initialState = {
  id: "",
  designation: "",
  resignationDate: "",
  note: "",
  date: currentDate,
  approvalStatus: "",
};

export const UpdateResignation = ({ setModal }: updatePromotionProps) => {
  const [allUsers, setAllUsers] = useState([]);

  const [addPromotion, setAddPromotion] = useState(initialState);

  console.log("=>", addPromotion);

  const { currentUser } = useAppSelector((state) => state?.officeState);

  const token = currentUser?.token;

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    
    setAddPromotion({ ...addPromotion, [name]: value });
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getUsers`, {
        headers: {
          Authorization: token,
        },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/addCustomer`,
        addPromotion,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data.message);
      setModal();
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message);
    }
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs  flex items-center justify-center z-10">
      <div className="w-[42rem]  bg-white mx-auto rounded-xl border  border-indigo-500 ">
        <form onSubmit={handlerSubmitted}>
          <Title setModal={() => setModal()}>Update Employee Resignation</Title>
          <div className="mx-2  flex-wrap gap-3  ">

            {}
            <UserSelect
              labelName="Select Employee*"
              name="id"
              handlerChange={handlerChange}
              optionData={allUsers}
              value={addPromotion.id}
            />
            <InputField
              labelName="Current Designation*"
              placeHolder="Enter the Current Designation"
              type="text"
              name="currentDesignation"
              handlerChange={handlerChange}
              inputVal={addPromotion?.designation}
            />

            <TextareaField
              labelName="Note*"
              placeHolder="Write here your promotion description"
              handlerChange={handlerChange}
              name="note"
              inputVal={addPromotion.note}
            />

            <InputField
              labelName="Resignation Date*"
              placeHolder="Enter the  Resignation Date"
              type="date"
              name="date"
              handlerChange={handlerChange}
              inputVal={addPromotion.date}
            />
          </div>
          {addPromotion.approvalStatus === "" ||
          addPromotion.approvalStatus === "pending" ? (
            <div className="px-2">
              <OptionField
                labelName="Approval Status*"
                name="approvalStatus"
                value={addPromotion.approvalStatus}
                handlerChange={handlerChange}
                optionData={ApprovalOptions}
                inital="Please Select Status"
              />
            </div>
          ) : null}

          <div className="flex items-center justify-center m-2 gap-2 text-xs ">
            <CancelBtn setModal={() => setModal()} />
            <AddButton label={"Update Resignation"} />
          </div>
        </form>
      </div>
    </div>
  );
};
