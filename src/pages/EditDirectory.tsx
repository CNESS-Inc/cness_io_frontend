import React from 'react'
import edit from '../assets/Edit.svg';
const EditDirectory: React.FC = () => {

const days = [
    { name: 'Monday', isOpen: true, openTime: '10:30 AM', closeTime: '10:30 PM' },
    { name: 'Tuesday', isOpen: false, openTime: '10:30 AM', closeTime: '10:30 PM' },
    { name: 'Wednesday', isOpen: false, openTime: '10:30 AM', closeTime: '10:30 PM' },
    { name: 'Thursday', isOpen: false, openTime: '10:30 AM', closeTime: '10:30 PM' },
    { name: 'Friday', isOpen: false, openTime: '10:30 AM', closeTime: '10:30 PM' },
    { name: 'Saturday', isOpen: false, openTime: '10:30 AM', closeTime: '10:30 PM' },
    { name: 'Sunday', isOpen: false, openTime: '10:30 AM', closeTime: '10:30 PM' }
  ]


  return (
    <main className="flex-1 p-4 flex flex-col items-end gap-4">
<div className="w-full bg-white rounded-xl p-4 flex gap-[90px]">
  <div className="flex-1 flex flex-col gap-4">
    
    {/* SECTION TITLE */}
    <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg uppercase">
      Basic Information
    </h2>

    <div className="flex flex-col gap-3">

      {/* ---------------- ROW 1 ---------------- */}
      <div className="flex gap-8">
        
        {/* Business Name */}
        <div className="w-[530px] flex flex-col gap-1.5">
          <label className="text-[#64748B] font-[Poppins] font-medium uppercase">
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
          <label className="text-[#64748B] font-[Poppins] font-medium uppercase">
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
          <label className="text-[#64748B] font-[Poppins] font-medium uppercase">
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
          <label className="text-[#64748B] font-[Poppins] font-medium uppercase">
            Contact
          </label>
          <input
            type="text"
            defaultValue="+1 512-704-9022"
            className="h-[43px] border border-[#CBD5E1] rounded-lg px-3 
                       text-[#081021] font-semibold text-base outline-none"
          />
        </div>

      </div>

      {/* ---------------- ROW 3 ---------------- */}
      <div className="flex gap-8">

        {/* Website */}
        <div className="w-[530px] flex flex-col gap-1.5">
          <label className="text-[#64748B] font-[Poppins] font-medium uppercase">
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
          <label className="text-[#64748B] font-[Poppins] font-medium uppercase">
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
        <label className="text-[#64748B] font-[Poppins] font-medium uppercase">About</label>
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
          <img src="https://static.codia.ai/image/2025-12-04/uMYZaG1cTX.png" alt="Photo 1" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center">
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
        <div className="w-[267px] h-[184px] bg-white border-2 border-dashed border-[#D5D5D5] rounded-lg flex flex-col items-center justify-center gap-1">
          <div className="w-5 h-5">
            <img src="https://static.codia.ai/image/2025-12-04/HyFuZpcPWL.png" alt="Add" className="w-full h-full" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#7077FE] font-semibold text-xs">Add image</span>
            <span className="text-[#64748B] text-xs">Maximum 3 mb</span>
          </div>
        </div>
      </div>
    </div>
{ /* Operating Hours Section */}
 <div className="w-full bg-white rounded-xl p-4">
      <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg uppercase mb-4">Operations Information</h2>
      
      {/* Opening Hours Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <img src="https://static.codia.ai/image/2025-12-04/9sGO1TwJU7.png" alt="Clock" className="w-3 h-3" />
          <span className="text-[#081021] font-semibold uppercase">Opening hours</span>
        </div>
        
        <div className="mb-3">
          <h3 className="text-[#081021] font-semibold text-xs mb-1">Hours</h3>
          <p className="text-[#64748B] text-sm">Set main business hours or mark your business as closed</p>
        </div>

        {/* Radio Options */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-[#7077FE] bg-[#7077FE]"></div>
            <div>
              <div className="text-[#081021] font-semibold">Opens with main hours</div>
              <div className="text-[#64748B] text-sm">Show when your business is open</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300"></div>
            <div>
              <div className="text-[#081021] font-semibold">Temporary closed</div>
              <div className="text-[#64748B] text-sm">Show your business will open again in the future</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-gray-300"></div>
            <div>
              <div className="text-[#081021] font-semibold">Permanently closed</div>
              <div className="text-[#64748B] text-sm">Show that your business no longer exist</div>
            </div>
          </div>
        </div>

        {/* Days Schedule */}
        <div className="space-y-3">
          {/* First Row */}
          <div className="flex gap-[101px]">
            {days.slice(0, 3).map((day, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="w-[62px] flex flex-col gap-2">
                  <span className="text-[#081021] font-semibold">{day.name}</span>
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5">
                      <img 
                        src={day.isOpen ? "https://static.codia.ai/image/2025-12-04/0KQ6rO2CrZ.png" : "https://static.codia.ai/image/2025-12-04/wGPW3TDuh8.png"} 
                        alt={day.isOpen ? "Open" : "Closed"} 
                        className="w-full h-full" 
                      />
                    </div>
                    <span className="text-[#64748B] text-xs">{day.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                </div>
                
                {day.isOpen && (
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[#64748B] text-sm">Open at</span>
                      <div className="border border-[#CBD5E1] rounded-lg px-2 py-1">
                        <span className="text-[#081021] font-semibold text-sm">{day.openTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#64748B] text-sm">Closes at</span>
                      <div className="border border-[#CBD5E1] rounded-lg px-2 py-1">
                        <span className="text-[#081021] font-semibold text-sm">{day.closeTime}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div className="flex gap-[101px]">
            {days.slice(3, 6).map((day, index) => (
              <div key={index + 3} className="flex items-center gap-6">
                <div className="w-[62px] flex flex-col gap-2">
                  <span className="text-[#081021] font-semibold">{day.name}</span>
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5">
                      <img 
                        src={day.isOpen ? "https://static.codia.ai/image/2025-12-04/Cx8VjkONb1.png" : "https://static.codia.ai/image/2025-12-04/F3xiKH5vEK.png"} 
                        alt={day.isOpen ? "Open" : "Closed"} 
                        className="w-full h-full" 
                      />
                    </div>
                    <span className="text-[#64748B] text-xs">{day.isOpen ? 'Open' : 'Closed'}</span>
                  </div>
                </div>
                
                {day.isOpen && (
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[#64748B] text-sm">Open at</span>
                      <div className="border border-[#CBD5E1] rounded-lg px-2 py-1">
                        <span className="text-[#081021] font-semibold text-sm">{day.openTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#64748B] text-sm">Closes at</span>
                      <div className="border border-[#CBD5E1] rounded-lg px-2 py-1">
                        <span className="text-[#081021] font-semibold text-sm">{day.closeTime}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Third Row - Sunday */}
          <div className="flex">
            <div className="flex items-center gap-6">
              <div className="w-[62px] flex flex-col gap-2">
                <span className="text-[#081021] font-semibold">{days[6].name}</span>
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5">
                    <img 
                      src="https://static.codia.ai/image/2025-12-04/mM7qAaFPs4.png" 
                      alt="Closed" 
                      className="w-full h-full" 
                    />
                  </div>
                  <span className="text-[#64748B] text-xs">Closed</span>
                </div>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[#64748B] text-sm">Open at</span>
                  <div className="border border-[#CBD5E1] rounded-lg px-2 py-1">
                    <span className="text-[#081021] font-semibold text-sm">{days[6].openTime}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#64748B] text-sm">Closes at</span>
                  <div className="border border-[#CBD5E1] rounded-lg px-2 py-1">
                    <span className="text-[#081021] font-semibold text-sm">{days[6].closeTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
                  <span className="text-[#A1A1A1] text-xs">Today</span>
                </div>
                <p className="text-[#1E1E1E] text-xs leading-[20.4px]">
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
                    <div className="bg-gradient-to-r from-[#7077FE] to-[#F07EFF] rounded-full px-5 py-3.5">
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
                  <span className="text-[#A1A1A1] text-xs">Today</span>
                </div>
                <p className="text-[#1E1E1E] text-xs leading-[20.4px]">
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
        <span className="text-[#081021] font-[Rubik] leading-[16.59px]">Cancel</span>
      </button>
      
      <button className="bg-white shadow-sm rounded-full px-5 py-3 flex items-center justify-center gap-2">
        <span className="text-[#081021] font-[Rubik] leading-[16.59px]">Preview</span>
      </button>
      
      <button className="bg-[#7077FE] shadow-sm rounded-full px-6 py-3 flex items-center justify-center gap-2">
        <span className="text-white font-[Rubik] leading-[16.59px]">Save</span>
      </button>
    </div>
      
    </main>
  )
}

export default EditDirectory
