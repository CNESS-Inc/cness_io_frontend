import { BellIcon, SearchIcon, SettingsIcon } from "lucide-react";
import React from "react";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export const HeaderByAnima = (): JSX.Element => {
  return (
    <header className="flex items-center justify-between px-8 py-[18px] bg-white border-b border-[#0000001a] w-full max-w-[1160px] mx-auto">
      <div className="relative flex items-center w-[440px]">
        <Input
          className="pl-3 pr-10 py-3 text-sm text-[#afb1b3] font-['Open_Sans',Helvetica] rounded-xl border-slate-300"
          placeholder="Search"
        />
        <SearchIcon className="absolute right-3 w-[15px] h-[15px] text-gray-400" />
      </div>

      <div className="flex items-center gap-3">
        <Card className="flex w-[41px] h-[41px] items-center justify-center p-2 rounded-xl border-[0.59px] border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d]">
          <div className="relative">
            <BellIcon className="w-5 h-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 bg-[#60c750] text-white rounded-full">
              <span className="text-[8px] font-['Poppins',Helvetica]">03</span>
            </Badge>
          </div>
        </Card>

        <Card className="flex w-[41px] h-[41px] items-center justify-center p-2 rounded-xl border-[0.59px] border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d]">
          <SettingsIcon className="w-6 h-6 text-gray-600" />
        </Card>

        <div className="flex items-center">
          <Avatar className="w-[44.25px] h-[44.25px]">
            <AvatarImage
              src="https://c.animaapp.com/magbsx1oc1vPoR/img/ellipse-3279.svg"
              alt="User avatar"
            />
          </Avatar>

          <div className="flex flex-col">
            <div className="px-2 py-0.5">
              <div className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm">
                Company Name
              </div>
            </div>

            <div className="px-2 py-0.5">
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
