import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";

export const FrameByAnima = (): JSX.Element => {
  // Module data for mapping
  const modules = [
    {
      id: 1,
      image: "https://c.animaapp.com/magbsx1oc1vPoR/img/frame-1707481273.png",
      status: "Completed",
      statusBgColor: "bg-[#b4b7ff]",
      statusIcon: "https://c.animaapp.com/magbsx1oc1vPoR/img/completed-1.svg",
      progress: 100,
      title: "Module 1: Basic",
      buttonText: "Start",
      buttonType: "gradient",
    },
    {
      id: 2,
      image: "https://c.animaapp.com/magbsx1oc1vPoR/img/frame-1707481273-1.png",
      status: "In progress",
      statusBgColor: "bg-[#f3ccf3]",
      statusIcon: "https://c.animaapp.com/magbsx1oc1vPoR/img/completed.svg",
      progress: 100,
      title: "Module 2",
      buttonText: "Resume",
      buttonType: "solid",
    },
    {
      id: 3,
      image: "https://c.animaapp.com/magbsx1oc1vPoR/img/frame-1707481273-2.png",
      status: "Completed",
      statusBgColor: "bg-[#b4b7ff]",
      statusIcon: "https://c.animaapp.com/magbsx1oc1vPoR/img/completed-1.svg",
      progress: 100,
      title: "Module 3",
      buttonText: "Resume",
      buttonType: "solid",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-[1122px] items-start gap-3 mx-auto mt-24">
      {/* Notification Banner */}
      <Card className="w-full bg-[#ffcc000d] border-none">
        <CardContent className="p-2.5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="flex w-6 h-6 items-center gap-[5.71px] p-[5.14px] rounded-xl">
                <img
                  className="w-3 h-3"
                  alt="Alert icon"
                  src="https://c.animaapp.com/magbsx1oc1vPoR/img/frame-3.svg"
                />
              </div>
              <p className="font-['Poppins',Helvetica] text-xs">
                <span className="text-slate-500">
                  Take practice tests to familiarize yourself with the exam
                  format.{" "}
                </span>
                <span className="font-medium text-[#897aff] underline cursor-pointer">
                  Click here
                </span>
              </p>
            </div>
            <div className="w-3 h-3 cursor-pointer">
              <img
                className="w-[7px] h-[7px] mt-0.5 ml-0.5"
                alt="Close"
                src="https://c.animaapp.com/magbsx1oc1vPoR/img/-icons.png"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <div className="px-3 py-0">
            <h1 className="font-['Poppins',Helvetica] text-[32px] leading-8">
              <span className="font-medium text-[#222224]">Hello, </span>
              <span className="font-semibold text-[#a392f2]">Company Name</span>
            </h1>
          </div>
          <div className="px-3 py-2">
            <p className="font-['Open_Sans',Helvetica] text-sm text-[#7a7a7a]">
              Welcome to your CNESS Dashboard, Margaret!
            </p>
          </div>
        </div>
      </div>

      {/* Profile Completion and Journey Cards */}
      <div className="flex w-full gap-3">
        <Card className="flex-1 border-[#eceef2] shadow-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-8">
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
              <div className="flex flex-col items-start gap-5 flex-1">
                <div className="flex flex-col items-start gap-3 w-full">
                  <h2 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-xl">
                    Complete Your Profile
                  </h2>
                  <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-base">
                    Fill out your profile with all the necessary details.
                  </p>
                </div>
                <Button className="w-[126px] h-8 bg-gradient-to-r from-purple to-[#9747FF] rounded-[70.94px] px-8 py-2">
                  <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs">
                    Start
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 border-none bg-gradient-to-br from-purple-light to-[rgba(240,126,255,0.1)] shadow-none">
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
              <Button className="w-[126px] h-8 bg-purple rounded-[70.94px] px-8 py-2">
                <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs">
                  Get Certification
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Row */}
      <div className="flex w-full gap-3">
        {/* Assessment Card */}
        <Card className="w-[554px] border-[#eceef2]">
        <CardContent className="p-2.5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="flex w-6 h-6 items-center gap-[5.71px] p-[5.14px] rounded-xl">
                <img
                  className="w-3 h-3"
                  alt="Alert icon"
                  src="https://c.animaapp.com/magbsx1oc1vPoR/img/frame-3.svg"
                />
              </div>
              <p className="font-['Poppins',Helvetica] text-xs">
                <span className="text-slate-500">
                  Take practice tests to familiarize yourself with the exam
                  format.{" "}
                </span>
                <span className="font-medium text-[#897aff] underline cursor-pointer">
                  Click here
                </span>
              </p>
            </div>
            <div className="w-3 h-3 cursor-pointer">
              <img
                className="w-[7px] h-[7px] mt-0.5 ml-0.5"
                alt="Close"
                src="https://c.animaapp.com/magbsx1oc1vPoR/img/-icons.png"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <div className="px-3 py-0">
            <h1 className="font-['Poppins',Helvetica] text-[32px] leading-8">
              <span className="font-medium text-[#222224]">Hello, </span>
              <span className="font-semibold text-[#a392f2]">Company Name</span>
            </h1>
          </div>
          <div className="px-3 py-2">
            <p className="font-['Open_Sans',Helvetica] text-sm text-[#7a7a7a]">
              Welcome to your CNESS Dashboard, Margaret!
            </p>
          </div>
        </div>

        {/* Hidden suggestion box */}
        <div className="w-[363px] hidden bg-[#ffcc001a] rounded-lg">
          <div className="flex items-center justify-between p-2.5">
            <div className="flex items-center gap-2">
              <div className="flex w-6 h-6 items-center gap-[5.71px] p-[5.14px] rounded-xl"></div>
              <p className="font-['Poppins',Helvetica] font-medium text-[#222224] text-xs">
                Next Suggested Steps
              </p>
            </div>
            <div className="w-3 h-3 overflow-hidden"></div>
          </div>
        </div>
      </div>

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

      {/* Metrics Row */}
      <div className="flex w-full gap-3">
        {/* Assessment Card */}
        <Card className="w-[554px] border-[#eceef2]">
          <CardHeader className="p-3 pb-0">
            <div className="flex items-center justify-between pb-3 border-b border-[#0000001a]">
              <div className="flex items-center gap-3.5">
                <img
                  className="w-8 h-8"
                  alt="Dashboard icons"
                  src="https://c.animaapp.com/magbsx1oc1vPoR/img/dashboard---icons.svg"
                />
                <h3 className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                  Assessement
                </h3>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 pb-6">
            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3.5">
                  <span className="font-['Poppins',Helvetica] font-medium text-[#222224] text-xl">
                    70%
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="font-['Poppins',Helvetica] font-medium text-[#9747ff] text-sm">
                    In Progress
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 w-full">
                <div className="flex-1 h-6 rounded bg-gradient-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]" />
                <div className="flex-1 h-6 rounded bg-gradient-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]" />
                <div className="flex-1 h-6 rounded bg-gradient-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]" />
                <div className="flex-1 h-6 rounded bg-gradient-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]" />
                <div className="flex-1 h-6 bg-[#897aff33] rounded" />
                <div className="flex-1 h-6 bg-[#897aff33] rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CIS Score Card */}
        <Card className="flex-1 border-[#eceef2]">
          <CardHeader className="p-3 pb-0">
            <div className="flex items-center justify-between pb-3 border-b border-[#0000001a]">
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 gap-[7.62px] p-[6.86px] bg-[#e8cdfd33] rounded-2xl flex items-center">
                  <img
                    className="w-[18.29px] h-[18.29px]"
                    alt="Frame"
                    src="https://c.animaapp.com/magbsx1oc1vPoR/img/frame-1.svg"
                  />
                </div>
                <h3 className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                  CIS Score
                </h3>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="relative w-[108px] h-[108px]">
              <div className="relative h-[90px] bg-[url(https://c.animaapp.com/magbsx1oc1vPoR/img/ellipse-20.svg)] bg-[100%_100%]">
                <img
                  className="absolute w-[105px] h-[90px] top-0 left-0"
                  alt="Ellipse"
                  src="https://c.animaapp.com/magbsx1oc1vPoR/img/ellipse-19-1.svg"
                />
                <div className="absolute top-[34px] left-[31px] font-['DM_Sans',Helvetica] font-bold text-primarydark-1 text-[23.1px]">
                  72%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Card */}
        <Card className="flex-1 border-[#eceef2]">
          <CardHeader className="p-3 pb-0">
            <div className="flex items-center justify-between pb-3 border-b border-[#0000001a]">
              <div className="flex items-center gap-3.5">
                <img
                  className="w-8 h-8"
                  alt="Dashboard icons"
                  src="https://c.animaapp.com/magbsx1oc1vPoR/img/dashboard---icons-1.svg"
                />
                <h3 className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                  Badge
                </h3>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-[19.16px]">
            <div className="flex items-center gap-[3.85px] relative">
              <img
                className="relative w-[54.37px] h-[74.59px]"
                alt="Vector"
                src="https://c.animaapp.com/magbsx1oc1vPoR/img/vector-1.svg"
              />
              <div className="relative w-[82px] h-[52.6px] mr-[-4.00px]">
                <div className="relative w-[78px] h-[53px]">
                  <div className="absolute top-0 left-0 font-['Poppins',Helvetica] font-bold text-[#1a237e] text-[23.1px]">
                    CNESS
                  </div>
                  <div className="absolute top-6 left-0 font-['Poppins',Helvetica] font-normal text-[#9747ff] text-[19.3px]">
                    Inspired
                  </div>
                </div>
              </div>
              <img
                className="absolute w-[27px] h-7 top-6 left-[23px]"
                alt="Vector"
                src="https://c.animaapp.com/magbsx1oc1vPoR/img/vector-2.svg"
              />
              <img
                className="absolute w-[15px] h-[15px] top-[30px] left-[29px]"
                alt="Vector"
                src="https://c.animaapp.com/magbsx1oc1vPoR/img/vector.svg"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Lab Section */}
      <Card className="w-full border-[#eceef2]">
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center justify-between pb-3 border-b border-[#0000001a]">
            <div className="flex items-center gap-3.5">
              <div className="flex w-8 h-8 items-center gap-[7.62px] p-[6.86px] bg-[#a2d69a33] rounded-2xl">
                <img
                  className="w-[18.29px] h-[18.29px]"
                  alt="Frame"
                  src="https://c.animaapp.com/magbsx1oc1vPoR/img/frame.svg"
                />
              </div>
              <h3 className="font-['Poppins',Helvetica] font-medium text-[#222224] text-base">
                Learning Lab
              </h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 pb-6">
          <div className="flex gap-[11px] w-full">
            {modules.map((module) => (
              <Card
                key={module.id}
                className="flex-1 border-[#eceef2] overflow-hidden"
              >
                <CardContent className="p-3 pb-6">
                  <div className="flex flex-col gap-2.5 w-full">
                    <div
                      className="relative w-full h-[135px] rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${module.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "50% 50%",
                      }}
                    >
                      <Badge
                        className={`absolute top-2.5 right-3 ${module.statusBgColor} flex items-center gap-2 px-2 py-1 rounded-[100px]`}
                      >
                        <img
                          className="w-3 h-3"
                          alt="Status icon"
                          src={module.statusIcon}
                        />
                        <span className="font-['Poppins',Helvetica] font-medium text-white text-xs">
                          {module.status}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mt-2.5 w-full">
                    <div className="flex items-center gap-1 w-full">
                      <div className="flex-1">
                        <div className="relative w-full h-2.5 bg-white rounded-[80px] border-[0.73px] border-solid border-[#eceef2]">
                          <div className="w-[108px] h-2.5 bg-[#a392f2] rounded-[80px]" />
                        </div>
                      </div>
                      <span className="font-['Poppins',Helvetica] font-normal text-[#222224] text-xs">
                        {module.progress}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <h4 className="font-['Poppins',Helvetica] font-semibold text-[#222224] text-base">
                        {module.title}
                      </h4>
                      {module.buttonType === "gradient" ? (
                        <Button className="w-[70px] h-8 bg-gradient-to-r from-[rgba(112,119,254,1)] to-[rgba(240,126,255,1)] rounded-[70.94px] px-3 py-2">
                          <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs">
                            {module.buttonText}
                          </span>
                        </Button>
                      ) : (
                        <Button className="w-[70px] h-8 bg-[#897aff] rounded-[70.94px] px-3 py-2">
                          <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-xs">
                            {module.buttonText}
                          </span>
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
    </div>
    </div>
  )}
