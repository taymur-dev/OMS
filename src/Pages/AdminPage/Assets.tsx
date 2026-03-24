import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
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
import { RiInboxArchiveLine } from "react-icons/ri";
import { toast } from "react-toastify";

type AssetT = "ADD" | "VIEW" | "EDIT" | "DELETE" | "";

type AssetType = {
  id: number;
  asset_name: string;
  category_name: string;
  category_id?: string;
  description?: string;
  date?: string;
};

interface AssetsProps {
  triggerModal: number;
  externalSearch: string;
  externalPageSize: number;
}

export const Assets = ({
  triggerModal,
  externalSearch,
  externalPageSize,
}: AssetsProps) => {
  const { loader } = useAppSelector((state) => state.NavigateState);
  const dispatch = useAppDispatch();

  const [isOpenModal, setIsOpenModal] = useState<AssetT>("");
  const [pageNo, setPageNo] = useState(1);

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
    document.title = "(OMS) ASSETS";
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("Assets"));
    }, 1000);
    fetchAssets();
  }, [dispatch]);

  // Handle external search and pagination changes
  useEffect(() => {
    setPageNo(1);
  }, [externalSearch, externalPageSize]);

  useEffect(() => {
    if (triggerModal > 0) {
      setIsOpenModal("ADD");
    }
  }, [triggerModal]);

  const handleIncrementPageButton = () => {
    const totalPages = Math.ceil(filteredAssets.length / externalPageSize);
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handleDecrementPageButton = () =>
    setPageNo((prev) => (prev > 1 ? prev - 1 : 1));

  const handleToggleViewModal = (active: AssetT) =>
    setIsOpenModal((prev) => (prev === active ? "" : active));

  const handleDeleteAsset = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/deleteassets/${id}`);

      toast.success("Asset deleted successfully");

      fetchAssets();
      setIsOpenModal("");
    } catch (err) {
      console.error("Failed to delete asset:", err);

      toast.error("Failed to delete asset ");
    }
  };

  if (loader) return <Loader />;

  const filteredAssets = assets.filter(
    (asset) =>
      asset.asset_name.toLowerCase().includes(externalSearch.toLowerCase()) ||
      asset.category_name.toLowerCase().includes(externalSearch.toLowerCase()),
  );

  const totalNum = filteredAssets.length;
  const startIndex = (pageNo - 1) * externalPageSize;
  const endIndex = startIndex + externalPageSize;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col flex-grow bg-white overflow-hidden">
      {/* Middle Section (Scrollable Table) */}
      <div className="overflow-auto px-3 sm:px-0">
        <div className="min-w-[900px]">
          <div className="px-0.5 pt-0.5">
            <div
              className="grid grid-cols-[80px_1fr_1fr_auto] 
            bg-blue-400 text-white rounded-lg items-center font-bold
            text-xs tracking-wider sticky top-0 z-10 gap-3 px-3 py-3 shadow-sm"
            >
              <span className="text-left">Sr#</span>
              <span className="text-left">Asset Name</span>
              <span className="text-left">Category</span>
              {/* Adjusted width and alignment to match UsersDetails Actions header */}
              <span className="text-right w-[140px] pr-4">Actions</span>
            </div>
          </div>

          <div className="px-0.5 sm:px-1 py-2">
            {paginatedAssets.length === 0 ? (
              <div className="bg-gray-50 rounded-lg border p-12 flex flex-col items-center justify-center text-gray-400">
                <RiInboxArchiveLine size={48} className="mb-3 text-gray-300" />
                <p className="text-lg font-medium">No records available!</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {paginatedAssets.map((asset, index) => (
                  <div
                    key={asset.id}
                    className="grid grid-cols-[80px_1fr_1fr_auto] 
                  items-center px-3 py-2 gap-3 text-sm bg-white 
                  border border-gray-100 rounded-lg 
                  hover:bg-blue-50/30 transition-colors shadow-sm"
                  >
                    <span className="text-gray-500 font-medium">
                      {startIndex + index + 1}
                    </span>

                    {/* Icon removed, text-only alignment */}
                    <div className="truncate text-gray-800">
                      {asset.asset_name}
                    </div>

                    {/* Icon removed, text-only alignment */}
                    <div className="text-gray-600 truncate">
                      {asset.category_name}
                    </div>

                    {/* Actions container adjusted to match UsersDetails alignment */}
                    <div className="flex items-center justify-end gap-1 w-[140px]">
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
                      <EditButton
                        handleUpdate={() => {
                          setSelectedAsset(asset);
                          handleToggleViewModal("EDIT");
                        }}
                      />
                      <DeleteButton
                        handleDelete={() => {
                          setAssetToDelete(asset.id);
                          handleToggleViewModal("DELETE");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION (Pagination) */}
      <div className="flex flex-row items-center justify-between p-1">
        <ShowDataNumber
          start={totalNum === 0 ? 0 : startIndex + 1}
          end={Math.min(endIndex, totalNum)}
          total={totalNum}
        />
        <Pagination
          pageNo={pageNo}
          handleDecrementPageButton={handleDecrementPageButton}
          handleIncrementPageButton={handleIncrementPageButton}
        />
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
    </div>
  );
};
