"use client";

import { Badge } from "lucide-react";
import Button from "../../ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/DashboardCard";

import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashboardSection() {
  // Data for modules
  const modules = [
    {
      id: 1,
      title: "Module 1: Basic",
      status: "Completed",
      progress: 100,
      image: "https://c.animaapp.com/magahlmqpONVZN/img/frame-1707481273.png",
      buttonText: "Start",
      buttonColor: "bg-gradient-to-r from-[#707AFE] to-[#F07EFF]",
       locked: true,
    },
    {
      id: 2,
      title: "Module 2",
      status: "In progress",
      progress: 100,
      image: "https://c.animaapp.com/magahlmqpONVZN/img/frame-1707481273-1.png",
      buttonText: "Resume",
      buttonColor: "bg-[#897aff]",
       locked: true,
    },
    {
      id: 3,
      title: "Module 3",
      status: "Completed",
      progress: 100,
      image: "https://c.animaapp.com/magahlmqpONVZN/img/frame-1707481273-2.png",
      buttonText: "Resume",
      buttonColor: "bg-[#897aff]",
       locked: true,
    },
  ];

  // Data for tasks
  //const tasks = [
    //{ id: 1, name: "Task Name" },
   // { id: 2, name: "Task Name" },
   // { id: 3, name: "Task Name" },
   // { id: 4, name: "Task Name" },
 // ];
 //for complete your profile 
const percentage = 32;

//Assessment progress
const Assessmentpercentage = 70;
const totalBlocks = 6;
const filledBlocks = Math.floor(Assessmentpercentage / (100 / totalBlocks));
  return (
    <>
   <div className="max-w-[1200px] mx-auto "></div>
<div className=" mx-5   bg-[rgba(255,204,0,0.05)] 5% text-sm text-[#444] px-4 py-2 border-t border-x border-[rgba(255,204,0,0.05)] rounded-t-[10px] rounded-b-[10px] flex items-center justify-between shadow-sm">
  <div className="flex items-center gap-2">
    <span className="text-yellow-500">💡</span>
    <span>
      Take practice tests to familiarize yourself with the exam format.{" "}
      <a href="#" className="text-blue-600 underline">Click here</a>
    </span>
  </div>
  <button className="text-gray-400 hover:text-gray-700 text-lg">×</button>
</div>

      <section className="flex flex-col w-full items-start gap-3 p-4 md:p-5">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2 md:gap-0">
          <div className="flex flex-col items-start">
            <div className="px-2 py-1 md:px-3 md:py-2 flex items-center gap-2.5">
              <h1 className="font-['Poppins',Helvetica] text-2xl md:text-[32px] leading-8">
                <span className="font-semibold text-[#222224]">Hello, </span>
                <span className="font-semibold text-[#a392f2]">
                  Company Name
                </span>
              </h1>
            </div>
            <div className="inline-flex items-center pt-1 pb-2 px-2 md:pt-2 md:pb-3 md:px-3">
              <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-xs md:text-sm">
                Welcome to your CNESS Dashboard, Margaret!
              </p>
            </div>
          </div>
        </header>

 {/* Profile Completion and Journey Cards */}

    <div className="flex w-full gap-3">
        <Card className="flex-1 border-[#eceef2]">
          <CardContent className="p-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-[31.17px]">
                <div className="relative w-[147px] h-[147px]">
                <div className="w-[147px] h-[147px]">
  <CircularProgressbar
    value={percentage}
   
    strokeWidth={10}
    styles={buildStyles({
      rotation: 0.60,
      pathColor: 'url(#gradient)',
      trailColor: '#f5f5f5',
      textColor: '#242731',
       pathTransitionDuration: 0.5,

    })}
  />
  {/* Custom-styled text overlaid manually */}
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="font-['open sans'] font-bold text-[31.51px] text-[#242731]">
      {percentage}%
    </span>
  </div>

  {/* Gradient definition */}
  <svg style={{ height: 0 }}>
    <defs>
      <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
        <stop offset="50%" stopColor="#A162F7" />
        <stop offset="100%" stopColor="#F07EFF" />
      </linearGradient>
    </defs>
  </svg>
</div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-5 flex-1">
                <div className="flex flex-col items-start gap-3 w-full">
                  <h2 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-xl">
                    Complete Your Profile
                  </h2>
                  <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-base">
                    Fill out your profile with all the necessary details.
                  </p>
                </div>
                <div className="h-8 w-full">
<Button className="w-[126px] h-full bg-gradient-to-r from-[rgba(112,119,254,1)] to-[rgba(151,71,255,1)] hover:brightness-120 active:scale-95  transition-all duration-300 rounded-full px-4 py-0 flex justify-center items-center">
  <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-[12px] leading-none tracking-[0px] text-white text-center">
    Start
  </span>
</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 border-none bg-gradient-to-br from-[rgba(151,71,255,0.1)] to-[rgba(240,126,255,0.1)]">
          <CardContent className="p-6">
            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex flex-col items-start gap-3 w-full">
                <h2 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-xl">
                  Start Your Journey
                </h2>
                <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-base">
                  Complete your profile by providing all the essential
                  information to kickstart your journey and obtain
                  certification.
                </p>
              </div>
              <div className="h-8 w-full">
                   <Button className="w-[160px] h-8 bg-[#7077FE] hover:bg-gradient-to-r hover:from-[#7077FE] hover:to-[#F07EFF] transition-all duration-300 rounded-full px-4 py-0 flex justify-center items-center">
    <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-[12px] leading-none tracking-[0px] text-white text-center">
      Get Certification
    </span>
  </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


        {/* Top Cards Row */}
        <div className="flex flex-col md:flex-row items-start gap-3 w-full">
          {/* Assessment Progress Card */}
          <Card className="w-full md:flex-1 border-[#eceef2]">
            <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-2 md:pb-3">
              <div className="flex items-center gap-2 md:gap-3.5">
                <div className="bg-[#ff708a33] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                  <img
                    className="w-5 h-5 md:w-6 md:h-6"
                    alt="Assessment icon"
                    src="https://c.animaapp.com/magahlmqpONVZN/img/frame-2.svg"
                  />
                </div>
                <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm md:text-base">
                  Assessment Progress
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6">
  <div className="flex items-center justify-between mb-3 md:mb-4">
    <div className="font-['Poppins',Helvetica] font-medium text-[#222224] text-xl md:text-2xl">
      {Assessmentpercentage}%
    </div>
    <div className="font-['Poppins',Helvetica] font-medium text-[#9747ff] text-sm md:text-base">
      In Progress
    </div>
  </div>

   {/* Segmented Progress Bar */}
  <div className="flex items-center gap-1 w-full">
    {[...Array(totalBlocks)].map((_, index) => (
      <div
        key={index}
        className={`flex-1 h-5 md:h-[24px] rounded ${
          index < filledBlocks
            ? 'bg-gradient-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]'
            : 'bg-[#EDEAFF]'
        }`}
      />
    ))}
  </div>


            </CardContent>
          </Card>

          {/* CIS Score Card */}
          <div className="relative w-full md:w-[272px] md:h-[199px]">
          <Card className="w-full md:w-[272px] md:h-[199px] border-[#eceef2] ">
            <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-2 md:pb-3">
              <div className="flex items-center gap-2 md:gap-3.5">
                <div className="bg-[#e8cdfd33] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                  <img
                    className="w-4 h-4 md:w-[21.71px] md:h-[21.71px]"
                    alt="CIS Score icon"
                    src="https://c.animaapp.com/magahlmqpONVZN/img/frame-1.svg"
                  />
                </div>
                <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm md:text-base">
                  CIS Score
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex justify-center items-center pt-4 pb-4 md:pt-6 md:pb-6">
              <div className="relative w-16 h-14 md:w-[85px] md:h-[71px]">
                <div className="relative w-full h-full bg-[url(https://c.animaapp.com/magahlmqpONVZN/img/ellipse-20.svg)] bg-[100%_100%]">
                  <img
                    className="absolute w-[calc(100%-3px)] h-full top-0 left-0"
                    alt="Ellipse"
                    src="https://c.animaapp.com/magahlmqpONVZN/img/ellipse-19.svg"
                  />
                  <div className="absolute top-[20px] left-[22px] md:top-[27px] md:left-6 font-['DM_Sans',Helvetica] font-bold text-primarydark-1 text-base md:text-[18.2px]">
                    72%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
{/* 🔒 Lock Overlay */}
  <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/40 rounded-[10px] shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
    <svg
      className="w-8 h-8 text-gray-700 opacity-80 mb-2"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path fill="#4F46E5" d="M10 2a4 4 0 00-4 4v3H5a1 1 0 000 2h10a1 1 0 000-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V6z" />
      <path fill="#4F46E5" d="M4 11a1 1 0 011-1h10a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
    </svg>
    <p className="text-sm text-gray-700 font-medium">
      CIS Score Locked
    </p>
    <p className="text-xs text-gray-500 mt-1">
      
    </p>
  </div>
</div>

{/* Badge Card */}
<div className="relative w-full md:w-[272px] md:h-[199px]">

       <Card className="w-full h-full border-[#eceef2] rounded-[10px] overflow-hidden">

            <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-2 md:pb-3">
              <div className="flex items-center gap-2 md:gap-3.5">
                <div className="bg-[#e8cdfd33] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                  <img
                    className="w-4 h-4 md:w-[21.71px] md:h-[21.71px]"
                    alt="Badge icon"
                    src="https://c.animaapp.com/magahlmqpONVZN/img/frame-1.svg"
                  />
                </div>
                <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm md:text-base">
                  Badge
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-3 md:py-[17px]">
              <div className="flex flex-col md:flex-row items-center justify-around gap-2">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-[42px]">
                  <img
                    className="w-24 md:w-[137.96px] h-auto md:h-[61.4px]"
                    alt="Badge vector"
                    src="https://c.animaapp.com/magahlmqpONVZN/img/vector.svg"
                  />
                  <div className="w-full md:w-[118.96px]">
                    <p className="w-full py-1 bg-[#9747ff1a] rounded-[8px] text-center text-[#9747FF] font-['Poppins',Helvetica] font-medium text-sm">
                      Inspired
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        {/* 🔒 Lock overlay only for badge */}
 <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-[10px] shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
  <svg
    className="w-8 h-8 text-gray-700 opacity-80 mb-2"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path fill="#4F46E5"  d="M10 2a4 4 0 00-4 4v3H5a1 1 0 000 2h10a1 1 0 000-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V6z" />
    <path fill="#4F46E5"  d="M4 11a1 1 0 011-1h10a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
  </svg>
  <p className="text-sm text-gray-700 font-medium">
    Badge Locked
  </p>
  <p className="text-xs text-gray-500 mt-1">

  </p>
</div>
</div>
</div>




        {/* Learning Lab Section */}
        <Card className="w-full border-[#eceef2]">
          <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-2 md:pb-3">
            <div className="flex items-center gap-2 md:gap-3.5">
              <div className="bg-[#a2d69a33] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                <img
                  className="w-4 h-4 md:w-[21.71px] md:h-[21.71px]"
                  alt="Learning Lab icon"
                  src="https://c.animaapp.com/magahlmqpONVZN/img/frame-3.svg"
                />
              </div>
              <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm md:text-base">
                Learning Lab
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-4 md:pt-6 md:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-[11px]">
              {modules.map((module) => (
                
                
                <Card
  key={module.id}
  className="w-full border-[#eceef2] overflow-hidden relative rounded-lg"
                >

                    {/* 🔒 Lock Overlay if locked */}
  {module.locked && (
    <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/40 shadow-inner z-10 flex flex-col items-center justify-center px-4 text-center">
      <svg
        className="w-8 h-8 text-gray-700 opacity-80 mb-2"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fill="#4F46E5"  d="M10 2a4 4 0 00-4 4v3H5a1 1 0 000 2h10a1 1 0 000-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V6z" />
        <path fill="#4F46E5"  d="M4 11a1 1 0 011-1h10a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
      </svg>
      <p className="text-sm text-gray-700 font-medium">Module Locked</p>
      <p className="text-xs text-gray-500 mt-1">
        
      </p>
    </div>
  )}
                  <CardContent className="p-0">
                    <div
                      className="relative h-24 md:h-[135px] rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${module.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Badge
                        className={`absolute top-2 right-2 md:top-2.5 md:right-3 ${
                          module.status === "Completed"
                            ? "bg-[#b4b7ff]"
                            : "bg-[#f3ccf3]"
                        } text-white flex items-center gap-1 px-1.5 py-0.5 md:gap-2 md:px-2 md:py-1 text-xs`}
                      >
                        <img
                          className="w-2 h-2 md:w-3 md:h-3"
                          alt="Status icon"
                          src={`https://c.animaapp.com/magahlmqpONVZN/img/completed${
                            module.status === "In progress" ? "-1" : ""
                          }.svg`}
                        />
                        {module.status}
                      </Badge>
                    </div>
                    <div className="p-2 md:p-3">
                      <div className="flex items-center gap-1 mb-2 md:mb-3">
                        <div className="flex-1">
                          <div className="h-2 bg-white rounded-[80px] border-[0.5px] md:border-[0.73px] border-[#eceef2] relative">
                            <div 
                              className={`h-full ${module.progress === 100 ? 'bg-[#a392f2]' : 'bg-[#a392f2]'} rounded-[80px]`}
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                        </div>
                        <span className="font-['Poppins',Helvetica] font-normal text-[#222224] text-xs">
                          {module.progress}%
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-0">
                        <h3 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-sm md:text-base">
                          {module.title}
                        </h3>
{!module.locked && (
                        <Button
                          className="bg-[#7077FE] py-1 px-2 md:py-[8px] md:px-[20.5px] w-fit rounded-full text-xs md:text-base"
                          variant="primary"
                          withGradientOverlay
                        >
                          {module.buttonText}
                        </Button>
)}


                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/*Next Suggested Steps Section 
        <Card className="w-full bg-[#f7f2ff80] border-[#eceef2]">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3.5">
                <div className="bg-[#72dbf233] w-8 h-8 md:w-[38px] md:h-[38px] flex items-center justify-center rounded-full">
                  <img
                    className="w-4 h-4 md:w-[21.71px] md:h-[21.71px]"
                    alt="Next Steps icon"
                    src="https://c.animaapp.com/magahlmqpONVZN/img/frame-5.svg"
                  />
                </div>
                <h2 className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm md:text-base">
                  Next Suggested Steps
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 py-3 md:py-[17px] bg-white rounded-lg border border-solid border-[#eceef2] gap-2 sm:gap-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#60c750] rounded-[3px]" />
                    <span className="font-['Rubik',Helvetica] font-normal text-slate-700 text-xs md:text-sm">
                      {task.name}
                    </span>
                  </div>
                  <Button
                    className="bg-[#7077FE] py-1 px-3 md:py-[8px] md:px-[20.5px] rounded-full text-xs md:text-base w-fit sm:w-auto text-center"
                    variant="primary"
                    withGradientOverlay
                  >
                    Start
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>*/}
      </section>
    </>
  
  );
}