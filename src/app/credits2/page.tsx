"use client";
import { Sidebar } from "@/src/components/common/sidebar2";
import CreditsPage from "@/src/components/credits3";
import { useSystemTheme } from "@/src/hooks/useSystemsTheme";
import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { LuArrowUpRight } from "react-icons/lu";

const AnalyticsPage = () => {
  const {theme} = useSystemTheme()
  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <div className="min-h-full w-full flex flex-col overflow-hidden bg-mainBG rounded-l-2xl">
        
        {/* Sticky banner */}
      <div 
      style={{
    backdropFilter: "blur(50px)",
    transition: "opacity 0.3s"
  }}
      className={`flex items-center justify-between shadow-sm backdrop-blur-xl mt-1  px-20 py-3 border-b-[0.5px] border-r-0 border-t-0 border-l-0 border-solid border-borderMuted flex-shrink-0`}>
  
  <div className="flex items-center gap-4">
    {/* Close */}
    <button className="text-cardSmText hover:text-textTheme bg-transparent border-none cursor-pointer p-0 flex-shrink-0 transition-colors">
      <FiX className="text-base" />
    </button>

    {/* Sparkle icon box */}
    <div className="w-8 h-8 rounded-lg  flex items-center bg-bgSubtle justify-center flex-shrink-0">
      <HiOutlineSparkles className="text-xl text-textTheme" />
    </div>

    {/* Text */}
    <div>
      <p className="text-sm font-semibold text-textTheme leading-tight">Organization credits exhausted</p>
      <p className="text-xs text-subTitleText mt-0.5">
You've consumed <span className="">94% of your credits</span>. Upgrade to avoid service interruption.
      </p>
    </div>
  </div>

  {/* Actions */}
  <div className="flex items-center gap-4 flex-shrink-0">
    <button className="text-sm font-semibold text-textTheme bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity whitespace-nowrap">
      Buy Credits
    </button>
    <button className="flex items-center gap-1.5 text-sm font-semibold text-black bg-[#40bc86] border-none cursor-pointer px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap">
      Upgrade Now
      <LuArrowUpRight className="text-sm" />
    </button>
  </div>

</div>

        <CreditsPage />
      </div>
    </div>
  );
};

export default AnalyticsPage;
