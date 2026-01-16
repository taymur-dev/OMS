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
    event: React.ChangeEvent<HTMLSelectElement>
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
    asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / selectedValue) || 1;
  const startIndex = (pageNo - 1) * selectedValue;
  const endIndex = startIndex + selectedValue;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Assets" activeFile="Assets list" />
      <div
        className="max-h-[74.5vh] h-full shadow-lg border-t-2 rounded border-indigo-900 bg-white
       overflow-hidden flex flex-col"
      >
        <div className="flex text-gray-800 items-center justify-between mx-2">
          <span>
            Total number of Assets :{" "}
            <span className="text-2xl text-indigo-900 font-semibold font-sans">
              [{assets.length}]
            </span>
          </span>
          <CustomButton
            label="Add Asset"
            handleToggle={() => handleToggleViewModal("ADD")}
          />
        </div>

        <div className="flex items-center justify-between text-gray-800 mx-2">
          <div>
            <span>Show</span>
            <span className="bg-gray-200 rounded mx-1 p-1">
              <select value={selectedValue} onChange={handleChangeShowData}>
                {numbers.map((num, index) => (
                  <option key={index} value={num}>
                    {num}
                  </option>
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

        {/* Table */}
        <div className="max-h-[28.4rem] overflow-y-auto mx-2">
          <div
            className="grid grid-cols-4 bg-indigo-900 text-white font-semibold border border-gray-600 
          text-sm sticky top-0 z-10 p-[10px]"
          >
            <span>Sr#</span>
            <span>Asset</span>
            <span>Asset Category</span>
            <span className="text-center w-40">Actions</span>
          </div>

          {paginatedAssets.map((asset, index) => (
            <div
              key={asset.id}
              className="grid grid-cols-4 border border-gray-600 text-gray-800 hover:bg-gray-100 transition 
              duration-200 text-sm items-center justify-center p-[7px]"
            >
              <span className="px-2">{startIndex + index + 1}</span>
              <span>{asset.asset_name}</span>
              <span>{asset.category_name}</span>
              <span className="flex items-center gap-1">
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
          ))}

          {paginatedAssets.length === 0 && (
            <div className="text-center py-5 text-gray-500">
              No assets found.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <ShowDataNumber
          start={startIndex + 1}
          total={filteredAssets.length}
          end={Math.min(endIndex, filteredAssets.length)}
        />
        <Pagination
          handleIncrementPageButton={handleIncrementPageButton}
          handleDecrementPageButton={handleDecrementPageButton}
          pageNo={pageNo}
        />
      </div>

      {isOpenModal === "ADD" && (
        <AddAsset
          setModal={() => handleToggleViewModal("")}
          refreshAssets={fetchAssets}
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
        />
      )}
      {isOpenModal === "DELETE" && assetToDelete !== null && (
        <ConfirmationModal
          isOpen={() => handleToggleViewModal("")}
          onClose={() => handleToggleViewModal("DELETE")}
          onConfirm={() => handleDeleteAsset(assetToDelete)}
          message="Are you sure you want to delete this Asset?"
        />
      )}

      {isOpenModal === "VIEW" && (
        <ViewAsset
          viewAsset={viewAsset}
          setIsOpenModal={() => handleToggleViewModal("")}
        />
      )}
    </div>
  );
};
