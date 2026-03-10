"use client";

import { useState } from "react";
import { FiDownload, FiPlus, FiSearch, FiFilter, FiArrowRight, FiAward } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { MdImage, MdVideoLibrary, MdMic, MdRefresh, MdBolt, MdOutlineWallet, MdOutlineFileUpload } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TbChartDonut, TbListNumbers } from "react-icons/tb";
import { BsLayers, BsUpload } from "react-icons/bs";
import { LuBadge, LuCalendar, LuSettings2, LuTrendingUp, LuWallet } from "react-icons/lu";
import { RxCheckCircled } from "react-icons/rx";
import { BiSort } from "react-icons/bi";
import { useSystemTheme } from "@/src/hooks/useSystemsTheme";
import CreditsBillingModal from "./modal";

// ── Segment colors (unchanged from original) ──
const SEGMENT_COLORS = [
  "#3A86FE", // Image gen
  "#8338EC", // Video
  "#FF006E", // AI chat
  "#FA5607", // Transcript
  "#FFBE0C", // Other
];

// ── Per-category icon config: icon component + bg color + icon color ──
const CATEGORY_CONFIG = [
  { Icon: MdImage, bg: "#EEF3FF", iconColor: "#3A86FE" }, // Image gen   – blue
  { Icon: IoChatbubblesOutline, bg: "#FFF0F5", iconColor: "#FF006E" }, // AI chat     – pink
  { Icon: MdVideoLibrary, bg: "#F3EEFF", iconColor: "#8338EC" }, // Video       – purple
  { Icon: MdMic, bg: "#FFF4EE", iconColor: "#FA5607" }, // Transcription – orange
  { Icon: BsLayers, bg: "#FFFBEE", iconColor: "#FFBE0C" }, // Other       – yellow
];

// ── Stat tile icon config ──
const STAT_ICONS = [
  { Icon: HiOutlineSparkles, bg: "#EEF3FF", iconColor: "#3A86FE" },
  { Icon: RiMoneyDollarCircleLine, bg: "#EDFAF4", iconColor: "#40bc86" },
  { Icon: TbChartDonut, bg: "#FFFBEE", iconColor: "#FFBE0C" },
];

const usageCategories = [
  { label: "Image generation", pct: 38, credits: 5240, colorIdx: 0 },
  { label: "AI chat completions", pct: 24, credits: 3220, colorIdx: 2 },
  { label: "Video rendering", pct: 16, credits: 2110, colorIdx: 1 },
  { label: "Transcription", pct: 10, credits: 1380, colorIdx: 3 },
  { label: "Other resources", pct: 12, credits: 1650, colorIdx: 4 },
];

const resourceIcons: any = {
  "Image generation": MdImage,
  "AI chat completions": IoChatbubblesOutline,
  "Video rendering": MdVideoLibrary,
  Transcription: MdMic,
  "Monthly credit refill": MdRefresh,
};

const usageLog = [
  {
    time: "Oct 23, 2:42 PM",
    date: "Nov 08, 2024",
    resource: "Image generation",
    sub: "Campaign visual set",
    detail: "8 renders · SDXL Fast",
    project: "Project: Winter launch",
    performedBy: "Sarah Chen",
    credits: -480
  },
  {
    time: "Oct 23, 12:18 PM",
    date: "Nov 08, 2024",
    resource: "AI chat completions",
    sub: "Support copilot",
    detail: "214 responses · GPT-4.1",
    project: "Workspace automation",
    performedBy: "Alex Rivera",
    credits: -260
  },
  {
    time: "Oct 23, 2:42 PM",
    date: "Nov 08, 2024",
    resource: "Image generation",
    sub: "Campaign visual set",
    detail: "8 renders · SDXL Fast",
    project: "Project: Winter launch",
    performedBy: "Sarah Chen",
    credits: -480
  },
  {
    time: "Oct 23, 12:18 PM",
    date: "Nov 08, 2024",
    resource: "AI chat completions",
    sub: "Support copilot",
    detail: "214 responses · GPT-4.1",
    project: "Workspace automation",
    performedBy: "Alex Rivera",
    credits: -260
  }, {
    time: "Oct 23, 2:42 PM",
    date: "Nov 08, 2024",
    resource: "Image generation",
    sub: "Campaign visual set",
    detail: "8 renders · SDXL Fast",
    project: "Project: Winter launch",
    performedBy: "Sarah Chen",
    credits: -480
  },
  {
    time: "Oct 23, 12:18 PM",
    date: "Nov 08, 2024",
    resource: "AI chat completions",
    sub: "Support copilot",
    detail: "214 responses · GPT-4.1",
    project: "Workspace automation",
    performedBy: "Alex Rivera",
    credits: -260
  },
];

const usageLog2 = [
  {
    time: "Today, 2:42 PM",
    date: "Nov 08, 2024",
    resource: "Image generation",
    sub: "Campaign visual set",
    detail: "randomefile.pdf",
    project: "Project: Winter launch",
    performedBy: "Sarah Chen",
    credits: 1000
  },
  {
    time: "Today, 12:18 PM",
    date: "Nov 08, 2024",
    resource: "AI chat completions",
    sub: "Support copilot",
    detail: "214 responses · GPT-4.1",
    project: "Workspace automation",
    performedBy: "Alex Rivera",
    credits: 10000
  },
  {
    time: "Today, 2:42 PM",
    date: "Nov 08, 2024",
    resource: "Image generation",
    sub: "Campaign visual set",
    detail: "8 renders · SDXL Fast",
    project: "Project: Winter launch",
    performedBy: "Sarah Chen",
    credits: 480
  },
  {
    time: "Today, 12:18 PM",
    date: "Nov 08, 2024",
    resource: "AI chat completions",
    sub: "Support copilot",
    detail: "214 responses · GPT-4.1",
    project: "Workspace automation",
    performedBy: "Alex Rivera",
    credits: 160
  }, {
    time: "Today, 2:42 PM",
    date: "Nov 08, 2024",
    resource: "Image generation",
    sub: "Campaign visual set",
    detail: "8 renders · SDXL Fast",
    project: "Project: Winter launch",
    performedBy: "Sarah Chen",
    credits: 480
  },
  {
    time: "Today, 12:18 PM",
    date: "Nov 08, 2024",
    resource: "AI chat completions",
    sub: "Support copilot",
    detail: "214 responses · GPT-4.1",
    project: "Workspace automation",
    performedBy: "Alex Rivera",
    credits: 260
  },
];

function StatusBadge({ status }: any) {
  const isAdded = status === "Added";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${isAdded ? "bg-[#d4ead9] text-[#1a3a2a]" : "bg-[#1a3a2a] text-[#d4ead9]"}`}>
      {status}
    </span>
  );
}

function ResourceIcon({ name }: any) {
  const Icon = resourceIcons[name] || MdBolt;
  return (
    <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-bgSkeleton text-[#40bc86] flex-shrink-0">
      <Icon size={15} />
    </span>
  );
}

export default function CreditsPage() {
  const [page, setPage] = useState(1);
  const { theme } = useSystemTheme()
  const [openCreditsModal, setOpenCreditsModal] = useState(false);


  const totalCredits = 50000;
  const usedCredits = 13600;
  const availableCredits = totalCredits - usedCredits;
  const pctRemaining = Math.round((availableCredits / totalCredits) * 100);
  // bar width = only the used portion of the card width
  const usedBarPct = (usedCredits / totalCredits) * 100; // 27.2%

  return (
    <div
      className="h-full max-w-[1100px] lg:max-w-[1300px] xl:max-w-[1430px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2300px] m-0 mx-auto overflow-hidden bg-mainBG flex flex-col px-4 px-10 xl:px-20 py-10">

      {/* ── Page body ── */}
      <div className="px-8 py-8 mx-auto overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1
              onClick={() => setOpenCreditsModal(true)}
              className="text-5xl flex-1 flex items-center m-0 font-extralight text-textTheme">
              Credits &amp; Billings
            </h1>
            <p className="text-sm whitespace-nowrap text-textTheme mt-1">
              Track available credits, where they are being spent, and how usage is trending across your resources.
            </p>
            <div className="invisible">
              <span className="hidden lg:inline">
                Page layouts look better with something in each section. g in each section. Web page designers, content writers, and layout artists use lorem ipsum, Web page designers, content writers, and layout artists use lorem ipsum, also known as placeholder copy, to distinguish which areas on a page will hold advertisements.
              </span>
              <span className="lg:hidden">Page layouts look better with something in each section.</span>
            </div>
          </div>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-[1fr_480px] 3xl:grid-cols-[1fr_600px] 4xl:grid-cols-[1fr_650px] mt-1 gap-5">

          {/* ═══════════════════════════════════════════
              LEFT — AVAILABLE CREDITS CARD (redesigned)
          ═══════════════════════════════════════════ */}
          <div className="bg-bgElevated rounded-2xl border border-borderMuted p-6 space-y-5 shadow-md">

            {/* Card header: wallet icon + title + Top up button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-bgSkeleton">
                  <LuWallet className="text-textTheme text-xl" />
                </span>
                <div>
                  <p className="text-md font-semibold text-textTheme leading-wide">Available credits</p>
                  <p className="text-xs text-cardSmText mt-1">Monthly pool for your active workspace</p>
                </div>
              </div>
              {/* Top up credits button — new green pill from screenshot */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#40bc86] text-black text-xsm font-medium cursor-pointer border-none shadow-md  transition-colors">
                <FiPlus size={15} />
                Top up credits
                <FiArrowRight size={14} />
              </button>
            </div>

            {/* Big number */}
            <div className="py-2">
              <span className="text-5xl font-semibold  text-textTheme font-sans">
                {availableCredits.toLocaleString()}
              </span>
              <span className="text-subTitleText ml-2 text-sm">
                / {totalCredits.toLocaleString()} total credits
              </span>
            </div>

            {/* Progress bar — only spans the used portion */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xsm font-semibold text-textTheme">Usage breakdown</p>
                <p className="text-xs tracking-wide text-cardSmText">{usedCredits.toLocaleString()} credits spent this cycle</p>
              </div>

              {/* Segmented bar — only first/last ends are rounded, inner edges flat, gaps between */}
              <div className="h-2 w-full flex gap-[3px]">
                {usageCategories.map((c, i) => (
                  <div
                    key={i}
                    className="h-full"
                    style={{
                      width: `${(c.credits / usedCredits) * 100}%`,
                      backgroundColor: SEGMENT_COLORS[c.colorIdx],
                      boxShadow: `0 2px 44px ${SEGMENT_COLORS[c.colorIdx]}35`,
                      borderRadius: i === 0
                        ? "999px 0 0 999px"
                        : i === usageCategories.length - 1
                          ? "0 999px 999px 0"
                          : "0",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Category legend — 2-col grid, colored dot only */}
            <div className="grid grid-cols-2 gap-x-8 pt-2 gap-y-6">
              {usageCategories.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  {/* Colored circle dot */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: SEGMENT_COLORS[c.colorIdx] }}
                  />
                  <div>
                    <p className="text-sm text-textTheme font-medium leading-tight">
                      {c.label}{"   "}
                      <span className="font-normal pl-1 text-xs tracking-wide text-subTitleText">{c.pct}%</span>
                    </p>
                    <p className="text-xs text-cardSmText tracking-wide mt-0.5">
                      {c.credits.toLocaleString()} credits
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stat tiles — icon badge top-left, bigger value, better bg */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { label: "Highest spending", value: "Image generation", sub: "5,240 credits", statIdx: 0 },
                { label: "Credits added", value: "+50,000", sub: "On Nov 1 refill", statIdx: 1 },
                { label: "Projected left", value: "9,200", sub: "By cycle end", statIdx: 2 },
              ].map((tile, i) => {
                const { Icon, iconColor } = STAT_ICONS[tile.statIdx];
                return (
                  <div
                    key={i}
                    className={`${theme == "dark" ? "bg-bgSkeleton" : "bg-[#f4f1ea]/20"} border-[0.5px] border-borderMuted border-solid shadow-sm rounded-2xl p-4 space-y-3`}
                  >
                    {/* Top row: icon badge + label */}
                    <div className="flex items-center gap-2">
                      <span
                        className=" rounded-xl flex items-center justify-center flex-shrink-0"
                      // style={{ backgroundColor: bg }}
                      >
                        <Icon className="text-md" style={{ color: iconColor }} />
                      </span>
                      <p className="text-xs text-cardSmText font-medium">{tile.label}</p>
                    </div>
                    {/* Value + sub */}
                    <div>
                      <p className="text-xl font-semibold text-textTheme leading-tight">{tile.value}</p>
                      <p className="text-xs text-cardSmText tracking-wide mt-1">{tile.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* ═══════════════════════════════════════════
              END LEFT CARD
          ═══════════════════════════════════════════ */}

          {/* Right: Current plan card (unchanged) */}
          <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-bgSkeleton">
                  <FiAward className="text-textTheme text-xl" />
                </span>
                <div>
                  <p className="text-md font-semibold text-textTheme">Current plan</p>
                  <p className="text-xs text-cardSmText mt-0.5">Credits are attached to this plan</p>
                </div>
              </div>
              {/* <span className="bg-[#42CE91] text-black text-xs font-bold px-3 py-1 rounded-full">Pro</span> */}
            </div>

            <div className="pt-3">
              <h2 className="text-2xl font-semibold text-textTheme">Growth Pro</h2>
              <p className="text-sm text-subTitleText mt-1">$99 / month</p>
            </div>

            <div className="space-y-4  pt-4">
              {[
                { label: "Included monthly credits", value: "50,000", icon: TbListNumbers },
                { label: "Overage rate", value: "$12 / 5,000 credits", icon: LuTrendingUp },
                { label: "Next refill", value: "Nov 01, 2024", icon: LuCalendar },
              ].map((row, i) => {
                const Icon = row.icon;

                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="text-cardSmText text-md" />
                      <p className="text-xsm text-cardSmText">{row.label}</p>
                    </div>

                    <p className="text-xsm font-medium text-textTheme">{row.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 border-t border-[#e8e2d9] pt-4 pb-3">
              {[
                "Shared team credit pool",
                "Shared team credit pool",
                "Shared team credit pool",
                "Credit usage breakdown by resource",
                "Priority processing on generation jobs",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <RxCheckCircled className="text-borderActive text-md" />
                  <p className="text-sm text-textTheme">{feat}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 rounded-xl flex items-center gap-2 justify-center shadow-md border-none bg-[#40bc86]  text-black text-sm font-medium ">
              <span><LuSettings2 className="text-lg" /></span>
              Manage plan
            </button>
          </div>
        </div>

        {/* ── Credit usage log (unchanged) ── */}
        <div className="mt-4">

          <div className="bg-bgElevated shadow-md rounded-2xl border mt-6 border-borderMuted  py-7">
            <div className="flex items-center justify-between mb-1 pb-5 border-b border-solid px-7 border-borderMuted border-t-0 border-l-0 border-r-0">
              <div>
                <h2 className="text-lg font-medium text-textTheme">Credit usage log</h2>
                <p className="text-xsm text-subTitleText mt-0.5">Recent credit activity across models, automations, and resources</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center focus-within:border-borderActive 3xl:focus-within:border-2 focus-within:border-[1.5px] gap-2   border border-borderMuted border-solid rounded-lg px-3 py-2 ">
                  <FiSearch className="text-cardSmText text-lg" />
                  <input placeholder="Search resources or jobs" className="bg-transparent text-sm text-textTheme  placeholder-cardSmText border-none outline-none w-64" />
                </div>
                <button className="flex items-center gap-1.5 border border-borderMuted 3xl:hover:border-2 hover:border-[1.5px] hover:border-borderActive bg-transparent border-solid   rounded-lg px-3 py-2  text-sm text-textTheme cursor-pointer transition-colors">
                  <BiSort className="text-lg" />
                  Sort
                </button>
                <button className="flex items-center gap-1.5 border border-borderMuted border-solid  3xl:hover:border-2 hover:border-[1.5px] hover:border-borderActive bg-transparent  rounded-lg px-3 py-2  text-sm text-textTheme cursor-pointer transition-colors">
                  <FiFilter className="text-lg" />
                  Filter
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] gap-4 pb-3 px-10 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
                {["Date & Time", "Resource", "Usage detail", "Performed By", "Credits"].map((h) => (
                  <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">{h}</p>
                ))}
              </div>

              {usageLog.map((row, i) => (
                <div key={i} className="px-10 grid grid-cols-[2fr_2fr_2fr_1fr_1fr] gap-4 py-4 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0 items-center px-1 -mx-1 transition-colors">
                  <div>
                    <p className="text-xsm font-normal tracking-wide text-textTheme">{row.time}</p>
                    {/* <p className="text-xxs text-cardSmText">{row.date}</p> */}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <ResourceIcon name={row.resource} /> */}
                    <div>
                      <p className="text-sm font-medium text-textTheme">{row.resource}</p>
                      <p className="text-xs text-cardSmText">{row.sub}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-textTheme">{row.detail}</p>
                    <p className="text-xs text-cardSmText">{row.project}</p>
                  </div>
                  <div>
                    <p className="text-sm text-textTheme">{row.performedBy}</p>
                  </div>
                  <p className={`text-sm font-medium tracking-wide ${row.credits > 0 ? "text-borderActive" : "text-errorBG"}`}>
                    {row.credits > 0 ? `+${row.credits.toLocaleString()}` : row.credits.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>


          </div>
        </div>

        <div className="mt-4">

          <div className="bg-bgElevated shadow-md py-7 rounded-2xl border mt-6 border-borderMuted  ">
            <div className="flex items-center justify-between mb-1 pb-5 border-b border-solid px-7 border-borderMuted border-t-0 border-l-0 border-r-0">
              <div>
                <h2 className="text-lg font-medium text-textTheme">Top up & billing history</h2>
                <p className="text-xsm text-subTitleText mt-0.5">Purchases, renewals, invoices, and manual credit additions.</p>
              </div>
              <div className="flex items-center gap-2">

                <button className="flex items-center gap-2 border border-borderMuted 3xl:hover:border-2 hover:border-[1.5px] hover:border-borderActive bg-transparent border-solid   rounded-lg px-3 py-2  text-sm text-textTheme cursor-pointer transition-colors">
                  <MdOutlineFileUpload className="text-lg" />
                  Export
                </button>
                <button className="flex items-center gap-2 border border-borderMuted border-solid  3xl:hover:border-2 hover:border-[1.5px] hover:border-borderActive bg-transparent  rounded-lg px-3 py-2  text-sm text-textTheme cursor-pointer transition-colors">
                  <FiFilter className="text-lg" />
                  Filter
                </button>
              </div>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-[2fr_2fr_2fr_1fr] gap-4 pb-3 px-10 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
                {["Description", "Date & Time", "Receipt", "Credits"].map((h) => (
                  <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">{h}</p>
                ))}
              </div>

              {usageLog2.map((row, i) => (
                <div key={i} className="px-10 grid grid-cols-[2fr_2fr_2fr_1fr] gap-4 py-4 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0 items-center px-1 -mx-1 transition-colors">

                  <div className="flex items-center gap-2">
                    {/* <ResourceIcon name={row.resource} /> */}
                    <div>
                      <p className="text-sm font-medium text-textTheme">{row.resource}</p>
                      <p className="text-xs text-cardSmText">{row.sub}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-normal text-textTheme">{row.time}</p>
                    {/* <p className="text-xxs text-cardSmText">{row.date}</p> */}
                  </div>

                  <div className="flex gap-2 items-center">
                    <FiDownload className="text-md text-subTitleText" />
                    <p className="text-sm text-textTheme">{row.detail}</p>
                  </div>

                  <p className={`text-sm font-medium tracking-wide ${row.credits > 0 ? "text-borderActive" : "text-errorBG"}`}>
                    {row.credits > 0 ? `+${row.credits.toLocaleString()}` : row.credits.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>


          </div>
        </div>

      </div>
      <CreditsBillingModal
        open={openCreditsModal}
        onClose={() => setOpenCreditsModal(false)}
      />
    </div>
  );
}