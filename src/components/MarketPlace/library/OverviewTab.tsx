import React from "react";
import { CheckCircle } from "lucide-react";
import { FaRegClock, FaRegCommentAlt, FaRegFileVideo, FaRegKeyboard, FaRegStar } from "react-icons/fa";
import { RiShapesLine } from "react-icons/ri";
import DOMPurify from "dompurify";

interface OverviewTabProps {
    overview: string;
    highlights: string[];
    duration?: string;
    skillLevel?: string;
    language?: string;
    format?: string;
    requirements?: string;
    theme?: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
    overview,
    highlights,
    duration,
    skillLevel,
    language,
    format,
    requirements,
    theme
}) => {
    return (
        <div>
            {/* Overview Section */}
            <h3 className=" w-[86px] h-[27px] text-black font-[Poppins] font-semibold text-[18px] opacity-100 mb-2 
                 flex items-center">
                Overview
            </h3>
            <div className="rich-text-content font-['Open_Sans'] font-normal text-[16px] leading [10] text-black bg-white w-full max-w-[843px] opacity-100 py-2
                               [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                               [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                               [&_li]:my-1 [&_li]:pl-1
                               [&_p]:my-3
                               [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4
                               [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3
                               [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2
                               [&_strong]:font-bold
                               [&_em]:italic
                               [&_u]:underline"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(overview),
                }}
            >
            </div>


            {/* Highlights Section */}
            <h4 className="w-[86px] h-[27px] pt-4 pb-4 text-black font-[Poppins] font-semibold text-[18px] leading-[1] opacity-100 mb-2 flex items-center">
                Highlights:
            </h4>
            <ul className="list-disc list-inside mb-4 text-[16px] font-[Poppins] text-slate-900 space-y-2">
                {highlights?.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <CheckCircle
                            size={20}
                            className="text-green-500 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-gray-700">{highlight}</span>
                    </li>
                ))}
            </ul>

            {/* Details Section */}
            <h4 className="w-[86px] h-[27px] pt-4 pb-4  text-black font-[Poppins] font-semibold text-[18px] leading-[1] opacity-100 mb-2 
                 flex items-center">Details:</h4>
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-[16px] pb-18 font-[Poppins] text-slate-700">
                    {duration && (
                        <>
                            <div className="flex items-center gap-2">
                                <FaRegClock className="text-[16px] text-indigo-400" />
                                <span>
                                    Duration
                                </span>
                            </div>
                            <div>{duration}</div>
                        </>
                    )}
                    {skillLevel && (
                        <>
                            <div className="flex items-center gap-2">
                                <FaRegStar className="text-[16px] text-indigo-400" />
                                <span>
                                    Skill Level
                                </span>
                            </div>
                            <div>{skillLevel}</div>
                        </>
                    )}
                    {language && (
                        <>
                            <div className="flex items-center gap-2">
                                <FaRegCommentAlt className="text-[16px] text-indigo-400" />
                                <span>
                                    Language
                                </span>
                            </div>
                            <div>{language}</div>
                        </>
                    )}
                    {format && (
                        <>
                            <div className="flex items-center gap-2">
                                <FaRegFileVideo className="text-[16px] text-indigo-400" />
                                <span>
                                    Format
                                </span>
                            </div>
                            <div>{format}</div>
                        </>
                    )}
                    {requirements && (
                        <>
                            <div className="flex items-center gap-2">
                                <FaRegKeyboard className="text-[16px] text-indigo-400" />
                                <span>
                                    Requirements
                                </span>
                            </div>
                            <div>{requirements}</div>
                        </>
                    )}
                    {theme && (
                        <>
                            <div className="flex items-center gap-2">
                                <RiShapesLine className="text-[16px] text-indigo-400" />
                                <span>
                                    Theme
                                </span>
                            </div>
                            <div>{theme}</div>
                        </>
                    )}
                    <div>Basic computer with drawing tablet or mouse</div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;