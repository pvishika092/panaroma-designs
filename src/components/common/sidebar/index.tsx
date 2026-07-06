"use client";
import { useState } from "react";
import { FaClipboardList, FaFolderClosed } from "react-icons/fa6";
import { BarComponent } from "./barComponent";
import { RiFileCopy2Fill, RiHome4Fill, RiHome6Fill } from "react-icons/ri";
import Image from "next/image";
import { IoIosSettings, IoMdNotificationsOutline } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useSystemTheme } from "@/src/hooks/useSystemsTheme";
import { BiSolidWallet } from "react-icons/bi";
import { LuArrowUpRight, LuChevronsDownUp, LuChevronUp, LuSquareArrowOutUpRight, LuWallet } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { BsChevronExpand } from "react-icons/bs";
import { TbSettings } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

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
    { onClick: () => { }, href: "/credits", icon: <RiHome4Fill className="text-2xl" />, module: "home", title: "Home" },
    { onClick: () => { }, href: "/credits", icon: <RiFileCopy2Fill className="text-2xl" />, module: "suppliers", title: "Contracts Hub" },
    { onClick: () => { }, href: "/credits", icon: <VscGraph className="text-2xl" />, module: "analytics", title: "Analytics" },
    { onClick: () => { }, href: "/credits", icon: <IoSettingsOutline className="text-2xl" />, module: "contracts", title: "Access" },
  ];



  return (
    <>
    <div className="h-screen w-fit py-7  flex flex-col items-center justify-between text-sidebarText bg-mainGreen relative z-50">

      {/* Logo */}
      <div className="flex flex-col gap-2 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 40 40" fill="none"><path d="M3.03569 14.3384H0.517938C0.231889 14.3384 0 14.5703 0 14.8563V21.5546C0 21.8406 0.231889 22.0725 0.517938 22.0725H3.03569C3.32174 22.0725 3.55362 21.8406 3.55362 21.5546V14.8563C3.55362 14.5703 3.32174 14.3384 3.03569 14.3384Z" fill="white"></path><path d="M15.3365 14.3384H12.8187C12.5327 14.3384 12.3008 14.5703 12.3008 14.8563V21.5546C12.3008 21.8406 12.5327 22.0725 12.8187 22.0725H15.3365C15.6225 22.0725 15.8544 21.8406 15.8544 21.5546V14.8563C15.8544 14.5703 15.6225 14.3384 15.3365 14.3384Z" fill="white"></path><path d="M28.1783 0.252054C23.5764 0.252054 20.2592 3.32885 19.3466 8.33763C19.2212 9.0241 18.6231 9.52354 17.9243 9.52354H0.517938C0.230195 9.52354 0 9.75579 0 10.0415V12.1502C0 12.438 0.23225 12.6682 0.517938 12.6682H17.8544C18.5738 12.6682 19.1883 13.1902 19.3034 13.8993C20.1441 19.0663 23.4963 22.25 28.1803 22.25C33.6495 22.25 37.2956 17.9544 37.2956 11.25C37.2956 4.54559 33.6495 0.25 28.1803 0.25L28.1783 0.252054ZM28.1783 19.1321C24.7479 19.1321 22.7091 16.3513 22.7091 11.2541C22.7091 6.15695 24.7479 3.37612 28.1783 3.37612C31.6086 3.37612 33.6783 6.18778 33.6783 11.2541C33.6783 16.3204 31.6702 19.1321 28.1783 19.1321Z" fill="white"></path></svg>
        {/* <Image src="/holmes_dark_theme_logo.svg" alt="Logo" width={131} height={40} /> */}
      </div>
      {/* Main nav links */}
      <div className="flex w-full flex-col items-center gap-8 ">
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
      <div className="flex w-full flex-col mx-1 gap-7 ">
         

        <div className="text-xxs flex flex-col gap-1 rounded-xl p-1 py-2  items-center font-semibold text-white ">
          <CreditCircle used={4160} total={10500} />
          <span className="opacity-70">Credits</span>
        </div>

        <div className="text-xxs flex flex-col gap-1  rounded-xl p-2  items-center font-semibold opacity-60 ">
          <IoMdNotificationsOutline className="text-3xl" />
          Alerts
        </div>

       {/* Account + Dropdown */}
<div className="relative flex flex-col items-center w-full">
  {/* Dropdown — renders above */}
  {accountOpen && (
    <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[260px] rounded-2xl overflow-hidden shadow-2xl z-50"
      style={{ background: "#0d2e1f" }}>

      {/* User card */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-solid border-t-0 border-r-0 border-l-0 border-white/10">
        <div className="w-10 h-10 rounded-full bg-[#43CE91]/20 flex items-center justify-center text-[#43CE91] font-bold text-base flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
          <p className="text-xsm text-white/50 truncate">{user.email}</p>
        </div>
      </div>

      {/* Profile Settings */}
      <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-white/80 hover:text-white hover:bg-white/5 bg-transparent border-none cursor-pointer transition-colors">
        <CgProfile className="text-lg flex-shrink-0" />
        Profile Settings
      </button>

      {/* Dark Mode */}
      <button
        onClick={toggleTheme}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-white/80 hover:text-white hover:bg-white/5 bg-transparent border-none cursor-pointer transition-colors"
      >
        {theme === "dark"
          ? <MdDarkMode className="text-lg flex-shrink-0" />
          : <MdLightMode className="text-lg flex-shrink-0" />}
        <span className="flex-1 text-left">Dark Mode</span>
        {/* Toggle pill */}
        <div className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${theme === "dark" ? "bg-[#40bc86]" : "bg-white/20"}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${theme === "dark" ? "left-[calc(100%-18px)]" : "left-0.5"}`} />
        </div>
      </button>

      {/* Divider */}
      <div className="h-px bg-white/10 mx-4" />

      {/* Log out */}
      <button className="w-full flex items-center gap-3 px-4 py-5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 bg-transparent border-none cursor-pointer transition-colors">
        <IoLogOut className="text-lg flex-shrink-0" />
        Log out
      </button>
    </div>
  )}

  {/* Account button */}
  <button
    onClick={() => setAccountOpen(o => !o)}
    className="text-xxs flex flex-col gap-1 rounded-xl p-2 items-center font-semibold text-[#40bc86] opacity-60 hover:opacity-100 bg-transparent border-none cursor-pointer transition-opacity  w-full"
  >
    <CgProfile className="text-2xl" />
    Account
  </button>
</div>

        <div className="invisible pb-14">dsfadf</div>
        {/* <div className="invisible">dsfadf</div> */}
      </div>
    </div>
    {accountOpen && (
  <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
)}
    </>
  );
};


export const CreditCircle = ({ used, total }: { used: number; total: number }) => {
  const percentage = used / total;
  const radius = 22;
  const stroke = 4;

  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset = circumference - percentage * circumference;

  const remaining = total - used;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
    }
    return num;
  };

  const color =
    percentage > 0.85
      ? "#ef4444"
      : percentage > 0.6
        ? "#f59e0b"
        : "#40bc86";

  return (
    <div className="relative flex items-center justify-center h-12 w-12">
      <svg height={radius * 2} width={radius * 2}>
        {/* background */}
        <circle
          stroke="rgba(255,255,255,0.15)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* progress */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.35s",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        
      </svg>

      <span className="absolute text-[12px]  font-mono  font-semibold">
        {formatNumber(remaining)}
      </span>
    </div>
  );
};