import React, { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import actionImgOne from "../../../assets/Group.png";
import actionImgTwo from "../../../assets/Group-1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faCertificate,
  faStar,
  faLockOpen,
  faBook,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

interface CustomCSSProperties extends React.CSSProperties {
  "--stroke-color"?: string;
}

export default function Stepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isJourneyComplete] = useState(false);

  const journeySteps = [
    {
      id: 1,
      steps: [
        {
          icon: faCircleUser,
          title: "Create Profile",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
        {
          icon: faClipboardList,
          title: "Assessment",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
      ],
      lineImg: "https://c.animaapp.com/magbg19buoKwc2/img/line-1.svg",
    },
    {
      id: 2,
      steps: [
        {
          icon: faCertificate,
          title: "Certified",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
        {
          icon: faStar,
          title: "Receive Score",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
      ],
      lineImg: "https://c.animaapp.com/magbg19buoKwc2/img/line-1.svg",
    },
    {
      id: 3,
      steps: [
        {
          icon: faLockOpen,
          title: "Unlock",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
        {
          icon: faBook,
          title: "Learn",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
      ],
      lineImg: "https://c.animaapp.com/magbg19buoKwc2/img/line-1.svg",
    },
  ];

  const totalSteps = journeySteps.length * 2;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const nextStep = prev + 1;

        // Mark current step as completed
        setCompletedSteps((prevCompleted) => {
          if (!prevCompleted.includes(prev)) {
            return [...prevCompleted, prev];
          }
          return prevCompleted;
        });

        if (nextStep >= totalSteps) {
          // Mark all steps as completed including the last one
          setCompletedSteps((prevCompleted) => {
            const allSteps = Array.from({ length: totalSteps }, (_, i) => i);
            return [...new Set([...prevCompleted, ...allSteps])];
          });

          // Delay to make them white (clear background)
          setTimeout(() => {
            setCompletedSteps([]); // Clear all completed steps (white background)
            setActiveStep(-1); // No active step

            setTimeout(() => {
              setActiveStep(0); // Restart the filling from the first step
            }, 1000); // Delay for a smooth restart
          }, 1000); // 1 second white background delay

          return prev; // Keep the last step active until reset
        }

        return nextStep;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [totalSteps]);

  const isStepActive = (stepNumber: number) => {
    return stepNumber === activeStep;
  };

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber) && !isJourneyComplete;
  };

  return (
    <section className="flex flex-col items-center relative w-full">
      <div className="relative w-full overflow-hidden rounded-xl bg-[url('/Blush.png')]">
        <div className="absolute left-0 bottom-0 transform translate-x-0 opacity-50">
          <img
            className="w-full"
            src={actionImgOne}
            alt=""
            role="presentation"
          />
        </div>
        <div className="absolute right-0 bottom-0 transform translate-x-0 opacity-50">
          <img
            className="w-full"
            src={actionImgTwo}
            alt=""
            role="presentation"
          />
        </div>

        <div className="inline-flex flex-col items-center gap-6 md:gap-[78px] px-0 py-6 relative flex-[0_0_auto] z-10 w-full">
          {/* Header section */}
          <div className="inline-flex flex-col items-center gap-[18px] relative flex-[0_0_auto] w-full">
            <div className="relative self-stretch mt-[-1.00px] poppins font-bold text-[#7076fe] text-lg text-center tracking-[3.15px] leading-[normal]">
              ACTIONS
            </div>

            <div className="flex flex-col items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex w-full md:w-[601px] items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
                <h1 className="relative flex-1 mt-[-1.00px] poppins font-semibold text-[#222224] text-3xl md:text-[42px] text-center tracking-[0] leading-[normal]">
                  Our Certification Journey
                </h1>
              </div>
            </div>
          </div>

          {/* Journey map - mobile version */}
          <div className="md:hidden flex flex-col items-center gap-4 w-full">
            {journeySteps.map((group, groupIndex) => (
              <div
                key={`mobile-group-${group.id}`}
                className="flex flex-col items-center gap-4 w-full"
              >
                <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 w-full">
                  {group.steps.map((step, stepIndex) => {
                    const stepNumber = groupIndex * 2 + stepIndex;
                    const active = isStepActive(stepNumber);
                    const completed = isStepCompleted(stepNumber);

                    return (
                      <React.Fragment
                        key={`mobile-step-${group.id}-${stepIndex}`}
                      >
                        <Card
                          className={`flex flex-col w-full sm:w-[140px] items-center gap-3 px-2 py-4 sm:py-6 rounded-[32px] border border-solid border-transparent 
                                ${
                                  active
                                    ? `bg-gradient-to-br ${step.color} `
                                    : completed
                                    ? `bg-gradient-to-br ${step.color}`
                                    : "bg-white"
                                }`}
                        >
                          <CardContent className="p-0 flex flex-col items-center gap-3">
                            <FontAwesomeIcon
                              icon={step.icon}
                              className={`text-[26px] ${
                                active || completed
                                  ? "text-white"
                                  : "text-[#2a2a2a]"
                              }`}
                            />
                            <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                              <div
                                className={`relative flex-1 mt-[-1.00px] jakarta font-medium ${
                                  active || completed
                                    ? "text-white"
                                    : "text-[#2a2a2a]"
                                } text-base text-center tracking-[0] leading-[20.1px]`}
                              >
                                {step.title}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {stepIndex === 0 && (
                          <div className="hidden sm:block">
                            <img
                              className="relative w-[50px] h-0.5 sm:w-[50px] sm:h-0.5"
                              alt="Line"
                              src={group.lineImg}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* {groupIndex < journeySteps.length - 1 && (
                  <div className="h-[50px] w-0.5 bg-gray-300 sm:hidden"></div>
                )} */}
              </div>
            ))}
          </div>

          {/* Journey map - desktop version */}
          <div className="hidden md:block relative w-full max-w-[1026.44px] h-[451px]">
            <div className="relative w-full h-[451px]">
              {/* Connecting lines between steps */}
              <svg
                className="absolute hidden lg:block transition-colors duration-[2000ms] ease-in-out"
                viewBox="0 0 154 123"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={
                  {
                    width: "153px",
                    height: "123px",
                    top: "65px",
                    left: "calc(50% - 100px)",
                    "--stroke-color":
                      isStepActive(1) || isStepCompleted(1)
                        ? "url(#gradient1)"
                        : "#FEFEFE",
                  } as CustomCSSProperties
                }
              >
                <defs>
                  <linearGradient
                    id="gradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#7077FE" />
                    <stop offset="100%" stopColor="#F07EFF" />
                  </linearGradient>
                </defs>
                <path
                  d="M1.50464 1H87.7812C91.6472 1 94.7812 4.13401 94.7812 8V115C94.7812 118.866 97.9152 122 101.781 122H152.657"
                  style={{
                    stroke: "var(--stroke-color)",
                    transition: "stroke 2s ease-in-out", // Changed from 1s to 2s
                  }}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <svg
                className="absolute hidden lg:block transition-colors duration-[2000ms] ease-in-out"
                viewBox="0 0 293 161"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={
                  {
                    width: "250px",
                    height: "150px",
                    top: "240px",
                    left: "calc(50% + 220px)",
                    "--stroke-color":
                      isStepActive(3) || isStepCompleted(3)
                        ? "url(#gradient2)"
                        : "#FEFEFE",
                  } as CustomCSSProperties
                }
              >
                <defs>
                  <linearGradient
                    id="gradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#7077FE" />
                    <stop offset="100%" stopColor="#F07EFF" />
                  </linearGradient>
                </defs>
                <path
                  d="M1 160H33C36.866 160 40 156.866 40 153V112.142V71.2836C40 67.4176 43.134 64.2836 47 64.2836H285C288.866 64.2836 292 61.1496 292 57.2836V1.00001"
                  style={{
                    stroke: "var(--stroke-color)",
                    transition: "stroke 2s ease-in-out", // Changed from 1s to 2s
                  }}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              {/* Journey step groups */}
              <div className="absolute top-0 left-0 w-full flex flex-col lg:flex-row lg:flex-wrap lg:justify-center lg:items-start lg:h-full">
                {/* Group 1 */}
                <div className="flex w-full lg:w-[447px] h-[132px] items-center gap-0.5 lg:absolute lg:top-0 lg:left-0 justify-center">
                  {journeySteps[0].steps.map((step, stepIndex) => {
                    const stepNumber = stepIndex;
                    const active = isStepActive(stepNumber);
                    const completed = isStepCompleted(stepNumber);

                    return (
                      <React.Fragment key={`desktop-step-1-${stepIndex}`}>
                        <Card
                          className={`flex flex-col w-[150px] items-center gap-3 px-2 py-6 rounded-3xl border border-solid border-transparent 
                            transition-colors duration-[2000ms] ease-in-out
                        ${
                          active
                            ? `bg-gradient-to-br ${step.color} `
                            : completed
                            ? `bg-gradient-to-br ${step.color}`
                            : "bg-white"
                        }`}
                        >
                          <CardContent className="p-0 flex flex-col items-center gap-3">
                            <FontAwesomeIcon
                              icon={step.icon}
                              className={`text-[26px] ${
                                active || completed
                                  ? "text-white"
                                  : "text-[#2a2a2a]"
                              }`}
                            />
                            <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                              <div
                                className={`relative flex-1 mt-[-1.00px] jakarta font-medium transition-colors duration-[1000ms] ease-in-out ${
                                  active || completed
                                    ? "text-white"
                                    : "text-[#2a2a2a]"
                                } text-base text-center tracking-[0] leading-[20.1px]`}
                              >
                                {step.title}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {stepIndex === 0 && (
                          <svg
                            width="166"
                            height="2"
                            viewBox="0 0 166 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-[50px] lg:w-[190px] transition-colors duration-[2000ms] ease-in-out ${
                              active
                                ? `bg-gradient-to-br ${step.color} `
                                : completed
                                ? `bg-gradient-to-br ${step.color}`
                                : "bg-white"
                            }`}
                          >
                            <path
                              d="M1.78125 1H164.781"
                              strokeWidth="3"
                              strokeLinecap="round"
                              className={`transition-colors duration-[2000ms] ease-in-out ${
                                active
                                  ? `stroke-${step.color}`
                                  : completed
                                  ? `stroke-${step.color}`
                                  : "stroke-white"
                              }`}
                            />
                          </svg>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Group 2 */}
                <div className="flex w-full lg:w-[472px] h-[132px] items-center gap-0.5 lg:absolute lg:top-[120px] lg:left-[calc(50%+50px)] justify-center mt-8 lg:mt-0">
                  {journeySteps[1].steps.map((step, stepIndex) => {
                    const stepNumber = 2 + stepIndex;
                    const active = isStepActive(stepNumber);
                    const completed = isStepCompleted(stepNumber);

                    return (
                      <React.Fragment key={`desktop-step-2-${stepIndex}`}>
                        <Card
                          className={`flex flex-col w-[140px] items-center gap-3 px-2 py-6 rounded-[32px] border border-solid border-transparent 
                            transition-colors duration-[2000ms] ease-in-out    
                            ${
                              active
                                ? `bg-gradient-to-br ${step.color} `
                                : completed
                                ? `bg-gradient-to-br ${step.color}`
                                : "bg-white"
                            }`}
                        >
                          <CardContent className="p-0 flex flex-col items-center gap-3">
                            <FontAwesomeIcon
                              icon={step.icon}
                              className={`text-[26px] ${
                                active || completed
                                  ? "text-white"
                                  : "text-[#2a2a2a]"
                              }`}
                            />
                            <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                              <div
                                className={`relative flex-1 mt-[-1.00px] jakarta font-medium transition-colors duration-[1000ms] ease-in-out ${
                                  active || completed
                                    ? "text-white"
                                    : "text-[#2a2a2a]"
                                } text-base text-center tracking-[0] leading-[20.1px]`}
                              >
                                {step.title}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {stepIndex === 0 && (
                          <svg
                            width="166"
                            height="2"
                            viewBox="0 0 166 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-[50px] lg:w-[190px] transition-colors duration-[2000ms] ease-in-out  ${
                              active
                                ? `bg-gradient-to-br ${step.color} `
                                : completed
                                ? `bg-gradient-to-br ${step.color}`
                                : "bg-white"
                            }`}
                          >
                            <path
                              d="M1.78125 1H164.781"
                              strokeWidth="3"
                              strokeLinecap="round"
                              className={`transition-colors duration-[2000ms] ease-in-out ${
                                active
                                  ? `stroke-${step.color}`
                                  : completed
                                  ? `stroke-${step.color}`
                                  : "stroke-white"
                              }`}
                            />
                          </svg>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Group 3 */}
                <div className="flex w-full lg:w-[472px] h-[132px] items-center gap-0.5 lg:absolute lg:top-[319px] lg:left-[calc(50%-250px)] justify-center mt-8 lg:mt-0">
                  {journeySteps[2].steps.map((step, stepIndex) => {
                    const stepNumber = 4 + stepIndex;
                    const active = isStepActive(stepNumber);
                    const completed = isStepCompleted(stepNumber);

                    return (
                      <React.Fragment key={`desktop-step-3-${stepIndex}`}>
                        <Card
                          className={`flex flex-col w-[140px] items-center gap-3 px-2 py-6 rounded-[32px] border border-solid border-transparent 
                            transition-colors duration-[2000ms] ease-in-out
                            ${
                              active
                                ? `bg-gradient-to-br ${step.color}`
                                : completed
                                ? `bg-gradient-to-br ${step.color}`
                                : "bg-white"
                            } 
                          order-${journeySteps[2].steps.length - stepIndex}`}
                        >
                          <CardContent className="p-0 flex flex-col items-center gap-3">
                            <FontAwesomeIcon
                              icon={step.icon}
                              className={`text-[26px] ${
                                active || completed
                                  ? "text-white"
                                  : "text-[#2a2a2a]"
                              }`}
                            />
                            <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                              <div
                                className={`relative flex-1 mt-[-1.00px] jakarta font-medium 
                            transition-colors duration-[1000ms] ease-in-out
                                  ${
                                    active || completed
                                      ? "text-white"
                                      : "text-[#2a2a2a]"
                                  } text-base text-center tracking-[0] leading-[20.1px]`}
                              >
                                {step.title}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {stepIndex === 1 && (
                          <svg
                            width="166"
                            height="2"
                            viewBox="0 0 166 2"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`w-[50px] lg:w-[190px] order-1 
                            transition-colors duration-[2000ms] ease-in-out
                              ${
                                isStepActive(4) || isStepCompleted(4)
                                  ? `bg-gradient-to-br ${step.color} `
                                  : "bg-white"
                              }`}
                          >
                            <path
                              d="M1.78125 1H164.781"
                              strokeWidth="3"
                              strokeLinecap="round"
                              className={`transition-colors duration-[2000ms] ease-in-out ${
                                isStepActive(4)
                                  ? `stroke-${step.color}`
                                  : isStepCompleted(4)
                                  ? `stroke-${step.color}`
                                  : "stroke-white"
                              }`}
                            />
                          </svg>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className="bg-[#7077FE] py-2 sm:py-3 lg:py-[16px] px-3 sm:px-4 lg:px-[24px] rounded-full text-xs sm:text-sm lg:text-base w-full sm:w-auto mx-auto sm:mx-0 text-center block hover:bg-[#5f66e5] transition-colors"
            variant="primary"
            withGradientOverlay
            // onClick={() => {
            //   const nextStep = activeStep + 1;
            //   if (nextStep >= totalSteps) {
            //     setActiveStep(0);
            //     setCompletedSteps([]);
            //     setIsJourneyComplete(false);
            //   } else {
            //     setActiveStep(nextStep);
            //     if (!completedSteps.includes(activeStep)) {
            //       setCompletedSteps([...completedSteps, activeStep]);
            //     }
            //     if (nextStep === totalSteps - 1) {
            //       setIsJourneyComplete(true);
            //     }
            //   }
            // }}
          >
            Start Journey
          </Button>
        </div>
      </div>
    </section>
  );
}
