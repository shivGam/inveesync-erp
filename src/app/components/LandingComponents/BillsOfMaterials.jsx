"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  useFetchBoM,
  useCreateBoMMutation,
  useUpdateBoMMutation,
  useDeleteBoMMutation,
} from "@/app/queries/BoM";
import { useFetchItems } from "@/app/queries/ItemsMaster";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUpload,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Loading from "../Loading";
import Select from "react-select";
import BulkUploadModal from "@/app/modals/BulkUploadModal";
import { BomFormModal } from "@/app/modals/BomModal";
import BomBulkModal from "@/app/modals/BomBulkModal";
import ErrorCard from "../ErrorCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validateBoMEntry = (component) => {
  return (
    !component.item_id ||
    !component.component_id ||
    !component.quantity ||
    isNaN(Number(component.quantity)) ||
    Number(component.quantity) <= 0 ||
    (component.uom === "Nos" && !Number.isInteger(Number(component.quantity)))
  );
};

const BillsOfMaterials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [errors, setErrors] = useState([]);
  const [components, setComponents] = useState([]);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: bomData,
    isLoading: bomLoading,
    isError: isBomError,
    error: bomError,
  } = useFetchBoM();
  const { data: itemsData, isLoading: itemsLoading } = useFetchItems();
  const createBoMMutation = useCreateBoMMutation();
  const updateBoMMutation = useUpdateBoMMutation();
  const deleteBoMMutation = useDeleteBoMMutation();

  const [itemsTypes, setItemsTypes] = useState({});

  useEffect(() => {
    // Check if itemsData is available and is an array
    if (itemsData && Array.isArray(itemsData)) {
      // Create a new object to avoid mutating the existing state
      const newItemsTypes = {};

      // Loop through the data and transform it into the desired object format
      itemsData.forEach((item) => {
        if (item.id && item.type) {
          newItemsTypes[item.id] = item.type;
        }
      });

      // Update the state with the transformed object
      setItemsTypes(newItemsTypes);
    }
  }, [itemsData]);

  useEffect(() => {
    if (bomData) {
      setComponents(
        bomData.map((item) => ({
          id: item.id,
          item_id: item.item_id,
          component_id: item.component_id,
          quantity: item.quantity,
          uom: item.uom || "KG",
        }))
      );
    }
  }, [bomData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return components;
    return components.filter((item) =>
      [item.item_id, item.component_id, item.uom]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [components, searchQuery]);

  const handleRemove = (id) => {
    deleteBoMMutation.mutate(id, {
      onSuccess: (data) => {
        setComponents(components.filter((comp) => comp.id !== id));
        toast.success("Item deleted successfully!")
      },
      onError: (err) =>
        toast.error(
          `Failed to delete the item, ${err?.response?.data?.message}`
        ),
    });
  };

  const handleEditClick = (bomEntry) => {
    setEditItem(bomEntry);
    setIsModalOpen(true);
  };

  const handleSave = (bomEntry) => {
    const isInvalid = validateBoMEntry(bomEntry);
    if (isInvalid) {
      setErrors(["Please fill in all required fields correctly"]);
      return;
    }
    updateBoMMutation.mutate(
      {
        bomId: editItem.id,
        formData: { ...bomEntry, quantity: Number(bomEntry.quantity) },
      },
      {
        onSuccess: () => {
          setComponents((prev) =>
            prev.map((comp) =>
              comp.id === bomEntry.id ? { ...bomEntry } : comp
            )
          );
          setEditItem(null);
          setIsModalOpen(false);
          setErrors([]);
        },
      }
    );
  };

  const itemOptions = itemsData
    ? itemsData.map((item) => ({
        value: item.id,
        label: item.internal_item_name,
      }))
    : [];

  const { csvData } = useSelector((state) => state.fileUploadBom);

  const handleCloseModal = () => setBulkModalOpen(false);

  const handleAddNewItem = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  if (bomLoading || itemsLoading) return <Loading />;

  return (
    <div className="p-6 bg-transparent">
      {/* Header Section */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Bills of Materials
          </h1>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 hover:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search BoMs..."
              className="
                w-full 
                pl-10 
                pr-4 
                py-3 
                rounded-xl 
                bg-white 
                border 
                border-gray-200 
                focus:border-blue-500 
                focus:ring 
                focus:ring-blue-200 
                focus:ring-opacity-50 
                transition-all 
                duration-300 
                shadow-lg 
                hover:shadow-xl
                text-gray-700
              "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              className="
                flex 
                items-center 
                px-4 
                py-3 
                bg-gradient-to-r 
                from-blue-500 
                to-indigo-600 
                text-white 
                rounded-xl 
                hover:from-blue-600 
                hover:to-indigo-700 
                transition-all 
                duration-300 
                shadow-md 
                hover:shadow-xl 
                group
              "
              onClick={() => setBulkModalOpen(true)}
            >
              {csvData?.length === 0 ? (
                <>
                  <FaUpload className="mr-2 group-hover:rotate-12 transition-transform" />
                  Bulk Upload
                </>
              ) : (
                <>
                  <FaEye className="mr-2 group-hover:scale-110 transition-transform" />
                  View CSV
                </>
              )}
            </button>
            
            <button
              className="
                flex 
                items-center 
                px-4 
                py-3 
                bg-gradient-to-r 
                from-green-500 
                to-emerald-600 
                text-white 
                rounded-xl 
                hover:from-green-600 
                hover:to-emerald-700 
                transition-all 
                duration-300 
                shadow-md 
                hover:shadow-xl 
                group
              "
              onClick={handleAddNewItem}
            >
              <FaPlus className="mr-2 group-hover:rotate-180 transition-transform" />
              Add BoM
            </button>
          </div>
        </div>
      </div>

      {/* Error Handling */}
      {errors.length > 0 && (
        <div
          className="
            bg-red-50 
            border 
            border-red-200 
            text-red-800 
            px-6 
            py-4 
            rounded-xl 
            mb-6 
            shadow-md
          "
          role="alert"
        >
          <ul className="list-disc list-inside space-y-2">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* BoM Table */}
      {!bomLoading && bomData ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <tr className="text-gray-700">
                  {["ID", "Item ID", "Component ID", "Quantity", "Status", "Action"].map((header) => (
                    <th 
                      key={header} 
                      className="
                        px-6 
                        py-4 
                        text-left 
                        font-semibold 
                        uppercase 
                        tracking-wider 
                        text-xs
                      "
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData?.length > 0 ? (
                  filteredData?.map((component) => {
                    return (
                      <tr
                        key={component.id}
                        className="
                          hover:bg-blue-50/50 
                          transition-colors 
                          duration-300 
                          border-b 
                          border-gray-100
                        "
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {component.id}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {component.item_id}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {component.component_id}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {component.quantity}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`
                              px-3 
                              py-1 
                              rounded-full 
                              text-xs 
                              font-medium 
                              ${
                                validateBoMEntry(component)
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : "bg-green-100 text-green-800"
                              }
                            `}
                          >
                            {validateBoMEntry(component)
                              ? "Pending"
                              : "Completed"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-2">
                            <button
                              className="
                                p-2 
                                rounded-lg 
                                bg-blue-50 
                                text-blue-600 
                                hover:bg-blue-100 
                                transition-colors 
                                group
                              "
                              onClick={() => handleEditClick(component)}
                            >
                              <FaEdit className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              className="
                                p-2 
                                rounded-lg 
                                bg-red-50 
                                text-red-600 
                                hover:bg-red-100 
                                transition-colors 
                                group
                              "
                              onClick={() => handleRemove(component.id)}
                            >
                              <FaTrash className="group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-24 w-24 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-600">
                          No BoMs Found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {searchQuery
                            ? "No boms match your current filters"
                            : "Start by adding a new bom"}
                        </p>
                        <button
                          onClick={handleAddNewItem}
                          className="
                            px-6 
                            py-3 
                            bg-gradient-to-r 
                            from-blue-500 
                            to-indigo-600 
                            text-white 
                            rounded-xl 
                            hover:from-blue-600 
                            hover:to-indigo-700 
                            transition-all 
                            duration-300 
                            shadow-md 
                            hover:shadow-xl
                          "
                        >
                          Add New BoM
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-20">
          <Loading />
        </div>
      )}

      {/* Error Handling */}
      {isBomError && <ErrorCard error={bomError}/>}

      {/* Modals */}
      {isBulkModalOpen && (
        <BomBulkModal
          isOpen={isBulkModalOpen}
          onClose={handleCloseModal}
          type={"bom"}
          itemsTypes={itemsTypes}
        />
      )}

      {isModalOpen && (
        <BomFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          onSave={handleSave}
          tenantId={2}
          isLoading={createBoMMutation.isLoading || updateBoMMutation.isLoading}
          isError={createBoMMutation.isError || updateBoMMutation.isError}
          isEdit={!!editItem}
          bomEntry={editItem}
          itemOptions={itemOptions}
        />
      )}
    </div>
  );
};

export default BillsOfMaterials;