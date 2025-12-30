import { ShowDataNumber } from "../Components/Pagination/ShowDataNumber";
import { Pagination } from "../Components/Pagination/Pagination";
import { TableInputField } from "../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../Components/TableLayoutComponents/TableTitle";
import { useAppDispatch, useAppSelector } from "../redux/Hooks";
import { useEffect, useState, useCallback } from "react";
import { navigationStart, navigationSuccess } from "../redux/NavigationSlice";
import { Loader } from "../Components/LoaderComponent/Loader";
import { AddProjectCategory } from "../Components/ProjectCategoryModal/AddProjectCategory";
import { EditCategory } from "../Components/ProjectCategoryModal/EditCategory";
import { ConfirmationModal } from "../Components/Modal/ComfirmationModal";
import { EditButton } from "../Components/CustomButtons/EditButton";
import { DeleteButton } from "../Components/CustomButtons/DeleteButton";
import axios from "axios";
import { BASE_URL } from "../Content/URL";
import { toast } from "react-toastify";

type TPROJECTCATEGORY = "ADDCATEGORY" | "EDITCATEGORY" | "DELETECATEGORY" | "";

type CATEGORYT = {
  id: number;
  categoryName: string;
};

const ITEMS_PER_PAGE = 10;

export const ProjectsCatogries = () => {
  const { loader } = useAppSelector((state) => state?.NavigateState);
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const dispatch = useAppDispatch();

  const [allCategories, setAllCategories] = useState<CATEGORYT[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<TPROJECTCATEGORY>("");
  const [selectCategory, setSelectCategory] = useState<CATEGORYT | null>(null);
  const [catchId, setCatchId] = useState<number>();
  const [pageNo, setPageNo] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    setPageNo(1);
  }, [searchTerm]);

  const filteredCategories = allCategories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (pageNo - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const handleIncrementPageButton = () => {
    setPageNo((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handleDecrementPageButton = () => {
    setPageNo((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleToggleViewModal = (active: TPROJECTCATEGORY) => {
    setIsOpenModal(active);
  };

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
        { headers: { Authorization: token } }
      );
      getAllCategories();
      toast.success("Category has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle
        tileName="Project Category"
        activeFile="Project Categorylist"
      />

      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500
       bg-white overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mx-2 text-gray-800">
          <span>
            Total Number of Project Categories :
            <span className="text-2xl text-blue-500 font-semibold ml-1">
              [{filteredCategories.length}]
            </span>
          </span>
          <CustomButton
            label="Add Category"
            handleToggle={() => handleToggleViewModal("ADDCATEGORY")}
          />
        </div>

        <div className="flex items-center justify-between mx-2 text-gray-800">
          <div />
          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="w-full max-h-[28.4rem] overflow-y-auto mx-auto">
          <div
            className="grid grid-cols-[0.5fr_1fr_1fr] bg-gray-200 font-semibold 
    border border-gray-600 text-sm sticky top-0 z-10 px-3 py-2 items-center"
          >
            <span>Sr#</span>
            <span>Name</span>
            <span className="text-center">Actions</span>
          </div>

          {paginatedCategories.map((category, index) => (
            <div
              key={category.id}
              className="grid grid-cols-[0.5fr_1fr_1fr] border border-gray-600 text-gray-800 
              hover:bg-gray-100 transition text-sm items-center p-[7px]"
            >
              <span>{startIndex + index + 1}</span>
              <span>{category.categoryName}</span>
              <span className="flex gap-2 justify-center">
                <EditButton
                  handleUpdate={() => handleSelectCategory(category)}
                />
                <DeleteButton
                  handleDelete={() => clickDeleteButton(category.id)}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={startIndex + 1}
          end={Math.min(endIndex, filteredCategories.length)}
          total={filteredCategories.length}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
      </div>

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
