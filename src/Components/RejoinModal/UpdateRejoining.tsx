import { useCallback, useEffect, useState } from "react";
import { InputField } from "../InputFields/InputField";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { TextareaField } from "../InputFields/TextareaField";
import { UserSelect } from "../InputFields/UserSelect";
import { OptionField } from "../InputFields/OptionField";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { REJOIN_T } from "../../Pages/AdminPage/Rejoin";

type UpdateRejoiningProps = {
  setModal: () => void;
  rejoinData: REJOIN_T;
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

type SelectOption = {
  value: string;
  label: string;
};

type UpdateRejoinState = {
  id: string;
  designation: string;
  resignation_date: string;
  rejoin_date: string;
  note: string;
  approval_status: string;
};

const ApprovalOptions: { id: number; value: string; label: string }[] = [
  { id: 1, value: "Accepted", label: "Accepted" },
  { id: 2, value: "Rejected", label: "Rejected" },
];

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const UpdateRejoining = ({
  setModal,
  rejoinData,
  handleRefresh,
}: UpdateRejoiningProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [allUsers, setAllUsers] = useState<SelectOption[]>([]);
  const [allUsersRaw, setAllUsersRaw] = useState<UserT[]>([]);

  const [updateData, setUpdateData] = useState<UpdateRejoinState>({
    id: rejoinData.employee_id.toString(),
    designation: rejoinData.designation,
    resignation_date: formatDate(rejoinData.resignation_date),
    rejoin_date: formatDate(rejoinData.rejoinRequest_date),
    note: "",
    approval_status: rejoinData.approval_status || "Pending",
  });

  const handlerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  const getAllUsers = useCallback(async () => {
    if (!token || currentUser?.role !== "admin") return;

    try {
      const res = await axios.get<{ users: UserT[] }>(
        `${BASE_URL}/api/admin/getUsers`,
        { headers: { Authorization: token } }
      );

      const filteredUsers = res.data.users.filter(
        (u) => u.loginStatus === "N" && u.role === "user"
      );

      setAllUsersRaw(filteredUsers);

      const formattedUsers: SelectOption[] = filteredUsers.map((u) => ({
        value: u.id.toString(),
        label: u.name,
      }));
      setAllUsers(formattedUsers);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Failed to fetch users");
    }
  }, [token, currentUser]);

  const handleUserSelect = (userId: string) => {
    const selectedUser = allUsersRaw.find((u) => u.id.toString() === userId);
    if (selectedUser) {
      setUpdateData({
        ...updateData,
        id: userId,
        designation: selectedUser.designation,
        resignation_date: formatDate(selectedUser.resignation_date),
      });
    }
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    try {
      const url =
        currentUser?.role === "admin"
          ? `${BASE_URL}/api/admin/updateRejoin/${rejoinData.id}`
          : `${BASE_URL}/api/user/updateMyRejoin/${rejoinData.id}`;

      const res = await axios.put(url, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message);
      handleRefresh?.();
      setModal();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data.message || "Failed to update rejoin request"
      );
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs px-4  flex items-center justify-center z-50">
      <div className="w-[42rem] bg-white mx-auto rounded border border-indigo-900">
        <form onSubmit={handlerSubmit}>
          <div className="bg-indigo-900 rounded px-6">
            <Title
              setModal={setModal}
              className="text-white text-lg font-semibold"
            >
              EDIT REJOINING REQUEST
            </Title>
          </div>

          <div className="mx-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 py-2 gap-3">
            {currentUser?.role === "admin" && (
              <UserSelect
                labelName="Select Employee*"
                name="id"
                handlerChange={(e) => {
                  handlerChange(e);
                  handleUserSelect(e.target.value);
                }}
                optionData={allUsers}
                value={updateData.id}
                disabled
              />
            )}

            <InputField
              labelName="Current Designation *"
              placeHolder="Enter the Current Designation"
              type="text"
              name="designation"
              handlerChange={handlerChange}
              value={updateData.designation}
              disabled
            />

            <InputField
              labelName="Resignation Date *"
              placeHolder="Enter the Resignation Date"
              type="date"
              name="resignation_date"
              handlerChange={handlerChange}
              value={updateData.resignation_date}
              disabled
            />

            <InputField
              labelName="Rejoin Date *"
              placeHolder="Enter the Rejoin Date"
              type="date"
              name="rejoin_date"
              handlerChange={handlerChange}
              value={updateData.rejoin_date}
            />

            <TextareaField
              labelName="Note *"
              placeHolder="Write your rejoining description"
              handlerChange={handlerChange}
              name="note"
              inputVal={updateData.note}
            />

            <OptionField
              labelName="Approval Status"
              name="approval_status"
              handlerChange={handlerChange}
              value={updateData.approval_status}
              optionData={ApprovalOptions}
              inital="Select Status"
            />
          </div>

          <div className="flex justify-end gap-3 px-4 rounded py-3 bg-indigo-900 border-t border-indigo-900">
            <CancelBtn setModal={setModal} />
            <AddButton label="Update" />
          </div>
        </form>
      </div>
    </div>
  );
};
