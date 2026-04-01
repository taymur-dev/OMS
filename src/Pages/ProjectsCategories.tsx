import { ShowDataNumber } from "../Components/Pagination/ShowDataNumber";
import { Pagination } from "../Components/Pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { useEffect, useState, useCallback } from "react";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loader } from "../Components/LoaderComponent/Loader";
import { AddProjectCategory } from "../Components/ProjectCategoryModal/AddProjectCategory";
import { EditCategory } from "../Components/ProjectCategoryModal/EditCategory";
import { ConfirmationModal } from "../Components/Modal/ComfirmationModal";
import { EditButton } from "../Components/CustomButtons/EditButton";
import { DeleteButton } from "../Components/CustomButtons/DeleteButton";
import { RiInboxArchiveLine } from "react-icons/ri";
import axios from "axios";
import { BASE_URL } from "../Content/URL";
import { toast } from "react-toastify";

type TPROJECTCATEGORY = "ADDCATEGORY" | "EDITCATEGORY" | "DELETECATEGORY" | "";

type CATEGORYT = {
  id: number;
  categoryName: string;
};

interface ProjectsCategoriesProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const ProjectsCatogries = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: ProjectsCategoriesProps) => {
  const { loader } = useAppSelector((state) => state?.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [allCategories, setAllCategories] = useState<CATEGORYT[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<TPROJECTCATEGORY>("");
  const [selectCategory, setSelectCategory] = useState<CATEGORYT | null>(null);
  const [catchId, setCatchId] = useState<number>();
  const [pageNo, setPageNo] = useState(1);

  const getAllCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getCategory`, {
        headers: { Authorization: token },
      });
      setAllCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    document.title = "(OMS) ALL PROJECTS";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Project Category"));
    }, 1000);
    getAllCategories();
  }, [dispatch, getAllCategories]);

  // Sync pagination with external filters
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADDCATEGORY");
    }
  }, [triggerModal]);

  const filteredCategories = allCategories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = Math.min(
    startIndex + externalPageSize,
    filteredCategories.length,
  );

  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const handleSelectCategory = (data: CATEGORYT) => {
    setIsOpenModal("EDITCATEGORY");
    setSelectCategory(data);
  };

  const clickDeleteButton = (id: number) => {
    setIsOpenModal("DELETECATEGORY");
    setCatchId(id);
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.patch(
        `${BASE_URL}/api/admin/deleteCategory/${catchId}`,
        {},
        { headers: { Authorization: token } },
      );
      getAllCategories();
      toast.success("Category has been deleted successfully");
      setIsOpenModal("");
    } catch (error) {
      console.log(error);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[700px]">
          {/* Table Header */}
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[90px_1fr_auto] 
            bg-blue-400 text-white rounded-lg items-center font-bold
            text-xs tracking-wider sticky top-0 z-10 gap-3 px-4 py-3 shadow-sm" // px-4 matches body padding
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Project Category Name</span>
              <span className="text-right">Actions</span>{" "}
              {/* Simplified alignment */}
            </div>
          </div>

          {/* Table Body */}
          <div className="px-0.5 py-2">
            {paginatedCategories.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  No records available at the moment!
                </p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className="grid grid-cols-[90px_1fr_auto] 
                  items-center px-4 py-2 gap-3 text-sm bg-white 
                  border border-gray-100 rounded-lg 
                  hover:bg-blue-50/30 transition-colors shadow-sm" // px-4 matches header
                  >
                    <span className="text-gray-500 font-medium text-left">
                      {startIndex + index + 1}
                    </span>

                    <div className="flex items-center gap-3 text-left">
                      <span className="text-gray-500">
                        {category.categoryName}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <EditButton
                        handleUpdate={() => handleSelectCategory(category)}
                      />
                      <DeleteButton
                        handleDelete={() => clickDeleteButton(category.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Pagination Footer Section */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={paginatedCategories.length === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, filteredCategories.length)}
          total={filteredCategories.length}
        />
        <Pagination
          pageNo={pageNo}
          totalNum={filteredCategories.length}
          pageSize={externalPageSize}
          handlePageClick={(targetPage) => setPageNo(targetPage)}
        />
      </div>

      {/* --- MODALS SECTION --- */}
      {isOpenModal === "ADDCATEGORY" && (
        <AddProjectCategory
          setModal={() => setIsOpenModal("")}
          getAllCategories={getAllCategories}
        />
      )}

      {isOpenModal === "EDITCATEGORY" && (
        <EditCategory
          setModal={() => setIsOpenModal("")}
          selectCategory={selectCategory}
          getAllCategories={getAllCategories}
        />
      )}

      {isOpenModal === "DELETECATEGORY" && (
        <ConfirmationModal
          isOpen={() => setIsOpenModal("DELETECATEGORY")}
          onClose={() => setIsOpenModal("")}
          message="Are you sure you want to delete this category?"
          onConfirm={handleDeleteCategory}
        />
      )}
    </div>
  );
};
