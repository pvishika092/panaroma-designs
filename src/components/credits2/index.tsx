"use client";

import { useState } from "react";
import { FiDownload, FiPlus, FiSearch, FiFilter, FiArrowRight, FiAward, FiMonitor, FiSettings } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { MdImage, MdVideoLibrary, MdMic, MdRefresh, MdBolt, MdOutlineWallet, MdOutlineFileUpload } from "react-icons/md";
import { IoChatbubblesOutline, IoRefreshOutline } from "react-icons/io5";
import { HiOutlineBolt, HiOutlineSparkles } from "react-icons/hi2";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TbChartDonut, TbListNumbers, TbShieldBolt } from "react-icons/tb";
import { BsLayers, BsUpload } from "react-icons/bs";
import { LuBadge, LuCalendar, LuSettings2, LuTrendingUp, LuWallet } from "react-icons/lu";
import { RxCheckCircled } from "react-icons/rx";
import { BiSort } from "react-icons/bi";
import { useSystemTheme } from "@/src/hooks/useSystemsTheme";
import CreditsBillingModal from "./modal";
import { GrRefresh } from "react-icons/gr";

const SEGMENT_COLORS = [
  "#3A86FE",
  "#8338EC",
  "#FF006E",
  "#FA5607",
  "#FFBE0C",
];

const CATEGORY_CONFIG = [
  { Icon: MdImage, bg: "#EEF3FF", iconColor: "#3A86FE" },
  { Icon: IoChatbubblesOutline, bg: "#FFF0F5", iconColor: "#FF006E" },
  { Icon: MdVideoLibrary, bg: "#F3EEFF", iconColor: "#8338EC" },
  { Icon: MdMic, bg: "#FFF4EE", iconColor: "#FA5607" },
  { Icon: BsLayers, bg: "#FFFBEE", iconColor: "#FFBE0C" },
];

const STAT_ICONS = [
  { Icon: HiOutlineSparkles, bg: "#EEF3FF", iconColor: "#3A86FE" },
  { Icon: RiMoneyDollarCircleLine, bg: "#EDFAF4", iconColor: "#40bc86" },
  { Icon: TbChartDonut, bg: "#FFFBEE", iconColor: "#FFBE0C" },
];

const usageCategories = [
  { label: "Image generation", pct: 38, credits: 5240, colorIdx: 0, perOp: 30, opLabel: "per render" },
  { label: "AI chat completions", pct: 24, credits: 3220, colorIdx: 2, perOp: 12, opLabel: "per response" },
  { label: "Video rendering", pct: 16, credits: 2110, colorIdx: 1, perOp: 180, opLabel: "per minute" },
  { label: "Transcription", pct: 10, credits: 1380, colorIdx: 3, perOp: 6, opLabel: "per minute" },
  { label: "Other resources", pct: 12, credits: 1650, colorIdx: 4, perOp: null, opLabel: "mixed rates" },
];

const resourceIcons: any = {
  "Image generation": MdImage,
  "AI chat completions": IoChatbubblesOutline,
  "Video rendering": MdVideoLibrary,
  Transcription: MdMic,
  "Monthly credit refill": MdRefresh,
};

const usageLog = [
  { time: "Oct 23, 2:42 PM", date: "Nov 08, 2024", resource: "Image generation", sub: "Campaign visual set", detail: "8 renders · SDXL Fast", project: "Project: Winter launch", performedBy: "Sarah Chen", credits: -480 },
  { time: "Oct 23, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot", detail: "214 responses · GPT-4.1", project: "Workspace automation", performedBy: "Alex Rivera", credits: -260 },
  { time: "Oct 23, 2:42 PM", date: "Nov 08, 2024", resource: "Image generation", sub: "Campaign visual set", detail: "8 renders · SDXL Fast", project: "Project: Winter launch", performedBy: "Sarah Chen", credits: -480 },
  { time: "Oct 23, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot", detail: "214 responses · GPT-4.1", project: "Workspace automation", performedBy: "Alex Rivera", credits: -260 },
  { time: "Oct 23, 2:42 PM", date: "Nov 08, 2024", resource: "Image generation", sub: "Campaign visual set", detail: "8 renders · SDXL Fast", project: "Project: Winter launch", performedBy: "Sarah Chen", credits: -480 },
  { time: "Oct 23, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot", detail: "214 responses · GPT-4.1", project: "Workspace automation", performedBy: "Alex Rivera", credits: -260 },
];

const usageLog2 = [
  { time: "Today, 2:42 PM", date: "Nov 08, 2024", resource: "Image generation", sub: "Campaign visual set", detail: "randomefile.pdf", project: "Project: Winter launch", performedBy: "Sarah Chen", credits: 1000 },
  { time: "Today, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot", detail: "214 responses · GPT-4.1", project: "Workspace automation", performedBy: "Alex Rivera", credits: 10000 },
  { time: "Today, 2:42 PM", date: "Nov 08, 2024", resource: "Image generation", sub: "Campaign visual set", detail: "8 renders · SDXL Fast", project: "Project: Winter launch", performedBy: "Sarah Chen", credits: 480 },
  { time: "Today, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot", detail: "214 responses · GPT-4.1", project: "Workspace automation", performedBy: "Alex Rivera", credits: 160 },
  { time: "Today, 2:42 PM", date: "Nov 08, 2024", resource: "Image generation", sub: "Campaign visual set", detail: "8 renders · SDXL Fast", project: "Project: Winter launch", performedBy: "Sarah Chen", credits: 480 },
  { time: "Today, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot", detail: "214 responses · GPT-4.1", project: "Workspace automation", performedBy: "Alex Rivera", credits: 260 },
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
  const [activeTab, setActiveTab] = useState<"credits" | "billing">("credits");
  const isPlanExpired = false; // toggle this based on your actual plan status
  const [editingBilling, setEditingBilling] = useState(false);
const [billingInfo, setBillingInfo] = useState({
  email: "sarah.chen@company.com",
  name: "Sarah Chen",
  address : "340 Pine St, Suite 800 San Francisco, CA 94104",
  company: "Acme Inc.",
  country: "United States",
  taxId: "US · VAT-884321",
});


  const billingInvoices = [
    { date: "Oct 24, 2025", description: "Growth Pro Annual Renewal", amount: "$990.00", creditsAdded: 600000, method: "4242", invoice: "INV-0012" },
    { date: "Aug 12, 2025", description: "Credit Top Up – 50k Pack", amount: "$100.00", creditsAdded: 50000, method: "4242", invoice: "INV-0011" },
    { date: "Oct 24, 2024", description: "Growth Pro Annual Subscription", amount: "$990.00", creditsAdded: 600000, method: "4242", invoice: "INV-0004" },
    { date: "Oct 24, 2025", description: "Growth Pro Annual Renewal", amount: "$990.00", creditsAdded: 600000, method: "4242", invoice: "INV-0012" },
    { date: "Aug 12, 2025", description: "Credit Top Up – 50k Pack", amount: "$100.00", creditsAdded: 50000, method: "4242", invoice: "INV-0011" },
    { date: "Oct 24, 2024", description: "Growth Pro Annual Subscription", amount: "$990.00", creditsAdded: 600000, method: "4242", invoice: "INV-0004" },
  ];

  const totalCredits = 50000;
  const usedCredits = 13600;
  const availableCredits = totalCredits - usedCredits;
  const pctRemaining = Math.round((availableCredits / totalCredits) * 100);
  const usedBarPct = (usedCredits / totalCredits) * 100;

  return (
    <div className="h-full  max-w-[1100px] lg:max-w-[1300px]  xl:max-w-[1430px]  2xl:max-w-[1600px]  3xl:max-w-[1800px] 4xl:max-w-[2300px] m-0 mx-auto overflow-hidden bg-mainBG flex flex-col px-4 px-10 xl:px-20 py-10">
      <div className="px-8 py-8 mx-auto overflow-y-auto">
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

        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setActiveTab("credits")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border-[1.6px] 3xl:border-[1.8px] 4xl:border-[2px] transition-all cursor-pointer ${activeTab === "credits"
                ? "border-borderActive border-solid text-textTheme bg-transparent"
                : "border-sectionBG border-solid text-cardSmText bg-transparent"
              }`}
          >
            Credits
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border-[1.6px] 3xl:border-[1.8px] 4xl:border-[2px] transition-all cursor-pointer ${activeTab === "billing"
                ? "border-borderActive border-solid text-textTheme bg-transparent"
                : "border-sectionBG border-solid text-cardSmText bg-transparent"
              }`}
          >
            Billing
          </button>
        </div>

     {activeTab === "credits" && (
  <>
    {isPlanExpired && (
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl border border-solid border-[#f5c0c0] bg-[#fff5f5] mb-5">
        <div className="flex items-center gap-3">
          <span className="text-[#c0392b] text-base flex-shrink-0">⚠</span>
          <div>
            <p className="text-sm font-semibold text-[#c0392b]">Your plan has expired</p>
            <p className="text-xs text-[#c0392b]/70 mt-0.5">Credit usage and top-ups are paused until you renew your subscription.</p>
          </div>
        </div>
        <button className="flex-shrink-0 flex items-center gap-1.5 bg-[#c0392b] text-white text-xs font-semibold px-4 py-2 rounded-lg border-none cursor-pointer whitespace-nowrap">
          Renew Plan →
        </button>
      </div>
    )}

    {/* Top stat tiles row */}
    <div className="grid grid-cols-4 gap-4 mt-1">
      {[
        {
          icon: <LuWallet className="text-cardSmText text-lg" />,
          label: "Available Balance",
          value: availableCredits.toLocaleString(),
          sub: `of ${totalCredits.toLocaleString()} credits`,
        },
        {
          icon: <TbChartDonut className="text-cardSmText text-lg" />,
          label: "Used this cycle",
          value: usedCredits.toLocaleString(),
          sub: `${Math.round((usedCredits / totalCredits) * 100)}% consumed`,
        },
        {
          icon: <LuCalendar className="text-cardSmText text-lg" />,
          label: "Next Refill",
          value: "—",
          sub: "Plan expired",
        },
        {
          icon: <FiAward className="text-cardSmText text-lg" />,
          label: "Average daily usage",
          value: "1,230 credits",
          sub: "Last 30 days",
          action: () => setActiveTab("billing"),
        },
      ].map((tile, i) => (
        <div
          key={i}
          onClick={tile.action}
          className={`bg-bgElevated rounded-2xl border border-borderMuted p-4 shadow-md flex flex-col gap-2 ${tile.action ? "cursor-pointer hover:border-borderActive transition-colors" : ""}`}
        >
         <div className="flex gap-3 items-center justify-between">
           
            <p className="text-xsm  font-normal text-textTheme ">{tile.label}</p>
            <div className=" flex items-center text-cardSmText justify-center  flex-shrink-0">
            {tile.icon}
          </div>

         </div>
          <div>
            <p className={`font-light text-textTheme  ${i === 3 ? "text-2xl" : "text-3xl"}`}>{tile.value}</p>
            <p className="text-xs text-cardSmText mt-1">{tile.sub}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-4 flex gap-4 items-stretch">

  {/* Left — Usage by feature */}
  <div className="flex-[1] bg-bgElevated rounded-2xl border border-borderMuted py-6 shadow-md">
    <div className="flex items-center justify-between px-6 mb-1 border-b border-solid border-borderMuted border-t-0 border-l-0 border-r-0 pb-5">
      <div>
        <h2 className="text-lg font-normal text-textTheme">Usage by feature</h2>
        <p className="text-xsm text-subTitleText mt-0.5">Recent credit activity across models, automations, and resources</p>
      </div>
    </div>

    <div className="mt-6 px-6">
      <div className="flex  flex-col mt-1 mb-3">
        <span className="text-xsm font-medium text-subTitleText mb-1">Credits consumed this cycle</span>
        <p className="text-4xl font-light text-textTheme">{usedCredits.toLocaleString()} <span className="text-sm text-cardSmText"> / 50,000</span> </p>
      </div>

                    <p className="text-xsm font-medium mb-2 mt-4 text-textTheme">Usage breakdown</p>

      <div className="h-2.5 w-full flex gap-[4px] mb-8">
        {usageCategories.map((c, i) => (
          <div
            key={i}
            className="h-full"
            style={{
              width: `${(c.credits / usedCredits) * 100}%`,
              backgroundColor: isPlanExpired ? "#d1d5db" : SEGMENT_COLORS[c.colorIdx],
              boxShadow: isPlanExpired ? "none" : `0 2px 44px ${SEGMENT_COLORS[c.colorIdx]}35`,
              borderRadius: i === 0 ? "999px 0 0 999px" : i === usageCategories.length - 1 ? "0 999px 999px 0" : "0",
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1  gap-4 gap-y-6">
        {usageCategories.map((c, i) => {
          const { Icon } = CATEGORY_CONFIG[i];
          const color = isPlanExpired ? "#d1d5db" : SEGMENT_COLORS[c.colorIdx];
          return (
            <div key={i} className="flex items-center border-b border-solid border-t-0 border-l-0 border-r-0 last:border-b-0 pb-4 pt-1 border-borderMuted items-start gap-3">
              <span
              className="w-1 h-4 rounded-sm flex-shrink-0 mt-1"
              style={{ backgroundColor: isPlanExpired ? "#d1d5db" : SEGMENT_COLORS[c.colorIdx] }}
            />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-sm text-textTheme font-medium">{c.label} <span className="text-xs text-cardSmText  tracking-wide"> {c.pct}%</span></p>
                <p className="text-xsm text-subTitleText mt-0.5">{c.credits.toLocaleString()} credits used</p>
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>

  {/* Right — Credit usage log */}
  <div className="flex-[1.5] bg-bgElevated shadow-md rounded-2xl border border-borderMuted py-7">
    <div className="flex items-center justify-between mb-1 pb-5 border-b border-solid px-7 border-borderMuted border-t-0 border-l-0 border-r-0">
      <div>
        <h2 className="text-lg font-normal text-textTheme">Credit Usage Log</h2>
        <p className="text-xsm text-subTitleText mt-0.5">Recent credit activity across models, automations, and resources</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 border border-borderMuted border-solid hover:border-[1.5px] hover:border-borderActive bg-transparent rounded-lg px-3 py-2 text-sm text-textTheme cursor-pointer transition-colors">
          <FiFilter className="text-lg" />
          Filter
        </button>
      </div>
    </div>
    <div className="mt-6">
      <div className="grid grid-cols-[1.5fr_1.5fr_1fr_60px] gap-4 pb-3 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
        {[ "Resource", "Date & Time",  "Performed By", "Credits"].map((h) => (
          <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">{h}</p>
        ))}
      </div>
      {usageLog.map((row, i) => (
        <div key={i} className="grid grid-cols-[1.5fr_1.5fr_1fr_60px] gap-4 py-4 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0 items-center transition-colors">
          
           <div>
            <p className="text-sm font-medium text-textTheme">{row.resource}</p>
            <p className="text-xs text-cardSmText">{row.sub}</p>
          </div>

          <p className="text-xsm font-normal tracking-wide text-textTheme">{row.time}</p>
         
        
          <p className="text-sm text-textTheme">{row.performedBy}</p>
          <p className={`text-sm font-medium tracking-wide ${row.credits > 0 ? "text-borderActive" : "text-errorBG"}`}>
            {row.credits > 0 ? `+${row.credits.toLocaleString()}` : row.credits.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  </div>

</div>
  </>
)}

      {activeTab === "billing" && (
  <div className="mt-4 space-y-5">

    {/* 2-col grid: Current Plan (left) + Billing & Card details (right) */}
    <div className="grid grid-cols-2 gap-4 items-stretch">

     {/* LEFT — Current Plan card */}
{/* LEFT — Current Plan card */}
<div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md overflow-hidden">
  <div className="px-5 py-4  flex items-center justify-between">
    <p className="text-md font-normal text-textTheme">Current Plan</p>
    <button className="text-sm font-medium flex gap-2 items-center text-textTheme border-solid bg-transparent border-[0.5px] shadow-sm border-borderMuted rounded-md px-3 py-2">
     <FiSettings className="text-sm"/>
      Renew Plan
    </button>
  </div>

  <div className="px-5  pb-2 ">
   <div className="">
     <p className="text-2xl font-normal text-textTheme flex items-center gap-2">Growth Pro <span className="text-errorBG text-xs font-medium"> Expired </span> </p>
    <p className="text-xsm text-textTheme mt-1 mb-5">$990 / year </p>
   </div>

    {[
      { icon: <TbShieldBolt className="text-md" />, label: "Included monthly credits", value: "600,000" },
      { icon: <LuCalendar className="text-md" />, label: "Next refill", value: true ? "—" : "Nov 01, 2026" },
      { icon: <GrRefresh className="text-md" />, label: "Billing cycle", value: "Annual" },
    ].map(({ icon, label, value }, i) => (
      <div key={i} className="flex items-center border-t-0  border-solid border-r-0 border-l-0 border-b last:border-b-0 border-borderMuted py-3 justify-between py-3 ">
        <div className="flex items-center  gap-2 text-subTitleText text-sm">
          {icon}
          {label}
        </div>
        <span className={`text-sm font-medium tracking-wide ${false && label === "Next refill" ? "text-cardSmText" : "text-textTheme"}`}>
          {value}
        </span>
      </div>
    ))}
  </div>
</div>

      {/* RIGHT — Billing details + Card details stacked */}
<div className="flex flex-col gap-4">

  {/* Billing details — display only */}
  <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md overflow-hidden">
    <div className="px-5 py-4 border-b border-borderMuted border-solid border-t-0 border-l-0 border-r-0 flex items-center justify-between">
      <p className="text-md text-textTheme">Billing Details</p>

      <button className="text-sm font-medium text-textTheme border-solid bg-transparent border-[0.5px] shadow-sm flex items-center gap-2 border-borderMuted rounded-md px-3 py-1.5">
       <LuSettings2 />
        Update
      </button>
    </div>

    <div className="px-10 py-4 flex items-start justify-between">
      
      {/* Left section */}
      <div>
        <p className="text-sm font-medium text-textTheme">
          {billingInfo.name || "Not set"}
        </p>

        <p className="text-xs text-cardSmText mt-1">
          {billingInfo.email || "No email provided"}
        </p>
      </div>

      {/* Right section */}
      <div className=" max-w-lg">
        <p className="text-xs text-cardSmText mb-0.5">Billing Address</p>

        <p className="text-sm font-medium text-textTheme">
          {billingInfo.address || "Not set"}
        </p>
      </div>

    </div>
  </div>


  {/* Card details — display only */}
  <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md overflow-hidden">
    <div className="px-5 py-4 border-b border-borderMuted border-solid border-t-0 border-l-0 border-r-0 flex items-center justify-between">
      <p className="text-md text-textTheme">Card Details</p>

      <button className="text-sm font-medium border-solid bg-transparent text-textTheme border-[0.5px] shadow-sm flex gap-2 items-center border-borderMuted rounded-md px-3 py-1.5">
       <LuSettings2 />
        Update
      </button>
    </div>

    <div className="px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="border-borderMuted border border-solid rounded-md px-2.5 py-1.5 flex-shrink-0">
          <span className="text-[#1a1f71] font-black text-sm tracking-tighter leading-none">
            VISA
          </span>
        </div>

        <div>
          <p className="text-lg font-medium text-textTheme tracking-widest">
            •••• •••• •••• <span className="text-sm">4242</span>
          </p>

          <p className="text-xs text-cardSmText mt-0.5">
            Expiry 08/28
          </p>
        </div>
      </div>
    </div>
  </div>

</div>

    </div>

    {/* Invoice table — unchanged */}
    <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md py-7">
      <div className="flex items-center justify-between px-7 pb-5 border-b border-borderMuted border-solid border-t-0 border-l-0 border-r-0">
        <div>
          <h2 className="text-lg font-normal text-textTheme">Invoice &amp; Billing History</h2>
          <p className="text-xsm text-subTitleText mt-0.5">View and download past invoices and credit purchases</p>
        </div>
        <div className="flex items-center gap-2">
          
          <button className="flex items-center gap-1.5 border border-borderMuted border-solid hover:border-[1.5px] hover:border-borderActive bg-transparent rounded-lg px-3 py-2 text-sm text-textTheme cursor-pointer transition-colors">
            <FiDownload className="text-lg" />
            Export CSV
          </button>
        </div>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-[1.2fr_2.5fr_1fr_1.2fr_1fr] gap-4 pb-3 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
          {["Date", "Description", "Amount", "Credits Added", "Invoice"].map((h) => (
            <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">{h}</p>
          ))}
        </div>
        {billingInvoices.map((row, i) => (
          <div key={i} className="grid grid-cols-[1.2fr_2.5fr_1fr_1.2fr_1fr] gap-4 py-4 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0 items-center transition-colors">
            <p className="text-sm text-textTheme">{row.date}</p>
            <p className="text-sm font-medium text-textTheme">{row.description}</p>
            <p className="text-sm text-textTheme">{row.amount}</p>
            <span className="inline-flex items-center px-3 rounded-full text-sm font-semibold text-borderActive w-fit">
              + {row.creditsAdded.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 text-sm text-textTheme">
              <FiDownload className="text-cardSmText text-sm" />
              {row.invoice}
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
)}

      </div>
      <CreditsBillingModal
        open={openCreditsModal}
        onClose={() => setOpenCreditsModal(false)}
      />
    </div>
  );
}