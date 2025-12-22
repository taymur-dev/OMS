import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { useCallback, useEffect, useState } from "react";
import { AddSale } from "../../Components/SaleModals/AddSale";
import { EditSale } from "../../Components/SaleModals/EditSale";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { Loader } from "../../Components/LoaderComponent/Loader";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

type SALET = "ADD" | "EDIT" | "DELETE" | "";

const numbers = [10, 25, 50, 100];

type ADDSALET = {
  id: number;
  projectId: number;
  projectName: string;
  customerId: number;
  customerName: string;
};

export const Sales = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);

  const { loader } = useAppSelector((state) => state.NavigateSate);

  const dispatch = useAppDispatch();
  const [isOpenModal, setIsOpenModal] = useState<SALET>("");

  const [allSales, setAllSales] = useState<ADDSALET[] | null>(null);

  console.log("moth mar k ", allSales);

  const [seleteSale, setSeleteSale] = useState<ADDSALET | null>(null);

  const [catchId, setCatchId] = useState<number>();

    const [searchTerm, setSearchTerm] = useState("");


  console.log(catchId);

  const handleToggleViewModal = (active: SALET) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const token = currentUser?.token;

  console.log("=>", allSales?.length);

  const handleGetsales = useCallback (async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getSales`, {
        headers: {
          Authorization: token,
        },
      });
      setAllSales(res.data);
    } catch (error) {
      console.log(error);
    }
  } , [token]);

  const handleClickEditButtton = (data: ADDSALET) => {
    handleToggleViewModal("EDIT");
    setSeleteSale(data);
  };

  const handleClickDeleteButton = (id: number) => {
    handleToggleViewModal("DELETE");
    setCatchId(id);
  };

  const handleDeleteSale = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/admin/deleteSale/${catchId}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetsales();
    document.title = "(OMS) SALE";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("SALE"));
    }, 1000);
  }, [ dispatch , handleGetsales]);

  if (loader) return <Loader />;
  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Sale" activeFile="All Sale,s list" />
      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-500 bg-white overflow-hidden flex flex-col ">
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Attendance :{" "}
            <span className="text-2xl text-blue-500 font-semibold font-sans">
              [10]
            </span>
          </span>
          <CustomButton
            label="Add Sale"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>
        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select>
                {numbers.map((num, index) => (
                  <option key={index}>{num}</option>
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
        <div className="w-full max-h-[28.4rem] overflow-y-auto  mx-auto">
          <div className="grid grid-cols-4 bg-gray-200 text-gray-900 font-semibold border border-gray-600 text-sm sticky top-0 z-10 p-[10px] ">
            <span className="">Sr</span>
            <span className="">Project</span>
            <span className="">Customer</span>
            <span className="text-center w-32">Actions</span>
          </div>

          {allSales?.length === 0 ? (
            <div className="text-gray-800 text-center">No data found</div>
          ) : (
            allSales?.map((sale, index) => (
              <div
                className="grid grid-cols-4 border border-gray-600 text-gray-800  hover:bg-gray-100 transition duration-200 text-sm items-center justify-center p-[7px]"
                key={sale.id}
              >
                <span className="px-2 ">{index + 1}</span>
                <span className=" ">{sale.projectName}</span>
                <span className=" ">{sale.customerName}</span>
                <span className="flex items-center  gap-1">
                  <EditButton
                    handleUpdate={() => handleClickEditButtton(sale)}
                  />

                  <DeleteButton
                    handleDelete={() => handleClickDeleteButton(sale.id)}
                  />
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <ShowDataNumber start={1} total={10} end={1 + 9} />
        <Pagination />
      </div>

      {isOpenModal === "ADD" && (
        <AddSale
          setModal={() => handleToggleViewModal("")}
          handleGetsales={handleGetsales}
        />
      )}

      {isOpenModal === "EDIT" && (
        <EditSale
          setModal={() => handleToggleViewModal("")}
          seleteSale={seleteSale}
          handleGetsales={handleGetsales}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("DELETE")}
          onClose={() => handleToggleViewModal("")}
          onConfirm={() => handleDeleteSale()}
          message="Are you sure you want to delete this Sale?"
        />
      )}
    </div>
  );
};
