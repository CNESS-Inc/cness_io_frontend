import { useState } from "react";

interface ResponsiveFilterDrawerProps {
  title?: string;
  children: React.ReactNode;
}

export default function ResponsiveFilterDrawer({
  title = "Filters",
  children,
}: ResponsiveFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      <button
        onClick={() => setOpen(true)}
        className="
          lg:hidden
          flex items-center gap-2
          px-3 py-2
          border border-gray-300
          rounded-lg
          text-sm font-medium
        "
      >
        ☰ {title}
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className="
              absolute right-0 top-0 h-full
              w-[85%] max-w-[320px]
              bg-white p-5 overflow-y-auto
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* Content */}
            {children}
          </div>
        </div>
      )}
    </>
  );
}
