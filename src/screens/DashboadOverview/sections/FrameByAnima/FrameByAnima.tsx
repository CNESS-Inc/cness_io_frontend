import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

export const FrameByAnima = (): JSX.Element => {
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
    },
    {
      id: 2,
      title: "Module 2",
      status: "In progress",
      progress: 100,
      image: "https://c.animaapp.com/magahlmqpONVZN/img/frame-1707481273-1.png",
      buttonText: "Resume",
      buttonColor: "bg-[#897aff]",
    },
    {
      id: 3,
      title: "Module 3",
      status: "Completed",
      progress: 100,
      image: "https://c.animaapp.com/magahlmqpONVZN/img/frame-1707481273-2.png",
      buttonText: "Resume",
      buttonColor: "bg-[#897aff]",
    },
  ];

  // Data for tasks
  const tasks = [
    { id: 1, name: "Task Name" },
    { id: 2, name: "Task Name" },
    { id: 3, name: "Task Name" },
    { id: 4, name: "Task Name" },
  ];

  return (
    <section className="flex flex-col w-full items-start gap-3">
      {/* Header Section */}
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
    {/* Profile Completion and Journey Cards */}
    <div className="flex w-full gap-3">
        <Card className="flex-1 border-[#eceef2]">
          <CardContent className="p-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-[31.17px]">
                <div className="relative w-[147px] h-[147px]">
                  <div className="relative w-[147px] h-[123px] bg-[url(https://c.animaapp.com/magbsx1oc1vPoR/img/ellipse-20.svg)] bg-[100%_100%]">
                    <img
                      className="absolute w-[29px] h-[98px] top-[25px] left-0"
                      alt="Ellipse"
                      src="https://c.animaapp.com/magbsx1oc1vPoR/img/ellipse-19.svg"
                    />
                    <div className="absolute w-[84px] top-[52px] left-[42px] font-['DM_Sans',Helvetica] font-bold text-primarydark-1 text-[31.5px]">
                      32%
                    </div>
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
                  <Button className="w-[126px] h-full bg-gradient-to-r from-[rgba(112,119,254,1)] to-[rgba(151,71,255,1)] rounded-[70.94px] px-8 py-2">
                    <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs">
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
                <Button className="w-[126px] h-full bg-gradient-to-r from-[rgba(112,119,254,1)] rounded-[70.94px] px-8 py-2">
                  <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs">
                    Get Cerification
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Top Cards Row */}
      <div className="flex items-start gap-3 w-full flex-wrap md:flex-nowrap">
        {/* Assessment Progress Card */}
        <Card className="flex-1 border-[#eceef2]">
          <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-3">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#ff708a33] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
                <img
                  className="w-6 h-6"
                  alt="Assessment icon"
                  src="https://c.animaapp.com/magahlmqpONVZN/img/frame-2.svg"
                />
              </div>
              <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                Assessment Progress
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between mb-4">
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
                  className="flex-1 h-[27px] bg-[#897aff33] rounded"
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CIS Score Card */}
        <Card className="w-full md:w-[197px] border-[#eceef2]">
          <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-3">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#e8cdfd33] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
                <img
                  className="w-[21.71px] h-[21.71px]"
                  alt="CIS Score icon"
                  src="https://c.animaapp.com/magahlmqpONVZN/img/frame-1.svg"
                />
              </div>
              <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                CIS Score
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-6 pb-6">
            <div className="relative w-[85px] h-[71px]">
              <div className="relative w-[85px] h-[71px] bg-[url(https://c.animaapp.com/magahlmqpONVZN/img/ellipse-20.svg)] bg-[100%_100%]">
                <img
                  className="absolute w-[82px] h-[71px] top-0 left-0"
                  alt="Ellipse"
                  src="https://c.animaapp.com/magahlmqpONVZN/img/ellipse-19.svg"
                />
                <div className="absolute top-[27px] left-6 font-['DM_Sans',Helvetica] font-bold text-primarydark-1 text-[18.2px]">
                  72%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Card */}
        <Card className="flex-1 border-[#eceef2]">
          <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-3">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#e8cdfd33] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
                <img
                  className="w-[21.71px] h-[21.71px]"
                  alt="Badge icon"
                  src="https://c.animaapp.com/magahlmqpONVZN/img/frame-1.svg"
                />
              </div>
              <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                Badge
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="py-[17px]">
            <div className="flex items-center justify-around gap-2.5">
              <div className="flex items-center gap-[42px]">
                <img
                  className="w-[137.96px] h-[61.4px]"
                  alt="Badge vector"
                  src="https://c.animaapp.com/magahlmqpONVZN/img/vector.svg"
                />
                <div className="w-[118.96px]">
                  <Badge className="w-full py-1 bg-[#9747ff1a] text-[#9747ff] font-['Poppins',Helvetica] font-medium">
                    Inspired
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Lab Section */}
      <Card className="w-full border-[#eceef2]">
        <CardHeader className="flex-row items-center justify-between border-b border-[#0000001a] pb-3">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#a2d69a33] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
              <img
                className="w-[21.71px] h-[21.71px]"
                alt="Learning Lab icon"
                src="https://c.animaapp.com/magahlmqpONVZN/img/frame-3.svg"
              />
            </div>
            <CardTitle className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
              Learning Lab
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-[11px] flex-wrap md:flex-nowrap">
            {modules.map((module) => (
              <Card
                key={module.id}
                className="flex-1 border-[#eceef2] overflow-hidden"
              >
                <CardContent className="p-0">
                  <div
                    className="relative h-[135px] rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: `url(${module.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <Badge
                      className={`absolute top-2.5 right-3 ${module.status === "Completed" ? "bg-[#b4b7ff]" : "bg-[#f3ccf3]"} text-white flex items-center gap-2 px-2 py-1`}
                    >
                      <img
                        className="w-3 h-3"
                        alt="Status icon"
                        src={`https://c.animaapp.com/magahlmqpONVZN/img/completed${module.status === "In progress" ? "-1" : ""}.svg`}
                      />
                      {module.status}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex-1">
                        <div className="h-2.5 bg-white rounded-[80px] border-[0.73px] border-[#eceef2] relative">
                          <div className="w-[108px] h-2.5 bg-[#a392f2] rounded-[80px]" />
                        </div>
                      </div>
                      <span className="font-['Poppins',Helvetica] font-normal text-[#222224] text-xs">
                        {module.progress}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-base">
                        {module.title}
                      </h3>
                      <Button
                        className={`${module.buttonColor} h-8 px-3 rounded-[70.94px]`}
                      >
                        <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs">
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
      <Card className="w-full bg-[#f7f2ff80] border-[#eceef2]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className="bg-[#72dbf233] w-[38px] h-[38px] flex items-center justify-center rounded-[19px]">
                <img
                  className="w-[21.71px] h-[21.71px]"
                  alt="Next Steps icon"
                  src="https://c.animaapp.com/magahlmqpONVZN/img/frame-5.svg"
                />
              </div>
              <h2 className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                Next Suggested Steps
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between px-3 py-[17px] bg-white rounded-lg border border-solid border-[#eceef2]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#60c750] rounded-[3px]" />
                  <span className="font-['Rubik',Helvetica] font-normal text-slate-700 text-sm">
                    {task.name}
                  </span>
                </div>
                <Button className="bg-gradient-to-r from-[#707AFE] h-8 rounded-[70.94px]">
                  <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs">
                    Start
                  </span>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
