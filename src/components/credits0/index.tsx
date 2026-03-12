// "use client";

// import { useState } from "react";
// import { FiDownload, FiPlus, FiSearch, FiFilter, FiArrowRight, FiAward } from "react-icons/fi";
// import { FaCheckCircle } from "react-icons/fa";
// import { MdImage, MdVideoLibrary, MdMic, MdRefresh, MdBolt, MdOutlineWallet, MdOutlineFileUpload } from "react-icons/md";
// import { IoChatbubblesOutline } from "react-icons/io5";
// import { HiOutlineSparkles } from "react-icons/hi2";
// import { RiMoneyDollarCircleLine } from "react-icons/ri";
// import { TbChartDonut, TbListNumbers } from "react-icons/tb";
// import { BsLayers, BsUpload } from "react-icons/bs";
// import { LuBadge, LuCalendar, LuSettings2, LuTrendingUp, LuWallet } from "react-icons/lu";
// import { RxCheckCircled } from "react-icons/rx";
// import { BiSort } from "react-icons/bi";
// import { useSystemTheme } from "@/src/hooks/useSystemsTheme";
// import CreditsBillingModal from "./modal";

// const SEGMENT_COLORS = [
//   "#3A86FE",
//   "#8338EC",
//   "#FF006E",
//   "#FA5607",
//   "#FFBE0C",
// ];

// const CATEGORY_CONFIG = [
//   { Icon: MdImage, bg: "#EEF3FF", iconColor: "#3A86FE" },
//   { Icon: IoChatbubblesOutline, bg: "#FFF0F5", iconColor: "#FF006E" },
//   { Icon: MdVideoLibrary, bg: "#F3EEFF", iconColor: "#8338EC" },
//   { Icon: MdMic, bg: "#FFF4EE", iconColor: "#FA5607" },
//   { Icon: BsLayers, bg: "#FFFBEE", iconColor: "#FFBE0C" },
// ];

// const STAT_ICONS = [
//   { Icon: HiOutlineSparkles, bg: "#EEF3FF", iconColor: "#3A86FE" },
//   { Icon: RiMoneyDollarCircleLine, bg: "#EDFAF4", iconColor: "#40bc86" },
//   { Icon: TbChartDonut, bg: "#FFFBEE", iconColor: "#FFBE0C" },
// ];

// const usageCategories = [
//   { label: "Image generation",   pct: 38, credits: 5240, colorIdx: 0, perOp: 30,  opLabel: "per render"    },
//   { label: "AI chat completions",pct: 24, credits: 3220, colorIdx: 2, perOp: 12,  opLabel: "per response"  },
//   { label: "Video rendering",    pct: 16, credits: 2110, colorIdx: 1, perOp: 180, opLabel: "per minute"    },
//   { label: "Transcription",      pct: 10, credits: 1380, colorIdx: 3, perOp: 6,   opLabel: "per minute"    },
//   { label: "Other resources",    pct: 12, credits: 1650, colorIdx: 4, perOp: null, opLabel: "mixed rates"  },
// ];

// const resourceIcons: any = {
//   "Image generation": MdImage,
//   "AI chat completions": IoChatbubblesOutline,
//   "Video rendering": MdVideoLibrary,
//   Transcription: MdMic,
//   "Monthly credit refill": MdRefresh,
// };

// const usageLog = [
//   { time: "Oct 23, 2:42 PM",  date: "Nov 08, 2024", resource: "Image generation",    sub: "Campaign visual set", detail: "8 renders · SDXL Fast",     project: "Project: Winter launch",  performedBy: "Sarah Chen",  credits: -480 },
//   { time: "Oct 23, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot",     detail: "214 responses · GPT-4.1",   project: "Workspace automation",    performedBy: "Alex Rivera", credits: -260 },
//   { time: "Oct 23, 2:42 PM",  date: "Nov 08, 2024", resource: "Image generation",    sub: "Campaign visual set", detail: "8 renders · SDXL Fast",     project: "Project: Winter launch",  performedBy: "Sarah Chen",  credits: -480 },
//   { time: "Oct 23, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot",     detail: "214 responses · GPT-4.1",   project: "Workspace automation",    performedBy: "Alex Rivera", credits: -260 },
//   { time: "Oct 23, 2:42 PM",  date: "Nov 08, 2024", resource: "Image generation",    sub: "Campaign visual set", detail: "8 renders · SDXL Fast",     project: "Project: Winter launch",  performedBy: "Sarah Chen",  credits: -480 },
//   { time: "Oct 23, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot",     detail: "214 responses · GPT-4.1",   project: "Workspace automation",    performedBy: "Alex Rivera", credits: -260 },
// ];

// const usageLog2 = [
//   { time: "Today, 2:42 PM",  date: "Nov 08, 2024", resource: "Image generation",    sub: "Campaign visual set", detail: "randomefile.pdf",           project: "Project: Winter launch",  performedBy: "Sarah Chen",  credits: 1000  },
//   { time: "Today, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot",     detail: "214 responses · GPT-4.1",   project: "Workspace automation",    performedBy: "Alex Rivera", credits: 10000 },
//   { time: "Today, 2:42 PM",  date: "Nov 08, 2024", resource: "Image generation",    sub: "Campaign visual set", detail: "8 renders · SDXL Fast",     project: "Project: Winter launch",  performedBy: "Sarah Chen",  credits: 480   },
//   { time: "Today, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot",     detail: "214 responses · GPT-4.1",   project: "Workspace automation",    performedBy: "Alex Rivera", credits: 160   },
//   { time: "Today, 2:42 PM",  date: "Nov 08, 2024", resource: "Image generation",    sub: "Campaign visual set", detail: "8 renders · SDXL Fast",     project: "Project: Winter launch",  performedBy: "Sarah Chen",  credits: 480   },
//   { time: "Today, 12:18 PM", date: "Nov 08, 2024", resource: "AI chat completions", sub: "Support copilot",     detail: "214 responses · GPT-4.1",   project: "Workspace automation",    performedBy: "Alex Rivera", credits: 260   },
// ];

// function StatusBadge({ status }: any) {
//   const isAdded = status === "Added";
//   return (
//     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${isAdded ? "bg-[#d4ead9] text-[#1a3a2a]" : "bg-[#1a3a2a] text-[#d4ead9]"}`}>
//       {status}
//     </span>
//   );
// }

// function ResourceIcon({ name }: any) {
//   const Icon = resourceIcons[name] || MdBolt;
//   return (
//     <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-bgSkeleton text-[#40bc86] flex-shrink-0">
//       <Icon size={15} />
//     </span>
//   );
// }

// export default function CreditsPage() {
//   const [page, setPage] = useState(1);
//   const { theme } = useSystemTheme()
//   const [openCreditsModal, setOpenCreditsModal] = useState(false);
//   const [activeTab, setActiveTab] = useState<"credits" | "billing">("credits");

//   const billingInvoices: any[] = [];

//   const totalCredits = 50000;
//   const usedCredits = 0;
//   const availableCredits = totalCredits - usedCredits;
//   const pctRemaining = Math.round((availableCredits / totalCredits) * 100);

//   const displayCategories = usageCategories.map(c => ({ ...c, pct: 0, credits: 0 }));

//   return (
//     <div className="h-full max-w-[900px] lg:max-w-[1100px] xl:max-w-[1230px] 2xl:max-w-[1400px] 3xl:max-w-[1500px] 4xl:max-w-[1800px] m-0 mx-auto overflow-hidden bg-mainBG flex flex-col px-4 px-10 xl:px-20 py-10">
//       <div className="px-8 py-8 mx-auto overflow-y-auto">
//         <div className="flex items-start justify-between">
//           <div>
//             <h1
//               onClick={() => setOpenCreditsModal(true)}
//               className="text-5xl flex-1 flex items-center m-0 font-extralight text-textTheme">
//               Credits &amp; Billings
//             </h1>
//             <p className="text-sm whitespace-nowrap text-textTheme mt-1">
//               Track available credits, where they are being spent, and how usage is trending across your resources.
//             </p>
//             <div className="invisible">
//               <span className="hidden lg:inline">
//                 Page layouts look better with something in each section. g in each section. Web page designers, content writers, and layout artists use lorem ipsum, Web page designers, content writers, and layout artists use lorem ipsum, also known as placeholder copy, to distinguish which areas on a page will hold advertisements.
//               </span>
//               <span className="lg:hidden">Page layouts look better with something in each section.</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 mb-5">
//           <button
//             onClick={() => setActiveTab("credits")}
//             className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border-[1.6px] 3xl:border-[1.8px] 4xl:border-[2px] transition-all cursor-pointer ${
//               activeTab === "credits"
//                 ? "border-borderActive border-solid text-textTheme bg-transparent"
//                 : "border-sectionBG border-solid text-cardSmText bg-transparent"
//             }`}
//           >
//             Credits
//           </button>
//           <button
//             onClick={() => setActiveTab("billing")}
//             className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border-[1.6px] 3xl:border-[1.8px] 4xl:border-[2px] transition-all cursor-pointer ${
//               activeTab === "billing"
//                 ? "border-borderActive border-solid text-textTheme bg-transparent"
//                 : "border-sectionBG border-solid text-cardSmText bg-transparent"
//             }`}
//           >
//             Billing
//           </button>
//         </div>

//         {activeTab === "credits" && (
//           <>
//             <div className="mt-1 gap-5">
//               <div className="bg-bgElevated rounded-2xl border border-borderMuted p-6 space-y-5 shadow-md">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-bgSkeleton">
//                       <LuWallet className="text-textTheme text-xl" />
//                     </span>
//                     <div>
//                       <p className="text-md font-semibold text-textTheme leading-wide">Available credits</p>
//                       <p className="text-xs text-cardSmText mt-1">Monthly pool for your active workspace</p>
//                     </div>
//                   </div>
//                   <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#40bc86] text-black text-xsm font-medium cursor-pointer border-none shadow-md transition-colors">
//                     <FiPlus size={15} />
//                     Top up credits
//                     <FiArrowRight size={14} />
//                   </button>
//                 </div>
//                 <div className="py-2">
//                   <span className="text-5xl font-semibold text-textTheme font-sans">
//                     {availableCredits.toLocaleString()}
//                   </span>
//                   <span className="text-subTitleText ml-2 text-sm">
//                     / {totalCredits.toLocaleString()} total credits
//                   </span>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <div className="flex items-center justify-between mb-2">
//                     <p className="text-xsm font-semibold text-textTheme">Usage breakdown</p>
//                     <p className="text-xs tracking-wide text-cardSmText">{usedCredits.toLocaleString()} credits spent this cycle</p>
//                   </div>
//                   <div className="h-2 w-full flex gap-[3px]">
//                     <div
//                       className="h-full bg-borderMuted"
//                       style={{ width: "100%", borderRadius: "999px" }}
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-x-8 pt-2 gap-y-6">
//                   {displayCategories.map((c, i) => (
//                     <div key={i} className="flex items-start gap-3">
//                       <span
//                         className="w-2 h-2 rounded-full flex-shrink-0 mt-[5px]"
//                         style={{ backgroundColor: SEGMENT_COLORS[c.colorIdx] }}
//                       />
//                       <div>
//                         <p className="text-sm text-textTheme font-medium leading-tight">
//                           {c.label}
//                           <span className="font-normal pl-1 text-xs tracking-wide text-subTitleText">{c.pct}%</span>
//                         </p>
//                         <p className="text-xs text-cardSmText tracking-wide mt-0.5">
//                           {c.credits.toLocaleString()} credits used
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   <div className="flex items-start gap-3">
//                     <span className="w-2 h-2 rounded-full flex-shrink-0 bg-bgSkeleton mt-[5px]" />
//                     <div>
//                       <p className="text-sm text-textTheme font-medium leading-tight">
//                         Remaining
//                         <span className="font-normal pl-1 text-xs tracking-wide text-subTitleText">{pctRemaining}%</span>
//                       </p>
//                       <p className="text-xs text-cardSmText tracking-wide mt-0.5">
//                         {availableCredits.toLocaleString()} credits left
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-4 pt-2">
//                   {[
//                     { label: "Highest spending", value: "None yet", sub: "0 credits", statIdx: 0 },
//                     { label: "Credits added", value: "+50,000", sub: "Welcome bonus", statIdx: 1 },
//                     { label: "Projected left", value: "50,000", sub: "By cycle end", statIdx: 2 },
//                   ].map((tile, i) => {
//                     const { Icon, iconColor } = STAT_ICONS[tile.statIdx];
//                     return (
//                       <div
//                         key={i}
//                         className={`${theme == "dark" ? "bg-bgSkeleton" : "bg-[#f4f1ea]/20"} border-[0.5px] border-borderMuted border-solid shadow-sm rounded-2xl p-4 space-y-3`}
//                       >
//                         <div className="flex items-center gap-2">
//                           <span className="rounded-xl flex items-center justify-center flex-shrink-0">
//                             <Icon className="text-md" style={{ color: iconColor }} />
//                           </span>
//                           <p className="text-xs text-cardSmText font-medium">{tile.label}</p>
//                         </div>
//                         <div>
//                           <p className="text-xl font-semibold text-textTheme leading-tight">{tile.value}</p>
//                           <p className="text-xs text-cardSmText tracking-wide mt-1">{tile.sub}</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4">
//               <div className="bg-bgElevated shadow-md rounded-2xl border mt-6 border-borderMuted py-7">
//                 <div className="flex items-center justify-between mb-1 pb-5 border-b border-solid px-7 border-borderMuted border-t-0 border-l-0 border-r-0">
//                   <div>
//                     <h2 className="text-lg font-medium text-textTheme">Credit usage log</h2>
//                     <p className="text-xsm text-subTitleText mt-0.5">Recent credit activity across models, automations, and resources</p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center focus-within:border-borderActive 3xl:focus-within:border-2 focus-within:border-[1.5px] gap-2 border border-borderMuted border-solid rounded-lg px-3 py-2">
//                       <FiSearch className="text-cardSmText text-lg" />
//                       <input placeholder="Search resources or jobs" className="bg-transparent text-sm text-textTheme placeholder-cardSmText border-none outline-none w-64" />
//                     </div>
//                     <button className="flex items-center gap-1.5 border border-borderMuted 3xl:hover:border-2 hover:border-[1.5px] hover:border-borderActive bg-transparent border-solid rounded-lg px-3 py-2 text-sm text-textTheme cursor-pointer transition-colors">
//                       <BiSort className="text-lg" />
//                       Sort
//                     </button>
//                     <button className="flex items-center gap-1.5 border border-borderMuted border-solid 3xl:hover:border-2 hover:border-[1.5px] hover:border-borderActive bg-transparent rounded-lg px-3 py-2 text-sm text-textTheme cursor-pointer transition-colors">
//                       <FiFilter className="text-lg" />
//                       Filter
//                     </button>
//                   </div>
//                 </div>
//                 <div className="mt-8">
//                   <div className="grid grid-cols-[2fr_2fr_2fr_1fr_1fr] gap-4 pb-3 px-10 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
//                     {["Date & Time", "Resource", "Usage detail", "Performed By", "Credits"].map((h) => (
//                       <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">{h}</p>
//                     ))}
//                   </div>
//                   <div className="flex flex-col items-center justify-center py-16 gap-3">
//                     <div className="w-12 h-12 rounded-full bg-bgSkeleton flex items-center justify-center">
//                       <HiOutlineSparkles className="text-cardSmText text-xl" />
//                     </div>
//                     <p className="text-sm font-medium text-textTheme">No credit usage yet</p>
//                     <p className="text-xs text-cardSmText text-center max-w-xs">Your recent activity and resource consumption will appear here.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {activeTab === "billing" && (
//           <div className="mt-4 space-y-5">

//              <div className="bg-bgElevated rounded-2xl border border-borderMuted p-6 shadow-md">

//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-bgSkeleton">
//                     <FiAward className="text-textTheme text-xl" />
//                   </span>
//                   <div>
//                     <p className="text-md font-semibold text-textTheme leading-wide">Current plan</p>
//                     <p className="text-xs text-cardSmText mt-1">Credits are attached to this plan</p>
//                   </div>
//                 </div>
//                 <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-[1.4px] 4xl:border-[2px] shadow-sm border-solid border-borderMuted bg-transparent text-textTheme text-sm font-medium cursor-pointer transition-colors hover:border-borderActive">
//                   <LuSettings2 size={14} />
//                   Manage Plan
//                 </button>
//               </div>

//               <div className="py-7">
//                 <div className="flex items-baseline gap-3 mb-1">
//                   <span className="text-2xl font-medium text-textTheme ">Growth Pro</span>
//                   {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#d4ead9] text-[#1a5c35]">
//                     Active
//                   </span> */}
//                 </div>
//                 <div className="flex items-center gap-1.5 mt-1">
//                   <LuCalendar className="text-cardSmText text-sm" />
//                   <p className="text-xsm text-cardSmText">Next billing date: Oct 24, 2026</p>
//                 </div>
//               </div>

//               <div className="border-t border-solid border-b-0 border-r-0 border-l-0 border-borderMuted pt-5">
//                 <p className="text-xsm font-medium text-textTheme mb-3">Monthly credit usage</p>
//                 <div className="flex items-baseline gap-1 mb-1">
//                   <span className="text-3xl font-medium text-textTheme ">{usedCredits.toLocaleString()}</span>
//                   <span className="text-subTitleText ml-2 text-xsm">/ {totalCredits.toLocaleString()} credits used</span>
//                 </div>
//                 <div className="flex justify-end mb-2">
//                   <span className="text-xs text-cardSmText">{Math.round((usedCredits / totalCredits) * 100)}% used</span>
//                 </div>
//                 <div className="h-2 w-full rounded-full bg-borderMuted overflow-hidden">
//                   <div
//                     className="h-full rounded-full bg-borderActive"
//                     style={{ width: `${(usedCredits / totalCredits) * 100}%` }}
//                   />
//                 </div>
//               </div>

//               <div className="border-t border-solid border-b-0 border-r-0 border-l-0 border-borderMuted mt-6 pt-7 pb-3 flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-1.5">
//                     <HiOutlineSparkles className="text-textTheme text-md" />
//                     <p className="text-sm font-medium text-textTheme">Credits reset in 12 days</p>
//                   </div>
//                   <p className="text-xs text-cardSmText mt-1">If credits run out before the reset, you can purchase additional credits.</p>
//                 </div>
//                 <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#40bc86] shadow-sm text-black text-sm font-medium cursor-pointer border-none transition-colors">
//                   <FiPlus size={14} />
//                   Top up credits
//                 </button>
//               </div>
//             </div>

//             <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md py-7">
//               <div className="flex items-center justify-between px-7 pb-5 border-b border-borderMuted border-solid border-t-0 border-l-0 border-r-0">
//                 <div>
//                   <h2 className="text-lg font-medium text-textTheme">Invoice &amp; Billing History</h2>
//                   <p className="text-xsm text-subTitleText mt-0.5">View and download past invoices and credit purchases</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center focus-within:border-borderActive focus-within:border-[1.5px] gap-2 border border-borderMuted border-solid rounded-lg px-3 py-2">
//                     <FiSearch className="text-textTheme text-lg" />
//                     <input placeholder="Search invoices" className="bg-transparent text-sm text-textTheme placeholder-cardSmText border-none outline-none w-44" />
//                   </div>
//                   <button className="flex items-center gap-1.5 border border-borderMuted border-solid hover:border-[1.5px] hover:border-borderActive bg-transparent rounded-lg px-3 py-2 text-sm text-textTheme cursor-pointer transition-colors">
//                     <FiDownload className="text-lg" />
//                     Export CSV
//                   </button>
//                 </div>
//               </div>
//               <div className="mt-6">
//                 <div className="grid grid-cols-[1.2fr_2.5fr_1fr_1.2fr_1.5fr_1fr] gap-4 pb-3 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
//                   {["Date", "Description", "Amount", "Credits Added", "Payment Method", "Invoice"].map((h) => (
//                     <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">{h}</p>
//                   ))}
//                 </div>
//                 <div className="flex flex-col items-center justify-center py-16 gap-3">
//                   <div className="w-12 h-12 rounded-full bg-bgSkeleton flex items-center justify-center">
//                     <FiDownload className="text-cardSmText text-xl" />
//                   </div>
//                   <p className="text-sm font-medium text-textTheme">No invoices yet</p>
//                   <p className="text-xs text-cardSmText text-center max-w-xs">Your billing history and past invoices will appear here.</p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         )}

//       </div>
//       <CreditsBillingModal
//         open={openCreditsModal}
//         onClose={() => setOpenCreditsModal(false)}
//       />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { FiDownload, FiFilter, FiAward, FiSettings } from "react-icons/fi";
import { MdImage, MdVideoLibrary, MdMic, MdRefresh, MdBolt } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TbChartDonut, TbShieldBolt } from "react-icons/tb";
import { BsLayers } from "react-icons/bs";
import { LuCalendar, LuSettings2, LuWallet } from "react-icons/lu";
import { useSystemTheme } from "@/src/hooks/useSystemsTheme";
import CreditsBillingModal from "./modal";
import { GrRefresh } from "react-icons/gr";
import { MdOutlineCreditCard } from "react-icons/md";
import { TbFileInvoice } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";

const resourceIcons: any = {
  "Image generation": MdImage,
  "AI chat completions": IoChatbubblesOutline,
  "Video rendering": MdVideoLibrary,
  Transcription: MdMic,
  "Monthly credit refill": MdRefresh,
};

export default function CreditsPage() {
  const { theme } = useSystemTheme();
  const [openCreditsModal, setOpenCreditsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"credits" | "billing">("credits");
  const isPlanExpired = false;

  // Zero state — newly onboarded user
  const totalCredits = 50000;
  const usedCredits = 0;
  const availableCredits = totalCredits;
  const usageLog: any[] = [];
  const billingInvoices: any[] = [];

  const billingInfo = {
    name: "",
    email: "",
    address: "",
  };
  const hasCard = false;

  return (
    <div className="h-full max-w-[1100px] lg:max-w-[1300px] xl:max-w-[1430px] 2xl:max-w-[1600px] 3xl:max-w-[1800px] 4xl:max-w-[2300px] m-0 mx-auto overflow-hidden bg-mainBG flex flex-col px-4 px-10 xl:px-20 py-10">
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

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setActiveTab("credits")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border-[1.6px] transition-all cursor-pointer ${activeTab === "credits" ? "border-borderActive border-solid text-textTheme bg-transparent" : "border-sectionBG border-solid text-cardSmText bg-transparent"}`}
          >
            Credits
          </button>
          <button
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border-[1.6px] transition-all cursor-pointer ${activeTab === "billing" ? "border-borderActive border-solid text-textTheme bg-transparent" : "border-sectionBG border-solid text-cardSmText bg-transparent"}`}
          >
            Billing
          </button>
        </div>

        {/* ── CREDITS TAB ── */}
        {activeTab === "credits" && (
          <>
            {/* Stat tiles */}
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
                  value: "0",
                  sub: "0% consumed",
                },
                {
                  icon: <LuCalendar className="text-cardSmText text-lg" />,
                  label: "Next Refill",
                  value: "30 days",
                  sub: "Dec 1, 2024",
                },
                {
                  icon: <FiAward className="text-cardSmText text-lg" />,
                  label: "Average daily usage",
                  value: "—",
                  sub: "No usage yet",
                  action: () => setActiveTab("billing"),
                },
              ].map((tile, i) => (
                <div
                  key={i}
                  onClick={tile.action}
                  className={`bg-bgElevated rounded-2xl border border-borderMuted p-4 shadow-md flex flex-col gap-2 ${tile.action ? "cursor-pointer hover:border-borderActive transition-colors" : ""}`}
                >
                  <div className="flex gap-3 items-center justify-between">
                    <p className="text-xsm font-normal text-textTheme">{tile.label}</p>
                    <div className="flex items-center text-cardSmText justify-center flex-shrink-0">
                      {tile.icon}
                    </div>
                  </div>
                  <div>
                    <p className={`font-light text-textTheme ${i === 3 ? "text-2xl text-cardSmText" : "text-3xl"}`}>{tile.value}</p>
                    <p className="text-xs text-cardSmText mt-1">{tile.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-4 items-stretch">

              {/* Left — Usage by feature — ZERO STATE */}
              <div className="flex-[1] bg-bgElevated rounded-2xl border border-borderMuted py-6 shadow-md">
                <div className="flex items-center justify-between px-6 mb-1 border-b border-solid border-borderMuted border-t-0 border-l-0 border-r-0 pb-5">
                  <div>
                    <h2 className="text-lg font-normal text-textTheme">Usage by feature</h2>
                    <p className="text-xsm text-subTitleText mt-0.5">Recent credit activity across models, automations, and resources</p>
                  </div>
                </div>

                <div className="mt-6 px-6">
                  {/* <div className="flex flex-col mt-1 mb-3">
                    <span className="text-xsm font-medium text-subTitleText mb-1">Credits consumed this cycle</span>
                    <p className="text-4xl font-light text-textTheme">0 <span className="text-sm text-cardSmText">/ 50,000</span></p>
                  </div> */}

                  {/* <p className="text-xsm font-medium mb-2 mt-4 text-textTheme">Usage breakdown</p> */}

                  {/* Empty bar */}
                  {/* <div className="h-2.5 w-full rounded-full bg-bgSkeleton mb-8" /> */}

                  {/* Empty state illustration */}
                  <div className="flex flex-col mt-8 items-center justify-center py-10 text-center">
                    <div className="w-10 h-10 rounded-xl bg-bgSkeleton flex items-center justify-center mb-4">
                      <TbChartDonut size={18} className="text-cardSmText" />
                    </div>
                    <p className="text-sm font-medium text-textTheme mb-1">No usage yet</p>
                    <p className="text-xs text-cardSmText leading-relaxed max-w-xs">
                      Start using services to see your credit breakdown here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — Credit usage log — ZERO STATE */}
              <div className="flex-[1.5] bg-bgElevated shadow-md rounded-2xl border border-borderMuted py-7">
                <div className="flex items-center justify-between mb-1 pb-5 border-b border-solid px-7 border-borderMuted border-t-0 border-l-0 border-r-0">
                  <div>
                    <h2 className="text-lg font-normal text-textTheme">Credit Usage Log</h2>
                    <p className="text-xsm text-subTitleText mt-0.5">Recent credit activity across models, automations, and resources</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 border border-borderMuted border-solid bg-transparent rounded-lg px-3 py-2 text-sm text-cardSmText cursor-not-allowed opacity-50">
                      <FiFilter className="text-lg" />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[1.5fr_1.5fr_1fr_60px] gap-4 pb-3 mt-6 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
                  {["Resource", "Date & Time", "Performed By", "Credits"].map((h) => (
                    <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">{h}</p>
                  ))}
                </div>

                {/* Empty state */}
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-10 h-10 rounded-xl bg-bgSkeleton flex items-center justify-center mb-4">
                    <HiOutlineSparkles size={20} className="text-cardSmText" />
                  </div>
                  <p className="text-sm font-medium text-textTheme mb-1">No transactions yet</p>
                  <p className="text-xs text-cardSmText leading-relaxed max-w-xs">
                    Your credit activity will appear here once you start using AI features.
                  </p>
                </div>
              </div>

            </div>
          </>
        )}

        {/* ── BILLING TAB ── */}
        {activeTab === "billing" && (
          <div className="mt-4 space-y-5">
            <div className="grid grid-cols-2 gap-4 items-stretch">

              {/* LEFT — Current Plan */}
              <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between">
                  <p className="text-md font-normal text-textTheme">Current Plan</p>
                  <button className="text-sm font-medium flex gap-2 items-center text-textTheme border-solid bg-transparent border-[0.5px] shadow-sm border-borderMuted rounded-md px-3 py-2">
                    <FiSettings className="text-sm" />
                    Manage Plan
                  </button>
                </div>
                <div className="px-5 pb-4">
                  <p className="text-2xl font-normal text-textTheme">Free Tier</p>
                  <p className="text-xsm text-textTheme mt-1 mb-5">$0 / month</p>
                  {[
                    { icon: <TbShieldBolt className="text-md" />, label: "Included monthly credits", value: "50,000" },
                    { icon: <LuCalendar className="text-md" />, label: "Next refill", value: "Dec 01, 2024" },
                    { icon: <GrRefresh className="text-md" />, label: "Billing cycle", value: "Monthly" },
                  ].map(({ icon, label, value }, i) => (
                    <div key={i} className="flex items-center border-t-0 border-solid border-r-0 border-l-0 border-b last:border-b-0 border-borderMuted py-3 justify-between">
                      <div className="flex items-center gap-2 text-subTitleText text-sm">
                        {icon}
                        {label}
                      </div>
                      <span className="text-sm font-medium tracking-wide text-textTheme">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — Billing + Card */}
              <div className="flex flex-col gap-4">

                {/* Billing Details — ZERO STATE */}
                <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md overflow-hidden">
                  <div className="px-5 py-4 border-b border-borderMuted border-solid border-t-0 border-l-0 border-r-0 flex items-center justify-between">
                    <p className="text-md text-textTheme">Billing Details</p>
                    <button className="text-sm font-medium text-textTheme border-solid bg-transparent border-[0.5px] shadow-sm flex items-center gap-2 border-borderMuted rounded-md px-3 py-1.5">
                      <LuSettings2 />
                      Update
                    </button>
                  </div>
                  <div className="flex gap-2  items-center justify-center py-6 text-center px-6">
                    <div className="w-6 h-6 px-1 rounded-2xl bg-bgSkeleton flex items-center justify-center ">
                      <HiOutlineLocationMarker size={18} className="text-cardSmText" />
                    </div>
                    <p className="text-sm font-normal text-textTheme mb-1">No billing address added yet.</p>
                   
                  </div>
                </div>

                {/* Card Details — ZERO STATE */}
                <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md overflow-hidden">
                  <div className="px-5 py-4 border-b border-borderMuted border-solid border-t-0 border-l-0 border-r-0 flex items-center justify-between">
                    <p className="text-md text-textTheme">Card Details</p>
                    <button className="text-sm font-medium border-solid bg-transparent text-textTheme border-[0.5px] shadow-sm flex gap-2 items-center border-borderMuted rounded-md px-3 py-1.5">
                      <LuSettings2 />
                      Link Card
                    </button>
                  </div>
                  <div className="flex gap-2 items-center justify-center py-6 text-center px-6">
                    <div className="w-6 h-6 px-1 rounded-2xl bg-bgSkeleton flex items-center justify-center">
                      <MdOutlineCreditCard size={18} className="text-cardSmText" />
                    </div>
                    <p className="text-sm  text-textTheme mb-1">No payment method added.</p>
                   
                  </div>
                </div>

              </div>
            </div>

            {/* Invoice History — ZERO STATE */}
            <div className="bg-bgElevated rounded-2xl border border-borderMuted shadow-md py-7">
              <div className="flex items-center justify-between px-7 pb-5 border-b border-borderMuted border-solid border-t-0 border-l-0 border-r-0">
                <div>
                  <h2 className="text-lg font-normal text-textTheme">Invoice &amp; Billing History</h2>
                  <p className="text-xsm text-subTitleText mt-0.5">View and download past invoices and credit purchases</p>
                </div>
                <button className="flex items-center gap-1.5 border border-borderMuted border-solid bg-transparent rounded-lg px-3 py-2 text-sm text-cardSmText cursor-not-allowed opacity-50">
                  <FiDownload className="text-lg" />
                  Export CSV
                </button>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[1.2fr_2.5fr_1fr_1.2fr_1fr] gap-4 pb-3 mt-6 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
                {["Date", "Description", "Amount", "Credits Added", "Invoice"].map((h) => (
                  <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">{h}</p>
                ))}
              </div>

              {/* Empty state */}
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-10 h-10 rounded-xl bg-bgSkeleton flex items-center justify-center mb-4">
                  <TbFileInvoice size={18} className="text-cardSmText" />
                </div>
                <p className="text-sm font-medium text-textTheme mb-1">No invoices yet</p>
                <p className="text-xs text-cardSmText leading-relaxed max-w-xs">
                  Your transaction history will appear here once you make your upgrade.
                </p>
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