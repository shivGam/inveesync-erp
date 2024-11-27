'use client';
import React, { useState } from 'react';
import { 
  FiAlertTriangle, 
  FiChevronRight, 
  FiTool,
  FiAlertCircle 
} from 'react-icons/fi';
import ErrorHandlerModal from "../modals/ErrorHandlerModal";

const PendingSetup = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingItems = [
    {
      title: 'Steel Pipe Grade A',
      description: 'Missing UoM',
      href: '/resolve/steel-pipe',
      severity: 'high',
    },
    {
      title: 'Assembly X23',
      description: 'Incomplete components',
      href: '/resolve/assembly-x23',
      severity: 'medium',
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex flex-col flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl pt-1 font-extrabold text-gray-900 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            <FiTool className="text-primary" />
            Pending Setup
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:flex-1 flex flex-col">
        {/* Warning Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div 
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <div className="stat p-6">
              <div className="stat-figure text-warning opacity-70">
                <FiAlertCircle size={32} />
              </div>
              <div className="stat-title text-gray-700 font-medium">Pending Items</div>
              <div className="stat-value text-gray-900">{pendingItems.length}</div>
              <div className="stat-desc text-gray-600 mt-1">Requires immediate attention</div>
            </div>
          </div>
        </div>

        {/* Pending Items List */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl  p-6 overflow-auto space-y-4">
          {pendingItems.map((item, index) => (
            <div
              key={index}
              className="border border-dashed border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <div className="p-4 flex flex-col items-center  gap-4">
              <div className='p-4 w-fit bg-yellow-100/50 rounded-full mx-auto'><FiAlertTriangle className="text-warning" size={24} /></div>
                <div className="flex-1 text-center">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                </div>
                <span
                  className="btn btn-warning btn-sm flex items-center gap-2"
                >
                  Resolve
                  <FiChevronRight />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        {pendingItems.length > 0 && (
          <div className="mt-6 text-center">
            <button
              className="btn btn-ghost text-primary hover:bg-primary/10"
              onClick={openModal}
            >
              Check Error Module
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && <ErrorHandlerModal onClose={closeModal} />}
    </div>
  );
};

export default PendingSetup;