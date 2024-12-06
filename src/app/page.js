'use client';

import React, { useState } from 'react';
import PendingSetup from "./components/PendingSetup";
import Landing from "./components/Landing";
import { FiSettings, FiTool } from "react-icons/fi";

export default function Home() {
  const [showPending, setShowPending] = useState(false);

  return (
    <div className="relative h-screen min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-100 w-full sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-center w-full items-center gap-3">
            <FiSettings className="text-blue-500 hover:rotate-180 transition-transform duration-300" />
            Masterlist Management
          </h1>
          
          {/* Mobile Toggle Button */}
          <button
            className="
              md:hidden 
              p-2 
              rounded-xl 
              bg-blue-50 
              text-blue-600 
              hover:bg-blue-100 
              transition-all 
              duration-300 
              group
            "
            onClick={() => setShowPending(!showPending)}
          >
            <FiTool className="w-6 h-6 group-hover:scale-110 transition-transform animate-pulse" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] bg-transparent relative">
        {/* Pending Setup Sidebar */}
        <div 
          className={`
            absolute md:static 
            top-0 left-0 
            w-full md:w-[300px] 
            z-40 
            bg-white 
            rounded-2xl 
            shadow-2xl 
            border 
            border-gray-100 
            md:block 
            transition-all 
            duration-300 
            ease-linear 
            ${showPending 
              ? 'translate-y-0 md:translate-y-0 opacity-100' 
              : '-translate-y-full md:translate-y-0 opacity-0 md:opacity-100'
            }
          `}
        >
          <PendingSetup />
        </div>

        {/* Content Section */}
        <div 
          className={`
            relative 
            flex-1 
            w-full 
            h-full 
            md:overflow-auto 
            bg-transparent 
            transition-all 
            duration-300 
            ease-linear 
            ${showPending 
              ? 'mt-[260px] md:mt-0' 
              : ''
            }
          `}
        >
          <Landing />
        </div>
      </div>
    </div>
  );
}