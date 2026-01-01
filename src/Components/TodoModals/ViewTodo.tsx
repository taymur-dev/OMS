import { Title } from "../Title";
import { TodoType } from "./UpdateTodo"; 

type ViewTodoProps = {
  setIsOpenModal: () => void;
  viewTodo: TodoType | null;
};

export const ViewTodo = ({ setIsOpenModal, viewTodo }: ViewTodoProps) => {
  if (!viewTodo) return null;

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-CA") : "-";

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-10">
      <div className="w-full flex justify-center">
        <div className="bg-white w-full max-w-3xl border border-indigo-500 rounded-lg p-6 shadow-lg">
          <Title setModal={setIsOpenModal}>Todo Detail</Title>

          <div className="mt-6 space-y-4">
            {viewTodo.employeeName && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Employee:
                </span>
                <p className="text-gray-600">{viewTodo.employeeName}</p>
              </div>
            )}

            {viewTodo.task && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Task:
                </span>
                <p className="text-gray-600">{viewTodo.task}</p>
              </div>
            )}

            {viewTodo.note && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-lg font-semibold text-gray-800">
                  Note:
                </span>
                <p className="text-gray-600">{viewTodo.note}</p>
              </div>
            )}

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Start Date:
              </span>
              <p className="text-gray-600">{formatDate(viewTodo.startDate)}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                End Date:
              </span>
              <p className="text-gray-600">{formatDate(viewTodo.endDate)}</p>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-lg font-semibold text-gray-800">
                Deadline:
              </span>
              <p className="text-gray-600">{formatDate(viewTodo.deadline)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
