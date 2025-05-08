import React from "react";
import { Badge } from "../../../../components/ui/badge";
import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

export const FrameByAnima = () => {
  // Module data for mapping
  const modules = [
    {
      id: 1,
      title: "Module 1: Basic",
      status: "Completed",
      progress: 100,
      image: "https://c.animaapp.com/mae5miq5mElmTn/img/frame-1707481273.png",
      buttonText: "Start",
      buttonVariant: "gradient",
    },
    {
      id: 2,
      title: "Module 2",
      status: "In progress",
      progress: 100,
      image: "https://c.animaapp.com/mae5miq5mElmTn/img/frame-1707481273-1.png",
      buttonText: "Resume",
      buttonVariant: "solid",
    },
    {
      id: 3,
      title: "Module 3",
      status: "Completed",
      progress: 100,
      image: "https://c.animaapp.com/mae5miq5mElmTn/img/frame-1707481273-2.png",
      buttonText: "Resume",
      buttonVariant: "solid",
    },
  ];

  // Task data for mapping
  const tasks = [
    { id: 1, name: "Task Name" },
    { id: 2, name: "Task Name" },
    { id: 3, name: "Task Name" },
    { id: 4, name: "Task Name" },
  ];

  return (
    <section className="flex flex-col w-full items-start gap-3">
      <header className="flex items-center justify-between relative w-full">
        <div className="flex flex-col items-start">
          <div className="px-3 py-2 flex items-center gap-2.5">
            <h1 className="font-['Poppins',Helvetica] text-[32px] leading-8">
              <span className="font-semibold text-[#222224]">Hello, </span>
              <span className="font-semibold text-[#a392f2]">Company Name</span>
            </h1>
          </div>

          <div className="inline-flex items-center pt-2 pb-3 px-3">
            <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-sm">
              Welcome to your CNESS Dashboard, Margaret!
            </p>
          </div>
        </div>
      </header>

      <div className="flex items-start gap-3 w-full">
        {/* Assessment Progress Card */}
        <Card className="flex-1 border border-[#eceef2] rounded-xl">
          <CardHeader className="border-b border-[#0000001a] pb-3">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#ff708a33] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
                <img
                  className="w-6 h-6"
                  alt="Assessment icon"
                  src="https://c.animaapp.com/mae5miq5mElmTn/img/frame-3.svg"
                />
              </div>
              <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                Assessment Progress
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-6 px-3">
            <div className="flex items-center justify-between mb-6">
              <div className="font-['Poppins',Helvetica] font-medium text-[#222224] text-2xl">
                70%
              </div>
              <div className="font-['Poppins',Helvetica] font-medium text-[#9747ff] text-base">
                In Progress
              </div>
            </div>
            <div className="flex items-center gap-1 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-[27px] rounded bg-gradient-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]"
                />
              ))}
              {[5, 6].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-[27px] rounded bg-[#897aff33]"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CIS Score Card */}
        <Card className="w-[197px] border border-[#eceef2] rounded-xl">
          <CardHeader className="border-b border-[#0000001a] pb-3">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#e8cdfd33] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
                <img
                  className="w-[21.71px] h-[21.71px]"
                  alt="CIS Score icon"
                  src="https://c.animaapp.com/mae5miq5mElmTn/img/frame-1.svg"
                />
              </div>
              <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                CIS Score
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-6">
            <div className="relative w-[85px] h-[71px]">
              <div className="relative w-[85px] h-[71px] bg-[url(https://c.animaapp.com/mae5miq5mElmTn/img/ellipse-20.svg)] bg-[100%_100%]">
                <img
                  className="absolute w-[82px] h-[71px] top-0 left-0"
                  alt="Ellipse"
                  src="https://c.animaapp.com/mae5miq5mElmTn/img/ellipse-19.svg"
                />
                <div className="absolute top-[27px] left-6 font-['DM_Sans',Helvetica] font-bold text-primarydark-1 text-[18.2px]">
                  72%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Card */}
        <Card className="flex-1 border border-[#eceef2] rounded-xl">
          <CardHeader className="border-b border-[#0000001a] pb-3">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#e8cdfd33] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
                <img
                  className="w-[21.71px] h-[21.71px]"
                  alt="Badge icon"
                  src="https://c.animaapp.com/mae5miq5mElmTn/img/frame-1.svg"
                />
              </div>
              <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                Badge
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-[17px]">
            <div className="flex items-center gap-[42px]">
              <img
                className="w-[137.96px] h-[61.4px]"
                alt="Badge vector"
                src="https://c.animaapp.com/mae5miq5mElmTn/img/vector.svg"
              />
              <div className="w-[118.96px]">
                <div className="bg-[#9747ff1a] rounded-lg py-1 px-0">
                  <div className="font-['Poppins',Helvetica] font-medium text-[#9747ff] text-sm text-center">
                    Inspired
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Lab Section */}
      <Card className="w-full border border-[#eceef2] rounded-xl">
        <CardHeader className="border-b border-[#0000001a] pb-3">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#a2d69a33] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
              <img
                className="w-[21.71px] h-[21.71px]"
                alt="Learning Lab icon"
                src="https://c.animaapp.com/mae5miq5mElmTn/img/frame-4.svg"
              />
            </div>
            <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
              Learning Lab
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-6 px-3">
          <div className="flex items-center gap-[11px] w-full">
            {modules.map((module) => (
              <Card
                key={module.id}
                className="flex-1 border border-[#eceef2] rounded-xl overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="pt-3 px-3">
                    <div
                      className="relative h-[135px] rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${module.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Badge
                        className={`absolute top-2.5 right-3 ${
                          module.status === "Completed"
                            ? "bg-[#b4b7ff]"
                            : "bg-[#f3ccf3]"
                        }`}
                      >
                        <img
                          className="w-3 h-3 mr-1"
                          alt="Status icon"
                          src={
                            module.status === "Completed"
                              ? "https://c.animaapp.com/mae5miq5mElmTn/img/completed.svg"
                              : "https://c.animaapp.com/mae5miq5mElmTn/img/completed-2.svg"
                          }
                        />
                        {module.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 px-3 pb-6 pt-2.5">
                    <div className="flex items-center gap-1">
                      <div className="flex-1">
                        <div className="h-2.5 bg-white rounded-[80px] border-[0.73px] border-[#eceef2] relative">
                          <div className="w-[108px] h-2.5 bg-[#a392f2] rounded-[80px]" />
                        </div>
                      </div>
                      <div className="font-['Poppins',Helvetica] font-normal text-[#222224] text-xs">
                        {module.progress}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-base">
                        {module.title}
                      </div>
                      <Button
                        className={`w-[70px] h-8 px-3 py-2 rounded-[70.94px] ${
                          module.buttonVariant === "gradient"
                            ? "bg-gradient-to-r from-[rgba(112,119,254,1)] to-[rgba(240,126,255,1)]"
                            : "bg-[#897aff]"
                        }`}
                      >
                        <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs whitespace-nowrap">
                          {module.buttonText}
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Suggested Steps Section */}
      <Card className="w-full bg-[#f7f2ff80] border border-[#eceef2] rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#72dbf233] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
                <img
                  className="w-[21.71px] h-[21.71px]"
                  alt="Next Steps icon"
                  src="https://c.animaapp.com/mae5miq5mElmTn/img/frame.svg"
                />
              </div>
              <h3 className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                Next Suggested Steps
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between px-3 py-[17px] bg-white rounded-lg border border-[#eceef2]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#60c750] rounded-[3px]" />
                    <div className="font-['Rubik',Helvetica] font-normal text-slate-700 text-sm">
                      {task.name}
                    </div>
                  </div>
                  <Button className="w-[70px] h-8 px-3 py-2 rounded-[70.94px] bg-gradient-to-r from-[rgba(112,119,254,1)]">
                    <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs whitespace-nowrap">
                      Start
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
