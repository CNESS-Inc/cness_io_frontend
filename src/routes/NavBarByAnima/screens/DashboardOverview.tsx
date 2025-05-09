import { FrameByAnima } from "./FrameByAnima";
import { HeaderByAnima } from "./HeaderByAnima";
import { NavBarByAnima } from "./NavBarByAnima";

export const DashboardOverview = (): JSX.Element => {
  return (
    <div className="relative w-full min-h-screen bg-[#f9f9f9] flex">
      <NavBarByAnima />
      <div className="flex flex-col flex-1">
        <HeaderByAnima />
        <FrameByAnima />
      </div>
    </div>
  );
};
