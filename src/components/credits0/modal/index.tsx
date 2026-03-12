"use client";

import { useState } from "react";
import { MdBolt, MdErrorOutline } from "react-icons/md";
import { FiArrowRight, FiPlus } from "react-icons/fi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { HiOutlineBolt, HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { LuInfo } from "react-icons/lu";
import { TbLayoutGrid } from "react-icons/tb";
import { CgCalculator } from "react-icons/cg";

type Props = {
    open: boolean;
    onClose: () => void;
    availableCredits?: number;
    requiredCredits?: number;
};

export default function CreditsBillingModal({
    open,
    onClose,
    availableCredits = 8,
    requiredCredits = 20,
}: Props) {
    const [showBreakdown, setShowBreakdown] = useState(false);

    const hasInsufficientCredits = availableCredits < requiredCredits;

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Modal container */}
            <div className="relative w-[900px] h-[520px] bg-bgElevated rounded-2xl shadow-xl flex flex-col">

                {/* Body (empty as requested) */}
                <div className="flex-1"></div>

                {/* Footer — UNCHANGED */}
                <div className="relative border-t border-solid border-b-0 border-r-0 border-l-0 border-borderMuted px-6 py-4 flex items-center justify-between">

                    {/* Estimated cost */}
                    <div></div>
                    <div className="flex gap-7 items-center">
                        <div
                            onMouseEnter={() => setShowBreakdown(true)}
                            // onMouseLeave={() => setShowBreakdown(false)}
                            className="relative"
                        >
                            <p className="text-xs flex gap-1 items-center text-subTitleText flex items-center gap-1">
                                Credit Usage <span><LuInfo className="text-sm" /></span>
                            </p>

                            <p className="flex items-center gap-1  text-sm font-medium text-textTheme">
                                {/* <HiOutlineBolt className="text-borderActive text-md" /> */}
                                20 credits
                            </p>

                            {/* Tooltip */}
                            {true && (
                                <div className="absolute bottom-[70px] left-0 w-[380px] bg-bgElevated border-[0.5px] border-solid border-borderMuted rounded-xl shadow-xl p-5">

                                    <p className="font-semibold text-textTheme mb-4 flex items-center gap-2">
                                        <span className="px-2 py-1 pt-[5px] bg-bgSkeleton rounded-lg">
                                            <CgCalculator className="text-md text-textTheme" />
                                        </span>
                                        Credit Breakdown
                                    </p>

                                    <p className="text-xs text-cardSmText mb-2">
                                        How this estimate is calculated
                                    </p>

                                    <div className="flex justify-between text-sm mb-6">
                                        <div className="flex items-center gap-2">
                                            <HiOutlineDocumentDuplicate className="text-lg text-textTheme shrink-0" />
                                            <div>
                                                <p className="font-medium text-textTheme">File analysis</p>
                                                <p className="text-cardSmText text-xs">5 credits × 4 files</p>
                                            </div>
                                        </div>
                                        <p className="font-medium text-textTheme">20</p>
                                    </div>

                                    <div className="border-t-[0.5px] border-solid border-b-0 border-r-0 border-l-0 border-borderMuted pt-4 flex justify-between items-center">
                                        <p className="font-medium text-textTheme">Total estimated</p>

                                        <p className="flex items-center gap-1 font-semibold text-textTheme">
                                            <HiOutlineBolt className="text-borderActive" />
                                            20 <span className="text-cardSmText text-xs font-normal">of 240 credits</span>
                                        </p>
                                    </div>

                                    <div
                                        className="absolute left-3 -bottom-[10px]"
                                        style={{
                                            width: 0,
                                            height: 0,
                                            borderLeft: '16px solid transparent',
                                            borderRight: '16px solid transparent',
                                            borderTop: '16px solid var(--bgElevated)'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="relative group">

                          

                            {/* Button — IDENTICAL className to original */}
                            <button className="flex items-center disabled:opacity-50 gap-2 bg-borderActive border-none transition-colors px-6 py-3 rounded-full text-black font-medium">
                                Add 2 Files
                                <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}