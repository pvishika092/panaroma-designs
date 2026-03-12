"use client";
import React, { useEffect } from "react";
import CreditsPage from "@/src/components/credits2";
import { Sidebar } from "@/src/components/common/sidebar1";


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
