"use client";
import React, { useState, useMemo } from "react";
import { FiAlertTriangle, FiChevronRight, FiTool } from "react-icons/fi";
import BomBulkModal from "../modals/BomBulkModal";
import { useFetchItems } from "../queries/ItemsMaster";
import { useFetchBoM } from "../queries/BoM";
import { usePendingSetup } from "../hooks/usePendingSetup";
import Loading from "./Loading";

const PendingSetup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // Fetch items and BOMs
  const { data: items = [], isLoading: itemsLoading } = useFetchItems();
  const { data: boms = [], isLoading: bomsLoading } = useFetchBoM();

  // Existing pendingItems logic remains the same...
  const pendingItems = usePendingSetup(items, boms);

  const openModal = (type, rowIndex) => {
    setModalType(type);
    setSelectedRowIndex(rowIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedRowIndex(null);
  };

  const loading = itemsLoading || bomsLoading;

  return (
    <div className="md:min-w-[20%] h-full md:h-[calc(100vh-60px)] border-l border-gray-200 bg-white py-6 px-3 overflow-auto">
      <div className="flex items-center justify-between mb-6 border-b pb-3 border-gray-200">
        <div className="flex items-center gap-3">
          <FiTool className="text-primary w-6 h-6 animate-pulse md:animate-none" />
          <h2 className="text-xl font-bold text-blue-900">Pending Jobs</h2>
        </div>
        {/* <div className="badge bg-blue-100 text-blue-800 border-blue-200 font-semibold w-28 py-4">
          {pendingItems.length} pending
        </div> */}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-6 animate-pulse">
          Analyzing setup requirements...
          <Loading />
        </div>
      ) : pendingItems.length === 0 ? (
        <div className="text-center text-green-700 bg-green-50 py-6 rounded-lg border border-green-200">
          🎉 All setup requirements are complete!
        </div>
      ) : (
        <div className="space-y-4">
          {pendingItems.map((item, index) => (
            <div
              key={index}
              className={`
                card transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg
                ${
                  item.severity === "high"
                    ? "bg-red-50 border-red-200 hover:bg-red-100"
                    : "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                }
                border shadow-sm
              `}
            >
              <div className="card-body p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <FiAlertTriangle
                      className={`
                        w-6 h-6 
                        ${
                          item.severity === "high"
                            ? "text-red-500 animate-bounce"
                            : "text-yellow-500"
                        }
                      `}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`
                      font-bold text-base leading-tight mb-1
                      ${
                        item.severity === "high"
                          ? "text-red-900"
                          : "text-yellow-600"
                      }
                    `}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-0">
                      {item.description}
                    </p>
                    {/* <button
                      onClick={() => openModal(item.type, item.rowIndex)}
                      className={`
                        btn btn-sm gap-2 w-full 
                        ${
                          item.severity === "high"
                            ? "btn-error text-white hover:bg-red-700"
                            : "btn-warning text-white hover:bg-yellow-600"
                        }
                        transition-all duration-300
                      `}
                    >
                      Resolve Now
                      <FiChevronRight className="w-4 h-4" />
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && modalType === "sell_item" && (
        <BulkUploadModal
          type="sell_item"
          isOpen={isModalOpen}
          onClose={closeModal}
          highlightRowIndex={selectedRowIndex}
        />
      )}

      {isModalOpen && modalType === "purchase_item" && (
        <BulkUploadModal
          type="purchase_item"
          isOpen={isModalOpen}
          onClose={closeModal}
          highlightRowIndex={selectedRowIndex}
        />
      )}

      {isModalOpen && modalType === "component_item" && (
        <BomBulkModal
          type="component_item"
          isOpen={isModalOpen}
          onClose={closeModal}
          highlightRowIndex={selectedRowIndex}
        />
      )}
    </div>
  );
};

export default PendingSetup;
