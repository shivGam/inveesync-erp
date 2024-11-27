"use client";
import React, { useState } from "react";
import {
  FiMenu,
  FiChevronUp,
  FiChevronDown,
  FiUpload,
  FiDownload,
  FiActivity,
  FiSettings,
  FiPackage,
  FiLayers,
  FiList,
  FiCpu,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import BulkUploadModal from "../modals/BulkUploadModal";
import AuditLogModal from "../modals/AuditLogModal";

const Sidebar = ({activeItem, setActiveItem}) => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { id: 1, name: "Tenant Configuration", icon: FiSettings },
    { id: 2, name: "Items Master", icon: FiPackage },
    { id: 3, name: "Processes", icon: FiCpu },
    { id: 4, name: "Bill of Materials", icon: FiLayers },
    { id: 5, name: "Process Steps", icon: FiList },
  ];

  const quickActions = [
    { id: "bulk_upload", name: "Upload Bulk Data", icon: FiUpload },
    { id: "download_templates", name: "Download Templates", icon: FiDownload },
    { id: "view_audit_log", name: "View Audit Log", icon: FiActivity },
  ];

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.showModal();
    }
  };

  return (
    <>
      <aside
        className={`flex flex-col md:h-screen bg-white/80 backdrop-blur-md border-r border-gray-100 transition-all duration-300 ease-in-out w-full md:w-fit ${
          isOpen ? "md:w-68" : "md:w-20"
        }`}
      >
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            {isOpen && (
              <div className="flex items-center gap-2">
                <FiSettings className="text-primary" />
                <h2 className="font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Setup Progress
                </h2>
              </div>
            )}
            {!isOpen && (
              <div className="md:hidden flex items-center gap-2">
                <FiSettings className="text-primary" />
                <h2 className="font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Setup Progress
                </h2>
              </div>
            )}

            <button 
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors hidden md:block"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors md:hidden"
            >
              {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 md:flex-none overflow-y-auto">
          <div className="p-4">
            <ul className="space-y-2 md:block flex items-center justify-between">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveItem(item.name)}
                    className={`w-full group flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 ${
                      activeItem === item.name
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`${
                        activeItem === item.name
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      <item.icon />
                    </span>
                    {isOpen && (
                      <span
                        className={`font-medium ${
                          activeItem === item.name
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-md border-t border-gray-100 shadow-md">
          <div className="p-4">
            {isOpen && (
              <h3 className="text-sm font-semibold text-gray-500 mb-3 px-3">
                Quick Actions
              </h3>
            )}
            <ul className="space-y-1 md:block flex items-center justify-around overflow-auto">
              {quickActions.map((action) => (
                <li key={action.id}>
                  <button
                    onClick={() => openModal(action.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-300 ease-in-out hover:scale-105 text-gray-700 hover:text-primary"
                  >
                    <span className="text-gray-400 group-hover:text-primary">
                      <action.icon />
                    </span>
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{action.name}</span>
                        <FiChevronRight className="text-gray-400" />
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Modals */}
      <BulkUploadModal />

      <dialog
        id="download_templates"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-white/80 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Download Templates
            </h3>
            <button
              onClick={() =>
                document.getElementById("download_templates").close()
              }
              className="btn btn-sm btn-circle btn-ghost"
            >
              <FiX size={20} />
            </button>
          </div>
          <p className="py-4 text-gray-600">
            Download templates for your processes here.
          </p>
          <div className="flex gap-3 justify-end mt-6">
            <button
              className="btn btn-ghost"
              onClick={() =>
                document.getElementById("download_templates").close()
              }
            >
              Cancel
            </button>
            <button className="btn bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90">
              Download
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <AuditLogModal />
    </>
  );
};

export default Sidebar;