"use client";

import React from "react";
import ItemsMaster from "./LandingComponents/ItemsMaster";
import Processes from "./LandingComponents/Processes";
import BillsOfMaterials from "./LandingComponents/BillsOfMaterials";
import ProcessSteps from "./LandingComponents/ProcessSteps";
import {
  FiBox,
  FiSettings,
  FiLayers,
  FiList,
  FiTrendingUp,
  FiCheckSquare,
  FiAlertCircle,
} from "react-icons/fi";

const Landing = ({ activeItem: activeTab, setActiveItem: setActiveTab }) => {
  // Render Components for each tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case "Items Master":
        return <ItemsMaster />;
      case "Processes":
        return <Processes />;
      case "Bill of Materials":
        return <BillsOfMaterials />;
      case "Process Steps":
        return <ProcessSteps />;
      default:
        return <ItemsMaster />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10 flex flex-col flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            <FiSettings className="text-primary" />
            Data Onboarding
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:flex-1 flex flex-col">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: FiTrendingUp,
              iconColor: "text-primary",
              title: "Active Processes",
              value: "12",
              desc: "↗︎ 2 Processes added this week",
              bgGradient: "from-blue-50 to-blue-100"
            },
            {
              icon: FiCheckSquare,
              iconColor: "text-success",
              title: "Completed BOMs",
              value: "28",
              desc: "80% completion rate",
              bgGradient: "from-green-50 to-green-100"
            },
            {
              icon: FiAlertCircle,
              iconColor: "text-warning",
              title: "Pending BOMs",
              value: "7",
              desc: "Requires attention",
              bgGradient: "from-yellow-50 to-yellow-100"
            }
          ].map(({ icon: Icon, iconColor, title, value, desc, bgGradient }) => (
            <div 
              key={title} 
              className={`bg-gradient-to-br ${bgGradient} rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out`}
            >
              <div className="stat p-6">
                <div className={`stat-figure ${iconColor} opacity-70`}>
                  <Icon size={32} />
                </div>
                <div className="stat-title text-gray-700 font-medium">{title}</div>
                <div className="stat-value text-gray-900">{value}</div>
                <div className="stat-desc text-gray-600 mt-1">{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-white/70 backdrop-blur-md rounded-xl mb-6 p-1 shadow-md">
          {[
            { label: "Items Master", icon: FiBox },
            { label: "Processes", icon: FiSettings },
            { label: "Bill of Materials", icon: FiLayers },
            { label: "Process Steps", icon: FiList },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`tab flex-1 h-14 flex items-center justify-center gap-2 rounded-lg transition-all duration-300 ${
                activeTab === label
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100 hover:text-primary"
              }`}
              onClick={() => setActiveTab(label)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:h-96 overflow-auto">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Landing;