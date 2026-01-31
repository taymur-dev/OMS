import { BiUser } from "react-icons/bi";
import { BiGroup } from "react-icons/bi";
import { BsBoxes } from "react-icons/bs";
import { FaProjectDiagram } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { GiTakeMyMoney } from "react-icons/gi";
import { CiViewList } from "react-icons/ci";
import { MdOutlineSell } from "react-icons/md";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import axios from "axios";
import { BASE_URL } from "../Content/URL";
import { OptionField } from "./InputFields/OptionField";
import { InputField } from "./InputFields/InputField";
import { Columns } from "./MenuCards/Colums";
import Card from "./DetailCards/Card";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type CategoryT = { id: number; categoryName: string };
type UserT = {
  id: number;
  name?: string;
  email?: string;
  loginStatus: "Y" | "N";
};
type TodoT = { id: number; todoStatus: "Y" | "N" };
type completionStatus = "New" | "Working" | "Complete";

// type AssignProjectAPIResponse = {
//   projectId: number;
//   projectName: string;
//   completionStatus: completionStatus;
//   projectCategory: string;
// };

type ProjectT = {
  id: string;
  projectName: string;
  completionStatus: completionStatus;
  projectCategory: string;
  startDate?: string;
  endDate?: string;
};

type SaleT = { id: number };

type AllcustomerT = {
  id: number;
  customerStatus: string;
  customerName: string;
  customerAddress: string;
  customerContact: string;
  companyName: string;
  companyAddress: string;
};

type AssetType = {
  id: number;
  asset_name: string;
  category_name: string;
  category_id?: string;
  description?: string;
  date?: string;
};

const columsData = [
  { id: "New", title: "New Project" },
  { id: "Working", title: "Working Project" },
  { id: "Complete", title: "Complete Project" },
];

export const MainContent = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const [allUsers, setAllUsers] = useState<UserT[]>([]);
  const [allCategory, setAllCategory] = useState<CategoryT[] | null>(null);
  const [allAssignProjects, setAllAssignProjects] = useState<ProjectT[]>([]);
  const [allTodos, setAllTodos] = useState<TodoT[]>([]);
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [allSales, setAllSales] = useState<SaleT[]>([]);
  const [allCustomers, setAllCustomers] = useState<AllcustomerT[]>([]);
  const [allAssets, setAllAssets] = useState<AssetType[]>([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
    fromDate: "",
    toDate: "",
  });

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsers(res?.data?.users);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetAssignProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedProjects: ProjectT[] = res.data.map((p: ProjectT) => ({
        id: String(p.id),
        projectName: p.projectName,
        completionStatus: p.completionStatus,
        projectCategory: p.projectCategory,
        startDate: p.startDate,
      }));

      setAllAssignProjects(formattedProjects);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handlegetTodos = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTodos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetExpenseCategory = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getExpenseCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenseCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetTotalExpense = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getTotalExpense`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotalExpenseAmount(Number(res.data.totalExpense));
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetProjectsCategory = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCategory(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const handleGetSales = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getSales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllSales(res.data);
    } catch (error) {
      console.log("Error fetching sales:", error);
    }
  }, [token]);

  const handleGetAllCustomers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllCustomers(res.data);
    } catch (error) {
      console.log("Error fetching customers:", error);
    }
  }, [token]);

  const handleGetAssets = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/assets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllAssets(res.data);
    } catch (error) {
      console.log("Failed to fetch assets for dashboard", error);
    }
  }, [token]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const newStatus = destination.droppableId as completionStatus;

    const previousProjects = [...allAssignProjects];

    setAllAssignProjects((prev) =>
      prev.map((project) =>
        project.id === draggableId
          ? { ...project, completionStatus: newStatus }
          : project,
      ),
    );

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/updateProjectStatus/${draggableId}`,
        { completionStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error("Drag & Drop update failed:", error);
      setAllAssignProjects(previousProjects);
      toast.error("Failed to sync project status. Reverting...");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    document.title = "(OMS) Admin Dashboard";
    dispatch(navigationStart());
    setTimeout(() => dispatch(navigationSuccess("logIn")), 1000);
  }, [dispatch]);

  useEffect(() => {
    getAllUsers();
    handleGetAssignProjects();
    handlegetTodos();
    handleGetTotalExpense();
    handleGetExpenseCategory();
    handleGetProjectsCategory();
    handleGetSales();
    handleGetAllCustomers();
    handleGetAssets();
  }, [
    getAllUsers,
    handleGetAssignProjects,
    handlegetTodos,
    handleGetTotalExpense,
    handleGetExpenseCategory,
    handleGetProjectsCategory,
    handleGetSales,
    handleGetAllCustomers,
    handleGetAssets,
  ]);

  const activeUsers = allUsers.filter((user) => user.loginStatus === "Y");
  const activeTodos = allTodos.filter((todo) => todo.todoStatus === "Y");

  const filteredProjects = allAssignProjects.filter((project) => {
    const matchesCategory =
      !formData.categoryName ||
      project.projectCategory === formData.categoryName;

    let matchesDate = true;

    if (formData.fromDate && formData.toDate) {
      const projectDate = project.startDate
        ? new Date(project.startDate)
        : null;
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      if (projectDate) {
        matchesDate = projectDate >= start && projectDate <= end;
      } else {
        matchesDate = false;
      }
    }

    return matchesCategory && matchesDate;
  });

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-6 space-y-5 bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div onClick={() => navigate("/users")} className="cursor-pointer">
          <Card
            titleName="Users"
            totalUser="Total Users"
            totalNumber={activeUsers.length}
            icon={<BiUser className="text-2xl" />}
            style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
          />
        </div>

        <div onClick={() => navigate("/projects")} className="cursor-pointer">
          <Card
            titleName="Projects"
            totalUser="Total Projects"
            totalNumber={allAssignProjects.length}
            icon={<FaProjectDiagram className="text-2xl" />}
            style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
          />
        </div>

        <div onClick={() => navigate("/todo")} className="cursor-pointer">
          <Card
            titleName="Todo's"
            totalUser="Active Todo's"
            totalNumber={activeTodos.length}
            icon={<LuListTodo className="text-2xl" />}
            style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
          />
        </div>

        <div onClick={() => navigate("/expensesCatogries")} className="cursor-pointer">
          <Card
            titleName="Expense Categories"
            totalUser="Total Categories"
            totalNumber={expenseCategory.length}
            icon={<CiViewList className="text-2xl" />}
            style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
          />
        </div>

        <div onClick={() => navigate("/expenses")} className="cursor-pointer">
          <Card
            titleName="Total Expense"
            totalNumber={totalExpenseAmount}
            isCurrency
            icon={<GiTakeMyMoney className="text-2xl" />}
            style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
          />
        </div>

        <div onClick={() => navigate("/sales")} className="cursor-pointer">
          <Card
            titleName="Sales"
            totalUser="Total Sales Count"
            totalNumber={allSales.length}
            icon={<MdOutlineSell className="text-2xl" />}
            style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
          />
        </div>

        <div onClick={() => navigate("/customers")} className="cursor-pointer">
          <Card
            titleName="Total Customers"
            totalUser="Registered Customers"
            totalNumber={allCustomers.length}
            icon={<BiGroup className="text-2xl" />}
            style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
          />
        </div>

        <div onClick={() => navigate("/assets")} className="cursor-pointer">
          <Card
            titleName="Assets"
            totalUser="Total Assets"
            totalNumber={allAssets.length}
            icon={<BsBoxes className="text-2xl" />}
            style="bg-white shadow-md rounded-lg border border-gray-100 h-full"
          />
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end w-full">
        {/* Category Select */}
        <div className="w-full min-w-0">
          <OptionField
            labelName="Category"
            name="categoryName"
            handlerChange={handleChange}
            value={formData.categoryName}
            optionData={allCategory?.map((category) => ({
              id: category.id,
              label: category.categoryName,
              value: category.categoryName,
            }))}
            inital="All Categories"
          />
        </div>

        {/* From Date */}
        <div className="w-full min-w-0">
          <InputField
            type="date"
            labelName="From Date"
            name="fromDate"
            value={formData.fromDate}
            handlerChange={handleChange}
          />
        </div>

        {/* To Date */}
        <div className="w-full min-w-0">
          <InputField
            type="date"
            labelName="To Date"
            name="toDate"
            value={formData.toDate}
            handlerChange={handleChange}
          />
        </div>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-6">
          {columsData.map((column) => (
            <div key={column.id} className="min-h-[400px]">
              <Columns
                colum={column}
                allProject={filteredProjects.filter(
                  (project) => project.completionStatus === column.id,
                )}
              />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
