import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import DashboardLayout from "../../../layout/Dashboard/dashboardlayout";

const tabNames = [
  "Basic Information",
  "Contact Information",
  "Social Links",
  "Organization Mission & Vision Values",
  "Public View Under Directory",
  
];

const OrganaizationProfilepage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [services, setServices] = useState<string[]>([]);
const [serviceInput, setServiceInput] = useState("");



  const {
    register,
 
    formState: { errors },
    reset,
  } = useForm( {
  mode: "onBlur", // or "onChange"
});

  // const onSubmit = (data: any) => {
  //   console.log("Form submitted:", data);
  // };

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

    {/* Basic info */}
    <Tab.Panels className= "pt-6">
      <Tab.Panel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Organization Name */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Organization Name <span className="text-red-500">*</span></label>
    <input
      type="text"
      placeholder="Enter your organization name"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Legal Business Name */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Legal Business Name (if different)</label>
    <input
      type="text"
      placeholder="Enter legal business name"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Business Registration Number */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Business Registration Number <span className="text-red-500">*</span></label>
    <input
      type="text"
      placeholder="Enter registration number"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <p className="text-xs text-gray-500 mt-1">This will remain private. Used for verification.</p>
  </div>

  {/* Website */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Website <span className="text-red-500">*</span></label>
    <input
      type="url"
      placeholder="https://yourwebsite.com"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Industry */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Industry <span className="text-red-500">*</span></label>
    <select className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
      <option>Select your industry</option>
      <option>Healthcare</option>
      <option>Education</option>
      <option>Technology</option>
      <option>Retail</option>
    </select>
  </div>

  {/* Year of Establishment */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Year Of Establishment <span className="text-red-500">*</span></label>
    <select className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
      <option>Select year</option>
      {Array.from({ length: 125 }, (_, i) => new Date().getFullYear() - i).map((year) => (
        <option key={year}>{year}</option>
      ))}
    </select>
  </div>

  {/* Organization Size */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Organization Size <span className="text-red-500">*</span></label>
    <select className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
      <option>Select size</option>
      <option>1-10</option>
      <option>11-50</option>
      <option>51-200</option>
      <option>201-1000</option>
      <option>1000+</option>
    </select>
  </div>

  {/* Headquarters Location */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-800 mb-2">Headquarters Location <span className="text-red-500">*</span></label>
    <input
      type="text"
      placeholder="Enter city, state, country"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Operating Locations with Add More functionality - optional placeholder */}
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-800 mb-2">Operating Locations</label>
    <textarea
      rows={3}
      placeholder="Enter city, state, country and address. Use line breaks for multiple locations."
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

        </div>
      </Tab.Panel>

 {/*contact info */}
<Tab.Panel>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

{/* Primary Contact Person Name */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Primary Contact Person Name <span className="text-red-500">*</span></label>
    <input
      type="text"
      placeholder="Enter full name"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

  {/* Designation */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Designation <span className="text-red-500">*</span></label>
    <select className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
      <option>Select designation</option>
      <option>Founder</option>
      <option>CEO</option>
      <option>COO</option>
      <option>Manager</option>
      <option>Director</option>
    </select>
  </div>

    {/* Phone Number */}
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-2">Contact Number <span className="text-red-500">*</span></label>
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
      <label className="block text-sm font-medium text-gray-700 mb-2">Official Email address <span className="text-red-500">*</span></label>
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

   <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">
      Youtube
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

{/* Organization Mission & Vision Values */}
                <Tab.Panel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Organization Mission Statement */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Organization Mission Statement <span className="text-red-500">*</span></label>
    <textarea
      rows={4}
      placeholder="Enter your mission statement"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      required
    />
  </div>

  {/* Vision Statement */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Vision Statement <span className="text-red-500">*</span></label>
    <textarea
      rows={4}
      placeholder="Enter your vision statement"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      required
    />
  </div>

  {/* Core Values */}
  <div>
    <label className="block text-sm font-medium text-gray-800 mb-2">Core Values <span className="text-red-500">*</span></label>
    <textarea
      rows={4}
      placeholder="List your core values"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
      required
    />
  </div>

</div>
 </Tab.Panel>

  {/* Services with Add More functionality */}
  
<Tab.Panel>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* Services Input */}
    <div className="md:col-span-2 mb-6">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Services <span className="text-gray-500 text-xs">(Add up to 20)</span> <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
          placeholder="Enter a service"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="button"
          onClick={() => {
            const trimmed = serviceInput.trim();
            if (trimmed && !services.includes(trimmed) && services.length < 20) {
              setServices([...services, trimmed]);
              setServiceInput("");
            }
          }}
          className="px-3 py-2 text-sm font-bold bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
          disabled={services.length >= 20}
        >
          +
        </button>
      </div>

      {/* Display added services */}
      {services.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((svc, idx) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {svc}
              <button
                type="button"
                onClick={() => {
                  const updated = [...services];
                  updated.splice(idx, 1);
                  setServices(updated);
                }}
                className="ml-2 text-purple-600 hover:text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  

  {/* Tags Input */}
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
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Notify Email <span className="text-red-500">*</span></label>
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

  {/* Official Address (Geo) */}
  <div>
     <label className="block text-sm font-medium text-gray-800 mb-2">Official Address <span className="text-red-500">*</span></label>
    <input
      type="text"
      placeholder="Enter full address"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>

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

  {/* Optional Email */}
  <div>
<label className="block text-sm font-medium text-gray-700 mb-2">
    Email address <span className="text-gray-500 text-xs">(optional)</span>
  </label>
  <input
    type="email"
    {...register("optionalEmail", {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email",
      },
    })}
    className={`w-full px-4 py-2 border ${
      errors.optionalEmail ? "border-red-500" : "border-gray-300"
    } rounded-xl focus:outline-none focus:ring-2 ${
      errors.optionalEmail ? "focus:ring-red-500" : "focus:ring-purple-500"
    }`}
  />
  {errors.optionalEmail && (
    <p className="text-sm text-red-500 mt-1">
      {errors.optionalEmail.message as string}
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

export default OrganaizationProfilepage;
