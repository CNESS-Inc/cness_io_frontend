import React, { useState, useEffect } from "react";
import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";

export default function Stepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isJourneyComplete, setIsJourneyComplete] = useState(false);
  
  const journeySteps = [
    {
      id: 1,
      steps: [
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-7.svg",
          title: "Create Profile",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-8.svg",
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
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-2.svg",
          title: "Certified",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-4.svg",
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
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame.svg",
          title: "Learn",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-5.svg",
          title: "Unlock",
          color: "from-[#7077FE] to-[#F07EFF]",
        },
      ],
      lineImg: "https://c.animaapp.com/magbg19buoKwc2/img/line-1.svg",
    },
  ];

  const totalSteps = journeySteps.length * 2;

  // Auto-advance steps for demo purposes
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const nextStep = prev + 1;
        
        if (nextStep >= totalSteps) {
          // Journey complete - reset after a delay
          setTimeout(() => {
            setCompletedSteps([]);
            setIsJourneyComplete(false);
          }, 1000);
          return 0;
        }
        
        // Mark current step as completed
        if (!completedSteps.includes(prev)) {
          setCompletedSteps([...completedSteps, prev]);
        }
        
        // Check if journey is complete (all steps done except last one)
        if (nextStep === totalSteps - 1) {
          setIsJourneyComplete(true);
        }
        
        return nextStep;
      });
    }, 2000);
    
    return () => clearInterval(timer);
  }, [completedSteps]);

  const isStepActive = (stepNumber: number) => {
    return stepNumber === activeStep;
  };

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber) && !isJourneyComplete;
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-4 md:p-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
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
        <div className="md:hidden flex flex-col items-center gap-8 w-full">
          {journeySteps.map((group, groupIndex) => (
            <div key={`mobile-group-${group.id}`} className="flex flex-col items-center gap-4 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                {group.steps.map((step, stepIndex) => {
                  const stepNumber = groupIndex * 2 + stepIndex;
                  const active = isStepActive(stepNumber);
                  const completed = isStepCompleted(stepNumber);
                  
                  return (
                    <React.Fragment key={`mobile-step-${group.id}-${stepIndex}`}>
                      <Card className={`flex flex-col w-full sm:w-[140px] items-center gap-3 px-2 py-4 sm:py-6 rounded-[32px] border border-solid border-transparent 
                        ${active ? `bg-gradient-to-br ${step.color} ` : 
                          completed ? `bg-gradient-to-br ${step.color}` : 
                          'bg-white'}`}>
                        <CardContent className="p-0 flex flex-col items-center gap-3">
                          <img
                            className="relative w-8 h-8"
                            alt="Frame"
                            src={step.icon}
                          />
                          <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                            <div className={`relative flex-1 mt-[-1.00px] jakarta font-medium ${
                              active || completed ? 'text-white' : 'text-[#2a2a2a]'
                            } text-base text-center tracking-[0] leading-[20.1px]`}>
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
              
              {groupIndex < journeySteps.length - 1 && (
                <div className="h-[50px] w-0.5 bg-gray-300 sm:hidden"></div>
              )}
            </div>
          ))}
        </div>

        {/* Journey map - desktop version */}
        <div className="hidden md:block relative w-full max-w-[1026.44px] h-[451px]">
          <div className="relative w-full h-[451px]">
            {/* Connecting lines between steps */}
            <img
              className="absolute hidden lg:block"
              alt="Line"
              src="https://c.animaapp.com/magbg19buoKwc2/img/line-1-1.svg"
              style={{
                width: "153px",
                height: "123px",
                top: "65px",
                left: "calc(50% - 100px)",
              }}
            />
            <img
              className="absolute hidden lg:block"
              alt="Line"
              src="https://c.animaapp.com/magbg19buoKwc2/img/line-4.svg"
              style={{
                width: "250px",
                height: "150px",
                top: "240px",
                left: "calc(50% + 220px)",
              }}
            />

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
                      <Card className={`flex flex-col w-[140px] items-center gap-3 px-2 py-6 rounded-[32px] border border-solid border-transparent 
                        ${active ? `bg-gradient-to-br ${step.color} ` : 
                          completed ? `bg-gradient-to-br ${step.color}` : 
                          'bg-white'}`}>
                        <CardContent className="p-0 flex flex-col items-center gap-3">
                          <img
                            className="relative w-8 h-8"
                            alt="Frame"
                            src={step.icon}
                          />
                          <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                            <div className={`relative flex-1 mt-[-1.00px] jakarta font-medium ${
                              active || completed ? 'text-white' : 'text-[#2a2a2a]'
                            } text-base text-center tracking-[0] leading-[20.1px]`}>
                              {step.title}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {stepIndex === 0 && (
                        <img
                          className="w-[50px] lg:w-[190px]"
                          alt="Line"
                          src={journeySteps[0].lineImg}
                        />
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
                      <Card className={`flex flex-col w-[140px] items-center gap-3 px-2 py-6 rounded-[32px] border border-solid border-transparent 
                        ${active ? `bg-gradient-to-br ${step.color} ` : 
                          completed ? `bg-gradient-to-br ${step.color}` : 
                          'bg-white'}`}>
                        <CardContent className="p-0 flex flex-col items-center gap-3">
                          <img
                            className="relative w-8 h-8"
                            alt="Frame"
                            src={step.icon}
                          />
                          <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                            <div className={`relative flex-1 mt-[-1.00px] jakarta font-medium ${
                              active || completed ? 'text-white' : 'text-[#2a2a2a]'
                            } text-base text-center tracking-[0] leading-[20.1px]`}>
                              {step.title}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {stepIndex === 0 && (
                        <img
                          className="w-[50px] lg:w-[190px]"
                          alt="Line"
                          src={journeySteps[1].lineImg}
                        />
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
                      <Card className={`flex flex-col w-[140px] items-center gap-3 px-2 py-6 rounded-[32px] border border-solid border-transparent 
                        ${active ? `bg-gradient-to-br ${step.color} ` : 
                          completed ? `bg-gradient-to-br ${step.color}` : 
                          'bg-white'}`}>
                        <CardContent className="p-0 flex flex-col items-center gap-3">
                          <img
                            className="relative w-8 h-8"
                            alt="Frame"
                            src={step.icon}
                          />
                          <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                            <div className={`relative flex-1 mt-[-1.00px] jakarta font-medium ${
                              active || completed ? 'text-white' : 'text-[#2a2a2a]'
                            } text-base text-center tracking-[0] leading-[20.1px]`}>
                              {step.title}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {stepIndex === 0 && (
                        <img
                          className="w-[50px] lg:w-[190px]"
                          alt="Line"
                          src={journeySteps[2].lineImg}
                        />
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
  );
}