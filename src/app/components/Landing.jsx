"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import ItemsMaster from "./LandingComponents/ItemsMaster";
import BillsOfMaterials from "./LandingComponents/BillsOfMaterials";
import {
  FiBox,
  FiSettings,
  FiLayers,
  FiList,
  FiTrendingUp,
  FiCheckSquare,
  FiAlertCircle,
} from "react-icons/fi";
import { useFetchBoM } from "../queries/BoM";
import { useFetchItems } from "../queries/ItemsMaster";
import { usePendingSetup } from "../hooks/usePendingSetup";

const Landing = () => {
  const [activeTab, setActiveTab] = useState("Items Master");

  // Fetch items and BOM data
  const { data: itemsData, isLoading: isItemsLoading } = useFetchItems();
  const { data: bomData, isLoading: isBomLoading } = useFetchBoM();

  // Count items using a for loop
  const itemCount = useMemo(() => {
    if (!itemsData) return 0;

    let count = 0;
    for (let i = 0; i < itemsData.length; i++) {
      if (!itemsData[i].is_deleted) {
        count++;
      }
    }
    return count;
  }, [itemsData]);

  // Count BOMs using a for loop
  const bomCount = useMemo(() => {
    if (!bomData) return 0;

    return bomData.length;
  }, [bomData]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Items Master":
        return <ItemsMaster />;

      case "Bill of Materials":
        return <BillsOfMaterials />;

      default:
        return <ItemsMaster />;
    }
  };

  // Reusable card component for metrics
  const MetricCard = ({ title, count, icon: Icon, bgColor, textColor, loadingState }) => (
    <div className={`
      relative group
      rounded-3xl overflow-hidden
      transition-all duration-500 ease-in-out
      ${bgColor} 
      transform hover:-translate-y-2 hover:scale-105
      shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]
      w-full md:w-[31.5%]
      border-2 border-opacity-30
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 w-full text-center">{title}</h3>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className={`text-3xl md:text-4xl font-bold ${textColor} text-center`}>
            {loadingState ? "..." : count}
          </span>
          {Icon && (
            <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full">
              <Icon className="text-white" />
            </div>
          )}
        </div>
        <p className="text-xs md:text-sm text-gray-600 mt-2 opacity-70 text-center">
          {title === "Items Master"
            ? "Total active items"
            : title === "Bills Of Materials"
              ? "Total active BoMs"
              : "Entries requiring review"}
        </p>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7fa] to-[#e6eef3] w-full flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Metrics Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">


          <MetricCard
            title="Bills Of Materials"
            count={bomCount}
            bgColor="bg-green-50/70"
            textColor="text-green-600"
            loadingState={isBomLoading}
          />

          <MetricCard
            title="Pending Jobs"
            count={
              !isBomLoading && !isItemsLoading
                ? usePendingSetup(itemsData, bomData)?.length
                : 0
            }
            bgColor="bg-yellow-50/70"
            textColor="text-yellow-600"
            loadingState={isBomLoading || isItemsLoading}
          />

          <MetricCard
            title="Items Master"
            count={itemCount}
            bgColor="bg-blue-50/70"
            textColor="text-blue-600"
            loadingState={isItemsLoading}
          />
        </div>

        {/* Tabs Section */}
<div className="mb-8">
  <div className="flex justify-center w-full">
    <div className="flex w-full bg-transparent p-1.5 rounded-xl shadow-xl border-2 border-gray-200">
      {["Items Master", "Bill of Materials"].map((tab) => (
        <button
          key={tab}
          className={`
            flex-1 px-6 py-3
            rounded-xl 
            text-sm 
            font-medium 
            transition-all 
            duration-300 
            ease-in-out
            flex items-center justify-center gap-2
            ${activeTab === tab
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/50"
              : "text-gray-600 hover:bg-gray-200 hover:shadow-md"
            }
          `}
          onClick={() => setActiveTab(tab)}
        >
          {tab === "Items Master" ? <FiBox /> : <FiLayers />}
          {tab}
        </button>
      ))}
    </div>
  </div>
</div>


        {/* Active Tab Content */}
        <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden animate-fade-in">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default Landing;