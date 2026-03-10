"use client";
import React, { useEffect } from "react";
import { Sidebar } from "@/src/components/common/sidebar";
import CreditsPage from "@/src/components/credits";


const Home = () => {


  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <div className="min-h-full w-full flex flex-col overflow-hidden bg-mainBG rounded-l-2xl ">
        <CreditsPage />
      </div>
    </div>
  );
};



export default Home;
