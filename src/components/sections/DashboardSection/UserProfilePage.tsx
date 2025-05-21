import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import DashboardLayout from "../../../layout/Dashboard/dashboardlayout";

const tabNames = [
  "Basic Information",
  "Contact Information",
  "Social Links",
  "Education",
  "Work Experience",
  "Public Profile Fields",
];

const UserProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm( {
  mode: "onBlur", // or "onChange"
});

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue("");
      }
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleCancel = () => {
    reset();
    setBanner(null);
    setLogoPreview(null);
    setTags([]);
  };

  return (
    <DashboardLayout>
      {/*banner and logo*/}
      <div className="max-w-6xl mx-auto mt-0 bg-white rounded-xl shadow overflow-hidden">
        <div className="relative h-[300px] bg-gray-100">
          <img
            src={banner || "/default-banner.jpg"}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 flex gap-2 z-10">
            <label className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-200">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, setBanner)}
              />
              <PhotoIcon className="w-5 h-5 text-gray-600" />
            </label>
            {banner && (
              <button
                onClick={() => setBanner(null)}
                className="bg-white p-2 rounded-full shadow hover:bg-red-100"
              >
                <TrashIcon className="w-5 h-5 text-red-600" />
              </button>
            )}
          </div>

          <div className="absolute -bottom-0 left-6 z-20 group">
            <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              <img
                src={logoPreview || "/default-logo.jpg"}
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                  <label
                    className="bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-gray-100"
                    title="Upload Photo"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, setLogoPreview)}
                    />
                    <PhotoIcon className="w-4 h-4 text-gray-600" />
                  </label>
                  {logoPreview && (
                    <button
                      onClick={() => setLogoPreview(null)}
                      className="bg-white p-1.5 rounded-full shadow hover:bg-red-100"
                      title="Remove Photo"
                    >
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


<div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-[22px] font-bold text-[#9747FF] mb-6">My Profile</h2>

<Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
  <div className="px-6 pt-6">
    {/* Tab Header */}
    <Tab.List className="flex gap-3">
      {tabNames.map((tab, index) => (
        <Tab
          key={index}
          className={({ selected }) =>
            `px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 ${
              selected
                ? "text-purple-600 bg-white shadow-md border-t-2 border-x-2 border-purple-600 -mb-[1px]"
                : "text-gray-500 bg-transparent hover:text-purple-500"
            }`
          }
        >
          {tab}
        </Tab>
      ))}
    </Tab.List>

    {/* Tab Content Panel */}
    
    <Tab.Panels className= "pt-6">
      <Tab.Panel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
  {/* First Name */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">First Name <span className="text-red-500">*</span></label>
    <input
      type="text"
      placeholder="Enter your First Name"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Last Name */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Last Name <span className="text-red-500">*</span></label>
    <input
      type="text"
      placeholder="Enter your Last Name"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Interests */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Interests <span className="text-red-500">*</span></label>
    <select className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
      <option>Select your Interest</option>
      <option>Health</option>
      <option>Education</option>
      <option>Spirituality</option>
      <option>Environment</option>
    </select>
  </div>

  {/* Profession */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Profession <span className="text-red-500">*</span></label>
    <select className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
       <option>Select your profession</option>
      <option>Teacher</option>
      <option>Engineer</option>
      <option>Artist</option>
      <option>Entrepreneur</option>
    </select>
  </div>

  {/* Gender */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Gender <span className="text-red-500">*</span></label>
    <select className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
       <option>Select your gender</option>
      <option>Male</option>
      <option>Female</option>
      <option>Non-binary</option>
    </select>
  </div>

  {/* Date of Birth */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Date of Birth <span className="text-red-500">*</span></label>
    <input
      type="date"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Quote on Consciousness */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Your Quote on Consciousness</label>
    <input
      type="text"
      placeholder="Enter your quote"
      className="w-full px-4 py-2 border border-purple-400 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Professional Bio */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Professional Bio <span className="text-red-500">*</span></label>
    <input
      type="text"
      placeholder="Add a short professional bio"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Vision Statement - Full Width */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-800 mb-2">Personal Vision Statement</label>
    <textarea
      rows={4}
      placeholder="What is your conscious vision?"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
                  {/*contact info */}
          </div>
        </div>
      </Tab.Panel>

                       {/*contact info */}
                <Tab.Panel>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Phone Number */}
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-2">Phone Number <span className="text-red-500">*</span></label>
      <input
  type="tel"
  {...register("phone", {
    required: "Phone number is required",
    pattern: {
      value: /^[0-9]{10}$/,
      message: "Phone must be 10 digits",
    },
  })}
  onKeyDown={(e) => {
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  }}
  className={`w-full px-4 py-2 border ${
    errors.phone ? "border-red-500" : "border-gray-300"
  } rounded-xl focus:outline-none focus:ring-2 ${
    errors.phone ? "focus:ring-red-500" : "focus:ring-purple-500"
  }`}
/>
{errors.phone && (
  <p className="text-sm text-red-500 mt-1">
    {errors.phone.message as string}
  </p>
)}
</div>

    {/* Email */}
     <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
   <input
  type="email"
  {...register("email", {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email",
    },
  })}
  className={`w-full px-4 py-2 border ${
    errors.email ? "border-red-500" : "border-gray-300"
  } rounded-xl focus:outline-none focus:ring-2 ${
    errors.email ? "focus:ring-red-500" : "focus:ring-purple-500"
  }`}
/>
{errors.email && (
  <p className="text-sm text-red-500 mt-1">
    {errors.email.message as string}
  </p>
)}
</div>
    
    
    {/* Address */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Address <span className="text-red-500">*</span></label>
      <input
        type="text"
        {...register("address")}
        placeholder="Enter your address"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>

    {/* Country */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Country <span className="text-red-500">*</span></label>
      <select
        {...register("country")}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Select your country</option>
        <option value="India">India</option>
        <option value="USA">USA</option>
      </select>
    </div>

    {/* State */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
      <select
        {...register("state")}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Select your state</option>
      </select>
    </div>

    {/* City */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
      <input
        type="text"
        {...register("city")}
        placeholder="Enter city"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>

    {/* Postal Code */}
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-2">Postal Code <span className="text-red-500">*</span></label>
      <input
        type="number"
        {...register("postalCode")}
        placeholder="Enter postal code"
        className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>

    {/* Communication Preferences */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Method of Communication <span className="text-red-500">*</span></label>
      <div className="flex gap-6">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("communication.sms")} className="accent-[#9747FF]" />
          <span className="text-sm text-gray-700">SMS</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("communication.email")} className="accent-[#9747FF]" />
          <span className="text-sm text-gray-700">Email</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" {...register("communication.whatsapp")} className="accent-[#9747FF]" />
          <span className="text-sm text-gray-700">WhatsApp</span>
        </label>
      </div>
    </div>

  </div>
   </Tab.Panel> 
   
         {/* Social links */}         

                <Tab.Panel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Facebook */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Facebook
    </label>
    <input
      type="url"
      {...register("facebook")}
      placeholder="Enter Facebook profile URL"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Twitter */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Twitter
    </label>
    <input
      type="url"
      {...register("twitter")}
      placeholder="Enter Twitter profile URL"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* LinkedIn */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      LinkedIn
    </label>
    <input
      type="url"
      {...register("linkedin")}
      placeholder="Enter LinkedIn profile URL"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Instagram */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Instagram
    </label>
    <input
      type="url"
      {...register("instagram")}
      placeholder="Enter Instagram profile URL"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
</div>
</Tab.Panel>

{/* Education */}
                <Tab.Panel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Degree */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Degree <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      {...register("degree")}
      placeholder="Enter your degree"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Institution */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Institution <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      {...register("institution")}
      placeholder="Enter institution name"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Start Date */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Start Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      {...register("startDate")}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* End Date */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      End Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      {...register("endDate")}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
</div>
 </Tab.Panel>

{/* Work exp */}
                <Tab.Panel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Company */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Company <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      {...register("degree")}
      placeholder="Enter Company Name"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Position */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Position <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      {...register("institution")}
      placeholder="Enter your Designation"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Start Date */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Start Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      {...register("startDate")}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* End Date */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      End Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      {...register("endDate")}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
</div>
</Tab.Panel>

 {/* public profile and fields */}
  <Tab.Panel>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* Title */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-800 mb-2">Title <span className="text-red-500">*</span></label>
    <textarea
      {...register("title")}
      rows={3}
      placeholder="Enter a brief title or role"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Featured Image Upload */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Featured Image <span className="text-gray-500 text-xs">(Upload an image that represents your service)</span>
    </label>
    <input
      type="file"
      accept="image/*"
      {...register("featuredImage")}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Services Offered (dynamic add more later) */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Services Offered
    </label>
    <input
      type="text"
      {...register("services")}
      placeholder="Enter a service you offer"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    {/* Future: Add 'Add More' button logic below */}
  </div>


  {/* Tags (could use react-select or tag-input field later) */}
{/* Tags Field */}
<div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-800 mb-2">Tags <span className="text-red-500">*</span></label>
  <div className="w-full border border-gray-300 rounded-xl px-3 py-2">
    <div className="flex flex-wrap gap-2 mb-1">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
        >
          {tag}
          <button
            onClick={() => removeTag(idx)}
            className="ml-1 text-purple-600 hover:text-red-500 font-bold"
          >
            ×
          </button>
        </span>
      ))}
    </div>
    <input
      type="text"
      className="w-full text-sm focus:outline-none placeholder-gray-400"
      placeholder="Add tags (e.g. therapy, online, free-consult)"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleTagKeyDown}
    />
  </div>
</div>

  {/* Notify Email */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Notify Email <span className="text-red-500">*</span>
    </label>
     <input
  type="email"
  {...register("email", {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email",
    },
  })}
  className={`w-full px-4 py-2 border ${
    errors.email ? "border-red-500" : "border-gray-300"
  } rounded-xl focus:outline-none focus:ring-2 ${
    errors.email ? "focus:ring-red-500" : "focus:ring-purple-500"
  }`}
/>
{errors.email && (
  <p className="text-sm text-red-500 mt-1">
    {errors.email.message as string}
  </p>
)}
  </div>
</div>

</Tab.Panel>

  </Tab.Panels>

    </div>
</Tab.Group>

    </div>  
    
          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
       
        {/* FORM ENDS HERE */}
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
