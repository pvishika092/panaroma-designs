"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiDownload,
  FiPlus,
  FiSearch,
  FiX,
  FiChevronRight,
  FiCheck,
  FiAlertTriangle,
  FiPaperclip,
  FiUserPlus,
  FiArrowUp,
} from "react-icons/fi";
import { MdOutlineFileUpload, MdVideoLibrary } from "react-icons/md";

/* -------------------------------------------------------------------------
   Types
------------------------------------------------------------------------- */
type TicketStatusKey =
  | "OPEN"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REFUNDED"
  | "REJECTED"
  | "CLOSED";

interface Org {
  id: string;
  name: string;
  contact: string;
  email: string;
  orders: Order[];
}

interface Order {
  id: string;
  desc: string;
  date: string;
  amount: number;
  creditsAdded: number;
  gateway: string;
}

interface Evidence {
  name: string;
  type: "image" | "video";
  url: string | null;
}

type ActivityType =
  | "created"
  | "delegated"
  | "escalated"
  | "approved"
  | "rejected"
  | "note";

interface TicketNote {
  type: ActivityType;
  actor: string;
  target?: string;
  detail?: string;
  at: string;
}

interface Ticket {
  id: string;
  orgId: string;
  orderId: string;
  customer: string;
  email: string;
  invoice: string;
  orderDesc: string;
  gateway: string;
  amount: number;
  reason: string;
  status: TicketStatusKey;
  created: string;
  assignedTo: string | null;
  escalated: boolean;
  escalatedTo: string | null;
  description: string;
  evidence: Evidence[];
  rejectReason?: string;
  parentTicketId: string | null;
  notes: TicketNote[];
}

interface IncomingRequest {
  id: string;
  orgId: string | null;
  orderId: string | null;
  name: string;
  email: string;
  reason: string;
  description: string;
  amount: number;
  evidence: Evidence[];
  submittedAt: string;
  status: "pending" | "converted";
  ticketId: string | null;
}

type PanelState =
  | { type: "form"; orderId: string }
  | { type: "customerTicket"; ticketId: string }
  | { type: "customerRequest"; requestId: string }
  | { type: "adminTicket"; ticketId: string }
  | { type: "createTicket"; requestId: string | null }
  | null;

/* -------------------------------------------------------------------------
   Constants
------------------------------------------------------------------------- */
const CURRENT_CUSTOMER = { name: "Priya Nair", email: "priya@northwind.io" };
const CURRENT_ORG_ID = "org-northwind";
const CURRENT_ADMIN = "Jordan Blake"; // signed-in support admin performing actions in this demo
const AGENTS = ["Alex Rivera", "Jordan Kim", "Sam Patel", "Priya Shah"];
const ESCALATION_TEAM = [
  { name: "Priya Shah", role: "Tier 2 Lead" },
  { name: "Morgan Reyes", role: "Trust & Safety" },
  { name: "Jordan Kim", role: "Payments Specialist" },
];
const REASONS = [
  "Wrong purchase",
  "Duplicate payment",
  "Didn't use product",
  "Technical issue",
  "Other",
];

const STATUS_META: Record<
  TicketStatusKey,
  { label: string; pillClass: string }
> 
= {
  OPEN: { label: "Open", pillClass: "bg-amber-50 text-amber-700 border-amber-200" },
  UNDER_REVIEW: {
    label: "Under Review",
    pillClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    pillClass: "bg-bgAction text-borderActive border-borderActive/30",
  },
  REFUNDED: {
    label: "Refunded",
    pillClass: "bg-bgAction text-borderActive border-borderActive/30",
  },
  REJECTED: {
    label: "Rejected",
    pillClass: "bg-redButton text-errorBG border-errorBG/30",
  },
  CLOSED: {
    label: "Closed",
    pillClass: "bg-bgSubtle text-cardSmText border-borderMuted",
  },
};

type OrderStatusKey = "PAID" | "REQUESTED" | "REFUNDED" | "REJECTED" | "PENDING_REQUEST";

const ORDER_STATUS_META: Record<
  OrderStatusKey,
  { label: string; pillClass: string }
> = {
  PAID: { label: "Paid", pillClass: "bg-bgSubtle text-cardSmText border-borderMuted" },
  REQUESTED: {
    label: "Refund Requested",
    pillClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  PENDING_REQUEST: {
    label: "Request Sent",
    pillClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  REFUNDED: {
    label: "Refunded",
    pillClass: "bg-bgAction text-borderActive border-borderActive/30",
  },
  REJECTED: {
    label: "Refund Rejected",
    pillClass: "bg-redButton text-errorBG border-errorBG/30",
  },
};

// Status pill is always singular — it reflects whichever single state is
// most relevant right now (an active ticket beats a pending request, which
// beats the resolved state of the last ticket). Never stacks multiple pills.
function orderStatusFor(ticket: Ticket | null, hasPendingRequest: boolean) {
  if (ticket && (ticket.status === "OPEN" || ticket.status === "UNDER_REVIEW")) {
    return ORDER_STATUS_META.REQUESTED;
  }
  if (hasPendingRequest) return ORDER_STATUS_META.PENDING_REQUEST;
  if (ticket && (ticket.status === "REFUNDED" || ticket.status === "APPROVED"))
    return ORDER_STATUS_META.REFUNDED;
  if (ticket && ticket.status === "REJECTED") return ORDER_STATUS_META.REJECTED;
  return ORDER_STATUS_META.PAID;
}

const STAGE_LABELS = ["Submitted", "Assigned", "Under Review", "Approved", "Closed"];
const STAGE_INDEX: Record<TicketStatusKey, number> = {
  OPEN: 0,
  UNDER_REVIEW: 2,
  APPROVED: 3,
  REFUNDED: 4,
  REJECTED: 3,
  CLOSED: 4,
};

// Customer-portal-facing orders — UNCHANGED, belongs to CURRENT_CUSTOMER only.
const INITIAL_ORDERS: Order[] = [
  { id: "INV-1046", desc: "Growth Pro Annual Renewal", date: "Oct 24, 2025", amount: 990.0, creditsAdded: 600000, gateway: "Stripe" },
  { id: "INV-1011", desc: "Credit Top Up — 50k Pack", date: "Aug 12, 2025", amount: 100.0, creditsAdded: 50000, gateway: "Stripe" },
  { id: "INV-1004", desc: "Growth Pro Annual Subscription", date: "Oct 24, 2024", amount: 990.0, creditsAdded: 600000, gateway: "Razorpay" },
  { id: "INV-1039", desc: "Add-on: Extra Seats (5)", date: "Jun 02, 2026", amount: 45.0, creditsAdded: 0, gateway: "Razorpay" },
  { id: "INV-0980", desc: "Pro Plan — Monthly", date: "Apr 3, 2026", amount: 12.0, creditsAdded: 5000, gateway: "Stripe" },
];

// Org directory — used ONLY by the admin "Raise a ticket" search. Customer
// portal never reads from this; it keeps using INITIAL_ORDERS as before.
const ORGS: Org[] = [
  {
    id: "org-northwind",
    name: "Northwind Labs",
    contact: "Priya Nair",
    email: "priya@northwind.io",
    orders: [
      { id: "INV-1046", desc: "Growth Pro Annual Renewal", date: "Oct 24, 2025", amount: 990.0, creditsAdded: 600000, gateway: "Stripe" },
      { id: "INV-1004", desc: "Growth Pro Annual Subscription", date: "Oct 24, 2024", amount: 990.0, creditsAdded: 600000, gateway: "Razorpay" },
      { id: "INV-0980", desc: "Pro Plan — Monthly", date: "Apr 3, 2026", amount: 12.0, creditsAdded: 5000, gateway: "Stripe" },
    ],
  },
  {
    id: "org-acme",
    name: "Acme Corp",
    contact: "Daniel Osei",
    email: "daniel@acme.com",
    orders: [
      { id: "INV-1039", desc: "Add-on: Extra Seats (5)", date: "Jun 02, 2026", amount: 45.0, creditsAdded: 0, gateway: "Razorpay" },
      { id: "INV-2050", desc: "Pro Plan — Annual", date: "May 30, 2026", amount: 99.0, creditsAdded: 60000, gateway: "Stripe" },
    ],
  },
  {
    id: "org-brightloop",
    name: "Brightloop",
    contact: "Mei Lin",
    email: "mei@brightloop.dev",
    orders: [
      { id: "INV-1011", desc: "Credit Top Up — 50k Pack", date: "Aug 12, 2025", amount: 100.0, creditsAdded: 50000, gateway: "Stripe" },
      { id: "INV-1900", desc: "Pro Plan — Annual", date: "Feb 14, 2026", amount: 99.0, creditsAdded: 60000, gateway: "Stripe" },
    ],
  },
];

function orgById(id: string | null) {
  return id ? ORGS.find((o) => o.id === id) || null : null;
}
function orderIn(org: Org | null, orderId: string | null) {
  if (!org || !orderId) return null;
  return org.orders.find((o) => o.id === orderId) || null;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "REF-1234",
    orgId: "org-northwind",
    orderId: "INV-1046",
    customer: CURRENT_CUSTOMER.name,
    email: CURRENT_CUSTOMER.email,
    invoice: "INV-1046",
    orderDesc: "Growth Pro Annual Renewal",
    gateway: "Stripe",
    amount: 990,
    reason: "Duplicate payment",
    status: "UNDER_REVIEW",
    created: "Yesterday",
    assignedTo: "Alex Rivera",
    escalated: false,
    escalatedTo: null,
    description:
      "I was charged twice for the same annual plan on the 18th — can see two identical charges on my statement.",
    evidence: [
      { name: "bank-statement.png", type: "image", url: null },
      { name: "charge-proof.png", type: "image", url: null },
    ],
    parentTicketId: null,
    notes: [
      { type: "created", actor: CURRENT_CUSTOMER.name, detail: "Duplicate payment", at: "Yesterday" },
      { type: "delegated", actor: CURRENT_ADMIN, target: "Alex Rivera", at: "Yesterday" },
    ],
  },
  {
    id: "REF-1198",
    orgId: "org-northwind",
    orderId: "INV-1004",
    customer: CURRENT_CUSTOMER.name,
    email: CURRENT_CUSTOMER.email,
    invoice: "INV-1004",
    orderDesc: "Growth Pro Annual Subscription",
    gateway: "Razorpay",
    amount: 990,
    reason: "Didn't use product",
    status: "REFUNDED",
    created: "2 weeks ago",
    assignedTo: "Jordan Kim",
    escalated: false,
    escalatedTo: null,
    description: "Never onboarded the team, requesting a refund within the window.",
    evidence: [],
    parentTicketId: null,
    notes: [
      { type: "created", actor: CURRENT_CUSTOMER.name, detail: "Didn't use product", at: "2 weeks ago" },
      { type: "delegated", actor: CURRENT_ADMIN, target: "Jordan Kim", at: "2 weeks ago" },
      { type: "approved", actor: "Jordan Kim", detail: "$990.00 processed to Razorpay", at: "2 weeks ago" },
    ],
  },
  {
    id: "REF-1188",
    orgId: "org-northwind",
    orderId: "INV-0980",
    customer: CURRENT_CUSTOMER.name,
    email: CURRENT_CUSTOMER.email,
    invoice: "INV-0980",
    orderDesc: "Pro Plan — Monthly",
    gateway: "Stripe",
    amount: 12,
    reason: "Duplicate payment",
    status: "REJECTED",
    created: "3 weeks ago",
    assignedTo: "Sam Patel",
    escalated: false,
    escalatedTo: null,
    description: "Requested refund outside the eligible window.",
    evidence: [],
    rejectReason: "Outside 30-day refund policy.",
    parentTicketId: null,
    notes: [
      { type: "created", actor: CURRENT_CUSTOMER.name, detail: "Duplicate payment", at: "3 weeks ago" },
      { type: "delegated", actor: CURRENT_ADMIN, target: "Sam Patel", at: "3 weeks ago" },
      { type: "rejected", actor: "Sam Patel", detail: "Outside 30-day refund policy.", at: "3 weeks ago" },
    ],
  },
  {
    id: "REF-1235",
    orgId: "org-acme",
    orderId: "INV-1039",
    customer: "Daniel Osei",
    email: "daniel@acme.com",
    invoice: "INV-1039",
    orderDesc: "Add-on: Extra Seats (5)",
    gateway: "Razorpay",
    amount: 45,
    reason: "Technical issue",
    status: "OPEN",
    created: "2h ago",
    assignedTo: null,
    escalated: false,
    escalatedTo: null,
    description: "Purchased 5 extra seats but they were never activated on our workspace.",
    evidence: [{ name: "screen-recording.mp4", type: "video", url: null }],
    parentTicketId: null,
    notes: [{ type: "created", actor: "Daniel Osei", detail: "Technical issue", at: "2h ago" }],
  },
  {
    id: "REF-1230",
    orgId: "org-brightloop",
    orderId: "INV-1011",
    customer: "Mei Lin",
    email: "mei@brightloop.dev",
    invoice: "INV-1011",
    orderDesc: "Credit Top Up — 50k Pack",
    gateway: "Stripe",
    amount: 100,
    reason: "Didn't use product",
    status: "OPEN",
    created: "5h ago",
    assignedTo: null,
    escalated: true,
    escalatedTo: "Priya Shah",
    description: "Bought the top-up pack by mistake, meant to buy the annual plan instead.",
    evidence: [],
    parentTicketId: null,
    notes: [
      { type: "created", actor: "Mei Lin", detail: "Didn't use product", at: "5h ago" },
      { type: "escalated", actor: CURRENT_ADMIN, target: "Priya Shah", at: "5h ago" },
    ],
  },
  {
    id: "REF-1335",
    orgId: "org-northwind",
    orderId: "INV-0980",
    customer: CURRENT_CUSTOMER.name,
    email: CURRENT_CUSTOMER.email,
    invoice: "INV-0980",
    orderDesc: "Pro Plan — Monthly",
    gateway: "Stripe",
    amount: 12,
    reason: "Duplicate payment",
    status: "OPEN",
    created: "1h ago",
    assignedTo: null,
    escalated: false,
    escalatedTo: null,
    description:
      "This is a follow-up — I found the second identical charge on my card statement, please take another look.",
    evidence: [{ name: "statement-followup.png", type: "image", url: null }],
    parentTicketId: "REF-1188",
    notes: [{ type: "created", actor: CURRENT_CUSTOMER.name, detail: "Duplicate payment", at: "1h ago" }],
  },
];

const INITIAL_REQUESTS: IncomingRequest[] = [
  {
    id: "REQ-501",
    orgId: "org-northwind",
    orderId: "INV-0980",
    name: "Priya Nair",
    email: "priya@northwind.io",
    reason: "Duplicate payment",
    description:
      "This is a follow-up — I found the second identical charge on my card statement, please take another look.",
    amount: 12,
    evidence: [{ name: "statement-followup.png", type: "image", url: null }],
    submittedAt: "1h ago",
    status: "converted",
    ticketId: "REF-1335",
  },
  {
    id: "REQ-502",
    orgId: null,
    orderId: null,
    name: "Daniel Osei",
    email: "daniel@acme.com",
    reason: "Wrong purchase",
    description:
      "I meant to buy the monthly plan but got charged for the annual one on INV-2050, please refund the difference or cancel it.",
    amount: 99,
    evidence: [],
    submittedAt: "3h ago",
    status: "pending",
    ticketId: null,
  },
];

/* -------------------------------------------------------------------------
   Small helpers
------------------------------------------------------------------------- */
function fmtMoney(n: number) {
  return "$" + n.toFixed(2);
}
function genId(prefix: string, base: number) {
  return `${prefix}-${base + Math.floor(Math.random() * 90)}`;
}

function useOnClickOutside(ref: React.RefObject<HTMLElement | null>, onOutside: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [active, onOutside, ref]);
}

/* Refund math — used by both the customer portal and the admin raise-ticket
   flow, so it can safely reason about every org, not just the current
   customer's. */
function ticketsForOrgOrder(tickets: Ticket[], orgId: string, orderId: string) {
  return tickets.filter((t) => t.orgId === orgId && t.orderId === orderId);
}
function latestTicketFor(tickets: Ticket[], orgId: string, orderId: string) {
  return ticketsForOrgOrder(tickets, orgId, orderId)[0] || null;
}
function pendingRequestFor(requests: IncomingRequest[], orgId: string, orderId: string) {
  return requests.find((r) => r.status === "pending" && r.orgId === orgId && r.orderId === orderId) || null;
}
function refundedSoFar(tickets: Ticket[], orgId: string, orderId: string) {
  return ticketsForOrgOrder(tickets, orgId, orderId)
    .filter((t) => t.status === "REFUNDED" || t.status === "APPROVED")
    .reduce((sum, t) => sum + t.amount, 0);
}
function remainingRefundable(tickets: Ticket[], orgId: string, order: Order) {
  return Math.max(0, order.amount - refundedSoFar(tickets, orgId, order.id));
}
function describeTicketOutcome(t: Ticket, org: Org | null) {
  const order = orderIn(org, t.orderId);
  if (t.status === "REJECTED") return "rejected";
  if (t.status === "REFUNDED" || t.status === "APPROVED") {
    const isPartial = order && t.amount < order.amount - 0.004;
    return `${isPartial ? "partially approved" : "approved"}, ${fmtMoney(t.amount)}`;
  }
  return STATUS_META[t.status].label.toLowerCase();
}

/* -------------------------------------------------------------------------
   Presentational bits
------------------------------------------------------------------------- */
function StatusPill({
  label,
  pillClass,
  onClick,
}: {
  label: string;
  pillClass: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 border border-solid rounded-full px-2.5 py-1 text-xxs font-semibold uppercase tracking-wide ${pillClass} ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {label}
      {onClick && <FiChevronRight size={11} />}
    </Tag>
  );
}

function AssignBadge({ ticket }: { ticket: Ticket }) {
  if (ticket.escalated) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-solid border-errorBG/30 bg-redButton text-errorBG rounded-full px-2.5 py-1 text-xxs font-semibold uppercase tracking-wide">
        <FiArrowUp size={11} /> {ticket.escalatedTo ? `Escalated · ${ticket.escalatedTo}` : "Escalated"}
      </span>
    );
  }
  if (ticket.assignedTo) {
    return (
      <span className="inline-flex items-center gap-1.5 border border-solid border-gradeBBg/30 bg-gradeBText text-gradeBBg rounded-full px-2.5 py-1 text-xxs font-semibold uppercase tracking-wide">
        <FiUserPlus size={11} /> {ticket.assignedTo}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center border border-solid border-borderMuted bg-bgSubtle text-cardSmText rounded-full px-2.5 py-1 text-xxs font-semibold uppercase tracking-wide">
      Unassigned
    </span>
  );
}

function Timeline({ status }: { status: TicketStatusKey }) {
  const rejected = status === "REJECTED";
  const current = STAGE_INDEX[status] ?? 0;
  return (
    <div className="flex items-center my-6">
      {STAGE_LABELS.map((label, i) => {
        const done = i < current;
        const now = i === current;
        const dotColor = rejected && i === 3 ? "bg-errorBG border-errorBG" : done || now ? "bg-borderActive border-borderActive" : "bg-borderMuted border-borderMuted";
        const lineColor = done || now ? "bg-borderActive" : "bg-borderMuted";
        const textColor = done || now ? "text-textTheme font-semibold" : "text-cardSmText";
        return (
          <div key={label} className="flex flex-col items-center flex-1 relative">
            {i !== 0 && <div className={`absolute top-[5px] left-[-50%] w-full h-[2px] ${lineColor}`} />}
            <div className={`w-[11px] h-[11px] rounded-full border-2 border-solid z-[1] ${dotColor}`} />
            <span className={`text-xxs uppercase tracking-wide mt-2 text-center ${textColor}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function ResolutionBanner({
  kind,
  title,
  message,
}: {
  kind: "approved" | "rejected";
  title: string;
  message?: string;
}) {
  const isApproved = kind === "approved";
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-solid px-4 py-3.5 mb-4 ${
        isApproved ? "bg-bgAction border-borderActive/30" : "bg-redButton border-errorBG/30"
      }`}
    >
      <span
        className={`flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
          isApproved ? "bg-borderActive" : "bg-errorBG"
        }`}
      >
        {isApproved ? <FiCheck size={12} className="text-white" /> : <FiAlertTriangle size={12} className="text-white" />}
      </span>
      <div>
        <p className="text-sm font-semibold text-textTheme">{title}</p>
        {message && <p className="text-xsm text-subTitleText mt-0.5">{message}</p>}
      </div>
    </div>
  );
}

function EvidenceList({
  evidence,
  removable,
  onRemove,
}: {
  evidence: Evidence[];
  removable?: boolean;
  onRemove?: (idx: number) => void;
}) {
  if (evidence.length === 0) {
    return <p className="text-xs text-cardSmText">No files attached.</p>;
  }
  return (
    <div className="flex flex-col gap-2 mt-1">
      {evidence.map((e, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border border-solid border-borderMuted rounded-lg px-2.5 py-2 bg-bgElevated"
        >
          <div className="w-10 h-10 rounded-md overflow-hidden bg-bgSkeleton border border-solid border-borderMuted flex items-center justify-center text-cardSmText flex-shrink-0">
            {e.url ? (
              e.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.url} alt={e.name} className="w-full h-full object-cover" />
              ) : (
                <video src={e.url} muted className="w-full h-full object-cover" />
              )
            ) : e.type === "video" ? (
              <MdVideoLibrary size={18} />
            ) : (
              <FiPaperclip size={16} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xsm font-semibold text-textTheme truncate">{e.name}</p>
            <p className="text-xxs uppercase tracking-wide text-cardSmText mt-0.5">
              {e.type === "video" ? "Video" : "Image"}
            </p>
          </div>
          {removable ? (
            <button
              onClick={() => onRemove?.(i)}
              className="flex-shrink-0 w-6.5 h-6.5 flex items-center justify-center rounded-md border border-solid border-borderMuted text-cardSmText hover:text-errorBG hover:border-errorBG/40 hover:bg-redButton cursor-pointer bg-transparent"
            >
              <FiX size={14} />
            </button>
          ) : e.url ? (
            <a
              href={e.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-xxs font-semibold px-2.5 py-1.5 rounded-md border border-solid border-gradeBBg/30 bg-gradeBText text-gradeBBg no-underline"
            >
              View
            </a>
          ) : (
            <span className="flex-shrink-0 text-xxs px-2.5 py-1.5 text-cardSmText">No preview</span>
          )}
        </div>
      ))}
    </div>
  );
}

function RelatedTickets({
  ticket,
  tickets,
  onOpen,
}: {
  ticket: Ticket;
  tickets: Ticket[];
  onOpen: (id: string) => void;
}) {
  const org = orgById(ticket.orgId);
  const parent = ticket.parentTicketId ? tickets.find((t) => t.id === ticket.parentTicketId) : null;
  const child = tickets.find((t) => t.parentTicketId === ticket.id) || null;
  if (!parent && !child) return null;
  return (
    <div className="mb-4">
      <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Related tickets</label>
      <div className="flex flex-col gap-2">
        {[parent && { t: parent, prefix: "Follow-up to" }, child && { t: child, prefix: "Followed by" }]
          .filter(Boolean)
          .map((entry) => {
            const { t, prefix } = entry as { t: Ticket; prefix: string };
            return (
              <button
                key={t.id}
                onClick={() => onOpen(t.id)}
                className="flex items-center gap-2 w-full text-left border border-solid border-borderMuted rounded-lg px-3 py-2.5 text-xsm text-textTheme bg-bgElevated hover:bg-bgSkeleton cursor-pointer"
              >
                <FiChevronRight size={13} className="text-cardSmText flex-shrink-0" />
                <span>
                  {prefix} <span className="font-mono">{t.id}</span>{" "}
                  <span className="text-cardSmText">({describeTicketOutcome(t, org)})</span>
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Invoice request history — shows every ticket (rejected / partially
   refunded / refunded) that has ever existed on this invoice. Used both
   inside the "request again" form (so the customer sees what already
   happened before submitting) and on a pending-request detail view (so a
   just-submitted request reads as part of the same timeline).
------------------------------------------------------------------------- */
function InvoiceRequestHistory({ history }: { history: Ticket[] }) {
  if (history.length === 0) return null;
  return (
    <div className="mb-5">
      <label className="block text-xsm font-semibold text-subTitleText mb-1.5">
        Previous requests on this invoice
      </label>
      <div className="flex flex-col gap-2">
        {history.map((t) => {
          const meta = STATUS_META[t.status];
          return (
            <div key={t.id} className="border border-solid border-borderMuted rounded-lg px-3.5 py-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-sm font-semibold text-textTheme">{t.reason}</p>
                  <p className="text-xs text-cardSmText mt-0.5">
                    {t.created} · <span className="font-mono">{t.id}</span>
                  </p>
                </div>
                <StatusPill label={meta.label} pillClass={meta.pillClass} />
              </div>
              <p className="text-xs text-cardSmText mt-2">
                Requested {fmtMoney(t.amount)}
                {t.status === "REJECTED" && t.rejectReason ? ` — ${t.rejectReason}` : ""}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Customer follow-up box — offered on a resolved ticket when there's still
   refundable balance left on the invoice. Mirrors the "Send Another
   Request" flow: if a follow-up request is already pending, it shows that
   instead of letting the customer submit a duplicate, and lets them open
   that pending request to see its status.
------------------------------------------------------------------------- */
function CustomerFollowUpBox({
  ticket,
  order,
  tickets,
  requests,
  onRequestAgain,
  onOpenRequest,
}: {
  ticket: Ticket;
  order: Order | null;
  tickets: Ticket[];
  requests: IncomingRequest[];
  onRequestAgain: () => void;
  onOpenRequest: (requestId: string) => void;
}) {
  const resolved = ticket.status === "REFUNDED" || ticket.status === "APPROVED" || ticket.status === "REJECTED";
  if (!resolved || !order) return null;

  const remaining = remainingRefundable(tickets, CURRENT_ORG_ID, order);
  if (remaining <= 0.004) return null;

  const pending = pendingRequestFor(requests, CURRENT_ORG_ID, order.id);
  const isPartial = ticket.status !== "REJECTED" && ticket.amount < order.amount - 0.004;
  const rejected = ticket.status === "REJECTED";

  const copy = rejected
    ? "This request wasn't approved. If you have more information, you can send another request for this invoice."
    : isPartial
    ? `You were refunded ${fmtMoney(ticket.amount)} of ${fmtMoney(order.amount)}. If you'd like to request the remaining ${fmtMoney(remaining)}, you can send another request.`
    : "Still not satisfied with this outcome? You can send another request for this invoice.";

  return (
    <div
      className={`border border-dashed rounded-lg px-4 py-3.5 mt-5 ${
        rejected ? "border-errorBG/30 bg-redButton" : "border-borderActive/30 bg-bgAction"
      }`}
    >
      <p className="text-xsm text-subTitleText mb-2.5">{copy}</p>
      {pending ? (
        <p className="text-xs text-cardSmText">
          You already sent a follow-up (
          <button
            onClick={() => onOpenRequest(pending.id)}
            className="font-mono underline decoration-dotted underline-offset-2 bg-transparent border-none p-0 cursor-pointer text-cardSmText hover:text-textTheme"
          >
            {pending.id}
          </button>
          ) — it&apos;s awaiting review, we&apos;ll email you once it&apos;s processed.
        </p>
      ) : (
        <button
          onClick={onRequestAgain}
          className="w-full bg-btnTheme text-btnThemeColor rounded-lg py-2 text-xsm font-semibold border-none cursor-pointer hover:opacity-85"
        >
          Send Another Request
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Activity Log — a vertical timeline of every action taken on the ticket,
   from creation through delegation/escalation to approval or rejection.
   Reuses the same dot-and-connecting-line language as the stage Timeline
   above it, so it reads as part of the same app rather than a bolted-on
   widget — just oriented vertically and carrying who/what/when per step.
------------------------------------------------------------------------- */
function describeActivity(n: TicketNote): string {
  switch (n.type) {
    case "created":
      return `submitted the request${n.detail ? ` — ${n.detail}` : ""}`;
    case "delegated":
      return `delegated to ${n.target}`;
    case "escalated":
      return `escalated to ${n.target}`;
    case "approved":
      return `approved the refund${n.detail ? ` — ${n.detail}` : ""}`;
    case "rejected":
      return `rejected the request${n.detail ? ` — ${n.detail}` : ""}`;
    default:
      return n.detail || "";
  }
}

function ActivityLog({ ticket }: { ticket: Ticket }) {
  const hasCreated = ticket.notes.some((n) => n.type === "created");
  const entries: TicketNote[] = hasCreated
    ? ticket.notes
    : [{ type: "created", actor: ticket.customer, detail: ticket.reason, at: ticket.created }, ...ticket.notes];

  return (
    <div className="mb-4">
      <label className="block text-xsm font-semibold text-subTitleText mb-2.5">Activity Log</label>
      <div className="relative">
        {entries.length > 1 && (
          <div className="absolute left-[3px] top-[6px] bottom-[6px] w-px bg-borderMuted" />
        )}
        <div className="flex flex-col gap-3.5">
          {entries.map((n, i) => {
            const isLatest = i === entries.length - 1;
            return (
              <div key={i} className="relative pl-5">
                <span
                  className={`absolute left-0 top-[5px] w-[7px] h-[7px] rounded-full ${
                    isLatest ? "bg-borderActive" : "bg-borderMuted"
                  }`}
                />
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xsm text-textTheme">
                    <span className="font-semibold">{n.actor}</span> {describeActivity(n)}
                  </p>
                  <span className="text-xxs text-cardSmText whitespace-nowrap flex-shrink-0">{n.at}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Main component
------------------------------------------------------------------------- */
export default function RefundLedgerApp() {
  const [tab, setTab] = useState<"customer" | "admin">("admin");
  const [orders] = useState<Order[]>(INITIAL_ORDERS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [requests, setRequests] = useState<IncomingRequest[]>(INITIAL_REQUESTS);

  const [panel, setPanel] = useState<PanelState>(null);
  const [delegateOpen, setDelegateOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [rejectBoxOpen, setRejectBoxOpen] = useState(false);
  const [rejectReasonDraft, setRejectReasonDraft] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // customer request-form draft state — UNCHANGED
  const [formEmail, setFormEmail] = useState(CURRENT_CUSTOMER.email);
  const [formReason, setFormReason] = useState(REASONS[0]);
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formEvidence, setFormEvidence] = useState<Evidence[]>([]);

  // admin "raise a ticket" draft state
  const [ctOrgSearch, setCtOrgSearch] = useState("");
  const [ctOrgId, setCtOrgId] = useState<string | null>(null);
  const [ctOrderId, setCtOrderId] = useState<string | null>(null);
  const [ctReason, setCtReason] = useState(REASONS[0]);
  const [ctDesc, setCtDesc] = useState("");
  const [ctAmount, setCtAmount] = useState("");
  const [ctEvidence, setCtEvidence] = useState<Evidence[]>([]);

  const delegateRef = useRef<HTMLDivElement>(null);
  const escalateRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(delegateRef, () => setDelegateOpen(false), delegateOpen);
  useOnClickOutside(escalateRef, () => setEscalateOpen(false), escalateOpen);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---------------- Customer portal ---------------- */
  function openForm(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    const remaining = order ? remainingRefundable(tickets, CURRENT_ORG_ID, order) : 0;
    setFormEmail(CURRENT_CUSTOMER.email);
    setFormReason(REASONS[0]);
    setFormDesc("");
    setFormAmount(order ? remaining.toFixed(2) : "");
    setFormEvidence([]);
    setPanel({ type: "form", orderId });
  }

  // Customer submissions land in the pending-requests queue as a new,
  // unmerged entry — they don't become a ticket until an admin raises one.
  function submitRefund(orderId: string) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const remaining = remainingRefundable(tickets, CURRENT_ORG_ID, order);
    const amount = parseFloat(formAmount) || remaining || order.amount;
    const id = genId("REQ", 600);
    const newRequest: IncomingRequest = {
      id,
      orgId: CURRENT_ORG_ID,
      orderId,
      name: CURRENT_CUSTOMER.name,
      email: formEmail.trim() || CURRENT_CUSTOMER.email,
      reason: formReason,
      description: formDesc.trim() || "No additional details provided.",
      amount,
      evidence: formEvidence,
      submittedAt: "Just now",
      status: "pending",
      ticketId: null,
    };
    setRequests((prev) => [newRequest, ...prev]);
    closePanel();
    setToast(`Sent to support — we'll email you once it's reviewed (${id})`);
  }

  /* ---------------- Shared panel controls ---------------- */
  function closePanel() {
    setPanel(null);
    setDelegateOpen(false);
    setEscalateOpen(false);
    setRejectBoxOpen(false);
    setRejectReasonDraft("");
    setFormEvidence([]);
  }

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const next: Evidence[] = files.map((file) => ({
      name: file.name,
      type: file.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(file),
    }));
    setFormEvidence((prev) => [...prev, ...next]);
    e.target.value = "";
  }

  /* ---------------- Admin ticket actions ---------------- */
  function approveTicket(id: string) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "REFUNDED",
              notes: [
                ...t.notes,
                { type: "approved", actor: CURRENT_ADMIN, detail: `${fmtMoney(t.amount)} processed to ${t.gateway}`, at: "Just now" },
              ],
            }
          : t
      )
    );
    closePanel();
    setToast(`${id} approved — refund sent to gateway`);
  }

  function rejectTicket(id: string, reason: string) {
    const finalReason = reason.trim() || "Outside refund policy.";
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "REJECTED",
              rejectReason: finalReason,
              notes: [
                ...t.notes,
                { type: "rejected", actor: CURRENT_ADMIN, detail: finalReason, at: "Just now" },
              ],
            }
          : t
      )
    );
    closePanel();
    setToast(`${id} rejected`);
  }

  function delegateTicket(id: string, agent: string) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              assignedTo: agent,
              status: t.status === "OPEN" ? "UNDER_REVIEW" : t.status,
              notes: [...t.notes, { type: "delegated", actor: CURRENT_ADMIN, target: agent, at: "Just now" }],
            }
          : t
      )
    );
    setDelegateOpen(false);
    setToast(`${id} delegated to ${agent}`);
  }

  function escalateTicket(id: string, contact: string) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              escalated: true,
              escalatedTo: contact,
              status: t.status === "OPEN" ? "UNDER_REVIEW" : t.status,
              notes: [...t.notes, { type: "escalated", actor: CURRENT_ADMIN, target: contact, at: "Just now" }],
            }
          : t
      )
    );
    setEscalateOpen(false);
    setToast(`${id} escalated to ${contact}`);
  }

  /* ---------------- Raise a ticket ---------------- */
  function openCreateTicket(requestId: string | null) {
    const req = requestId ? requests.find((r) => r.id === requestId) : null;
    setCtOrgSearch(req ? req.email || req.name : "");
    setCtOrgId(req?.orgId ?? null);
    setCtOrderId(req?.orderId ?? null);
    setCtReason(req ? req.reason : REASONS[0]);
    setCtDesc(req ? req.description : "");
    setCtAmount(req ? String(req.amount) : "");
    setCtEvidence(req ? req.evidence : []);
    setPanel({ type: "createTicket", requestId });
  }

  function raiseTicket() {
    if (!ctOrgId || !ctOrderId) {
      setToast("Select an organization and invoice first");
      return;
    }
    const org = orgById(ctOrgId);
    const order = orderIn(org, ctOrderId);
    if (!org || !order) return;

    const remaining = remainingRefundable(tickets, org.id, order);
    const amount = Math.min(parseFloat(ctAmount) || remaining, remaining);
    const prior = ticketsForOrgOrder(tickets, org.id, order.id)[0] || null;
    const parentTicketId =
      prior && ["REFUNDED", "APPROVED", "REJECTED"].includes(prior.status) ? prior.id : null;

    const req = panel && panel.type === "createTicket" ? panel.requestId : null;
    const reqObj = req ? requests.find((r) => r.id === req) : null;

    const id = genId("REF", 1300);
    const newTicket: Ticket = {
      id,
      orgId: org.id,
      orderId: order.id,
      customer: org.contact,
      email: org.email,
      invoice: order.id,
      orderDesc: order.desc,
      gateway: order.gateway,
      amount,
      reason: ctReason,
      status: "OPEN",
      created: "Just now",
      assignedTo: null,
      escalated: false,
      escalatedTo: null,
      description: ctDesc.trim() || "No description provided.",
      evidence: ctEvidence,
      parentTicketId,
      notes: [
        { type: "created", actor: org.contact, detail: ctReason, at: "Just now" },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    if (reqObj) {
      setRequests((prev) =>
        prev.map((r) => (r.id === reqObj.id ? { ...r, status: "converted", ticketId: id } : r))
      );
    }
    closePanel();
    setToast(`Ticket ${id} raised`);
  }

  /* ---------------- CSV export — unchanged ---------------- */
  function exportCSV() {
    const header = "Date,Description,Amount,Credits Added,Invoice\n";
    const rows = orders
      .map((o) => `${o.date},"${o.desc}",${o.amount.toFixed(2)},${o.creditsAdded},${o.id}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "billing-history.csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("CSV exported");
  }

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    open: tickets.filter((t) => t.status === "OPEN").length,
    review: tickets.filter((t) => t.status === "UNDER_REVIEW").length,
    approved: tickets.filter((t) => t.status === "REFUNDED" || t.status === "APPROVED").length,
    rejected: tickets.filter((t) => t.status === "REJECTED").length,
  };

  const activePanelTicket =
    panel && (panel.type === "customerTicket" || panel.type === "adminTicket")
      ? tickets.find((t) => t.id === panel.ticketId) || null
      : null;

  const activePanelRequest =
    panel && panel.type === "customerRequest"
      ? requests.find((r) => r.id === panel.requestId) || null
      : null;

  const activePanelOrder = panel && panel.type === "form" ? orders.find((o) => o.id === panel.orderId) || null : null;

  const activePanelTicketOrder = activePanelTicket ? orders.find((o) => o.id === activePanelTicket.orderId) || null : null;

  const panelTitle =
    panel?.type === "form"
      ? "Request a refund"
      : panel?.type === "createTicket"
      ? "Raise a ticket"
      : panel?.type === "customerRequest"
      ? "Refund request"
      : activePanelTicket?.id;

  const panelSubtitle =
    panel?.type === "form"
      ? activePanelOrder?.id
      : panel?.type === "createTicket"
      ? panel.requestId || "New ticket"
      : panel?.type === "customerRequest"
      ? activePanelRequest?.orderId ?? ""
      : panel?.type === "customerTicket" || panel?.type === "adminTicket"
      ? activePanelTicket?.orderId
      : "";

  return (
    <div className="w-full">
      {/* Tab switcher */}
      <div className="inline-flex bg-bgSkeleton border border-solid border-borderMuted rounded-lg p-1 gap-1 mb-6">
        {(["customer", "admin"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`border-none rounded-md px-4 py-2 text-xsm font-semibold cursor-pointer ${
              tab === k ? "bg-textTheme text-mainBG" : "bg-transparent text-subTitleText"
            }`}
          >
            {k === "customer" ? "Customer Portal" : "Tickets"}
          </button>
        ))}
      </div>

      {tab === "customer" && (
        <CustomerView
          orders={orders}
          tickets={tickets}
          requests={requests}
          openForm={openForm}
          openCustomerTicket={(id) => setPanel({ type: "customerTicket", ticketId: id })}
          openCustomerRequest={(id) => setPanel({ type: "customerRequest", requestId: id })}
          exportCSV={exportCSV}
        />
      )}

      {tab === "admin" && (
        <AdminView
          tickets={filteredTickets}
          stats={stats}
          search={search}
          setSearch={setSearch}
          openAdminTicket={(id) => setPanel({ type: "adminTicket", ticketId: id })}
          onNewTicket={() => openCreateTicket(null)}
        />
      )}

      {/* Slide-over panel */}
      {panel && (
        <div className="fixed inset-0 bg-black/45 flex items-start justify-end z-50" onClick={closePanel}>
          <div
            className={`bg-bgElevated max-w-[94vw] h-full overflow-y-auto shadow-2xl ${
              panel.type === "createTicket" ? "w-[580px]" : "w-[500px]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-solid border-borderMuted sticky top-0 bg-bgElevated z-[1]">
              <div>
                <h2 className="text-xl font-semibold text-textTheme">{panelTitle}</h2>
                <p className="text-xxs uppercase tracking-wide text-cardSmText mt-0.5">{panelSubtitle}</p>
              </div>
              <button onClick={closePanel} className="text-cardSmText hover:text-textTheme bg-transparent border-none cursor-pointer p-1">
                <FiX size={18} />
              </button>
            </div>

            <div className="px-6 py-6">
              {panel.type === "form" && activePanelOrder && (
                <RequestForm
                  order={activePanelOrder}
                  remaining={remainingRefundable(tickets, CURRENT_ORG_ID, activePanelOrder)}
                  history={ticketsForOrgOrder(tickets, CURRENT_ORG_ID, activePanelOrder.id)}
                  email={formEmail}
                  setEmail={setFormEmail}
                  reason={formReason}
                  setReason={setFormReason}
                  desc={formDesc}
                  setDesc={setFormDesc}
                  amount={formAmount}
                  setAmount={setFormAmount}
                  evidence={formEvidence}
                  onFilePick={handleFilePick}
                  onRemoveEvidence={(idx) => setFormEvidence((prev) => prev.filter((_, i) => i !== idx))}
                  onSubmit={() => submitRefund(activePanelOrder.id)}
                />
              )}

              {panel.type === "customerTicket" && activePanelTicket && (
                <CustomerTicketDetail
                  ticket={activePanelTicket}
                  order={activePanelTicketOrder}
                  tickets={tickets}
                  requests={requests}
                  onRequestAgain={() => openForm(activePanelTicket.orderId)}
                  onOpenRelated={(id) => setPanel({ type: "customerTicket", ticketId: id })}
                  onOpenRequest={(id) => setPanel({ type: "customerRequest", requestId: id })}
                />
              )}

              {panel.type === "customerRequest" && activePanelRequest && (
                <CustomerRequestDetail
                  request={activePanelRequest}
                  history={
                    activePanelRequest.orgId && activePanelRequest.orderId
                      ? ticketsForOrgOrder(tickets, activePanelRequest.orgId, activePanelRequest.orderId)
                      : []
                  }
                />
              )}

              {panel.type === "adminTicket" && activePanelTicket && (
                <AdminTicketDetail
                  ticket={activePanelTicket}
                  tickets={tickets}
                  delegateOpen={delegateOpen}
                  setDelegateOpen={setDelegateOpen}
                  delegateRef={delegateRef}
                  escalateOpen={escalateOpen}
                  setEscalateOpen={setEscalateOpen}
                  escalateRef={escalateRef}
                  rejectBoxOpen={rejectBoxOpen}
                  setRejectBoxOpen={setRejectBoxOpen}
                  rejectReasonDraft={rejectReasonDraft}
                  setRejectReasonDraft={setRejectReasonDraft}
                  onApprove={() => approveTicket(activePanelTicket.id)}
                  onReject={() => rejectTicket(activePanelTicket.id, rejectReasonDraft)}
                  onDelegate={(agent) => delegateTicket(activePanelTicket.id, agent)}
                  onEscalate={(contact) => escalateTicket(activePanelTicket.id, contact)}
                  onOpenRelated={(id) => setPanel({ type: "adminTicket", ticketId: id })}
                />
              )}

              {panel.type === "createTicket" && (
                <CreateTicketForm
                  request={panel.requestId ? requests.find((r) => r.id === panel.requestId) || null : null}
                  tickets={tickets}
                  orgSearch={ctOrgSearch}
                  setOrgSearch={setCtOrgSearch}
                  orgId={ctOrgId}
                  setOrgId={setCtOrgId}
                  orderId={ctOrderId}
                  setOrderId={setCtOrderId}
                  reason={ctReason}
                  setReason={setCtReason}
                  desc={ctDesc}
                  setDesc={setCtDesc}
                  amount={ctAmount}
                  setAmount={setCtAmount}
                  evidence={ctEvidence}
                  onRaise={raiseTicket}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-textTheme text-mainBG px-5 py-3 rounded-lg text-sm z-[80] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Customer View
------------------------------------------------------------------------- */
function CustomerView({
  orders,
  tickets,
  requests,
  openForm,
  openCustomerTicket,
  openCustomerRequest,
  exportCSV,
}: {
  orders: Order[];
  tickets: Ticket[];
  requests: IncomingRequest[];
  openForm: (orderId: string) => void;
  openCustomerTicket: (ticketId: string) => void;
  openCustomerRequest: (requestId: string) => void;
  exportCSV: () => void;
}) {
  // Single entry point per invoice: go straight to whatever's most relevant —
  // the active ticket, else a pending request, else the most recent resolved
  // ticket (which already shows its own Related tickets), else the form to
  // start a new request. No intermediate list screen.
  function handleRowClick(order: Order) {
    const ticket = latestTicketFor(tickets, CURRENT_ORG_ID, order.id);
    if (ticket) {
      openCustomerTicket(ticket.id);
      return;
    }
    const pending = pendingRequestFor(requests, CURRENT_ORG_ID, order.id);
    if (pending) {
      openCustomerRequest(pending.id);
      return;
    }
    openForm(order.id);
  }

  return (
    <>
      <div className="flex items-end justify-between gap-5 flex-wrap mb-5">
        <div>
          <h1 className="text-3xl font-light text-textTheme mb-1">Invoice &amp; Billing History</h1>
          <p className="text-sm text-subTitleText max-w-md">
            View and download past invoices, and request a refund on any of them.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 border border-solid border-borderMuted bg-transparent rounded-lg px-4 py-2 text-sm text-textTheme cursor-pointer hover:border-borderActive transition-colors"
        >
          <FiDownload size={14} /> Export CSV
        </button>
      </div>

      <div className="bg-bgElevated rounded-2xl border border-solid border-borderMuted shadow-md py-7">
        <div className="grid grid-cols-[110px_1.9fr_0.8fr_1.1fr_1.3fr_0.9fr_100px] gap-4 pb-3 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
          {["Date", "Description", "Amount", "Credits Added", "Status", "Invoice", ""].map((h) => (
            <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">
              {h}
            </p>
          ))}
        </div>

        {orders.map((o) => {
          const ticket = latestTicketFor(tickets, CURRENT_ORG_ID, o.id);
          const pending = pendingRequestFor(requests, CURRENT_ORG_ID, o.id);
          const st = orderStatusFor(ticket, !!pending);
          return (
            <div
              key={o.id}
              className="grid grid-cols-[110px_1.9fr_0.8fr_1.1fr_1.3fr_0.9fr_100px] gap-4 py-4 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0 items-center transition-colors hover:bg-bgSkeleton/50"
            >
              <p className="text-sm text-textTheme">{o.date}</p>
              <p className="text-sm text-textTheme">{o.desc}</p>
              <p className="text-sm font-mono font-semibold text-textTheme">{fmtMoney(o.amount)}</p>
              <p className="text-sm font-mono font-semibold text-borderActive">
                {o.creditsAdded ? "+" + o.creditsAdded.toLocaleString() : "—"}
              </p>
              <div>
                <StatusPill label={st.label} pillClass={st.pillClass} />
              </div>
              <span className="inline-flex items-center gap-1.5 text-xsm text-subTitleText">
                <FiDownload size={13} /> {o.id}
              </span>
              <button
                onClick={() => handleRowClick(o)}
                className="flex items-center justify-end gap-1 w-full text-xsm font-semibold text-textTheme bg-transparent border-none cursor-pointer hover:text-borderActive"
              >
                View <FiChevronRight size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------
   Admin View
------------------------------------------------------------------------- */
function AdminView({
  tickets,
  stats,
  search,
  setSearch,
  openAdminTicket,
  onNewTicket,
}: {
  tickets: Ticket[];
  stats: { open: number; review: number; approved: number; rejected: number };
  search: string;
  setSearch: (v: string) => void;
  openAdminTicket: (id: string) => void;
  onNewTicket: () => void;
}) {
  return (
    <>
      <div className="flex items-end justify-between gap-5 flex-wrap mb-5">
        <div>
          <h1 className="text-3xl font-light text-textTheme mb-1">Tickets</h1>
          <p className="text-sm text-subTitleText max-w-lg">
            Review open tickets, delegate or escalate, then approve or reject.
          </p>
        </div>
        <button
          onClick={onNewTicket}
          className="flex items-center gap-2 bg-btnTheme text-btnThemeColor rounded-lg px-4 py-2 text-sm font-semibold border-none cursor-pointer hover:opacity-85"
        >
          <FiPlus size={14} /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {[
          { label: "Open tickets", value: stats.open, color: "text-textTheme" },
          { label: "Under review", value: stats.review, color: "text-textTheme" },
          { label: "Approved", value: stats.approved, color: "text-borderActive" },
          { label: "Rejected", value: stats.rejected, color: "text-errorBG" },
        ].map((s) => (
          <div key={s.label} className="bg-bgElevated rounded-2xl border border-solid border-borderMuted shadow-md p-4">
            <div className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xsm text-cardSmText mt-1">{s.label}</div>
          </div>
        ))}
      </div>


      <div className="bg-bgElevated rounded-2xl border border-solid border-borderMuted shadow-md py-7">
        <div className="grid grid-cols-[100px_1.8fr_0.8fr_1.2fr_1.3fr_1fr_50px] gap-4 pb-3 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0">
          {["Ticket", "Customer", "Amount", "Reason", "Assigned", "Status", ""].map((h) => (
            <p key={h} className="text-xs font-semibold text-cardSmText uppercase tracking-wider">
              {h}
            </p>
          ))}
        </div>

        {tickets.length === 0 ? (
          <p className="text-center text-cardSmText text-sm py-10">No tickets match your search.</p>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => openAdminTicket(t.id)}
              className="grid grid-cols-[100px_1.8fr_0.8fr_1.2fr_1.3fr_1fr_50px] gap-4 py-4 px-7 border-b border-borderMuted border-solid border-r-0 border-t-0 border-l-0 items-center transition-colors hover:bg-bgSkeleton/50 cursor-pointer"
            >
              <p className="font-mono text-sm text-textTheme">{t.id}</p>
              <div>
                <p className="text-sm text-textTheme">{t.customer}</p>
                <p className="text-xs text-cardSmText">{t.email}</p>
              </div>
              <p className="text-sm font-mono font-semibold text-textTheme">{fmtMoney(t.amount)}</p>
              <p className="text-sm text-textTheme">{t.reason}</p>
              <div>
                <AssignBadge ticket={t} />
              </div>
              <div>
                <StatusPill label={STATUS_META[t.status].label} pillClass={STATUS_META[t.status].pillClass} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------
   Request form (customer slide-over content)
------------------------------------------------------------------------- */
function RequestForm({
  order,
  remaining,
  history,
  email,
  setEmail,
  reason,
  setReason,
  desc,
  setDesc,
  amount,
  setAmount,
  evidence,
  onFilePick,
  onRemoveEvidence,
  onSubmit,
}: {
  order: Order;
  remaining: number;
  history: Ticket[];
  email: string;
  setEmail: (v: string) => void;
  reason: string;
  setReason: (v: string) => void;
  desc: string;
  setDesc: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  evidence: Evidence[];
  onFilePick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveEvidence: (idx: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center bg-bgSkeleton border border-solid border-borderMuted rounded-lg px-4 py-3.5 mb-5">
        <div>
          <div className="text-sm font-semibold text-textTheme">{order.id}</div>
          <div className="text-xs text-cardSmText mt-0.5">{order.desc}</div>
        </div>
        <div className="font-mono font-semibold text-base text-textTheme">{fmtMoney(order.amount)}</div>
      </div>

      <InvoiceRequestHistory history={history} />

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Email for follow-up</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-solid border-borderMuted rounded-lg px-3 py-2.5 text-sm bg-bgField text-textTheme outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Why are you requesting a refund?</label>
        {REASONS.map((r) => (
          <div
            key={r}
            onClick={() => setReason(r)}
            className={`flex items-center gap-2.5 border border-solid rounded-lg px-3 py-2.5 mb-2 text-sm cursor-pointer ${
              reason === r ? "border-textTheme bg-bgSkeleton" : "border-borderMuted"
            }`}
          >
            <input type="radio" checked={reason === r} readOnly />
            <span className="text-textTheme">{r}</span>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Tell us more</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="What happened? The more detail you give, the faster we can review this."
          className="w-full min-h-[80px] border border-solid border-borderMuted rounded-lg px-3 py-2.5 text-sm bg-bgField text-textTheme outline-none resize-y"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Refund amount</label>
        <div className="flex items-center border border-solid border-borderMuted rounded-lg overflow-hidden">
          <span className="px-3 py-2.5 bg-bgSkeleton border-r border-solid border-borderMuted font-mono text-cardSmText text-sm">$</span>
          <input
            type="number"
            step="0.01"
            max={remaining.toFixed(2)}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border-none outline-none px-3 py-2.5 text-sm font-mono flex-1 bg-bgField text-textTheme"
          />
        </div>
        <p className="text-xs text-cardSmText mt-1.5">
          Up to {fmtMoney(remaining)} remains refundable on this invoice — adjust if you&apos;re only requesting a partial refund.
        </p>
      </div>

      <div className="mb-5">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">
          Evidence (screenshots, screen recordings)
        </label>
        <label className="flex flex-col items-center gap-2 border border-dashed border-borderMuted rounded-lg px-5 py-5 text-xsm text-cardSmText cursor-pointer hover:border-cardSmText hover:bg-bgSkeleton">
          <MdOutlineFileUpload size={22} />
          Drop images or videos here, or click to upload
          <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={onFilePick} />
        </label>
        <div className="mt-3">
          <EvidenceList evidence={evidence} removable onRemove={onRemoveEvidence} />
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="w-full flex items-center justify-center gap-2 bg-btnTheme text-btnThemeColor rounded-lg py-2.5 text-sm font-semibold border-none cursor-pointer hover:opacity-85"
      >
        <FiPlus size={15} /> Submit request
      </button>
      <p className="text-center text-xs text-cardSmText mt-2.5">
        A support agent typically responds within 1–2 business days.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Customer ticket detail
------------------------------------------------------------------------- */
function CustomerTicketDetail({
  ticket,
  order,
  tickets,
  requests,
  onRequestAgain,
  onOpenRelated,
  onOpenRequest,
}: {
  ticket: Ticket;
  order: Order | null;
  tickets: Ticket[];
  requests: IncomingRequest[];
  onRequestAgain: () => void;
  onOpenRelated: (id: string) => void;
  onOpenRequest: (requestId: string) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center bg-bgSkeleton border border-solid border-borderMuted rounded-lg px-4 py-3.5 mb-5">
        <div>
          <div className="text-sm font-semibold text-textTheme">{ticket.reason}</div>
          <div className="text-xs text-cardSmText mt-0.5">{ticket.orderDesc}</div>
        </div>
        <div className="font-mono font-semibold text-base text-textTheme">{fmtMoney(ticket.amount)}</div>
      </div>

      {ticket.status === "REFUNDED" && (
        <ResolutionBanner
          kind="approved"
          title="Refund issued"
          message={`${fmtMoney(ticket.amount)} was refunded to your original payment method.`}
        />
      )}
      {ticket.status === "REJECTED" && (
        <ResolutionBanner kind="rejected" title="Request rejected" message={ticket.rejectReason} />
      )}

      <Timeline status={ticket.status} />

      <RelatedTickets ticket={ticket} tickets={tickets} onOpen={onOpenRelated} />

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">What you told us</label>
        <div className="border border-solid border-borderMuted rounded-lg px-3.5 py-3 text-sm text-textTheme">
          {ticket.description}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Evidence</label>
        <EvidenceList evidence={ticket.evidence} />
      </div>

      <CustomerFollowUpBox
        ticket={ticket}
        order={order}
        tickets={tickets}
        requests={requests}
        onRequestAgain={onRequestAgain}
        onOpenRequest={onOpenRequest}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------
   Customer request detail — read-only view of a pending (not-yet-a-ticket)
   IncomingRequest. Shows the request itself plus the full resolved-ticket
   history on that invoice, so a fresh "request again" submission still
   reads as part of one continuous timeline rather than floating alone.
------------------------------------------------------------------------- */
function CustomerRequestDetail({
  request,
  history,
}: {
  request: IncomingRequest;
  history: Ticket[];
}) {
  return (
    <div>
      <div className="flex justify-between items-center bg-bgSkeleton border border-solid border-borderMuted rounded-lg px-4 py-3.5 mb-5">
        <div>
          <div className="text-sm font-semibold text-textTheme">{request.reason}</div>
          <div className="text-xs text-cardSmText mt-0.5">Submitted {request.submittedAt}</div>
        </div>
        <div className="font-mono font-semibold text-base text-textTheme">{fmtMoney(request.amount)}</div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-solid border-amber-200 bg-amber-50 px-4 py-3.5 mb-4">
        <FiAlertTriangle size={14} className="text-amber-700 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          Awaiting review — a support agent hasn&apos;t looked at this yet. We&apos;ll email you once it&apos;s processed.
        </p>
      </div>

      <InvoiceRequestHistory history={history} />

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">What you told us</label>
        <div className="border border-solid border-borderMuted rounded-lg px-3.5 py-3 text-sm text-textTheme">
          {request.description}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Evidence</label>
        <EvidenceList evidence={request.evidence} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Admin ticket detail — the Activity Log is fully system-generated
   (populated by create/delegate/escalate/approve/reject — no manual
   composer). Delegate and Escalate both use a person-picker dropdown.
------------------------------------------------------------------------- */
function AdminTicketDetail({
  ticket,
  tickets,
  delegateOpen,
  setDelegateOpen,
  delegateRef,
  escalateOpen,
  setEscalateOpen,
  escalateRef,
  rejectBoxOpen,
  setRejectBoxOpen,
  rejectReasonDraft,
  setRejectReasonDraft,
  onApprove,
  onReject,
  onDelegate,
  onEscalate,
  onOpenRelated,
}: {
  ticket: Ticket;
  tickets: Ticket[];
  delegateOpen: boolean;
  setDelegateOpen: (v: boolean) => void;
  delegateRef: React.RefObject<HTMLDivElement | null>;
  escalateOpen: boolean;
  setEscalateOpen: (v: boolean) => void;
  escalateRef: React.RefObject<HTMLDivElement | null>;
  rejectBoxOpen: boolean;
  setRejectBoxOpen: (v: boolean) => void;
  rejectReasonDraft: string;
  setRejectReasonDraft: (v: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onDelegate: (agent: string) => void;
  onEscalate: (contact: string) => void;
  onOpenRelated: (id: string) => void;
}) {
  const resolved = ["REFUNDED", "APPROVED", "REJECTED"].includes(ticket.status);

  return (
    <div>
      <div className="flex justify-between items-center bg-bgSkeleton border border-solid border-borderMuted rounded-lg px-4 py-3.5 mb-3">
        <div>
          <div className="text-sm font-bold text-textTheme">{ticket.customer}</div>
          <div className="text-xs text-cardSmText mt-0.5">{ticket.email}</div>
        </div>
        <StatusPill label={STATUS_META[ticket.status].label} pillClass={STATUS_META[ticket.status].pillClass} />
      </div>

      <div className="flex justify-between items-center bg-bgSkeleton border border-solid border-borderMuted rounded-lg px-4 py-3.5 mb-5">
        <div>
          <div className="text-sm font-semibold text-textTheme">{ticket.reason}</div>
          <div className="text-xs text-cardSmText mt-0.5">
            Invoice {ticket.invoice} · {ticket.gateway}
          </div>
        </div>
        <div className="font-mono font-semibold text-base text-textTheme">{fmtMoney(ticket.amount)}</div>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <label className="text-xsm font-semibold text-subTitleText">Assignment</label>
        <AssignBadge ticket={ticket} />
      </div>

      {(ticket.status === "REFUNDED" || ticket.status === "APPROVED") && (
        <ResolutionBanner
          kind="approved"
          title="Refund processed"
          message={`${fmtMoney(ticket.amount)} was refunded to the customer's original payment method.`}
        />
      )}
      {ticket.status === "REJECTED" && (
        <ResolutionBanner kind="rejected" title="Request rejected" message={ticket.rejectReason} />
      )}

      <RelatedTickets ticket={ticket} tickets={tickets} onOpen={onOpenRelated} />

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Customer&apos;s message</label>
        <div className="border border-solid border-borderMuted rounded-lg px-3.5 py-3 text-sm text-textTheme">
          {ticket.description}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Evidence</label>
        <EvidenceList evidence={ticket.evidence} />
      </div>

      <ActivityLog ticket={ticket} />

      {!resolved ? (
        <>
          <div className="flex gap-2.5 mt-6 flex-wrap">
            <button
              onClick={onApprove}
              className="flex-1 min-w-[110px] flex items-center justify-center gap-2 bg-btnTheme text-btnThemeColor rounded-lg py-2.5 text-sm font-semibold border-none cursor-pointer hover:opacity-85"
            >
              <FiCheck size={15} /> Approve Refund
            </button>
            <button
              onClick={() => setRejectBoxOpen(!rejectBoxOpen)}
              className="flex-1 min-w-[110px] border border-solid border-errorBG/40 text-errorBG rounded-lg py-2.5 text-sm font-semibold bg-transparent cursor-pointer"
            >
              Reject
            </button>
            <div className="relative flex-1 min-w-[110px]" ref={delegateOpen ? delegateRef : undefined}>
              <button
                onClick={() => setDelegateOpen(!delegateOpen)}
                className="w-full flex items-center justify-center gap-2 bg-gradeBBg text-white rounded-lg py-2.5 text-sm font-semibold border-none cursor-pointer hover:opacity-85"
              >
                <FiUserPlus size={15} /> Delegate
              </button>
              {delegateOpen && (
                <div className="absolute bottom-[calc(100%+8px)] left-0 bg-bgElevated border border-solid border-borderMuted rounded-lg shadow-xl min-w-[210px] z-10 overflow-hidden">
                  <div className="text-xxs uppercase tracking-wide text-cardSmText px-3.5 pt-2.5 pb-1.5">Assign to</div>
                  {AGENTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => onDelegate(a)}
                      className="block w-full text-left px-3.5 py-2.5 text-sm text-textTheme bg-transparent border-none cursor-pointer hover:bg-bgSkeleton"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex-1 min-w-[110px]" ref={escalateOpen ? escalateRef : undefined}>
              <button
                onClick={() => setEscalateOpen(!escalateOpen)}
                className="w-full flex items-center justify-center gap-2 border border-solid border-borderMuted text-textTheme rounded-lg py-2.5 text-sm font-semibold bg-transparent cursor-pointer"
              >
                <FiArrowUp size={15} /> Escalate
              </button>
              {escalateOpen && (
                <div className="absolute bottom-[calc(100%+8px)] right-0 bg-bgElevated border border-solid border-borderMuted rounded-lg shadow-xl min-w-[230px] z-10 overflow-hidden">
                  <div className="text-xxs uppercase tracking-wide text-cardSmText px-3.5 pt-2.5 pb-1.5">Escalate to</div>
                  {ESCALATION_TEAM.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => onEscalate(c.name)}
                      className="block w-full text-left px-3.5 py-2.5 text-sm text-textTheme bg-transparent border-none cursor-pointer hover:bg-bgSkeleton"
                    >
                      {c.name}
                      <span className="text-cardSmText"> — {c.role}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {rejectBoxOpen && (
            <div className="mt-4">
              <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Reason for rejection</label>
              <textarea
                value={rejectReasonDraft}
                onChange={(e) => setRejectReasonDraft(e.target.value)}
                placeholder="e.g. Outside 30-day refund policy"
                className="w-full min-h-[80px] border border-solid border-borderMuted rounded-lg px-3 py-2.5 text-sm bg-bgField text-textTheme outline-none resize-y mb-3"
              />
              <button
                onClick={onReject}
                className="w-full bg-redButton text-errorBG border border-solid border-errorBG/30 rounded-lg py-2.5 text-sm font-semibold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          )}
        </>
      ) : (
        <div>
          <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Resolution</label>
          <div className="border border-solid border-borderMuted rounded-lg px-3.5 py-3 text-sm text-textTheme">
            {ticket.status === "REJECTED" ? ticket.rejectReason : "Refund processed to original payment method."}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Create Ticket form (admin raises a ticket from scratch by searching
   across every organization). Auto-detects a prior resolved ticket on the
   same invoice and links as a follow-up.
------------------------------------------------------------------------- */
function CreateTicketForm({
  request,
  tickets,
  orgSearch,
  setOrgSearch,
  orgId,
  setOrgId,
  orderId,
  setOrderId,
  reason,
  setReason,
  desc,
  setDesc,
  amount,
  setAmount,
  evidence,
  onRaise,
}: {
  request: IncomingRequest | null;
  tickets: Ticket[];
  orgSearch: string;
  setOrgSearch: (v: string) => void;
  orgId: string | null;
  setOrgId: (v: string | null) => void;
  orderId: string | null;
  setOrderId: (v: string | null) => void;
  reason: string;
  setReason: (v: string) => void;
  desc: string;
  setDesc: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  evidence: Evidence[];
  onRaise: () => void;
}) {
  const q = orgSearch.trim().toLowerCase();
  const matches = q
    ? ORGS.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.contact.toLowerCase().includes(q)
      )
    : ORGS;

  const selectedOrg = orgById(orgId);
  const selectedOrder = orderIn(selectedOrg, orderId);
  const remaining = selectedOrg && selectedOrder ? remainingRefundable(tickets, selectedOrg.id, selectedOrder) : null;
  const prior = selectedOrg && selectedOrder ? ticketsForOrgOrder(tickets, selectedOrg.id, selectedOrder.id)[0] : null;
  const willLink = prior && ["REFUNDED", "APPROVED", "REJECTED"].includes(prior.status) ? prior : null;

  return (
    <div>
      {request && (
        <div className="bg-bgSkeleton border border-solid border-borderMuted rounded-lg px-4 py-3.5 mb-5">
          <div className="flex justify-between gap-3 text-xsm mb-1.5">
            <span className="text-cardSmText">From</span>
            <span className="text-textTheme text-right">
              {request.name} · {request.email}
            </span>
          </div>
          <div className="flex justify-between gap-3 text-xsm mb-1.5">
            <span className="text-cardSmText">Reason</span>
            <span className="text-textTheme text-right">{request.reason}</span>
          </div>
          <div className="flex justify-between gap-3 text-xsm mb-1.5">
            <span className="text-cardSmText">Amount claimed</span>
            <span className="text-textTheme text-right font-mono">{fmtMoney(request.amount)}</span>
          </div>
          <div className="flex justify-between gap-3 text-xsm">
            <span className="text-cardSmText flex-shrink-0">Message</span>
            <span className="text-textTheme text-right">{request.description}</span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Find the organization</label>
        <div className="flex items-center gap-2 border border-solid border-borderMuted rounded-lg px-3 py-2.5 bg-bgField">
          <FiSearch size={14} className="text-cardSmText" />
          <input
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
            placeholder="Search by company, contact, or email…"
            className="border-none outline-none text-sm flex-1 bg-transparent text-textTheme"
          />
        </div>
        <div className="mt-2.5 flex flex-col gap-2">
          {matches.length === 0 ? (
            <p className="text-xs text-cardSmText">No organizations match that search.</p>
          ) : (
            matches.map((o) => (
              <div
                key={o.id}
                onClick={() => {
                  setOrgId(o.id);
                  setOrderId(null);
                  setAmount("");
                }}
                className={`flex justify-between items-center border border-solid rounded-lg px-3 py-2.5 cursor-pointer ${
                  orgId === o.id ? "border-textTheme bg-bgSkeleton" : "border-borderMuted bg-bgElevated"
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-textTheme">{o.name}</div>
                  <div className="text-xs text-cardSmText mt-0.5">
                    {o.contact} · {o.email}
                  </div>
                </div>
                {orgId === o.id && <FiCheck size={14} className="text-textTheme" />}
              </div>
            ))
          )}
        </div>
      </div>

      {selectedOrg && (
        <div className="mb-4">
          <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Select the invoice</label>
          <div className="flex flex-col gap-2">
            {selectedOrg.orders.map((o) => {
              const rem = remainingRefundable(tickets, selectedOrg.id, o);
              return (
                <div
                  key={o.id}
                  onClick={() => {
                    setOrderId(o.id);
                    setAmount(rem.toFixed(2));
                  }}
                  className={`flex justify-between items-center border border-solid rounded-lg px-3 py-2.5 cursor-pointer ${
                    orderId === o.id ? "border-textTheme bg-bgSkeleton" : "border-borderMuted bg-bgElevated"
                  }`}
                >
                  <div>
                    <div className="text-sm font-mono font-semibold text-textTheme">{o.id}</div>
                    <div className="text-xs text-cardSmText mt-0.5">
                      {o.desc} · {o.date}
                      {rem < o.amount - 0.004 ? ` · ${fmtMoney(rem)} remaining` : ""}
                    </div>
                  </div>
                  <div className="text-sm font-mono font-semibold text-textTheme">{fmtMoney(o.amount)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedOrder && remaining !== null && (
        <>
          {willLink && (
            <p className="text-xs text-cardSmText mb-4">
              This will link as a follow-up to <span className="font-mono font-semibold text-textTheme">{willLink.id}</span> (
              {describeTicketOutcome(willLink, selectedOrg)}).
            </p>
          )}

          <div className="mb-4">
            <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Reason</label>
            {REASONS.map((r) => (
              <div
                key={r}
                onClick={() => setReason(r)}
                className={`flex items-center gap-2.5 border border-solid rounded-lg px-3 py-2.5 mb-2 text-sm cursor-pointer ${
                  reason === r ? "border-textTheme bg-bgSkeleton" : "border-borderMuted"
                }`}
              >
                <input type="radio" checked={reason === r} readOnly />
                <span className="text-textTheme">{r}</span>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What the customer described…"
              className="w-full min-h-[80px] border border-solid border-borderMuted rounded-lg px-3 py-2.5 text-sm bg-bgField text-textTheme outline-none resize-y"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Refund amount</label>
            <div className="flex items-center border border-solid border-borderMuted rounded-lg overflow-hidden">
              <span className="px-3 py-2.5 bg-bgSkeleton border-r border-solid border-borderMuted font-mono text-cardSmText text-sm">$</span>
              <input
                type="number"
                step="0.01"
                max={remaining.toFixed(2)}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-none outline-none px-3 py-2.5 text-sm font-mono flex-1 bg-bgField text-textTheme"
              />
            </div>
            <p className="text-xs text-cardSmText mt-1.5">Up to {fmtMoney(remaining)} remains refundable on this invoice.</p>
          </div>

          <div className="mb-5">
            <label className="block text-xsm font-semibold text-subTitleText mb-1.5">Evidence</label>
            <EvidenceList evidence={evidence} />
          </div>

          <button
            onClick={onRaise}
            className="w-full flex items-center justify-center gap-2 bg-btnTheme text-btnThemeColor rounded-lg py-2.5 text-sm font-semibold border-none cursor-pointer hover:opacity-85"
          >
            <FiPlus size={15} /> Raise Ticket
          </button>
        </>
      )}

      {(!selectedOrg || !selectedOrder) && (
        <p className="text-xs text-cardSmText">Select an organization and invoice to continue.</p>
      )}
    </div>
  );
}