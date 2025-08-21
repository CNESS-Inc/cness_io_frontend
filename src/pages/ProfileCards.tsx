interface ProfileCardProps {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  onFollow: () => void;
  onMessage: () => void;
}

export default function ProfileCard({
  username,
  firstName,
  lastName,
  profilePicture,
}: ProfileCardProps) {
  return (
    <>
      <div className="flex-none bg-white w-full lg:max-w-[100%] max-w-[263px] h-[291px] rounded-[12px] p-[12px] pb-[18px] shadow border border-gray-200 mx-auto">
        {/* Image */}
        <div className="relative w-full h-[209px] xs:h-[160px]">
          <img
            src={profilePicture ? profilePicture : "/profile.png"}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover rounded-[12px]"
          />
          {/* <button
          // onClick={onMaximize}
          className="absolute top-2 right-2 bg-white p-1 rounded-lg shadow hover:bg-gray-100"
          aria-label="Maximize"
        >
          <Maximize size={16} />
        </button> */}
        </div>

        {/* Info + Actions */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm sm:text-base">{`${firstName} ${lastName}`}</p>
            <p className="text-gray-500 text-xs sm:text-sm">@{username}</p>
          </div>
        </div>
      </div>
    </>
  );
}
