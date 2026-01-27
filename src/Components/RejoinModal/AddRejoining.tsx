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

// Props
type AddRejoiningProps = {
  setModal: () => void;
  handleRefresh?: () => void;
};

// Types
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

type AddRejoinState = {
  id: number | null;
  designation: string;
  resignation_date: string;
  rejoin_date: string;
  note: string;
};

type LifeLineAPI = {
  id: number | string;
  position: string;
  date: string;
};

type ResignationAPI = {
  user_id: number | string;
  resignation_date: string;
};

// Helper to format date as YYYY-MM-DD
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = formatDate(new Date().toLocaleDateString("sv-SE"));

// Initial form state
const initialState: AddRejoinState = {
  id: null,
  designation: "",
  resignation_date: "",
  rejoin_date: today,
  note: "",
};

export const AddRejoining = ({ setModal, handleRefresh }: AddRejoiningProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [allUsers, setAllUsers] = useState<SelectOption[]>([]);
  const [addRejoin, setAddRejoin] = useState<AddRejoinState>(initialState);
  const [lifeLines, setLifeLines] = useState<LifeLine[]>([]);
  const [resignations, setResignations] = useState<ResignationT[]>([]);

  // Fetch all users for admin
  const getAllUsers = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get<{ users: UserT[] }>(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredUsers = res.data.users
        .filter((u) => u.loginStatus === "N" && u.role === "user")
        .map((u) => ({ value: u.id.toString(), label: u.name }));

      setAllUsers(filteredUsers);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Failed to fetch users");
    }
  }, [token]);

  // Fetch lifelines
  const fetchLifeLines = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? "/api/admin/getEmployeeLifeLine"
          : "/api/user/getMyLifeLine";

      const res = await axios.get<LifeLineAPI[]>(`${BASE_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLifeLines(
        Array.isArray(res.data)
          ? res.data.map((l) => ({ ...l, id: Number(l.id) }))
          : []
      );
    } catch {
      toast.error("Failed to fetch lifelines");
    }
  }, [token, currentUser]);

  // Fetch resignations
  const fetchResignations = useCallback(async () => {
    if (!token || !currentUser) return;

    try {
      const url =
        currentUser.role === "admin"
          ? "/api/admin/getResignations"
          : "/api/user/getMyResignation";

      const res = await axios.get<ResignationAPI[]>(`${BASE_URL}${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResignations(
        Array.isArray(res.data)
          ? res.data.map((r) => ({ ...r, user_id: Number(r.user_id) }))
          : []
      );
    } catch {
      toast.error("Failed to fetch resignations");
    }
  }, [token, currentUser]);

  // Fetch data on mount
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === "admin") getAllUsers();
    fetchLifeLines();
    fetchResignations();
  }, [currentUser, getAllUsers, fetchLifeLines, fetchResignations]);

  // Handle form changes
  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddRejoin((prev) => ({
      ...prev,
      [name]: name === "id" ? (value ? Number(value) : null) : value,
    }));
  };

  // Auto-fill for normal users
  useEffect(() => {
    if (!currentUser || currentUser.role !== "user") return;

    const uid = Number(currentUser.id);

    const latestLifeLine = lifeLines
      .filter((l) => l.id === uid)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const resignation = resignations.find((r) => r.user_id === uid);

    setAddRejoin({
      id: uid,
      designation: latestLifeLine?.position || "",
      resignation_date: formatDate(resignation?.resignation_date) || "",
      rejoin_date: today,
      note: "",
    });
  }, [currentUser, lifeLines, resignations]);

  // Submit form
  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!addRejoin.id || !addRejoin.rejoin_date) {
      toast.error("Employee and rejoin date are required");
      return;
    }

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
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white mx-auto rounded-lg border border-indigo-900">
        <form onSubmit={handlerSubmit}>
          <div className="bg-indigo-900 rounded-t-lg px-6">
            <Title setModal={setModal} className="text-white text-lg font-semibold">
              ADD REJOINING REQUEST
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            {currentUser?.role === "admin" ? (
              <UserSelect
                labelName="Select Employee *"
                name="id"
                handlerChange={handlerChange}
                optionData={allUsers}
                value={addRejoin.id !== null ? String(addRejoin.id) : undefined}
              />
            ) : (
              <InputField
                labelName="Employee"
                type="text"
                value={currentUser?.name || ""}
                disabled
              />
            )}

            <InputField
              labelName="Current Designation *"
              type="text"
              name="designation"
              handlerChange={handlerChange}
              value={addRejoin.designation}
            />

            <InputField
              labelName="Resignation Date *"
              type="date"
              name="resignation_date"
              handlerChange={handlerChange}
              value={addRejoin.resignation_date}
            />

            <InputField
              labelName="Rejoin Date *"
              type="date"
              name="rejoin_date"
              handlerChange={handlerChange}
              value={addRejoin.rejoin_date}
            />

            <TextareaField
              labelName="Note *"
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
