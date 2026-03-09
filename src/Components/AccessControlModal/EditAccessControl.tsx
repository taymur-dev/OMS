import { useState, useEffect, useMemo, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";
import { toast } from "react-toastify";
import { Title } from "../Title";
import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";

interface AccessControlData {
  moduleId: number;
  moduleName: string;
  status: number | boolean; // Backend returns 0 or 1
}

type RoleType = {
  id: number;
  roleName: string;
};

type EditAccessControlProps = {
  role: RoleType;
  initialPermissions: AccessControlData[];
  onClose: () => void;
  onSuccess?: () => void;
};

export const EditAccessControl = ({
  role,
  initialPermissions,
  onClose,
  onSuccess,
}: EditAccessControlProps) => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const mainModules = useMemo(
    () => [
      "Dashboard",
      "People",
      "Attendance",
      "Human Resources",
      "Talent Acquisition",
      "Projects",
      "Performance",
      "Sales",
      "Expenses",
      "Payroll",
      "Assets",
      "Dynamics",
      "Accounts",
      "Reports",
      "Users Management",
      "Configuration",
    ],
    [],
  );

  useEffect(() => {
    const initializePermissions = () => {
      const permMap: Record<string, boolean> = {};
      mainModules.forEach((module) => {
        permMap[module] = false;
      });

      if (initialPermissions && initialPermissions.length > 0) {
        initialPermissions.forEach((p) => {
          if (mainModules.includes(p.moduleName)) {
            permMap[p.moduleName] = Boolean(p.status);
          }
        });
      }

      console.log("Initialized permissions:", permMap); // For debugging
      setPermissions(permMap);
      setIsLoading(false);
    };

    initializePermissions();
  }, [initialPermissions, mainModules]);

  const handleCheck = useCallback((key: string) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const handleCheckAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      const allPermissions: Record<string, boolean> = {};

      mainModules.forEach((item) => {
        allPermissions[item] = isChecked;
      });

      setPermissions(allPermissions);
    },
    [mainModules],
  );

  const allChecked = useMemo(
    () => mainModules.every((module) => permissions[module]),
    [mainModules, permissions],
  );

  const handleUpdate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/updateAccessControl`,
        {
          roleId: role.id,
          permissions: permissions, 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`Permissions for ${role.roleName} updated!`);
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to update permissions",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
        <div className="w-[42rem] bg-white mx-auto rounded-xl shadow-xl p-6 text-center">
          Loading permissions...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm px-4 flex items-center justify-center z-50">
      <div className="w-[42rem] max-h-[95vh] overflow-y-auto bg-white mx-auto rounded-xl shadow-xl">
        <form onSubmit={handleUpdate}>
          <div className="bg-white rounded-xl border-t-5 border-blue-400">
            <Title
              setModal={onClose}
              className="text-white text-lg font-semibold"
            >
              EDIT ACCESS CONTROL
            </Title>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Updating Permissions for Role
              </label>
              <div className="w-full p-2.5 border rounded-lg bg-gray-50 text-blue-600 font-bold">
                {role.roleName}
              </div>
            </div>

            <div className="flex items-center mb-6 gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
              <input
                type="checkbox"
                id="editCheckAll"
                checked={allChecked}
                onChange={handleCheckAll}
                disabled={isSaving}
                className="w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="editCheckAll"
                className="font-semibold cursor-pointer select-none text-gray-700"
              >
                Grant Access to All Modules
              </label>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mainModules.map((item) => (
                <label
                  key={item}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    permissions[item]
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 border-gray-100"
                  } ${isSaving ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={permissions[item] || false}
                    onChange={() => handleCheck(item)}
                    disabled={isSaving}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </label>
              ))}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-4">
              <CancelBtn setModal={onClose} />
              <AddButton
                loading={isSaving}
                label={isSaving ? "Updating..." : "Update Access"}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};