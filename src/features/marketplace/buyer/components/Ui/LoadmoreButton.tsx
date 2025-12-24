interface LoadMoreButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export default function LoadMoreButton({
  onClick,
  disabled = false,
  label = "Load more",
}: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mt-10">
      <button
        onClick={onClick}
        disabled={disabled}
        className="
          px-6 py-2
          border border-[#7077FE]
          text-[#7077FE]
          rounded-lg
          text-sm font-medium
          hover:bg-[#7077FE]/10
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {label}
      </button>
    </div>
  );
}
