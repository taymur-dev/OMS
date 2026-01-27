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
import { Footer } from "../Components/Footer";


type TPROJECTCATEGORY = "ADDCATEGORY" | "EDITCATEGORY" | "DELETECATEGORY" | "";

type CATEGORYT = {
  id: number;
  categoryName: string;
};

const numbers = [5, 10, 15, 20];

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
  const [selectedValue, setSelectedValue] = useState(10);

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
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = Math.min(
    startIndex + selectedValue,
    filteredCategories.length,
  );

  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const handleChangeShowData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(Number(e.target.value));
    setPageNo(1);
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
        { headers: { Authorization: token } },
      );
      getAllCategories();
      toast.success("Category has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  if (loader) return <Loader />;

  

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Category button as the rightElement */}
        <TableTitle
          tileName="Project Category"
          rightElement={
            <CustomButton
              label="+ Add Category"
              handleToggle={() => handleToggleViewModal("ADDCATEGORY")}
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
                  value={selectedValue}
                  onChange={handleChangeShowData}
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
              setSearchTerm={(term) => {
                setSearchTerm(term);
                setPageNo(1);
              }}
            />
          </div>
        </div>

        {/* --- MIDDLE SECTION (Scrollable Table) --- */}
        <div className="overflow-auto px-2">
          <div className="min-w-[600px]">
            {/* Sticky Table Header */}
            <div
              className="grid grid-cols-3 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Project Category</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedCategories.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              paginatedCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="grid grid-cols-3 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{category.categoryName}</span>
                  <span className="flex flex-nowrap justify-center gap-1">
                    <EditButton
                      handleUpdate={() => handleSelectCategory(category)}
                    />
                    <DeleteButton
                      handleDelete={() => clickDeleteButton(category.id)}
                    />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between">
          <ShowDataNumber
            start={paginatedCategories.length === 0 ? 0 : startIndex + 1}
            end={Math.min(endIndex, filteredCategories.length)}
            total={filteredCategories.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={() =>
              setPageNo((p) => Math.max(p - 1, 1))
            }
            handleIncrementPageButton={() =>
              pageNo * selectedValue < filteredCategories.length &&
              setPageNo((p) => p + 1)
            }
          />
        </div>
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

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
