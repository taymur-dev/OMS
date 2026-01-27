import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { UserSelect } from "../InputFields/UserSelect";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";

import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";

const today = new Date().toLocaleDateString('sv-SE');

type AddResignationProps = {
  setModal: () => void;
  handleRefresh?: () => void;
};

type UserT = {
  id: string | number;
  employee_name?: string;
  name?: string;
  loginStatus?: string;
  role: string;
};

type ResignationT = {
  id: string;
  designation: string;
  note: string;
  resignation_date: string;
};

type LifeLine = {
  id: number;
  position: string;
  date: string;
};

const initialState: ResignationT = {
  id: "",
  designation: "",
  note: "",
  resignation_date: today,
};

export const AddResignation = ({
  setModal,
  handleRefresh,
}: AddResignationProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const token = currentUser?.token;
  const isAdmin = currentUser?.role === "admin";

  const [allUsers, setAllUsers] = useState<UserT[]>([]);
  const [lifeLines, setLifeLines] = useState<LifeLine[]>([]);
  const [formData, setFormData] = useState<ResignationT>(initialState);

  const getAllUsers = useCallback(async () => {
    if (!token || !isAdmin) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllUsers(res.data?.users ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  }, [token, isAdmin]);

  const fetchUserDesignation = useCallback(async () => {
    if (!token || !isAdmin) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getEmployeeLifeLine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLifeLines(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch employee lifeline");
    }
  }, [token, isAdmin]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "id") {
      const latestLifeLine = lifeLines
        .filter((l) => String(l.id) === value)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

      setFormData((prev) => ({
        ...prev,
        designation: latestLifeLine?.position || "",
      }));
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getAllUsers();
      fetchUserDesignation();
    } else {
      setFormData((prev) => ({
        ...prev,
        id: String(currentUser?.id),
      }));
    }
  }, [isAdmin, getAllUsers, fetchUserDesignation, currentUser]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id || !formData.designation || !formData.note) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/addResignation`
        : `${BASE_URL}/api/user/addResignation`;

      await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Resignation added successfully");
      setModal();
      handleRefresh?.();
      setFormData(initialState);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data?.message || "Failed to add resignation"
      );
    }
  };

  const userOptions = allUsers
    .filter((u) => u.role === "user" && u.loginStatus === "Y")
    .map((u) => ({
      value: String(u.id),
      label: u.employee_name || u.name || "User",
    }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white rounded-lg border border-indigo-900">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-indigo-900 rounded-t-lg px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD EMPLOYEE RESIGNATION
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-2 space-y-2">
            {isAdmin && (
              <UserSelect
                labelName="Select Employee*"
                name="id"
                value={formData.id}
                optionData={userOptions}
                handlerChange={handlerChange}
              />
            )}

            <InputField
              labelName="Current Designation*"
              name="designation"
              value={formData.designation}
              handlerChange={handlerChange}
              readOnly
            />

            <InputField
              labelName="Resignation Date*"
              type="date"
              name="resignation_date"
              value={formData.resignation_date}
              handlerChange={handlerChange}
            />

            <TextareaField
              labelName="Note*"
              name="note"
              inputVal={formData.note}
              handlerChange={handlerChange}
            />
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
