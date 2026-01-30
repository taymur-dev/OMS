import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { useCallback, useEffect, useState, useMemo } from "react";
import { AddTodo } from "../../Components/TodoModals/AddTodo";
import { UpdateTodo, TodoType } from "../../Components/TodoModals/UpdateTodo";
import { ViewTodo } from "../../Components/TodoModals/ViewTodo";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { Footer } from "../../Components/Footer";

type ALLTODOT = TodoType;
type TODOT = "Add" | "Edit" | "Delete" | "";

const numbers = [10, 25, 50];

export const Todo = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [allTodos, setAllTodos] = useState<ALLTODOT[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<ALLTODOT | null>(null);
  const [modalType, setModalType] = useState<TODOT>("");
  const [catchId, setCatchId] = useState<number | null>(null);

  const token = currentUser?.token;
  const id = currentUser?.userId;

  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewTodo, setViewTodo] = useState<ALLTODOT | null>(null);

  const handleIncrementPageButton = () => setPageNo((prev) => prev + 1);
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const toggleModal = (type: TODOT) => {
    setModalType((prev) => (prev === type ? "" : type));
  };

  const getAllTodos = useCallback(async () => {
    try {
      const res =
        currentUser?.role === "admin"
          ? await axios.get(`${BASE_URL}/api/admin/getTodos`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          : await axios.get(`${BASE_URL}/api/user/getTodo/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

      const sortedTodos = res.data.sort(
        (a: TodoType, b: TodoType) => a.id - b.id,
      );
      setAllTodos(sortedTodos);
    } catch (error) {
      console.log(error);
    }
  }, [token, currentUser?.role, id]);

  const handleClickEditButton = (todo: ALLTODOT) => {
    setSelectedTodo(todo);
    toggleModal("Edit");
  };

  const handleClickDeleteButton = (id: number) => {
    setCatchId(id);
    toggleModal("Delete");
  };

  const handleDeleteTodo = async () => {
    if (!catchId) return;
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteTodo/${catchId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await getAllTodos();
      toggleModal("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTodo = (updatedTodo: TodoType) => {
    setAllTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    );
  };

  useEffect(() => {
    getAllTodos();
    document.title = "(OMS)ALL Todos";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("TODOS"));
    }, 1000);
  }, [dispatch, getAllTodos]);

  const filteredTodos = useMemo(() => {
    return allTodos.filter(
      (todo) =>
        todo.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.employee_id?.toString().includes(searchTerm),
    );
  }, [allTodos, searchTerm]);

  const paginatedTodos = useMemo(() => {
    const startIndex = (pageNo - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredTodos.slice(startIndex, endIndex);
  }, [filteredTodos, pageNo, rowsPerPage]);

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Todo button as the rightElement */}
        <TableTitle
          tileName="Todo's"
          rightElement={
            <CustomButton
              handleToggle={() => toggleModal("Add")}
              label="+ Add Todo"
            />
          }
        />

        <hr className="border border-b border-gray-200" />

        <div className="p-2">
          <div className="flex flex-row items-center justify-between text-gray-800 gap-2">
            {/* Left Side: Show entries */}
            <div className="text-sm flex items-center">
              <span>Show</span>
              <span className="bg-gray-100 border border-gray-300 rounded mx-1 px-1">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPageNo(1);
                  }}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {numbers.map((num, index) => (
                    <option key={index} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </span>
              <span className="hidden xs:inline">entries</span>
            </div>

            {/* Right Side: Search Input */}
            <TableInputField
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[900px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-8 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              {/* Logic maintained: showing Employee only if admin, but keeping grid alignment */}
              <span>{currentUser?.role === "admin" ? "user" : ""}</span>
              <span>Tasks</span>
              <span>Start Date</span>
              <span>End Date</span>
              <span>Deadline</span>
              <span>Completion Status</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedTodos.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedTodos.map((todo, index) => {
                const startDate = todo.startDate
                  ? new Date(todo.startDate)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")
                  : "-";
                const endDate = todo.endDate
                  ? new Date(todo.endDate)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")
                  : "-";
                const deadline = todo.deadline
                  ? new Date(todo.deadline)
                      .toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/ /g, "-")
                  : "-";

                return (
                  <div
                    key={todo.id}
                    className="grid grid-cols-8 border-b border-x border-gray-200 text-gray-800 items-center
                     text-sm p-2 hover:bg-gray-50 transition"
                  >
                    <span>{(pageNo - 1) * rowsPerPage + index + 1}</span>
                    <span className="truncate">
                      {currentUser?.role === "admin"
                        ? (todo.employeeName ?? "-")
                        : ""}
                    </span>
                    <span className="truncate">{todo.task}</span>
                    <span>{startDate}</span>
                    <span>{endDate}</span>
                    <span>{deadline}</span>
                    <span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          todo.completionStatus === "Completed"
                            ? "bg-green-700 text-white"
                            : todo.completionStatus === "Defer"
                              ? "bg-blue-700 text-white"
                              : "bg-red-700 text-white"
                        }`}
                      >
                        {todo.completionStatus || "Pending"}
                      </span>
                    </span>
                    <span className="flex flex-nowrap justify-center gap-1">
                      <EditButton
                        handleUpdate={() => handleClickEditButton(todo)}
                      />
                      <ViewButton handleView={() => setViewTodo(todo)} />
                      <DeleteButton
                        handleDelete={() => handleClickDeleteButton(todo.id)}
                      />
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={
              filteredTodos.length === 0 ? 0 : (pageNo - 1) * rowsPerPage + 1
            }
            end={Math.min(pageNo * rowsPerPage, filteredTodos.length)}
            total={filteredTodos.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
      {modalType === "Add" && (
        <AddTodo setModal={() => toggleModal("")} getAllTodos={getAllTodos} />
      )}

      {modalType === "Edit" && selectedTodo && (
        <UpdateTodo
          setModal={() => toggleModal("")}
          seleteTodo={selectedTodo}
          onUpdate={handleUpdateTodo}
        />
      )}

      {viewTodo && (
        <ViewTodo
          setIsOpenModal={() => setViewTodo(null)}
          viewTodo={viewTodo}
        />
      )}

      {modalType === "Delete" && (
        <ConfirmationModal
          isOpen={() => toggleModal("Delete")}
          onClose={() => toggleModal("")}
          onConfirm={handleDeleteTodo}
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
