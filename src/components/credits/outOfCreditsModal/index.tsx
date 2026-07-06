"use client";

import { useState } from "react";
import { HiOutlineBolt, HiOutlineSparkles } from "react-icons/hi2";
import { LuArrowRight, LuCrown, LuWallet } from "react-icons/lu";
import { FiX, FiCheck } from "react-icons/fi";
import { AiOutlineAlert } from "react-icons/ai";
import { CgBolt } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa6";

interface CreditsBillingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreditsBillingModal({ open, onClose }: CreditsBillingModalProps) {
  const [selected, setSelected] = useState<"topup" | "premium">("topup");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-bgElevated rounded-3xl shadow-2xl w-full max-w-[710px]  mx-4 overflow-hidden flex flex-col items-center">

        {/* ── HEADER — gradient from lavender to white ── */}
        <div className="w-full flex flex-col bg-bgElevated items-start px-8 pt-8 pb-8" >
       <div className="absolute inset-0 pointer-events-none overflow-hidden">
  <div
    className="absolute -top-10 -left-8 w-32 h-32 rounded-full"
    style={{ background: 'radial-gradient(circle, rgba(67, 206, 145, 0.3) 0%, transparent 70%)', filter: 'blur(40px)' }}
  />
  <div
    className="absolute -top-6 left-28 w-40 h-40 rounded-full"
    style={{ background: 'radial-gradient(circle, rgba(67, 206, 145, 0.3) 0%, transparent 70%)', filter: 'blur(45px)' }}
  />
  <div
    className="absolute -top-14 right-20 w-40 h-52 rounded-full"
    style={{ background: 'radial-gradient(circle, rgba(67, 206, 145, 0.3) 0%, transparent 70%)', filter: 'blur(45px)' }}
  />
  <div
    className="absolute top-0 right-[-10px] w-36 h-36 rounded-full"
    style={{ background: 'radial-gradient(circle, rgba(67, 206, 145, 0.3) 0%, transparent 70%)', filter: 'blur(48px)' }}
  />
  <div
    className="absolute -top-4 left-[42%] w-32 h-32 rounded-full"
    style={{ background: 'radial-gradient(circle, rgba(67, 206, 145, 0.3) 0%, transparent 65%)', filter: 'blur(42px)' }}
  />
  <div
    className="absolute top-2 left-10 w-28 h-28 rounded-full"
    style={{ background: 'radial-gradient(circle, rgba(67, 206, 145, 0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}
  />
</div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-1 rounded-full transition-colors"
          >
            <FiX size={18} />
          </button>

          {/* Sparkle icon + "Credits exhausted" label */}
          <div className="flex items-center mt-9  rounded-full pl-10 gap-1.5 mb-2">
            {/* <AiOutlineAlert className="text-errorBG text-lg" /> */}
            <span className="text-sm  font-semibold text-[#2F9E6F] ">Credits needed to continue</span>
          </div>

          {/* Big bold title */}
          <h2 className="text-3xl pl-10 font-medium text-textTheme text-center leading-tight mb-2 m-0">
            You've run out of credits
          </h2>

          {/* Subtitle */}
          <p className="text-md  pl-10 text-textTheme font-light text-start leading-relaxed max-w-[480px] m-0">
            Top up to continue right away, explore all plans, or view usage to see where your credits were spent.
          </p>
        </div>

        <div className="w-[82%] px-4 text-sm mx-auto pr-8 items-center  py-3 border-[1.4px] shadow-sm border-solid border-bgSkeleton rounded-xl mx-auto flex justify-between ">
            <p className="flex flex-col gap-0.5   text-xs text-subTitleText">  Current balance   <span className=" text-textTheme text-sm font-semibold">0 Credits</span>   </p>
            <span className="text-sm text-subTitleText flex items-center gap-3">View usage  <FaChevronRight className="text-xs"/> </span>
           
        </div>

        {/* ── BODY ── */}
        <div className="w-[90%] px-8 mx-auto pt-6 pb-8 flex flex-col items-center bg-bgElevated">

          {/* Option cards */}
          <div className="w-full grid grid-cols-2 gap-3 mb-5">

            {/* Quick Top Up — now RECOMMENDED */}
            <div
              onClick={() => setSelected("topup")}
              className={`relative rounded-2xl border-[1.8px] border-solid p-4 cursor-pointer transition-all
                ${selected === "topup"
                  ? "border-[#43CE91]"
                  : "border-borderMuted"
                }`}
            >
              {/* Recommended badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[#43CE91] text-black text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full whitespace-nowrap">
                  RECOMMENDED
                </span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#43CE91]/10 flex items-center justify-center mb-3 mt-1">
                <HiOutlineBolt className="text-borderActive text-lg" />
              </div>
              <p className="text-lg font-medium text-textTheme mb-0.5">Quick Top Up</p>
              <p className="text-sm text-subTitleText font-light mb-3">Add credits instantly</p>
              <ul className="space-y-1.5 px-0">
                {["Instant activation", "Flexible packages", "Starting from $10"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-sm text-subTitleText">
                    <FiCheck className="text-borderActive flex-shrink-0 text-xs" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Plan — no badge */}
            <div
              onClick={() => setSelected("premium")}
              className={`relative rounded-2xl border-[1.8px] border-solid p-4 cursor-pointer transition-all
                ${selected === "premium"
                  ? "border-[#43CE91]"
                  : "border-borderMuted"
                }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#43CE91]/10 flex items-center justify-center mb-3">
                <LuCrown className="text-borderActive text-lg" />
              </div>
              <p className="text-lg font-medium text-textTheme mb-0.1">Upgrade Plan</p>
              <p className="text-sm text-subTitleText font-light  mb-3">Unlock unlimited potential</p>
              <ul className="space-y-1.5 px-0">
                {["500 credits monthly", "Advanced AI features", "Priority support 24/7"].map((item) => (
                  <li key={item} className="flex items-center gap-1.5 text-sm text-subTitleText">
                    <FiCheck className="text-borderActive flex-shrink-0 text-sm" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="w-full grid grid-cols-2 gap-3 mb-3">
            <button className="w-full flex items-center gap-2 bg-[#43CE91] text-black text-sm font-semibold py-3.5 rounded-xl border-none cursor-pointer transition-colors flex items-center justify-center gap-1.5">
              {selected == "premium" ? "Get Premium  " : "Top Up Credits  "}
               <LuArrowRight className="text-md"/>
            </button>
            <button className="w-full bg-transparent text-borderActive text-sm font-semibold py-3.5 rounded-xl border border-borderActive border-solid cursor-pointer transition-colors">
              View All Plans
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}