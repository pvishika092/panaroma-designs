"use client";
import { useEffect } from "react";
import { FaClipboardList, FaFolderClosed } from "react-icons/fa6";
import { BarComponent } from "./barComponent";
import { RiFileCopy2Fill, RiHome4Fill, RiHome6Fill } from "react-icons/ri";
import Image from "next/image";
import { IoIosSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { VscGraph } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useSystemTheme } from "@/src/hooks/useSystemsTheme";
import { BiSolidWallet } from "react-icons/bi";

export const Sidebar = () => {
  const { theme, toggleTheme } = useSystemTheme();
  const router = useRouter();

 

  const links = [
    {
      onClick: () => {
        // dispatch(setModule("home"));
      },
      href: "/home",
      icon: <RiHome4Fill className="text-lg" />,
      module: "home",
      title: "Home",
    },
    {
      onClick: () => {
        // dispatch(setModule("suppliers"));
      },
      href: "/suppliers",
      icon: <RiHome6Fill className="text-lg" />,
      module: "suppliers",
      title: "Suppliers",
    },
    {
      onClick: () => {
        // dispatch(setModule("contracts"));
      },
      href: "/contracts",
      icon: <RiFileCopy2Fill className="text-lg" />,
      module: "contracts",
      title: "Contracts",
    },
     {
      onClick: () => {
        // dispatch(setModule("directory"));
      },
      href: "/directory",
      icon: <FaFolderClosed className="text-md" />,
      module: "directory",
      title: "Directory",
    },
    {
      onClick: () => {
        // dispatch(setModule("analytics"));
      },
      href: "/analytics",
      icon: <VscGraph className="text-lg" />,
      module: "analytics",
      title: "Analytics",
    },
    {
      onClick: () => {
        // dispatch(setModule("policy"));
      },
      href: "/policy",
      icon: <FaClipboardList className="text-lg" />,
      module: "policy",
      title: "Policy",
    },
    {
      onClick: () => {
        // dispatch(setModule("audit"));
      },
      href: "/audit",
      icon: <FaClipboardList className="text-lg" />,
      module: "audit",
      title: "Audit",
    },
  ];
  const links2 = [
    {
      onClick: () => { },
      href: "/settings",
      icon: <IoIosSettings className="text-xl" />,
      module: "settings",
      title: "Settings",
    },
    {
      onClick: () => { },
      href: "/credits",
      icon: <BiSolidWallet className="text-xl" />,
      module: "credits",
      title: "Credits",
    },
    {
      onClick: () => {
      },
      href: "#",
      icon: <IoLogOut className="text-xl" />,
      module: "logout",
      title: "Logout",
    },
    {
      onClick: () => toggleTheme(),
      href: "#",
      icon:
        theme === "dark" ? <MdDarkMode className="text-xl" /> : <MdLightMode className="text-xl" />,
      title: theme === "dark" ? "Dark" : "Light",
    },
  ];

  const themeLink = {
    onClick: () => {
      toggleTheme();
    },
    icon:
      theme === "light" ? <MdDarkMode className="text-2xl" /> : <MdLightMode className="text-2xl" />,
    title: theme === "light" ? "Dark" : "Light",
  };

  return (
    <div className="h-screen w-40 3xl:px-[32px] 4xl:w-56 py-7 px-[15px] flex flex-col items-center justify-between text-sidebarText bg-mainGreen relative z-50">
      <div className="flex flex-col gap-2 items-center">
        {/* <Image src="/holmes_dark_theme_logo.svg" alt="Logo" width={131} height={40} /> */}
      </div>
      <div className="flex w-full flex-col gap-4 ml-6">
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

      <div className="flex w-full flex-col gap-4 ml-6">
        {links2.map((link, idx) => (
          <BarComponent
            key={idx}
            onClick={link.onClick}
            href={link.href}
            icon={link.icon}
            isActive={false}
            title={link.title}
          />
        ))}
       <div className="mt-5 opacity-0">
         <BarComponent
          onClick={themeLink.onClick}
          icon={themeLink.icon}
          href=""
          isActive={false}
          title={themeLink.title}
        />
       </div>
      </div>

    </div>
  );
};