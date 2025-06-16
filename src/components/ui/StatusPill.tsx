import React, { useEffect, useState } from "react";

type StatusType = "start" | "in_progress" | "completed";

interface StatusPillProps {
  status: StatusType;
  percentage: number;
}

const StatusPill: React.FC<StatusPillProps> = ({ status, percentage }) => {
  const [offset, setOffset] = useState(0);

  const radius = 18;
  const strokeWidth = 3;
  const normalizedRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * normalizedRadius;

  useEffect(() => {
    const progressOffset =
      circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);
  }, [percentage, circumference]);

  const statusLabel: Record<StatusType, string> = {
    start: "Start",
    in_progress: "In Progress",
    completed: "Completed",
  };

  const strokeColor: Record<StatusType, string> = {
    start: "#D1D5DB",
    in_progress: "#FBBF24",
    completed: "#10B981",
  };

  const borderColor = {
    start: "border-gray-300",
    in_progress: "border-yellow-400",
    completed: "border-green-500",
  }[status];

  return (
    <div
      className={`flex items-center gap-3 px-5 py-2 rounded-full bg-white shadow-sm border ${borderColor} transition-colors duration-500`}
    >
      <span className="text-sm font-semibold text-gray-800">
        {statusLabel[status]}
      </span>

      <div className="relative w-8 h-8">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={normalizedRadius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r={normalizedRadius}
            stroke={strokeColor[status]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.6s ease",
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-800">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default StatusPill;
