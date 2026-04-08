import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

import { InputField } from "../InputFields/InputField";
import { TextareaField } from "../InputFields/TextareaField";
import { UserSelect } from "../InputFields/UserSelect";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";

import { useAppSelector } from "../../redux/Hooks";
import { BASE_URL } from "../../Content/URL";

const today = new Date().toLocaleDateString("sv-SE");

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
  const [loading, setLoading] = useState(false);

  const getAllUsers = useCallback(async () => {
    if (!token || !isAdmin) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });

      setLifeLines(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch employee lifeline");
    }
  }, [token, isAdmin]);

  // ✅ FIXED: use userId instead of id
  const getMyLifeLine = useCallback(async () => {
    if (!token || isAdmin || !currentUser?.userId) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/user/getMyLifeLine`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const myLifeLineData = Array.isArray(res.data) ? res.data : [];

      const latestLifeLine = myLifeLineData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

      setFormData((prev) => ({
        ...prev,
        id: String(currentUser.userId), // ✅ FIX
        designation: latestLifeLine?.position || "",
      }));
    } catch (error) {
      console.error("Failed to fetch my lifeline:", error);

      setFormData((prev) => ({
        ...prev,
        id: String(currentUser.userId), // ✅ FIX
      }));
    }
  }, [token, isAdmin, currentUser]);

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

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === "id") {
      const latestLifeLine = lifeLines
        .filter((l) => String(l.id) === value)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
      getMyLifeLine();
    }
  }, [isAdmin, getAllUsers, fetchUserDesignation, getMyLifeLine]);

  const handlerSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ FIX: prevent "undefined" from ever going to backend
    const employeeId = isAdmin ? formData.id : currentUser?.userId;

    if (!employeeId || !formData.designation || !formData.note) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);

    try {
      const url = isAdmin
        ? `${BASE_URL}/api/admin/addResignation`
        : `${BASE_URL}/api/user/addResignation`;

      await axios.post(
        url,
        {
          id: String(employeeId), // ✅ FIXED HERE
          designation: formData.designation,
          note: formData.note,
          resignation_date: formData.resignation_date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Resignation added successfully");

      setModal();
      handleRefresh?.();
      setFormData(initialState);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      toast.error(error.response?.data?.message || "Failed to add resignation");
    }
  };

  const userOptions = allUsers
    .filter((u) => u.role === "user" && u.loginStatus === "Y")
    .map((u) => ({
      value: String(u.id),
      label: u.employee_name || u.name || "User",
    }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form onSubmit={handlerSubmitted}>
          <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              ADD EMPLOYEE RESIGNATION
            </Title>
          </div>

          <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 py-6 gap-2">
            {isAdmin && (
              <div className="sm:col-span-2">
                <UserSelect
                  labelName="Select Employee*"
                  name="id"
                  value={formData.id}
                  optionData={userOptions}
                  handlerChange={handlerChange}
                />
              </div>
            )}

            <InputField
              labelName="Current Position*"
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

            <div className="sm:col-span-2">
              <TextareaField
                labelName="Note*"
                name="note"
                inputVal={formData.note}
                handlerChange={handlerChange}
                minLength={3}
                maxLength={250}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-4 py-3">
            <CancelBtn setModal={setModal} />
            <AddButton loading={loading} label={loading ? "Saving" : "Save"} />
          </div>
        </form>
      </div>
    </div>
  );
};
