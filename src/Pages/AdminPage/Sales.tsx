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
import { Footer } from "../../Components/Footer";

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
  new Date(date)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

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
        },
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
          sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.id - b.id);
  }, [allSales, searchTerm]);

  const handleIncrementPageButton = () => setPageNo((p) => p + 1);

  const handleDecrementPageButton = () => setPageNo((p) => Math.max(p - 1, 1));

  if (loader) return <Loader />;

  return (
    <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
      <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
        {/* 1 & 3) Table Title with Add Sale button */}
        <TableTitle
          tileName="Sale"
          rightElement={
            <CustomButton
              handleToggle={() => handleToggleViewModal("ADD")}
              label="+ Add Sale"
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
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPageNo(1);
                  }}
                  className="bg-transparent outline-none py-1 cursor-pointer"
                >
                  {pageSizes.map((num) => (
                    <option key={num} value={num}>
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
              className="grid grid-cols-5 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
            >
              <span>Sr#</span>
              <span>Customer</span>
              <span>Project</span>
              <span>Date</span>
              <span className="text-center">Actions</span>
            </div>

            {/* Table Body */}
            {filteredSales.slice((pageNo - 1) * limit, pageNo * limit)
              .length === 0 ? (
              <div className="text-gray-800 text-lg text-center py-10">
                No records available at the moment!
              </div>
            ) : (
              filteredSales
                .slice((pageNo - 1) * limit, pageNo * limit)
                .map((sale, index) => (
                  <div
                    key={sale.id}
                    className="grid grid-cols-5 border-b border-x border-gray-200 text-gray-800 items-center
                   text-sm p-2 hover:bg-gray-50 transition"
                  >
                    <span>{(pageNo - 1) * limit + index + 1}</span>
                    <span className="truncate">{sale.customerName}</span>
                    <span className="truncate">{sale.projectName}</span>
                    <span>{formatDate(sale.saleDate)}</span>
                    <span className="flex flex-nowrap justify-center gap-1">
                      <EditButton handleUpdate={() => handleEdit(sale)} />
                      <ViewButton handleView={() => handleView(sale)} />
                      <DeleteButton
                        handleDelete={() => handleDeleteClick(sale.id)}
                      />
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* 4) Pagination placed under the table */}
        <div className="flex flex-row sm:flex-row gap-2 items-center justify-between p-2">
          <ShowDataNumber
            start={filteredSales.length === 0 ? 0 : (pageNo - 1) * limit + 1}
            end={Math.min(pageNo * limit, filteredSales.length)}
            total={filteredSales.length}
          />
          <Pagination
            pageNo={pageNo}
            handleDecrementPageButton={handleDecrementPageButton}
            handleIncrementPageButton={handleIncrementPageButton}
          />
        </div>
      </div>

      {/* --- MODALS SECTION --- */}
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
          onClose={() => handleToggleViewModal("")}
          onConfirm={handleDeleteSale}
          message="Are you sure you want to delete this sale?"
        />
      )}

      {/* --- FOOTER SECTION --- */}
      <div className="border border-t-5 border-gray-200">
        <Footer />
      </div>
    </div>
  );
};
