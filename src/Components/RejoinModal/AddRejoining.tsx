import { useCallback, useEffect, useState } from "react";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { TextareaField } from "../InputFields/TextareaField";
import { UserSelect } from "../InputFields/UserSelect";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";

type AddRejoiningProps = {
  setModal: () => void;
  handleRefresh?: () => void;
};

type UserT = {
  id: number;
  name: string;
  designation: string;
  resignation_date: string;
  loginStatus: string;
  role: string;
};

type LifeLine = {
  id: number;
  position: string;
  date: string;
};

type ResignationT = {
  user_id: number;
  resignation_date: string;
};

type SelectOption = {
  value: string;
  label: string;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = formatDate(new Date().toISOString());

const initialState = {
  id: "",
  designation: "",
  resignation_date: "",
  rejoin_date: today,
  note: "",
};

export const AddRejoining = ({
  setModal,
  handleRefresh,
}: AddRejoiningProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [allUsers, setAllUsers] = useState<SelectOption[]>([]);
  const [addRejoin, setAddRejoin] = useState(initialState);
  const [lifeLines, setLifeLines] = useState<LifeLine[]>([]);
  const [resignations, setResignations] = useState<ResignationT[]>([]);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredUsers = res.data.users.filter(
        (u: UserT) => u.loginStatus === "N" && u.role === "user"
      );

      const formattedUsers = filteredUsers.map((u: UserT) => ({
        value: u.id.toString(),
        label: u.name,
      }));

      setAllUsers(formattedUsers);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Failed to fetch users");
    }
  }, [token]);

  const fetchLifeLines = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getEmployeeLifeLine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLifeLines(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch employee lifelines");
    }
  }, [token]);

  const fetchResignations = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getResignations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResignations(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch resignations");
    }
  }, [token]);

  useEffect(() => {
    getAllUsers();
    fetchLifeLines();
    fetchResignations();
  }, [getAllUsers, fetchLifeLines, fetchResignations]);

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAddRejoin((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!addRejoin.id) return;

    const uid = Number(addRejoin.id);

    const latestLifeLine = lifeLines
      .filter((l) => l.id === uid)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

    const resignation = resignations.find((r) => r.user_id === uid);

    setAddRejoin((prev) => ({
      ...prev,
      designation: latestLifeLine?.position || "",
      resignation_date: formatDate(resignation?.resignation_date) || "",
    }));
  }, [addRejoin.id, lifeLines, resignations]);

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url =
        currentUser?.role === "admin"
          ? `${BASE_URL}/api/admin/addRejoin`
          : `${BASE_URL}/api/user/addRejoin`;

      const payload = {
        ...addRejoin,
        resignation_date: formatDate(addRejoin.resignation_date),
        rejoin_date: formatDate(addRejoin.rejoin_date),
      };

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message);
      setModal();
      handleRefresh?.();
      setAddRejoin(initialState);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data.message || "Failed to add rejoin request"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-[42rem] bg-white mx-auto rounded-xl border border-indigo-900">
        <form onSubmit={handlerSubmit}>
          <div className="bg-indigo-900 rounded-t-xl px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              Add Employee Rejoining
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-2 py-2 gap-3">
            <UserSelect
              labelName="Select Employee*"
              name="id"
              handlerChange={handlerChange}
              optionData={allUsers}
              value={addRejoin.id}
            />

            <InputField
              labelName="Current Designation*"
              type="text"
              name="designation"
              handlerChange={handlerChange}
              value={addRejoin.designation}
              disabled
            />

            <InputField
              labelName="Resignation Date*"
              type="date"
              name="resignation_date"
              handlerChange={handlerChange}
              value={addRejoin.resignation_date}
            />

            <InputField
              labelName="Rejoin Date*"
              type="date"
              name="rejoin_date"
              handlerChange={handlerChange}
              value={addRejoin.rejoin_date}
            />

            <TextareaField
              labelName="Note*"
              placeHolder="Write here your note"
              handlerChange={handlerChange}
              name="note"
              inputVal={addRejoin.note}
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
