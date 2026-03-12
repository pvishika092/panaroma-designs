"use client";
import { Sidebar } from "@/src/components/common/sidebar2";
import CreditsPage from "@/src/components/credits3";
import React, { useEffect } from "react";


const AnalyticsPage = () => {


  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <div className="min-h-full w-full flex flex-col overflow-hidden bg-mainBG rounded-l-2xl ">
        <CreditsPage />
      </div>
    </div>
  );
};



export default AnalyticsPage;
