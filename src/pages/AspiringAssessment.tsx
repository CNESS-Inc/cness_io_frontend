import { useState } from "react";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

const AspiringAssessment = () => {
  const navigate = useNavigate();

  const values = [
    "I’m guided by a higher purpose in how I live and act.",
    "My choices reflect my conscious values.",
    "I stay open, keep learning, and inspire positive change.",
    "I strive to avoid harm to people, animals, and the planet.",
    "I consider the ripple effect of my actions on society and the environment.",
    "I give back—through volunteering, kindness, or meaningful contribution.",
    "I’m creating a positive, lasting legacy through my work and life.",
    "I practice conscious habits in my thoughts, actions, and relationships.",
  ];

  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-3 mb-8 px-6 md:px-16 mt-8">
        <img
          src="https://cdn.cness.io/aspiringlogo.svg"
          alt="Aspiring Certification"
          className="w-12 h-12 sm:w-14 sm:h-14"
        />
        <h3 className="font-poppins font-medium text-[22px] sm:text-[24px] leading-[115%] text-gray-900">
          Aspiring Certification
        </h3>
      </div>

      {/* Assessment Section */}
      <section className="bg-white rounded-2xl py-10 sm:py-16 px-4 sm:px-8 md:px-16 border border-gray-100 shadow-sm">
        {/* Heading */}
        <div className="flex items-center mb-6">
          <h3 className="font-poppins font-medium text-[15px] sm:text-[16px] leading-snug text-gray-900">
            Select the values that truly resonate with you — embracing 5 or more
            unlocks your Conscious Aspired Badge.
          </h3>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Checkboxes Grid (responsive) */}
        <ul className="space-y-4 sm:space-y-3">
          {values.map((item, index) => (
            <li
              key={index}
              className="relative flex items-start gap-3 sm:gap-4 pl-1"
            >
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  id={`value-${index}`}
                  checked={selected.includes(item)}
                  onChange={() => handleToggle(item)}
                  className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer appearance-none border border-gray-400 rounded-sm checked:bg-[#22C55E] relative"
                />
                {/* ✅ White tick mark */}
                {selected.includes(item) && (
                  <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      viewBox="0 0 25 25"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )}
              </div>

              <label
                htmlFor={`value-${index}`}
                className="font-openSans text-[14px] sm:text-[16px] leading-[160%] text-gray-800 cursor-pointer"
              >
                {item}
              </label>
            </li>
          ))}
        </ul>

        {/* Selected count */}
        <p className="mt-6 text-xs sm:text-sm text-gray-500">
          Selected: {selected.length} / {values.length}
        </p>
      </section>

      {/* Action Buttons */}
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
    </>
  );
};

export default AspiringAssessment;
