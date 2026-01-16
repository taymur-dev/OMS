import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";
import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddSale } from "../../Components/SaleModals/AddSale";
import { EditSale } from "../../Components/SaleModals/EditSale";
import { ViewSale } from "../../Components/SaleModals/ViewSale";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { Loader } from "../../Components/LoaderComponent/Loader";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

type SALET = "ADD" | "EDIT" | "DELETE" | "VIEW" | "";

type Sale = {
  id: number;
  projectId: number;
  projectName: string;
  customerId: number;
  customerName: string;
  saleDate: string;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("sv-SE");

const pageSizes = [10, 25, 50, 100];

export const Sales = () => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const token = currentUser?.token;

  const [isOpenModal, setIsOpenModal] = useState<SALET>("");
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [catchId, setCatchId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);

  const handleToggleViewModal = (active: SALET) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const handleGetSales = useCallback(async () => {
    try {
      dispatch(navigationStart());

      const res = await axios.get(`${BASE_URL}/api/admin/getSales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllSales(res.data.sort((a: Sale, b: Sale) => a.id - b.id));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("SALE"));
    }
  }, [dispatch, token]);

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    handleToggleViewModal("EDIT");
  };

  const handleDeleteClick = (id: number) => {
    setCatchId(id);
    handleToggleViewModal("DELETE");
  };

  const handleView = (sale: Sale) => {
    setSelectedSale(sale);
    handleToggleViewModal("VIEW");
  };

  const handleDeleteSale = async () => {
    if (!catchId) return;
    try {
      dispatch(navigationStart());

      await axios.patch(
        `${BASE_URL}/api/admin/deleteSale/${catchId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleGetSales();
      handleToggleViewModal("");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(navigationSuccess("SALE"));
    }
  };

  useEffect(() => {
    document.title = "(OMS) SALE";
    handleGetSales();
  }, [handleGetSales]);

  const filteredSales = useMemo(() => {
    return allSales
      .filter(
        (sale) =>
          sale.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.id - b.id);
  }, [allSales, searchTerm]);

  const handleIncrementPageButton = () => setPageNo((p) => p + 1);

  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Sale" activeFile="Sales list" />

      <div className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white flex flex-col">
        <div className="flex items-center justify-between mx-2 py-2">
          <span>
            Total Sales :
            <span className="text-2xl text-indigo-900 font-semibold">
              [{filteredSales.length}]
            </span>
          </span>

          <CustomButton
            label="Add Sale"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between mx-2 py-2">
          <div>
            Show
            <select
              className="mx-2 p-1 border rounded"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPageNo(1);
              }}
            >
              {pageSizes.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            entries
          </div>

          <TableInputField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="flex-1 mx-2">
          <div className="grid grid-cols-5 bg-indigo-900 text-white font-semibold text-sm p-3 sticky top-0">
            <span>Sr#</span>
            <span>Customer</span>
            <span>Project</span>
            <span>Date</span>
            <span className="text-center">Actions</span>
          </div>

          {filteredSales
            .slice((pageNo - 1) * limit, pageNo * limit)
            .map((sale, index) => (
              <div
                key={sale.id}
                className="grid grid-cols-5 text-sm border-b p-2 items-center hover:bg-gray-50"
              >
                <span>{(pageNo - 1) * limit + index + 1}</span>
                <span>{sale.customerName}</span>
                <span>{sale.projectName}</span>
                <span>{formatDate(sale.saleDate)}</span>

                <span className="flex justify-center gap-2">
                  <EditButton handleUpdate={() => handleEdit(sale)} />
                  <ViewButton handleView={() => handleView(sale)} />
                  <DeleteButton
                    handleDelete={() => handleDeleteClick(sale.id)}
                  />
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <ShowDataNumber
          start={(pageNo - 1) * limit + 1}
          end={Math.min(pageNo * limit, filteredSales.length)}
          total={filteredSales.length}
        />

        <Pagination
          pageNo={pageNo}
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddSale
          setModal={() => handleToggleViewModal("")}
          handleGetsales={handleGetSales}
        />
      )}

      {isOpenModal === "EDIT" && selectedSale && (
        <EditSale
          setModal={() => handleToggleViewModal("")}
          seleteSale={selectedSale}
          handleGetsales={handleGetSales}
        />
      )}

      {isOpenModal === "VIEW" && selectedSale && (
        <ViewSale
          setIsOpenModal={() => handleToggleViewModal("")}
          viewSale={{
            projectName: selectedSale.projectName,
            customerName: selectedSale.customerName,
            saleDate: selectedSale.saleDate,
          }}
        />
      )}

      {isOpenModal === "DELETE" && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("")}
          onClose={() => handleToggleViewModal("DELETE")}
          onConfirm={handleDeleteSale}
          message="Are you sure you want to delete this sale?"
        />
      )}
    </div>
  );
};
