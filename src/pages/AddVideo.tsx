import React, { useState, useRef } from "react";
import uploadimg from "../assets/upload1.svg";
//import { ChevronRight } from "lucide-react";
import Breadcrumb from "../components/MarketPlace/Breadcrumb";
import CategoryModel from "../components/MarketPlace/CategoryModel";
import { useNavigate } from "react-router-dom";


interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => (
  <section className="space-y-5">
    <div>
      <h2 className="font-[poppins] font-semibold text-[18px] leading-[100%] text-[#242E3A] mb-1">
        {title}
      </h2>
      <p className="font-['Open_Sans'] text-[14px] leading-[26px] text-[#665B5B]">
        {description}
      </p>
    </div>
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {children}
    </div>
  </section>
);

interface InputFieldProps {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  required = false,
  type = "text",
}) => (
  <div className="flex flex-col">
    <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent"
    />
  </div>
);

interface FileUploadProps {
  label?: string;
  description: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, description }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => fileRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {label && (
        <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
          {label}
        </label>
      )}
      <div
        onClick={handleClick}
        className={`relative rounded-lg p-6 text-center cursor-pointer transition-all bg-[#F9FAFB] hover:bg-[#EEF3FF]`}
>
  {/* ✅ SVG Dashed Border */}
  <svg
    className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
  >
    <rect
      x="1"
      y="1"
      width="calc(100% - 2px)"
      height="calc(100% - 2px)"
      rx="12"
      ry="12"
      stroke="#CBD5E1"
      strokeWidth="2"
      strokeDasharray="6,6"
      fill="none"
      className="transition-colors duration-300 group-hover:stroke-[#7077FE]"
    />
  </svg>
      
        <input
          ref={fileRef}
          type="file"
          accept="video/*,image/*"
          onChange={handleChange}
          className="hidden"
        />
        {preview ? (
          <video
            src={preview}
            controls
            className="w-full max-h-64 rounded-lg object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <img src={uploadimg} alt="upload" className="w-10 h-10 mt-6" />
            <p className="font-[poppins] text-[16px] text-[#242E3A]">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const AddVideoForm: React.FC = () => {
  const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleSelectCategory = (category: string) => {
    const routes: Record<string, string> = {
      Video: "/dashboard/products/add-video",
      Music: "/dashboard/products/add-music",
      Course: "/dashboard/products/add-course",
      Podcasts: "/dashboard/products/add-podcast",
      Ebook: "/dashboard/products/add-ebook",
      Arts: "/dashboard/products/add-arts",
    };
    const path = routes[category];
    if (path) navigate(path);
  };


  return (
    <>

    {/* 🔹 Breadcrumb Section */}      
<Breadcrumb
        onAddProductClick={() => setShowModal(true)}
        onSelectCategory={handleSelectCategory}
      />
 
       <div className="max-w-9xl mx-auto px-2 py-1 space-y-10">
        {/* Add Video Section */}
        <FormSection
          title="Add Video"
          description="Upload your digital product details, set pricing, and make it available for buyers on the marketplace."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InputField label="Product Title *" placeholder="Enter your title" required />
            <InputField label="Price" placeholder="Enter the $ amount" />
            <InputField label="Discount in %" placeholder="Enter discount in %" />
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Mood
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent cursor-pointer">
                <option>Calm</option>
                <option>Energetic</option>
                <option>Inspiring</option>
                <option>Romantic</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <FileUpload label="Upload Video" description="Drag & drop or click to upload" />
          </div>
        </FormSection>

        {/* Details Section */}
        <FormSection
          title="Details"
          description="Add detailed information about your product."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Overview
              </label>
              <textarea
                placeholder="Write a brief description of your product"
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
              />
            </div>
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Highlights
              </label>
              <textarea
                placeholder="Share up to three key achievements or highlights"
                className="w-full h-32 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
              />
            </div>
            <InputField label="Duration" placeholder="Enter video duration" />
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Language
              </label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-[#7077FE]">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </FormSection>

        {/* Storytelling Section */}
        <FormSection
          title="Storytelling"
          description="Add a short video and description to explain your content."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUpload label="Short Video"
             description="Drag & drop or click to upload" />
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Summary of the video
              </label>
              <textarea
                placeholder="Write a brief description of your storytelling"
                className="w-full h-38 px-3 py-2 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#7077FE]"
              />
            </div>
          </div>
        </FormSection>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button className=" px-5 py-3 text-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%] tracking-[0]  hover:text-blue-500 transition-colors">
            Discard
          </button>
          <button className="px-5 py-3 bg-white text-[#7077FE] border border-[#7077FE] rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%] tracking-[0] hover:bg-gray-300 transition-colors">
            Preview
          </button>
          <button className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-['Plus_Jakarta_Sans'] font-medium text-[16px] leading-[100%] tracking-[0] hover:bg-[#5a60ea] transition-colors">
            Submit
          </button>
        </div>
      </div>
{showModal && (
        <CategoryModel
          open={showModal}
          onClose={() => setShowModal(false)}
          onSelect={handleSelectCategory}
        />
     
)}
    </>
  );
};

export default AddVideoForm;
