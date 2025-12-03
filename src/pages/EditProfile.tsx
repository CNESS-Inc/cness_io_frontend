import React, { useState } from "react";
import { X } from "lucide-react";
import altprofile from "../assets/altprofile.png";
import { useNavigate } from "react-router-dom";
const UserProfileForm: React.FC = () => {
  // ================================
  // 🔹 FORM STATE
  // ================================
  const [firstName, setFirstName] = useState("Lara");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("@jaydip108");
  const [location, setLocation] = useState("Bangalore, India");
  const [about, setAbout] = useState(
    "Experienced Design, System Validation Engineer with a demonstrated history of working in the semiconductors industry. Skilled in Timing Closure, EDA, Field-Programmable Gate Arrays (FPGA), Physical Design, and SystemVerilog. Strong engineering professional."
  );
const navigate = useNavigate();
//const { id } = useParams();
  const [interests, setInterests] = useState([
    "Climate Action",
    "Renewable Energy",
  ]);

  const [inputValue, setInputValue] = React.useState("");

const addInterest = (value: string) => {
  if (!value.trim()) return;
  if (interests.includes(value.trim())) return; // avoid duplicates

  setInterests([...interests, value.trim()]);
  setInputValue(""); // clear input after adding
};



  const locations = [
    "Bangalore, India",
    "Chennai, India",
    "Delhi, India",
    "Mumbai, India",
  ];

  const professions = ["UI/UX Designer", "Developer", "Engineer", "Artist"];

  const [profession, setProfession] = useState("");

  // REMOVE TAG
  const removeInterest = (tag: string) => {
    setInterests(interests.filter((i) => i !== tag));
  };

  // ================================
  // 🔹 INPUT COMPONENT
  // ================================
  const InputField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-col gap-[6px] w-full">
      <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#CBD5E1] rounded-[7px] h-[43px] px-4 text-[#081021] text-base outline-none"
      />
    </div>
  );

  // ================================
  // 🔹 SELECT COMPONENT
  // ================================
 const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-[6px] w-full">
    <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize">
      {label}
    </label>

    <div className="relative">
      <select
        className="border border-[#CBD5E1] rounded-[7px] h-[43px] px-3 text-[#081021] text-base outline-none w-full appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Custom Black Arrow (exact as screenshot) */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="black">
          <path d="M0 0 L5 6 L10 0 Z" />
        </svg>
      </span>
    </div>
  </div>
);

  // ================================
  // 🔹 TEXTAREA COMPONENT
  // ================================
  const TextAreaField = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="flex flex-col gap-[6px] w-full">
      <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#CBD5E1] rounded-[7px] min-h-[81px] p-3 text-[#081021] text-base outline-none resize-none"
      />
    </div>
  );

  // ================================
  // 🔹 UI LAYOUT
  // ================================
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-full">
      {/* PROFILE IMAGE + EDIT */}
      <div className="flex flex-col items-start gap-2 mb-4">
        <img
          src={altprofile}
          className="w-[77px] h-[77px] rounded-full "
          alt="Profile"
        />
        <button className="text-[#7077FE] font-semibold text-[16px] ml-5">
          Edit
        </button>
      </div>

      {/* ROW 1 */}
      <div className="flex gap-[26px] w-full">
        <InputField label="First name" value={firstName} onChange={setFirstName} />
        <InputField label="Last name" value={lastName} onChange={setLastName} />
      </div>

      {/* ROW 2 */}
      <div className="flex gap-[26px] mt-4">
        <InputField label="User ID" value={userId} onChange={setUserId} />
        <SelectField
          label="Location"
          value={location}
          options={locations}
          onChange={setLocation}
        />
      </div>

      {/* ABOUT */}
      <div className="mt-4">
        <TextAreaField label="About" value={about} onChange={setAbout} />
      </div>

      {/* Interests / Profession */}
      <div className="flex gap-[26px] mt-4">
        {/* INTERESTS */}
        <div className="w-full">
  <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize">
    My Interests
  </label>

  <div className="border border-[#CBD5E1] rounded-[7px] p-2 flex gap-2 flex-wrap items-center">
    
    {/* Existing tags */}
    {interests.map((tag) => (
      <div
        key={tag}
        className="bg-[#ECEAF8] rounded-[5px] px-2 py-[4px] flex items-center gap-1"
      >
        <span className="text-[#081021] text-sm">{tag}</span>
        <X
          className="w-4 h-4 text-[#081021] cursor-pointer"
          onClick={() => removeInterest(tag)}
        />
      </div>
    ))}

    {/* Input for new tag */}
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          addInterest(inputValue);
        }
      }}
      className="flex-grow outline-none text-sm text-[#081021] bg-transparent"
      placeholder="Type and press Enter"
    />
  </div>
</div>

        {/* PROFESSION */}
        <SelectField
          label="My Profession"
          value={profession}
          options={professions}
          onChange={setProfession}
        />
      </div>

      {/* ACTION BUTTONS */}
     <div className="flex justify-end w-full mt-6 gap-3">

  {/* BACK BUTTON */}
<button
  onClick={() => navigate(`/dashboard/Profile`)}
  className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] 
  text-black bg-white hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] 
  hover:text-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out 
  w-full sm:w-auto flex justify-center"
  type="button"
>
                        Back
                      </button>
                      <button
                       
                        className="font-['Plus Jakarta Sans'] text-[14px] text-white w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out bg-[#7077FE]"
                        type="submit"
                        
                      >
                       Save
                      </button>
</div>
    </div>
  );
};

export default UserProfileForm;
