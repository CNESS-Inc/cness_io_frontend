import React from "react";
import { FrameByAnima } from "./sections/FrameByAnima/FrameByAnima";
import { HeaderByAnima } from "./sections/HeaderByAnima/HeaderByAnima";
import { NavBarByAnima } from "./sections/NavBarByAnima";

const DashboadOverview = () => {
  return (
    <div className="bg-[#f9f9f9] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#f9f9f9] w-full max-w-[1440px] flex flex-col">
        <div className="flex">
          <NavBarByAnima />
          <div className="flex-1 flex flex-col">
            <HeaderByAnima />
            <FrameByAnima />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboadOverview;
