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
        (a: TodoType, b: TodoType) => a.id - b.id
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await getAllTodos();
      toggleModal("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTodo = (updatedTodo: TodoType) => {
    setAllTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
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
        todo.employee_id?.toString().includes(searchTerm)
    );
  }, [allTodos, searchTerm]);

  const paginatedTodos = useMemo(() => {
    const startIndex = (pageNo - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredTodos.slice(startIndex, endIndex);
  }, [filteredTodos, pageNo, rowsPerPage]);

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Todo's" activeFile="All Todos list" />
      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
       overflow-hidden flex flex-col "
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Todos:{" "}
            <span className="text-2xl text-indigo-900 font-semibold font-sans">
              [{allTodos?.length}]
            </span>
          </span>
          <CustomButton
            label="Add Todo"
            handleToggle={() => toggleModal("Add")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPageNo(1);
                }}
              >
                {numbers.map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </span>
            <span>entries</span>
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="max-h-[28.4rem] overflow-y-auto mx-2">
          <div
            className="grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_1fr] bg-indigo-900  text-white
           font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            {currentUser?.role === "admin" && <span>Employee</span>}
            <span>Tasks</span>
            <span>Start Date</span>
            <span>End Date</span>
            <span>Deadline</span>
            <span className="text-center w-28">Actions</span>
          </div>

          {paginatedTodos.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-2">
              No records available at the moment!
            </div>
          ) : (
            paginatedTodos.map((todo, index) => {
              const startDate = todo.startDate
                ? new Date(todo.startDate).toLocaleDateString("en-CA")
                : "-";
              const endDate = todo.endDate
                ? new Date(todo.endDate).toLocaleDateString("en-CA")
                : "-";
              const deadline = todo.deadline
                ? new Date(todo.deadline).toLocaleDateString("en-CA")
                : "-";

              return (
                <div
                  className="grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr_1fr] border border-gray-600 text-gray-800
          hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
                  key={todo.id}
                >
                  <span className="px-2">
                    {(pageNo - 1) * rowsPerPage + index + 1}
                  </span>
                  {currentUser?.role === "admin" && (
                    <span>{todo.employeeName ?? "-"}</span>
                  )}
                  <span>{todo.task}</span>
                  <span>{startDate}</span>
                  <span>{endDate}</span>
                  <span>{deadline}</span>
                  <span className="flex items-center gap-2">
                    <EditButton
                      handleUpdate={() => handleClickEditButton(todo)}
                    />
                    <ViewButton
                      handleView={() => setViewTodo(todo)}
                    ></ViewButton>
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

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={(pageNo - 1) * rowsPerPage + 1}
          end={Math.min(pageNo * rowsPerPage, filteredTodos.length)}
          total={filteredTodos.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

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
    </div>
  );
};
