"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useFetchItems,
  useUpdateItemMutation,
} from "@/app/queries/ItemsMaster";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUpload,
  FaSearch,
  FaEye,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../Loading";
import { ItemFormModal } from "@/app/modals/ItemModal";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import ItemBulkModal from "@/app/modals/ItemBulkModal";
import ErrorCard from "../ErrorCard";

const VALID_TYPES = ["sell", "purchase"];
const VALID_UOMS = ["kgs", "kg", "nos", "no"];

const validateItem = (newItem) => {
  const errors = [];

  if (!newItem.internal_item_name)
    errors.push("Internal item name is required.");

  if (!newItem.type || !VALID_TYPES.includes(newItem.type.toLowerCase())) {
    errors.push(`Type must be one of: ${VALID_TYPES.join(", ")}`);
  }

  if (!newItem.uom || !VALID_UOMS.includes(newItem.uom.toLowerCase())) {
    errors.push(`UoM must be one of: ${VALID_UOMS.join(", ")}`);
  }

  if (["sell", "purchase"].includes(newItem.type.toLowerCase())) {
    const minBuffer = parseFloat(newItem.min_buffer);
    const maxBuffer = parseFloat(newItem.max_buffer);

    if (isNaN(minBuffer) || isNaN(maxBuffer))
      errors.push("Buffer values must be valid numbers.");
    if (maxBuffer < minBuffer)
      errors.push(
        "Maximum buffer must be greater than or equal to minimum buffer."
      );
    if (!newItem.max_buffer) errors.push("Max buffer is required.");
    if (!newItem.min_buffer) errors.push("Min buffer is required.");
  }

  if (
    newItem.type.toLowerCase() === "sell" &&
    !newItem.additional_attributes?.scrap_type
  ) {
    errors.push("Scrap type is required for 'sell' items.");
  }

  if (
    newItem.additional_attributes?.avg_weight_needed === undefined ||
    newItem.additional_attributes?.avg_weight_needed === ""
  ) {
    errors.push("Average weight needed must be specified.");
  }

  if (!newItem.additional_attributes)
    errors.push("Additional attributes are required.");

  return errors;
};

const ItemsMaster = () => {
  const { data, isLoading, isError,error } = useFetchItems();
  const createItemMutation = useCreateItemMutation();
  const updateItemMutation = useUpdateItemMutation();
  const deleteItemMutation = useDeleteItemMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const [itemsTypes, setItemsTypes] = useState({});

  useEffect(() => {
    // Check if itemsData is available and is an array
    if (data && Array.isArray(data)) {
      // Create a new object to avoid mutating the existing state
      const newItemsTypes = {};

      // Loop through the data and transform it into the desired object format
      data.forEach((item) => {
        if (item.id && item.type) {
          newItemsTypes[item.id] = item.type;
        }
      });

      // Update the state with the transformed object
      setItemsTypes(newItemsTypes);
    }
  }, [data]);
  const { csvData } = useSelector((state) => state.fileUploadItem);

  const handleEditClick = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemToDelete) => {
    deleteItemMutation.mutate(itemToDelete.id, {
      onSuccess: () => toast.success("Item deleted successfully!"),
      onError: (err) =>
        toast.error(
          `Failed to delete the item, ${err?.response?.data?.message}`
        ),
      onSettled: () => setBulkModalOpen(false),
    });
  };

  const handleSaveItem = (newItem) => {
    const validationErrors = validateItem(newItem);

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    if (["sell", "purchase"].includes(newItem.type)) {
      newItem.additional_attributes.min_buffer ??= 0;
      newItem.additional_attributes.max_buffer ??= 0;
    }

    const mutation = editItem ? updateItemMutation : createItemMutation;
    const action = editItem ? "updated" : "created";

    mutation.mutate(
      {
        itemId: editItem?.id,
        formData: {
          ...newItem,
          tenant_id: 2,
          created_by: "current_user",
          createdAt: editItem ? undefined : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success(`Item ${action} successfully!`);
          setIsModalOpen(false);
          queryClient.invalidateQueries("items");
        },
        onError: () => toast.error(`Failed to ${action} item.`),
      }
    );
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data?.filter((item) =>
      [item.internal_item_name, item.type, item.uom]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);



  const validateRow = (item) => {
    try {
      const errors = validateItem(item);
      return errors.length > 0;
    } catch {
      return true;
    }
  };

  const handleAddNewItem = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-transparent">
      {/* Header Section */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Items Master
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
              placeholder="Search items..."
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
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      {!isLoading && data ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <tr className="text-gray-700">
                  {["Item Name", "Type", "UoM", "Avg Weight", "Status", "Action"].map((header) => (
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
                  filteredData?.map((item) => {
                    const validation = validateRow(item);
                    return (
                      <tr
                        key={item.id}
                        className="
                          hover:bg-blue-50/50 
                          transition-colors 
                          duration-300 
                          border-b 
                          border-gray-100
                        "
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {item.internal_item_name}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {item.uom}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700">
                          {item.additional_attributes?.avg_weight_needed?.toString()}
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
                                validation 
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : "bg-green-100 text-green-800"
                              }
                            `}
                          >
                            {validation ? "Pending" : "Completed"}
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
                              onClick={() => handleEditClick(item)}
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
                              onClick={() => handleDeleteItem(item)}
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
                          No Items Found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {searchQuery
                            ? "No items match your current filters"
                            : "Start by adding a new item"}
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
                          Add New Item
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

      {/* Modals would be placed here - preserving existing modal logic */}
      {isError && <ErrorCard error={error}/>}

      {isBulkModalOpen && (
        <ItemBulkModal
          isOpen={isBulkModalOpen}
          onClose={() => setBulkModalOpen(false)}
          type={"items"}
          itemsTypes={itemsTypes}
        />
      )}

      {isModalOpen && (
        <ItemFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setEditItem(null);
            setIsModalOpen(false);
          }}
          onSave={handleSaveItem}
          tenantId={2}
          isLoading={createItemMutation.isLoading || updateItemMutation.isLoading}
          isError={createItemMutation.isError || updateItemMutation.isError}
          isEdit={!!editItem}
          item={editItem}
        />
      )}
    </div>
  );
};

export default ItemsMaster;