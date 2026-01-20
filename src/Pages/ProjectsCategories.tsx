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

  // return (
  //   <div className="w-full mx-2">
  //     <TableTitle
  //       tileName="Project Category"
  //       activeFile="Project Categorylist"
  //     />

  //     <div
  //       className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900
  //      bg-white overflow-hidden flex flex-col"
  //     >
  //       <div className="flex items-center justify-between mx-2 text-gray-800">
  //         <span>
  //           Total Number of Project Categories :
  //           <span className="text-2xl text-indigo-900 font-semibold ml-1">
  //             [{filteredCategories.length}]
  //           </span>
  //         </span>
  //         <CustomButton
  //           label="Add Category"
  //           handleToggle={() => handleToggleViewModal("ADDCATEGORY")}
  //         />
  //       </div>

  //       <div className="flex items-center justify-between mx-2 text-gray-800">
  //         <div className="flex items-center gap-2">
  //           <span>Show</span>
  //           <select
  //             value={selectedValue}
  //             onChange={handleChangeShowData}
  //             className="bg-gray-200 rounded px-2 py-1"
  //           >
  //             {numbers.map((num) => (
  //               <option key={num}>{num}</option>
  //             ))}
  //           </select>
  //           <span>entries</span>
  //         </div>

  //         <TableInputField
  //           searchTerm={searchTerm}
  //           setSearchTerm={(term) => {
  //             setSearchTerm(term);
  //             setPageNo(1);
  //           }}
  //         />
  //       </div>

  //       <div className="max-h-[28.4rem] overflow-y-auto mx-2">
  //         <div
  //           className="grid grid-cols-3 bg-indigo-900 text-white font-semibold
  //   border border-gray-900 text-sm sticky top-0 z-10 px-3 py-2 items-center"
  //         >
  //           <span>Sr#</span>
  //           <span>Project Category</span>
  //           <span className="text-center">Actions</span>
  //         </div>

  //         {paginatedCategories.map((category, index) => (
  //           <div
  //             key={category.id}
  //             className="grid grid-cols-3 border border-gray-600 text-gray-800
  //             hover:bg-gray-100 transition text-sm items-center p-[7px]"
  //           >
  //             <span>{startIndex + index + 1}</span>
  //             <span>{category.categoryName}</span>
  //             <span className="flex gap-2 justify-center">
  //               <EditButton
  //                 handleUpdate={() => handleSelectCategory(category)}
  //               />
  //               <DeleteButton
  //                 handleDelete={() => clickDeleteButton(category.id)}
  //               />
  //             </span>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     <div className="flex items-center justify-between mt-2">
  //       <ShowDataNumber
  //         start={startIndex + 1}
  //         end={Math.min(endIndex, filteredCategories.length)}
  //         total={filteredCategories.length}
  //       />
  //       <Pagination
  //         pageNo={pageNo}
  //         handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
  //         handleIncrementPageButton={() =>
  //           pageNo * selectedValue < filteredCategories.length &&
  //           setPageNo((p) => p + 1)
  //         }
  //       />
  //     </div>

  //     {isOpenModal === "ADDCATEGORY" && (
  //       <AddProjectCategory
  //         setModal={() => setIsOpenModal("")}
  //         getAllCategories={getAllCategories}
  //       />
  //     )}

  //     {isOpenModal === "EDITCATEGORY" && (
  //       <EditCategory
  //         setModal={() => setIsOpenModal("")}
  //         selectCategory={selectCategory}
  //         getAllCategories={getAllCategories}
  //       />
  //     )}

  //     {isOpenModal === "DELETECATEGORY" && (
  //       <ConfirmationModal
  //         isOpen={() => setIsOpenModal("DELETECATEGORY")}
  //         onClose={() => setIsOpenModal("")}
  //         message="Are you sure you want to delete this category?"
  //         onConfirm={handleDeleteCategory}
  //       />
  //     )}
  //   </div>
  // );
  return (
    <div className="w-full px-2 sm:px-4">
      <TableTitle
        tileName="Project Category"
        activeFile="Project Category list"
      />

      <div className="max-h-[70vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 py-2 text-gray-800">
          <span className="text-sm sm:text-base">
            Total Number of Project Categories :
            <span className="ml-1 text-xl sm:text-2xl text-indigo-900 font-semibold">
              [{filteredCategories.length}]
            </span>
          </span>

          <CustomButton
            label="Add Category"
            handleToggle={() => handleToggleViewModal("ADDCATEGORY")}
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between px-2 text-gray-800">
          <div className="text-sm flex items-center gap-2">
            <span>Show</span>
            <select
              value={selectedValue}
              onChange={handleChangeShowData}
              className="bg-gray-200 rounded px-2 py-1"
            >
              {numbers.map((num) => (
                <option key={num}>{num}</option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
              setSearchTerm(term);
              setPageNo(1);
            }}
          />
        </div>

        {/* Table Wrapper */}
        <div className="mx-2 mt-2 overflow-x-auto max-h-[28.4rem]">
          <div className="min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-[0.5fr_2fr_1fr] bg-indigo-900 items-center text-white
             font-semibold text-sm sticky top-0 z-10 p-2">
              <span>Sr#</span>
              <span>Project Category</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {paginatedCategories.length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-4">
                No records available at the moment!
              </div>
            ) : (
              paginatedCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="grid grid-cols-[0.5fr_2fr_1fr] border border-gray-300 items-center
                   text-gray-800 text-sm p-2 hover:bg-gray-100 transition"
                >
                  <span>{startIndex + index + 1}</span>
                  <span className="truncate">{category.categoryName}</span>
                  <span className="flex flex-wrap items-center justify-center gap-1">
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
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between mt-3">
        <ShowDataNumber
          start={paginatedCategories.length === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, filteredCategories.length)}
          total={filteredCategories.length}
        />

        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
          handleIncrementPageButton={() =>
            pageNo * selectedValue < filteredCategories.length &&
            setPageNo((p) => p + 1)
          }
        />
      </div>

      {/* Modals */}
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
