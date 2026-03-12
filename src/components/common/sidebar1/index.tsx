"use client";
import { useState } from "react";
import { FaClipboardList, FaFolderClosed } from "react-icons/fa6";
import { RiFileCopy2Fill, RiHome4Fill, RiHome6Fill } from "react-icons/ri";
import Image from "next/image";
import { IoIosSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useSystemTheme } from "@/src/hooks/useSystemsTheme";
import { BiSolidWallet } from "react-icons/bi";
import { LuChevronsDownUp, LuChevronUp } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { BsChevronExpand } from "react-icons/bs";
import { BarComponent } from "../sidebar/barComponent";

export const Sidebar = () => {
  const { theme, toggleTheme } = useSystemTheme();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);

  // mock — replace with real user data
  const user = {
    name: "Nikhil",
    email: "nikhil@example.com",
    initials: "N",
    creditsUsed: 3500,
    creditsTotal: 10000,
    renewsIn: 21,
  };

  const creditsPct = Math.round((user.creditsUsed / user.creditsTotal) * 100);

  const links = [
    { onClick: () => {}, href: "/home", icon: <RiHome4Fill className="text-lg" />, module: "home", title: "Home" },
    { onClick: () => {}, href: "/suppliers", icon: <RiHome6Fill className="text-lg" />, module: "suppliers", title: "Suppliers" },
    { onClick: () => {}, href: "/contracts", icon: <RiFileCopy2Fill className="text-lg" />, module: "contracts", title: "Contracts" },
    { onClick: () => {}, href: "/directory", icon: <FaFolderClosed className="text-md" />, module: "directory", title: "Directory" },
    { onClick: () => {}, href: "/analytics", icon: <VscGraph className="text-lg" />, module: "analytics", title: "Analytics" },
    { onClick: () => {}, href: "/policy", icon: <FaClipboardList className="text-lg" />, module: "policy", title: "Policy" },
    { onClick: () => {}, href: "/audit", icon: <FaClipboardList className="text-lg" />, module: "audit", title: "Audit" },
  ];

  

  return (
    <div className="h-screen w-56 py-7  flex flex-col items-center justify-between text-sidebarText bg-mainGreen relative z-50">
      
      {/* Logo */}
      <div className="flex flex-col gap-2 items-center">
        {/* <Image src="/holmes_dark_theme_logo.svg" alt="Logo" width={131} height={40} /> */}
      </div>

      {/* Main nav links */}
      <div className="flex w-full flex-col gap-4  ml-14">
        {links.map((link, idx) => (
          <BarComponent
            key={idx}
            onClick={link.onClick}
            href={link.href}
            icon={link.icon}
            isActive={false}
            title={link.title}
          />
        ))}
      </div>

      {/* Bottom section */}
      <div className="flex w-full flex-col gap-2 ">


        <div className=" mt-1 border mx-2 cursor-pointer  border-solid border-white/10 rounded-2xl p-3 cursor-pointer group hover:border-white/20 transition-colors" onClick={() => router.push("/credits")}>
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <span className="rounded-xl  flex items-center justify-center flex-shrink-0">
        <BiSolidWallet  className="text-[#40bc86] group-hover:text-white text-sm" />
      </span>
      <span className="text-xs font-semibold group-hover:text-sidebarText text-sidebarText">Credits</span>
    </div>
    <FiArrowUpRight  className="text-sidebarText text-sm opacity-40 " />
  </div>

  <div className="flex items-center justify-between mb-1.5">
    {/* <span className="text-xs text-sidebarText opacity-50 uppercase tracking-wider text-xxs font-semibold" >Usage</span> */}
    <span className="text-xs font-semibold text-sidebarText">
        Plan Expired
      {/* {user.creditsUsed.toLocaleString()} / {user.creditsTotal.toLocaleString()} */}
    </span>
  </div>

  <div className="w-full h-1 rounded-full bg-white/10 mb-2">
    <div
      className="h-1 rounded-full bg-[#40bc86] transition-all"
      style={{ width: `${creditsPct}%`, boxShadow: "0 0 6px rgba(64,188,134,0.5)" }}
    />
  </div>

 
</div>

        {/* Account row */}
        <div className="relative   mx-2 cursor-pointer group   rounded-2xl py-3  cursor-pointer group hover:border-white/20 mx-2">

          {/* Dropdown */}
          {accountOpen && (
            <div className="absolute bottom-full mb-2 border border-solid border-white/10 left-0 w-52 bg-mainGreen bg-opacity-50 rounded-2xl shadow-2xl overflow-hidden z-50 ">
              <div className="py-1.5">
                <button
                  onClick={() => { router.push("/settings"); setAccountOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white  dark:hover:bg-white/5 transition-colors bg-transparent border-none cursor-pointer font-normal"
                >
                  <IoSettingsOutline  className="text-md text-white" />
                  Account Info
                </button>
                <button
                  onClick={() => { toggleTheme(); setAccountOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white transition-colors bg-transparent border-none cursor-pointer font-normal"
                >
                  {theme === "dark"
                    ? <MdDarkMode  className="text-white text-md " />
                    : <MdLightMode  className="text-md text-white" />
                  }
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </button>
                {/* <div className="mx-3 my-1 border-t-[0.5px]  border-solid border-[#40bc86]" /> */}
                <button
                  onClick={() => { setAccountOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500  transition-colors bg-transparent border-none cursor-pointer font-normal"
                >
                  <IoLogOut  />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Account trigger row */}
          <button
            onClick={() => setAccountOpen(prev => !prev)}
            className="w-full text-xs pl-3 hover:text-white  font-semibold  text-left text-sidebarText flex items-center gap-2 bg-transparent border-none cursor-pointer p-0 group"
          >
            <IoIosSettings  className="text-lg text-[#40bc86]  group-hover:text-white"/>
          <span className="hover:opacity-70 opacity-80"> Settings</span>
          <BsChevronExpand/>
          </button>

        </div>
        <div className="invisible pb-10">dsfadf</div>
        <div className="invisible">dsfadf</div>
      </div>
    </div>
  );
};