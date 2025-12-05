import React from 'react'
import edit from '../assets/Edit.svg';
import { useState, useRef } from 'react';
import { CirclePlus } from 'lucide-react';
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface DayType {
  name: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}


const EditDirectory: React.FC = () => {

const [mode, setMode] = useState("main");  
const [contactNumber, setContactNumber] = useState("");





const [days, setDays] = useState<DayType[]>([  { name: "Monday", isOpen: true, openTime: "10:30", closeTime: "22:30" },
  { name: "Tuesday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
  { name: "Wednesday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
  { name: "Thursday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
  { name: "Friday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
  { name: "Saturday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
  { name: "Sunday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
]);


const toggleDay = (index: number) => {
  setDays(prev => {
    const updated = [...prev];
    updated[index].isOpen = !updated[index].isOpen;
    return updated;
  });
};

const updateTime = (index: number, key: "openTime" | "closeTime", value: string) => {
  setDays(prev => {
    const updated = [...prev];
    updated[index][key] = value; // value is always 'HH:mm'
    return updated;
  });
};

const fileInputRef = useRef<HTMLInputElement>(null);

const handleAddImageClick = () => {
  fileInputRef.current?.click(); // opens file picker
};





  return (
    <main className="flex-1 p-4 flex flex-col items-end gap-4">
<div className="w-full bg-white rounded-xl p-4 flex gap-[90px]">
  <div className="flex-1 flex flex-col gap-4">
    
    {/* SECTION TITLE */}
    <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg">
      Basic Information
    </h2>

    <div className="flex flex-col gap-3">

      {/* ---------------- ROW 1 ---------------- */}
      <div className="flex gap-8">
        
        {/* Business Name */}
        <div className="w-[530px] flex flex-col gap-1.5">
          <label className="text-[#64748B] font-[Poppins] font-medium">
            Business Name
          </label>
          <input
            type="text"
            defaultValue="The White House"
            className="h-[43px] border border-[#CBD5E1] rounded-lg px-3 
                       text-[#081021] font-semibold text-base outline-none"
          />
        </div>

        {/* Services Select + Tags */}
        <div className="w-[530px] flex flex-col gap-1.5">
          <label className="text-[#64748B] font-[Poppins] font-medium">
            Services
          </label>

          <div className="h-[43px] border border-[#CBD5E1] rounded-lg flex items-center gap-2 px-3">

            {/* TAG 1 */}
            <div className="bg-[#ECEAF8] rounded-md px-3 py-1 flex items-center gap-1.5">
              <span className="text-[#081021] font-semibold text-base">Climate Action</span>
         <button className="w-3 h-3 text-[#081021] flex items-center justify-center">
✕</button>
            </div>

            {/* TAG 2 */}
            <div className="bg-[#ECEAF8] rounded-md px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-[#081021] font-semibold text-base">Climate Action</span>
          <button className="w-3 h-3 text-[#081021] flex items-center justify-center">
✕</button>
            </div>

            {/* Dropdown */}
         <div className="relative ml-auto">
  <select
    className="
      appearance-none      /* hides default arrow */
      text-[#64748B]
      outline-none 
      bg-transparent
      pr-6                  /* space for the arrow */
      cursor-pointer
    "
  >
    {/* <option>Add Service</option>
    <option>Climate Action</option>
    <option>Energy</option>
    <option>Research</option> */}
  </select>

  {/* Custom arrow */}
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="black"
    className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
  >
    <path d="M0 0 L5 6 L10 0 Z" />
  </svg>
</div>
          </div>
        </div>

      </div>

      {/* ---------------- ROW 2 ---------------- */}
      <div className="flex gap-8">

        {/* Location */}
        <div className="w-[530px] flex flex-col gap-1.5">
          <label className="text-[#64748B] font-[Poppins] font-medium">
            Location
          </label>
        <div className="relative w-[530px]">
  <select
    defaultValue="Bangalore, India"
    className="
      h-[43px] w-full border border-[#CBD5E1] rounded-lg px-3
      text-[#081021] font-semibold text-base
      outline-none bg-white appearance-none
    "
  >
    <option> India</option>
    <option> USA</option>
    <option> UK</option>
    <option> UAE</option>
    <option> Australia</option>
  </select>

  {/* Custom dropdown arrow */}
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="#081021"
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
  >
    <path d="M0 0 L5 6 L10 0 Z" />
  </svg>
</div>

        </div>

        {/* Contact */}
        <div className="w-[530px] flex flex-col gap-1.5">
  <label className="text-[#64748B] font-[Poppins] font-medium">
    Contact
  </label>

  <PhoneInput
    value={contactNumber}
    onChange={(value) => setContactNumber(value)}
    defaultCountry="us"
    forceDialCode
    placeholder="Enter contact number"
    className="w-full border border-[#CBD5E1] rounded-lg"
    inputClassName="w-full px-3 py-2 focus:outline-none"
    countrySelectorStyleProps={{
      buttonClassName: "border-r border-gray-300 px-3",
      dropdownStyleProps: { className: "z-50" }
    }}
  />
</div>
      </div>

      {/* ---------------- ROW 3 ---------------- */}
      <div className="flex gap-8">

        {/* Website */}
        <div className="w-[530px] flex flex-col gap-1.5">
          <label className="text-[#64748B] font-[Poppins] font-medium">
            Website
          </label>
          <input
            type="text"
            defaultValue="www.whitehouse.com"
            className="h-[43px] border border-[#CBD5E1] rounded-lg px-3 
                       text-[#081021] font-semibold text-base outline-none"
          />
        </div>

        {/* Email */}
        <div className="w-[530px] flex flex-col gap-1.5">
          <label className="text-[#64748B] font-[Poppins] font-medium">
            Email
          </label>
          <input
            type="email"
            defaultValue="white@gmail.com"
            className="h-[43px] border border-[#CBD5E1] rounded-lg px-3 
                       text-[#081021] font-semibold text-base outline-none"
          />
        </div>

      </div>

      {/* ---------------- ABOUT ---------------- */}
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-[#64748B] font-[Poppins] font-medium">About</label>
        <textarea
          defaultValue="Experienced Design, System Validation Engineer with a demonstrated history of working in the semiconductors industry. Skilled in Timing Closure, EDA, Field-Programmable"
          className="h-[94px] border border-[#CBD5E1] rounded-lg p-3 text-[#081021] 
                     font-semibold text-base leading-[26px] outline-none resize-none"
        />
      </div>

      {/* ---------------- LOGO UPLOAD ---------------- */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[#64748B] font-[Poppins] font-medium">Logo</label>

        <div className="flex items-center gap-4">
          <label className="w-[82px] h-[82px] bg-white border-2 border-dashed border-[#D5D5D5] 
                           rounded-full flex items-center justify-center cursor-pointer">
            <input type="file" className="hidden" accept=".jpg,.jpeg,.png" />
            <span className="text-[#7077FE] text-2xl">+</span>
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-[#7077FE] font-semibold text-base cursor-pointer">
              Upload your logo here
            </span>
            <span className="text-[#64748B] text-sm">
              Accepted file types: .jpg, .jpeg, .png
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

      
      { /* Photos Section */}
      <div className="w-full bg-white border border-[#F7F7F7] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[#081021] font-[Poppins] font-semibold text-xl">Photos</h2>
      </div>
      
      <div className="flex gap-3">
        {/* Photo 1 */}
      <div className="w-[267px] h-[184px] bg-[#F8F0F0] rounded-lg relative overflow-hidden">
  <img
    src="https://static.codia.ai/image/2025-12-04/uMYZaG1cTX.png"
    alt="Photo 1"
    className="w-full h-full object-cover"
  />

  {/* EDIT ICON */}
  <div
    className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center cursor-pointer"
    onClick={handleAddImageClick}
  >
    <img src={edit} alt="Edit" className="w-10 h-10" />
  </div>
</div>

        {/* Photo 2 */}
        <div className="w-[267px] h-[184px] bg-[#F8F0F0] rounded-lg relative overflow-hidden">
          <img src="https://static.codia.ai/image/2025-12-04/uyEoYvcw9U.png" alt="Photo 2" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center">
            <img src={edit} alt="Edit" className="w-10 h-10" />
          </div>
        </div>

        {/* Photo 3 */}
        <div className="w-[267px] h-[184px] bg-[#F8F0F0] rounded-lg relative overflow-hidden">
          <img src="https://static.codia.ai/image/2025-12-04/CG7kH5kVN6.png" alt="Photo 3" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center">
            <img src={edit} alt="Edit" className="w-10 h-10" />
          </div>
        </div>

        {/* Add Photo */}
       <div
    className="w-[267px] h-[184px] bg-white border-2 border-dashed border-[#D5D5D5] 
               rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer"
    onClick={handleAddImageClick}
  >
    <div className="w-5 h-5">
      <CirclePlus size={20} color="#7077FE" />
    </div>

    <div className="flex flex-col items-center">
      <span className="text-[#7077FE] font-semibold text-xs">Add image</span>
      <span className="text-[#64748B] text-xs">Maximum 3 mb</span>
    </div>

    {/* Hidden file input */}
    <input
      type="file"
      ref={fileInputRef}
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          console.log("Selected image:", file);
          // 👉 do whatever you want with the file here
        }
      }}
    />
  </div>

      </div>
    </div>
{ /* Operating Hours Section */}
 <div className="w-full bg-white rounded-xl p-4">
  <h2 className="text-[#081021] font-semibold text-lg mb-4">
    Operations Information
  </h2>

  {/* =================== RADIO BUTTONS =================== */}
  <div className="flex flex-col gap-3 mb-6">

    {/* Opens with main hours */}
    <div className="flex items-center gap-2 cursor-pointer"
         onClick={() => setMode("main")}>
      <div className={`w-3 h-3 rounded-full border-2 
          ${mode === "main" ? "bg-[#7077FE] border-[#7077FE]" : "border-gray-300"}`}
      ></div>
      <div>
        <div className="font-semibold text-[#081021]">Opens with main hours</div>
        <div className="text-[#64748B] text-sm">Show when your business is open</div>
      </div>
    </div>

    {/* Temporary closed */}
    <div className="flex items-center gap-2 cursor-pointer"
         onClick={() => setMode("temporary")}>
      <div className={`w-3 h-3 rounded-full border-2 
          ${mode === "temporary" ? "bg-[#7077FE] border-[#7077FE]" : "border-gray-300"}`}
      ></div>
      <div>
        <div className="font-semibold text-[#081021]">Temporary closed</div>
        <div className="text-[#64748B] text-sm">Show your business will open again</div>
      </div>
    </div>

    {/* Permanently closed */}
    <div className="flex items-center gap-2 cursor-pointer"
         onClick={() => setMode("permanent")}>
      <div className={`w-3 h-3 rounded-full border-2 
          ${mode === "permanent" ? "bg-[#7077FE] border-[#7077FE]" : "border-gray-300"}`}
      ></div>
      <div>
        <div className="font-semibold text-[#081021]">Permanently closed</div>
        <div className="text-[#64748B] text-sm">Your business no longer exists</div>
      </div>
    </div>
  </div>

  {/* =================== CONDITIONAL SECTION =================== */}

{mode === "main" && (
  <div className="grid grid-cols-3 gap-x-20 gap-y-12">

    {days.map((day, index) => (
      <div key={index} className="flex flex-col gap-1">

        {/* TOP ROW: Day Name + Labels */}
        <div className="flex items-center gap-10">

          {/* DAY NAME */}
          <span className="text-[14px] font-['open_sans'] font-semibold text-[#081021] w-24">
            {day.name}
          </span>

          {/* LABELS ROW */}
          <div className="flex items-center gap-10">
            <span className="text-[14px] font-['open_sans'] text-[#64748B] w-[120px]">Open at</span>
            <span className="text-[14px] font-['open_sans'] text-[#64748B] w-[120px]">Closes at</span>
          </div>
        </div>

        {/* SECOND ROW: Checkbox + Inputs */}
        <div className="flex items-center gap-10">

          {/* CHECKBOX */}
          <div className="flex items-center gap-2 w-24">
            <input
              id={`day-${index}`}
              type="checkbox"
              checked={day.isOpen}
              onChange={() => toggleDay(index)}
              className="w-4 h-4 accent-[#7077FE]"
            />
            <label
              htmlFor={`day-${index}`}
              className="text-[12px] font-['open_sans'] text-[#64748B] cursor-pointer"
            >
              {day.isOpen ? "Open" : "Closed"}
            </label>
          </div>

          {/* TIME INPUTS ROW */}
          <div className="flex items-center gap-10">

            {/* OPEN TIME INPUT */}
            <input
              type="time"
              value={day.openTime}
              disabled={!day.isOpen}
              onChange={(e) => updateTime(index, "openTime", e.target.value)}
              className={`border border-[#CBD5E1] rounded-lg px-2 py-1 w-[120px] ${
                !day.isOpen ? "bg-gray-200 opacity-60 cursor-not-allowed" : ""
              }`}
            />

            {/* CLOSE TIME INPUT */}
            <input
              type="time"
              value={day.closeTime}
              disabled={!day.isOpen}
              onChange={(e) => updateTime(index, "closeTime", e.target.value)}
              className={`border border-[#CBD5E1] rounded-lg px-2 py-1 w-[120px] ${
                !day.isOpen ? "bg-gray-200 opacity-60 cursor-not-allowed" : ""
              }`}
            />

          </div>
        </div>

      </div>
    ))}

  </div>
)}


  {/* ----------- 2. TEMPORARY CLOSED ----------- */}
  {mode === "temporary" && (
    <div className="mt-4 flex gap-4">
      <div>
        <label className="text-sm text-[#64748B]">Start Date</label>
        <input type="date" className="border rounded-lg px-2 py-1 ml-2"/>
      </div>

      <div>
        <label className="text-sm text-[#64748B]">End Date</label>
        <input type="date" className="border rounded-lg px-2 py-1 ml-2"/>
      </div>
    </div>
  )}

  {/* ----------- 3. PERMANENTLY CLOSED ----------- */}
  {mode === "permanent" && (
    <div className="text-sm text-gray-500 mt-3">
      Business profile will show as permanently closed.
    </div>
  )}
</div>



{ /* Reviews Section */}
<div className="w-full bg-white rounded-xl p-4">
      <div className="bg-white p-4">
        <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg mb-4">All Reviews</h2>
        
        <div className="space-y-5">
          {/* Review 1 */}
          <div className="bg-[#F9F9F9] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-stretch gap-2.5">
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-black font-[Poppins] font-semibold text-base">John Doe</span>
                  <div className="w-1.5 h-1.5 bg-[#A1A1A1] rounded-full"></div>
                  <span className="text-[#A1A1A1] text-[12px] font-['open_sans']">Today</span>
                </div>
                <p className="text-[#1E1E1E] text-[12px] font-['open_sans'] leading-[20.4px]">
                  We should also take into consideration other factors in detecting hate speech. In case the algorithm mistakenly flags a comment as hate speech
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 p-2.5">
              <div className="w-6 h-6">
                <img src="https://static.codia.ai/image/2025-12-04/e6MiVoWVJn.png" alt="Like" className="w-full h-full" />
              </div>
              <div className="w-px h-5 bg-[#E0E0E0]"></div>
              <div className="flex items-center gap-1 bg-transparent rounded-full px-2.5 py-1.5">
                <div className="w-6 h-6">
                  <img src="https://static.codia.ai/image/2025-12-04/0jQyhLuXK4.png" alt="Reply" className="w-full h-full" />
                </div>
                <span className="text-[#222224] text-xs leading-[26.4px]">Reply</span>
              </div>
            </div>

            {/* Reply Box */}
            <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 space-y-2.5">
              <div className="text-[#8A8A8A] text-base leading-[35.2px]">Replay a comment...</div>
              <div className="flex justify-end">
                <div className="flex items-center">
                  <div className="flex items-end gap-3 p-1">
                    <div className="bg-white rounded-full px-3 py-2">
                      <span className="text-[#8A8A8A] text-xs text-center">2000 Characters remaining</span>
                    </div>
                    <div className="bg-gradient-to-r from-[#7077FE] to-[#F07EFF] rounded-full px-6 py-3">
                      <span className="text-white font-semibold text-base text-center">Submit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-[#F9F9F9] rounded-lg p-4 space-y-5">
            <div className="flex justify-stretch items-stretch">
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-black font-[Poppins] font-semibold text-base">John Doe</span>
                  <div className="w-1.5 h-1.5 bg-[#A1A1A1] rounded-full"></div>
                  <span className="text-[#A1A1A1] text-[12px] font-['open_sans']">Today</span>
                </div>
                <p className="text-[#1E1E1E] text-[12px] font-['open_sans'] leading-[20.4px]">
                  We should also take into consideration other factors in detecting hate speech. In case the algorithm mistakenly flags a comment as hate speech
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 p-2.5">
              <div className="w-6 h-6">
                <img src="https://static.codia.ai/image/2025-12-04/V3hCQqvhhk.png" alt="Like" className="w-full h-full" />
              </div>
              <div className="w-px h-5 bg-[#E0E0E0]"></div>
              <div className="flex items-center gap-1 bg-transparent rounded-full px-2.5 py-1.5">
                <div className="w-6 h-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[#222224] text-xs leading-[26.4px]">Reply</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
{ /* Action Buttons */}
    <div className="flex items-center gap-3 self-end">
      <button className="bg-white shadow-sm rounded-full px-5 py-3 flex items-center justify-center gap-2">
        <span className="text-[#081021] font-Rubik leading-[16.59px]">Cancel</span>
      </button>
      
      <button className="bg-white shadow-sm rounded-full px-5 py-3 flex items-center justify-center gap-2">
        <span className="text-[#081021] font-Rubik leading-[16.59px]">Preview</span>
      </button>
      
      <button className="bg-[#7077FE] shadow-sm rounded-full px-6 py-3 flex items-center justify-center gap-2">
        <span className="text-white font-Rubik leading-[16.59px]">Save</span>
      </button>
    </div>
      
    </main>
  )
}

export default EditDirectory
