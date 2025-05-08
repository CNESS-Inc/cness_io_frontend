import { BellIcon, SearchIcon, SettingsIcon } from "lucide-react";
import React from "react";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Input } from "../../../../components/ui/input";

export const HeaderByAnima = (): JSX.Element => {
  return (
    <header className="flex w-full items-center justify-between px-8 py-[18px] bg-white border-b border-[#0000001a]">
      <div className="flex items-center justify-between p-3 relative bg-white rounded-xl border border-solid border-slate-300 w-[440px]">
        <Input
          className="border-0 shadow-none p-0 h-auto font-['Open_Sans',Helvetica] text-[#afb1b3] text-sm placeholder:text-[#afb1b3] focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search"
        />
        <SearchIcon className="w-[15px] h-[15px] text-[#afb1b3]" />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex w-[41px] h-[41px] items-center justify-center relative bg-white rounded-xl overflow-hidden border border-solid border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d]">
          <div className="relative">
            <BellIcon className="w-5 h-5 text-gray-500" />
            <div className="w-4 h-4 absolute -top-1 -right-1 bg-[#60c750] rounded-full flex items-center justify-center">
              <span className="font-['Poppins',Helvetica] font-normal text-white text-[8px]">
                03
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-[41px] h-[41px] items-center justify-center relative bg-white rounded-xl overflow-hidden border border-solid border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d]">
          <SettingsIcon className="w-6 h-6 text-gray-500" />
        </div>

        <div className="flex items-center">
          <Avatar className="w-[44.25px] h-[44.25px]">
            <AvatarImage
              src="https://c.animaapp.com/mae5miq5mElmTn/img/ellipse-3279.svg"
              alt="User avatar"
            />
          </Avatar>

          <div className="flex flex-col items-start">
            <div className="px-2 py-0.5 flex items-center">
              <div className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm">
                Company Name
              </div>
            </div>

            <div className="flex items-center px-2 py-0.5">
              <div className="font-['Open_Sans',Helvetica] font-normal text-[#7a7a7a] text-[10px]">
                Margaret
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
