import { Card, CardContent } from "../../NavBarByAnima/components/ui/card";
import { Separator } from "../../NavBarByAnima/components/ui/separator";
import { WireframeByAnima } from "./WireframeByAnima";
import { FrameByAnima } from "./FrameByAnima";
import { FrameWrapperByAnima } from "./FrameWrapperByAnima";
import { DesktopByAnima } from "./DesktopByAnima";
import { DivWrapperByAnima } from "./DivWrapperByAnima";
import { DivByAnima } from "./DivByAnima";
import { SectionComponentNodeByAnima } from "./SectionComponentNodeByAnima";
import { Frame1ByAnima } from "./Frame1ByAnima";
export const CnessFinalVersion = (): JSX.Element => {
  // Define data for each section to enable mapping
  const sections = [
    { id: "wireframe", component: WireframeByAnima },
    { id: "frame", component: FrameByAnima },
    { id: "frameWrapper", component: FrameWrapperByAnima },
    { id: "desktop", component: DesktopByAnima },
    { id: "divWrapper", component: DivWrapperByAnima },
    { id: "div", component: DivByAnima },
    { id: "sectionComponentNode", component: SectionComponentNodeByAnima},
    { id: "frame1", component: Frame1ByAnima},
  ];

  // return (
  //   <main className="bg-white flex flex-row justify-center w-full">
  //     <div className="bg-white w-full max-w-[1440px]">
  //       <div className="flex flex-col w-full items-start">
  //         {sections.map((section) => (
  //           <Card key={section.id} className="w-full border-none shadow-none">
  //             <CardContent className="p-0">
  //               <section id={section.id} className="w-full">
  //                 {/* Placeholder for section content */}
  //                 <div className="min-h-[200px] flex items-center justify-center">
  //                   <span className="text-lg text-gray-500">
  //                     <section.component key={section.id} />
  //                   </span>
  //                 </div>
  //                 <Separator className="my-4" />
  //               </section>
  //             </CardContent>
  //           </Card>
  //         ))}
  //       </div>
  //     </div>
  //   </main>
  // );
  return (
    <>
      {sections.map(({ id, component: Section }) => (
        <Section key={id} />
      ))}
    </>
  );
};
