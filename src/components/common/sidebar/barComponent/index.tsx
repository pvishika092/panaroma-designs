import Link from "next/link";

export const BarComponent = ({
    onClick,
    href,
    icon,
    isActive,
    title,
}: any) => {
    return (
        <Link
            onClick={onClick}
            href={href}
            title={title}
            className={`w-full relative group ease-in-out hover:text-white rounded-full p-1 no-underline transition-all duration-300 flex gap-4 ${isActive ? "text-white" : "text-sidebarText"
                }`}
        >
            {/* {isActive && (
        <span
          style={{ left: "-45px" }}
        className="absolute inset-0   flex items-center justify-center">
          <span className="w-10 h-10 rounded-full bg-white blur-lg opacity-30" />
        </span>
      )} */}

            <span className="relative z-10 text-md">{icon}</span>

            {title && (
                <span className="text-xs font-semibold opacity-60 text-left relative z-10">
                    {title}
                </span>
            )}
        </Link>
    );
};
