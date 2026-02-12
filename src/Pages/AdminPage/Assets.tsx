import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { CustomButton } from "../../Components/TableLayoutComponents/CustomButton";
import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

import { ViewButton } from "../../Components/CustomButtons/ViewButton";
import { EditButton } from "../../Components/CustomButtons/EditButton";
import { DeleteButton } from "../../Components/CustomButtons/DeleteButton";

import { UpdateAsset } from "../../Components/AssetsModal/UpdateAsset";
import { ConfirmationModal } from "../../Components/Modal/ComfirmationModal";
import { AddAsset } from "../../Components/AssetsModal/AddAsset";
import {
  ViewAsset,
  AssetDetailT,
} from "../../Components/AssetsModal/ViewAsset";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";
import { Loader } from "../../Components/LoaderComponent/Loader";
import { Footer } from "../../Components/Footer";


const numbers = [10, 25, 50, 100];

type AssetT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

type AssetType = {
  id: number;
  asset_name: string;
  category_name: string;
  category_id?: string;
  description?: string;
  date?: string;
};

export const Assets = () => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<AssetT>("");
  const [pageNo, setPageNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [assets, setAssets] = useState<AssetType[]>([]);
  const [assetToDelete, setAssetToDelete] = useState<number | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [viewAsset, setViewAsset] = useState<AssetDetailT | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/assets`);
      setAssets(res.data);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    }
  };

  useEffect(() => {
    document.title = "(OMS) CONFIG TIME";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("JCONFIG TIME"));
    }, 1000);

    fetchAssets();
  }, [dispatch]);

  const handleChangeShowData = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedValue(Number(event.target.value));
    setPageNo(1);
  };

  const handleIncrementPageButton = () => {
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };
  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleToggleViewModal = (active: AssetT) =>
    setIsOpenModal((prev) => (prev === active ? "" : active));

  const handleDeleteAsset = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteassets/${id}`);
      fetchAssets();
      setIsOpenModal("");
    } catch (err) {
      console.error("Failed to delete asset:", err);
    }
  };

  if (loader) return <Loader />;

  const filteredAssets = assets.filter((asset) =>
    asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredAssets.length / selectedValue) || 1;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  return (
  <div className="flex flex-col flex-grow shadow-lg p-2 rounded-lg bg-gray overflow-hidden">
    <div className="min-h-screen w-full flex flex-col shadow-lg bg-white">
      {/* 1 & 3) Table Title with Add Asset button as the rightElement */}
      <TableTitle
        tileName="Assets"
        rightElement={
          <CustomButton
            handleToggle={() => handleToggleViewModal("ADD")}
            label="+ Add Asset"
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
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      {/* --- MIDDLE SECTION (Scrollable Table) --- */}
      <div className="overflow-auto px-2">
        <div className="min-w-[900px]">
          {/* Sticky Table Header */}
          <div
            className="grid grid-cols-4 bg-indigo-900 text-white items-center font-semibold
             text-sm sticky top-0 z-10 p-2"
          >
            <span>Sr#</span>
            <span>Asset</span>
            <span>Asset Category</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Table Body */}
          {paginatedAssets.length === 0 ? (
            <div className="text-gray-800 text-lg text-center py-10">
              No records available at the moment!
            </div>
          ) : (
            paginatedAssets.map((asset, index) => (
              <div
                key={asset.id}
                className="grid grid-cols-4 border-b border-x border-gray-200 text-gray-800 items-center
                 text-sm p-2 hover:bg-gray-50 transition"
              >
                <span>{startIndex + index + 1}</span>
                <span className="truncate">{asset.asset_name}</span>
                <span className="truncate">{asset.category_name}</span>
                <span className="flex flex-nowrap justify-center gap-1">
                  <EditButton
                    handleUpdate={() => {
                      setSelectedAsset(asset);
                      handleToggleViewModal("EDIT");
                    }}
                  />
                  <ViewButton
                    handleView={() => {
                      setViewAsset({
                        asset_name: asset.asset_name,
                        category_name: asset.category_name,
                        description: asset.description,
                        date: asset.date,
                      });
                      handleToggleViewModal("VIEW");
                    }}
                  />
                  <DeleteButton
                    handleDelete={() => {
                      setAssetToDelete(asset.id);
                      handleToggleViewModal("DELETE");
                    }}
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
          start={filteredAssets.length === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, filteredAssets.length)}
          total={filteredAssets.length}
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
      <AddAsset
        setModal={() => handleToggleViewModal("")}
        refreshAssets={fetchAssets}
        existingAssets={assets}
      />
    )}

    {isOpenModal === "EDIT" && selectedAsset && (
      <UpdateAsset
        setModal={() => handleToggleViewModal("")}
        assetData={{
          id: selectedAsset.id,
          asset_name: selectedAsset.asset_name,
          category_id: selectedAsset.category_id || "",
          description: selectedAsset.description || "",
          date: selectedAsset.date || "",
        }}
        refreshAssets={fetchAssets}
        existingAssets={assets}
      />
    )}

    {isOpenModal === "VIEW" && (
      <ViewAsset
        viewAsset={viewAsset}
        setIsOpenModal={() => handleToggleViewModal("")}
      />
    )}

    {isOpenModal === "DELETE" && assetToDelete !== null && (
      <ConfirmationModal
        isOpen={() => handleToggleViewModal("")}
        onClose={() => handleToggleViewModal("")}
        onConfirm={() => handleDeleteAsset(assetToDelete)}
        message="Are you sure you want to delete this Asset?"
      />
    )}

    {/* --- FOOTER SECTION --- */}
    <div className="border border-t-5 border-gray-200">
      <Footer />
    </div>
  </div>
);
};
