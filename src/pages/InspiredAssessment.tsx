import React, { useState } from "react";
import { Plus, Minus, Loader2, X } from "lucide-react";
import cloud from "../assets/cloud-add.svg";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
const InspiredAssessment = () => {
   const navigate = useNavigate();
  const sections = [
    {
      id: 1,
      title: "Mission & Vision",
      reflection:
        "Your mission and vision are how you express who you are through what you do. It reflects what gives your life meaning, what inspires you, and how your work or actions align with your higher purpose.",
      items: [
        "Share your mission statement or vision document.",
        "Provide a short written note on how your vision inspires your daily work.",
        "Upload a short video explaining your purpose or the positive change you seek to create.",
      ],
    },
    {
      id: 2,
      title: "Client / Customer / Community Relationships",
      reflection:
        "This section reflects how you serve others — with reliability, fairness, kindness, and openness. It shows how you bring values into your professional or service interactions.",
      items: [
        "Client appreciation message, testimonial, or thank-you email.",
        "Photo with clients, students, or community members that shows connection or collaboration.",
        "Sample of communication such as a brochure, message, or email that represents your value-driven approach.",
        "Short written note on how you ensure fairness, punctuality, and empathy in your service.",
        "Optional short video (30–60 seconds) speaking about what 'serving with heart' means to you.",
      ],
    },
    {
      id: 3,
      title: "Communities & Charities",
      reflection:
        "Show how you give back or contribute to communities or causes aligned with your values.",
      items: [
        "Upload proof of volunteer work or charity involvement.",
        "Share any recognition or testimonials from community initiatives.",
        "Upload photos or documents that show your contribution or participation.",
      ],
    },
    {
      id: 4,
      title: "Vision & Legacy",
      reflection:
        "This section captures your commitment to creating a lasting, positive legacy through your conscious actions.",
      items: [
        "Write a brief statement on the legacy you wish to leave behind.",
        "Upload an example of your long-term goals or sustainability efforts.",
      ],
    },
    {
      id: 5,
      title: "Leadership Best Practices",
      reflection:
        "This section highlights the examples of leadership practices that demonstrate awareness, fairness, and empowerment.",
      items: [
        "Share a leadership example where you empowered others.",
        "Provide documentation of best practices in action.",
         "Client appreciation message, testimonial, or thank-you email.",
        "Photo with clients, students, or community members that shows connection or collaboration.",
        "Sample of communication such as a brochure, message, or email that represents your value-driven approach.",
      ],
    },
  ];
const [expanded, setExpanded] = useState<number[]>([1]);
  const [checked, setChecked] = useState<Record<number, string[]>>({});
  const [uploads, setUploads] = useState<
    Record<number, { name: string; size: string; status: string }[]>
  >({});

 const toggleSection = (id: number) => {
  setExpanded((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
};

  const handleCheck = (sectionId: number, item: string) => {
    setChecked((prev) => {
      const current = prev[sectionId] || [];
      return {
        ...prev,
        [sectionId]: current.includes(item)
          ? current.filter((i) => i !== item)
          : [...current, item],
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, sectionId: number) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map((file) => ({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB of 120 KB`,
        status: "Uploading...",
      }));
      setUploads((prev) => ({
        ...prev,
        [sectionId]: [...(prev[sectionId] || []), ...newFiles],
      }));
    }
  };

  const handleRemove = (sectionId: number, fileName: string) => {
    setUploads((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId].filter((f) => f.name !== fileName),
    }));
  };

  return (
    <>
      {/* Page Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-6 text-center sm:text-left">
        <img
          src="https://cdn.cness.io/inspiredlogo.svg"
          alt="Inspired Certification"
          className="w-15 h-15"
        />
        <h3 className="font-[poppins] font-medium text-[24px] leading-[115%] text-gray-900">
          Inspired Certification
        </h3>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
<div key={section.id} className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleSection(section.id)}
  className="w-full flex justify-between items-center px-4 sm:px-6 py-5 sm:py-6 text-left"
            >
              <span className="font-[poppins] font-semibold text-[18px] sm:text-[18px] leading-[100%] text-gray-900">
                {section.id}. {section.title}
              </span>
              <div className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm">
{expanded.includes(section.id) ? (
  <Minus className="text-gray-500" />
) : (
  <Plus className="text-gray-500" />
)}
              </div>
            </button>

            {/* Expanded Section */}
           {expanded.includes(section.id) && (

<div className="border-t border-[#E0E0E0] px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 sm:gap-8">
                {/* Text and Checkboxes */}
                
  <div className="flex-1">
                  <p className="font-[poppins] font-medium text-[16px] leading-[140%] text-gray-800 mb-1">
                    Conscious Reflection:
                  </p>
                  <p className="font-['Open_Sans'] font-normal text-[14px] leading-[120%] text-[#6E6E6E] mb-4">
                    {section.reflection}
                  </p>
                  <p className="font-[poppins] font-medium text-[16px] leading-[140%] text-gray-800 mb-2">
                    Choose the practical examples to share with us{" "}
                    <span className="font-['Open_Sans'] font-normal text-[12px] leading-[140%] text-gray-600">
                      (choose at least one option)
                    </span>
                  </p>

<ul className="space-y-3 px-4 sm:px-8 mb-6 mt-5">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3 relative">
                        <input
                          type="checkbox"
                          id={`section-${section.id}-item-${idx}`}
                          checked={checked[section.id]?.includes(item) || false}
                          onChange={() => handleCheck(section.id, item)}
                          className="w-5 h-5 cursor-pointer appearance-none border border-gray-400 rounded-sm checked:bg-[#22C55E] relative"
                        />
                        <label
                          htmlFor={`section-${section.id}-item-${idx}`}
                          className="font-['Open_Sans'] font-normal text-[16px] leading-[140%] text-[#1E1E1E] cursor-pointer"
                        >
                          {item}
                        </label>

                        {checked[section.id]?.includes(item) && (
                          <span className="absolute left-[1px] top-[2px] w-5 h-5 flex items-center justify-center pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 h-3.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="white"
                              strokeWidth="3"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                                {/* ✅ paste below this */}
{section.id === 5 && (
    <>
  <p className="mt-20 text-[12px] font-['Open_Sans'] leading-[140%] text-gray-400 px-5">optional</p>
  <div className="mt-2 w-full border border-dashed border-[#E5E5E5] rounded-[25px] py-5 px-6 flex items-center justify-between bg-[#FCFCFC]"
     style={{ borderWidth: "3px" }}>
    <p className="text-[14px] font-['poppins'] font-medium leading-[140%] text-transparent bg-clip-text bg-gradient-to-r from-[#7077FE] to-[#C56BFE]">
      Share the best practices that reflect who you truly are & let your True Profile inspire the world.
    </p>
    <button className="ml-4 px-5 py-1.5 rounded-full border border-gray-300 bg-white text-[14px] font-medium text-gray-700 hover:bg-gray-100 transition-all">
      Add
    </button>
  </div>
  </>
)}
                </div>
 

                {/* Upload Box - at the end */}
<div className="w-full max-w-[336px] min-h-[420px] rounded-[30px] shadow-sm border border-gray-200 bg-white flex flex-col justify-between py-5 px-5 mx-auto sm:mx-0">
                    <div>
                      <h4 className="font-[poppins] font-semibold text-[16px] text-gray-900 mb-1">
                        Upload (Practical Examples)
                      </h4>
                      <p className="font-['Open_Sans'] text-[14px] text-gray-400 mb-5">
                        Select and upload the files of your choice
                      </p>

                      <div
                        className="text-center py-6 px-4 rounded-[26px] border-2 border-[#CBD0DC] border-dashed flex flex-col items-center justify-center cursor-pointer bg-[#FAFAFA] mb-6 gap-[10px]"
                        style={{ borderWidth: "3px" }}
                      >
                        <div className="flex flex-col items-center pb-4">
                          <img src={cloud} alt="Upload" className="w-10 opacity-80" />
                          <h4 className="pt-2 text-[14px] font-[poppins] font-medium text-[#292D32] leading-[100%]">
                            Choose a file or drag & drop it here
                          </h4>
                          <p className="pt-1 font-['Open_Sans'] text-[12px] text-[#A9ACB4]">
                            JPEG, PNG, PDF, & MP4 formats, up to 50MB
                          </p>
                        </div>

                        <input
                          type="file"
                          id={`uploadFiles-${section.id}`}
                          className="hidden"
                          multiple
                          accept=".jpg,.jpeg,.png,.pdf,.mp4"
                          onChange={(e) => handleFileChange(e, section.id)}
                        />
                        <label
                          htmlFor={`uploadFiles-${section.id}`}
                          className="block px-8 py-2.5 rounded-full text-[#54575C] text-[14px] font-[plus-jakarta-sans] font-medium border border-[#CBD0DC] hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          Browse File
                        </label>
                      </div>
                    </div>

                    {/* Uploaded Files */}
                    <div className="space-y-3 overflow-y-auto pr-1">
                      {uploads[section.id]?.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-[#FFECEC] rounded-md">
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                alt="PDF"
                                className="w-4 h-4"
                              />
                            </div>
                            <div>
                              <p className="font-['Open_Sans'] text-[14px] text-gray-800">
                                {file.name}
                              </p>
                              <p className="font-['Open_Sans'] text-[12px] text-gray-500">
                                {file.size}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 text-[#7077FE] animate-spin" />
                            <p className="font-['Open_Sans'] text-[12px] text-gray-500">
                              {file.status}
                            </p>
                            <X
                              className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                              onClick={() => handleRemove(section.id, file.name)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
   
                  </div>

                  
                </div>
             

            )}

         
          </div>

          
        ))}

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-8 px-4 sm:px-8 md:px-16">
        <Button
          onClick={() => navigate("/dashboard/assesmentcertification")}
          variant="white-outline"
          className="font-plusJakarta text-[14px] sm:text-[15px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
            hover:bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
            shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
          type="button"
        >
          Back
        </Button>

        <Button
          variant="gradient-primary"
          className="font-openSans text-[14px] sm:text-[15px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
          type="submit"
        >
          Submit
        </Button>
      </div>
      </div>
    </>
  );
};

export default InspiredAssessment;
