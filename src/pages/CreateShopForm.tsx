import React from 'react'
import uploadimg from '../assets/upload.svg'
import { useState } from 'react'
import instagramIcon from '../assets/instagramicon.svg';
import youtubeIcon from '../assets/youtubeicon.svg';
import facebookIcon from '../assets/facebookicon.svg';
import xIcon from '../assets/twittericon.svg';
import cnessicon from '../assets/cnessicon.svg';
//import { TwitterIcon } from 'react-share';

interface FormSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <section className="space-y-5">
      <div>
<h2 className="font-[poppins] font-semibold text-[18px] leading-[100%] tracking-[0] text-[#242E3A] capitalize mb-1">
          {title}
        </h2>
<p className="font-['Open_Sans'] font-normal text-[14px] leading-[26px] tracking-[0] text-[#665B5B]">
            {description}
        </p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {children}
      </div>
    </section>
  )
}

interface InputFieldProps {
  label: string
  placeholder: string
  required?: boolean
  fullWidth?: boolean
  type?: string
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  placeholder, 
  required = false, 
  fullWidth = false,
  type = 'text'
}) => {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
<label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        required={required}
      />
    </div>
  )
}

interface DateInputProps {
  label: string
  required?: boolean
}

const DateInput: React.FC<DateInputProps> = ({ label = false }) => {
  return (
    <div>
<label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">
        {label}
      </label>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="MM"
          className="w-12 px-3 py-2 border border-gray-200 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          maxLength={2}
        />
        <input
          type="text"
          placeholder="DD"
          className="w-12 px-3 py-2 border border-gray-200 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          maxLength={2}
        />
        <input
          type="text"
          placeholder="YYYY"
          className="w-16 px-3 py-2 border border-gray-200 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          maxLength={4}
        />
      </div>
    </div>
  )
}

interface FileUploadProps {
  label?: string
  description: string
  recommendation?: string
  required?: boolean
  className?: string
    iconPosition?: "top" | "lower"

}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  description, 
  recommendation, 
  className = '',
   iconPosition = "top",
}) => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Trigger input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

   // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {label && (
<label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-4">
          {label}
        </label>
      )}
<div 
onClick={handleClick}
className={`border-dashed border-[#CBD5E1] rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer ${className}`}
 style={{
    borderStyle: "dashed",
    borderWidth: "3px",
    borderRadius: "6px",
    // @ts-ignore — allow non-standard style prop
    borderDasharray: "8,8",
  }}  
  >
    {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
       {/* Show preview if uploaded */}
        {image ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={image}
              alt="Uploaded preview"
              className="max-h-48 rounded-lg object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <img
              src={uploadimg}
              alt="upload"
              className={`w-10 h-10 text-gray-400 transition-all duration-300 ${
                iconPosition === "lower" ? "mt-8" : "mt-12"
              }`}
            />
            <p className="font-[poppins] text-[16px] text-[#242E3A]">
              {description}
            </p>
            {recommendation && (
              <p className="font-['Open_Sans'] text-[14px] text-[#665B5B]">
                {recommendation}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const LanguageSelector: React.FC = () => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "English",
    "Spanish",
    "French",
  ]);
const [availableLanguages, setAvailableLanguages] = useState<string[]>([
    "German",
  ]);

    const [inputValue, setInputValue] = useState("");
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newLang = inputValue.trim();

      // Avoid duplicates
      if (!selectedLanguages.includes(newLang)) {
        setSelectedLanguages([...selectedLanguages, newLang]);
      }

      setInputValue("");
    }
  };

   const removeLanguage = (lang: string) => {
    setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
  };
   const addFromAvailable = (lang: string) => {
    if (!selectedLanguages.includes(lang)) {
      setSelectedLanguages([...selectedLanguages, lang]);
      setAvailableLanguages(availableLanguages.filter((l) => l !== lang));
    }
  };
  return (
    <div>
      <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">
        Languages *
      </label>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {selectedLanguages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-[#7077FE] text-white px-5 py-2 rounded-full"
            >
              <span className="font-['Open_Sans'] font-normal text-[14px]">{lang}</span>
               <button
                onClick={() => removeLanguage(lang)}
                className="w-4 h-4 flex items-center justify-center hover:text-gray-200"
              >
                <svg className="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {availableLanguages.map((lang, index) => (
            <div
              key={index}
               onClick={() => addFromAvailable(lang)}
              className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-full cursor-pointer hover:bg-gray-50"
            >
              <span className="text-sm">{lang}</span>
            </div>
          ))}
        </div>
       <input
          type="text"
          placeholder="other Languages"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  )
}


const socialLinks = [
  { platform: "Website",url: "https://www.cness.com/", icon: <img src={cnessicon} alt="Website" />, active: true },
  { platform: "Instagram",url: "https://www.instagram.com/", icon: <img src={instagramIcon} alt="Instagram" />, active: false },
  { platform: "YouTube",  url: "https://www.youtube.com/", icon: <img src={youtubeIcon} alt="YouTube" />, active: false },
  { platform: "Facebook",  url: "https://www.facebook.com/",icon: <img src={facebookIcon} alt="Facebook" />, active: false },
  { platform: "Twitter",  url: "https://www.twitter.com/",icon: <img src={xIcon} alt="Twitter" />, active: false },
];

  const TeamMemberCard: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-6">
      <div className="flex justify-between items-start">
        <FileUpload
          label="Profile image"
          description="Drag & drop or click to upload"
          recommendation="Recommended 120 X 120 px"
          className="w-50 h-60 aspect-square"
           iconPosition="lower"
        />
        <button className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your teammate name"
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">
            Role
          </label>
          <input
            type="text"
            placeholder="Enter your teammate role"
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}

  
const CreateShopForm: React.FC = () => {

const [policies, setPolicies] = useState([
    {
      title: "Terms & Conditions",
      description: "Using this shop means you agree to our terms and conditions",
      checked: true,
    },
    {
      title: "Licensing & usage",
      description: "Products include standard and commercial usage rights",
      checked: true,
    },
    {
      title: "Refund Policy",
      description: "Refunds available within 12 hours of purchase",
      checked: false,
    },
  ]);

  // ✅ Add handler to toggle
  const togglePolicy = (index: number) => {
    setPolicies((prev) =>
      prev.map((policy, i) =>
        i === index ? { ...policy, checked: !policy.checked } : policy
      )
    );
  };

 return (
   <>
  <header className="w-full bg-white border-b border-gray-200 pt-4 pb-3 px-6">
    <h1 className="font-poppins font-semibold text-[20px] leading-[115%] text-[#242E3A] capitalize">
      Create your shop
    </h1>
    <p className="font-['Open_Sans'] font-normal text-[14px] leading-[26px] text-[#665B5B]">
      Set up your shop in minutes and start sharing your products with the world.
    </p>
  </header>

 {/* ✅ Form content area (centered) */}
      <div className="max-w-8xl mx-auto px-6 py-10 space-y-10">
        {/* Basic Information Section */}
        <FormSection
          title="Basic Information"
          description="Name your shop and add your primary visuals. Recommended sizes help your brand look sharp everywhere"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <InputField
                label="Owner Name *"
                placeholder="Enter your name"
                required
              />
              <DateInput label="Owner DOB *" required />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <InputField
                label="Owner Mobile number *"
                placeholder="Enter your mobile number"
                required
              />
              <InputField
                label="SSN / EIN *"
                placeholder="Enter SSN (XXX-XX-XXXX) or EIN"
                required
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                  Owner Address *
                </label>
                <textarea
                  placeholder="Enter your Address"
                  className="w-full h-43 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              <FileUpload
                label="Government ID Upload *"
                description="Drag & drop or click to upload"
                required
               
              />
            </div>

            <InputField
              label="Shop Name *"
              placeholder="Enter your Shop name"
              required
              fullWidth
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <FileUpload
                label="Shop logo"
                description="Drag & drop or click to upload"
                recommendation="Recommended 120 X 120 px"
className="aspect-[1128/500] max-w-[600px] mx-auto"
              />
              <div className="lg:col-span-2">
                <FileUpload
                  label="Shop Banner"
                  description="Drag & drop or click to upload"
                  recommendation="Recommended 1128 X 340 px"
                  className="aspect-[1128/235]"
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Extra Banners Section */}
        <FormSection
          title="Extra Banners (Optional)"
          description="Optional promotional banners to showcase your shop or offers"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <FileUpload
                key={index}
                description="Drag & drop or click to upload"
                recommendation="Recommended 360 X 200 px"
                className="aspect-[360/200]"
              />
            ))}
          </div>
        </FormSection>

        {/* Story & Positioning */}
        <FormSection
          title="Story & Positioning"
          description="Tell customers what you stand for and why they should they should choose you."
        >
          <div className="space-y-4">
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                About shop *
              </label>
              <textarea
                placeholder="Write up to 300 words"
                className="w-full h-50 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <div className="text-right text-gray-500 text-sm mt-1">0/300</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                  Why Choose Your Shop *
                </label>
                <textarea
                  placeholder="Highlight your unique value"
                  className="w-full h-50 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <div className="text-right text-gray-500 text-sm mt-1">0/200</div>
              </div>
              <div>
                <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                  Shop Philosophy *
                </label>
                <textarea
                  placeholder="What principles guide your work?"
                  className="w-full h-50 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <div className="text-right text-gray-500 text-sm mt-1">0/200</div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Operational Details */}
        <FormSection
          title="Operational Details"
          description="Define the country where your shop is based and languages you support"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                Shop based in *
              </label>
              <div className="relative">
               <select
          className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          defaultValue="Berlin, Germany"
        >
          <option disabled value="">
            Select your country
          </option>
          <option>Berlin, Germany</option>
          <option>Paris, France</option>
          <option>Madrid, Spain</option>
          <option>London, United Kingdom</option>
          <option>New York, USA</option>
          <option>Tokyo, Japan</option>
          <option>Sydney, Australia</option>
        </select>
                <svg
                  className="absolute right-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </FormSection>

        {/* Social Media Links */}
        <FormSection
          title="Social Media Links"
          description="Connect Your profiles so customers can follow and trust your brand."
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Add social links"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-3 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md ${
                    link.active ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded border border-gray-200 flex items-center justify-center">
                      <span className="text-lg">{link.icon}</span>
                    </div>
                    <span className="text-gray-500">{link.url}</span>
                  </div>
                  <button className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Team Members */}
        <FormSection
          title="Team Members (Optional)"
          description="Add up to 4 team members to showcase the people behind your shop."
        >
          <div className="space-y-6">
            <div className="flex justify-end">
              <button className="px-5 py-3 bg-gray-200 text-white rounded-lg font-jakarta font-medium hover:bg-gray-300 transition-colors">
                Add members
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <TeamMemberCard key={index} />
              ))}
            </div>
          </div>
        </FormSection>

        {/* Store Policies */}
        <FormSection
          title="Store Policies"
          description="Please review the default policies below. By checking the box, you confirm that you agree to these terms."
        >
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center space-x-9">
              {policies.map((policy, index) => (
                <div key={index}
              className="flex items-center space-x-4 cursor-pointer"
                 onClick={() => togglePolicy(index)}>
                  <div
  className={`w-6 h-6 rounded border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
                      policy.checked
                        ? "bg-[#7077FE] border-[#7077FE]"
      : "border-[#7077FE]"
                    } `}
                  >
                    {policy.checked && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold text-gray-800">
                      {policy.title}
                    </h4>
                    <p className="text-xs text-gray-500">{policy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button className="px-5 py-3 border border-primary text-primary rounded-lg font-jakarta font-medium hover:bg-primary hover:text-white transition-colors">
            Save Draft
          </button>
          <button className="px-5 py-3 bg-gray-200 text-white rounded-lg font-jakarta font-medium hover:bg-gray-300 transition-colors">
            Submit
          </button>
        </div>
      </div>
 </>
     
  );
};
export default CreateShopForm