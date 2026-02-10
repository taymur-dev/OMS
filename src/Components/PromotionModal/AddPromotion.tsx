import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { UserSelect } from "../InputFields/UserSelect";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

const today = new Date();
const currentDate = today.toLocaleDateString("sv-SE");

type AddPromotionProps = {
  setModal: () => void;
  handleRefresh: () => void;
};

type AddPromotionType = {
  id: string;
  current_designation: string;
  requested_designation: string;
  note: string;
  date: string;
};

type User = {
  id: number;
  name?: string;
  loginStatus?: string;
  role?: string;
};

type LifeLine = {
  id: number;
  employee_name: string;
  email: string;
  contact: string;
  position: string;
  date: string;
};

const initialState: AddPromotionType = {
  id: "",
  current_designation: "",
  requested_designation: "",
  note: "",
  date: currentDate,
};

export const AddPromotion = ({
  setModal,
  handleRefresh,
}: AddPromotionProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [lifeLines, setLifeLines] = useState<LifeLine[]>([]);
  const [addPromotion, setAddPromotion] =
    useState<AddPromotionType>(initialState);

  const getAllUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(Array.isArray(res.data.users) ? res.data.users : []);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Failed to fetch users");
    }
  }, [token]);

  const getEmployeeLifeLine = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getEmployeeLifeLine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLifeLines(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch employee lifeline");
    }
  }, [token]);

  useEffect(() => {
    if (isAdmin) {
      getAllUsers();
      getEmployeeLifeLine();
    } else {
      setAddPromotion((prev) => ({
        ...prev,
        id: String(currentUser?.id),
      }));
    }
  }, [isAdmin, getAllUsers, getEmployeeLifeLine, currentUser]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "note") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 250);
    }

    if (name === "requested_designation") {
      updatedValue = value.replace(/[^a-zA-Z ]/g, "").slice(0, 50);
    }

    setAddPromotion((prev) => ({ ...prev, [name]: updatedValue }));

    if (name === "id") {
      const latestLifeLine = lifeLines
        .filter((l) => String(l.id) === value)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0];

      setAddPromotion((prev) => ({
        ...prev,
        current_designation: latestLifeLine?.position || "",
      }));
    }
  };

  const handlerSubmitted = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { id, current_designation, requested_designation, note, date } =
      addPromotion;

    if (
      !id ||
      !current_designation ||
      !requested_designation ||
      !note ||
      !date
    ) {
      return toast.error("Please fill all required fields", {
        toastId: "add-promotion-validation",
      });
    }

    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/addPromotion`
        : `${BASE_URL}/api/user/addPromotion`;

      await axios.post(url, addPromotion, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Promotion request added successfully!", {
        toastId: "add-promotion-success",
      });

      handleRefresh();
      setAddPromotion(initialState);
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data.message || "Failed to add promotion",
        {
          toastId: "add-promotion-error",
        },
      );
    }
  };

  const userOptions = isAdmin
    ? allUsers
        .filter((u) => u.loginStatus === "Y" && u.role === "user")
        .map((u) => ({
          id: u.id,
          value: String(u.id),
          label: u.name || "",
        }))
    : [];

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur px-4  flex items-center justify-center z-50"
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    >
      <div className="w-[42rem] bg-white rounded border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded  px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD PROMOTION REQUEST
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            {isAdmin && (
              <UserSelect
                labelName="Select Employee *"
                name="id"
                handlerChange={handlerChange}
                optionData={userOptions}
                value={addPromotion.id}
              />
            )}

            <InputField
              labelName="Current Designation *"
              type="text"
              name="current_designation"
              handlerChange={handlerChange}
              value={addPromotion.current_designation}
              readOnly
            />

            <InputField
              labelName="Requested Designation *"
              type="text"
              name="requested_designation"
              handlerChange={handlerChange}
              value={addPromotion.requested_designation}
            />

            <InputField
              labelName="Date *"
              type="date"
              name="date"
              handlerChange={handlerChange}
              value={addPromotion.date}
            />

            <div className="md:col-span-2">
              <TextareaField
                labelName="Note *"
                handlerChange={handlerChange}
                name="note"
                inputVal={addPromotion.note}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Save" />
          </div>
        </form>
      </div>
    </div>
  );
};
