import React from 'react'

interface FormSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-poppins font-semibold text-gray-800 mb-1">
          {title}
        </h2>
        <p className="text-gray-500 text-sm">
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
      <label className="block text-gray-900 font-semibold mb-2">
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
      <label className="block text-gray-900 font-semibold mb-2">
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
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  description, 
  recommendation, 
  className = ''
}) => {
  return (
    <div>
      {label && (
        <label className="block text-gray-900 font-semibold mb-2">
          {label}
        </label>
      )}
      <div className={`border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="font-poppins text-gray-800">{description}</p>
          {recommendation && (
            <p className="text-xs text-gray-500">{recommendation}</p>
          )}
        </div>
      </div>
    </div>
  )
}

const LanguageSelector: React.FC = () => {
  const selectedLanguages = ['English', 'Spanish', 'French']
  const availableLanguages = ['German']

  return (
    <div>
      <label className="block text-gray-900 font-semibold mb-2">
        Languages *
      </label>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {selectedLanguages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-primary text-white px-5 py-2 rounded-full"
            >
              <span className="text-sm">{lang}</span>
              <button className="w-4 h-4 flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {availableLanguages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-full cursor-pointer hover:bg-gray-50"
            >
              <span className="text-sm">{lang}</span>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="other Languages"
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  )
}


const socialLinks = [
    { platform: 'Website', url: 'https://www.cness.com/', icon: '🌐', active: true },
    { platform: 'Instagram', url: 'https://www.instagram.com/', icon: '📷', active: false },
    { platform: 'YouTube', url: 'https://www.youtube.com/', icon: '📺', active: false },
    { platform: 'Facebook', url: 'Paste facebook URL', icon: '📘', active: false },
    { platform: 'Twitter', url: 'Paste twitter URL', icon: '🐦', active: false },
  ]


  const TeamMemberCard: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-5">
      <div className="flex justify-between items-start">
        <FileUpload
          label="Profile image"
          description="Drag & drop or click to upload"
          recommendation="Recommended 120 X 120 px"
          className="w-35 aspect-square"
        />
        <button className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-900 font-semibold mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your teammate name"
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-gray-900 font-semibold mb-2">
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

  const policies = [
    {
      title: 'Terms & Conditions',
      description: 'Using this shop means you agree to our terms and conditions',
      checked: true
    },
    {
      title: 'Licensing & usage',
      description: 'Products included standard and commercial usage rights',
      checked: true
    },
    {
      title: 'Refund Policy',
      description: 'Refunds Available within 12 hours of Purchase',
      checked: false
    }
  ]

const CreateShopForm: React.FC = () => {
 return (
<div className="max-w-8xl mx-auto space-y-10">
      <header className="bg-white rounded-lg p-6">
        <h1 className="text-xl font-poppins font-semibold text-gray-800 mb-0">
          Create your shop
        </h1>
        <p className="text-gray-500">
          Set up your shop in minutes and start sharing your products with the world.
        </p>
      </header>

<div className="space-y-10">
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
        <DateInput
          label="Owner DOB *"
          required
        />
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
          <label className="block text-gray-900 font-semibold mb-2">
            Owner Address *
          </label>
          <textarea
            placeholder="Enter your Address"
            className="w-full h-30 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
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
          className="aspect-square"
        />
        <div className="lg:col-span-2">
          <FileUpload
            label="Shop Banner"
            description="Drag & drop or click to upload"
            recommendation="Recommended 1128 X 340 px"
            className="aspect-[1128/340]"
          />
        </div>
      </div>
    </div>
        </FormSection>

{/* banner Images Section */}
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
{/* Story & Positioning */}
     <FormSection
          title="Story & Positioning"
          description="Tell customers what you stand for and why they should they should choose you."
        >
         <div className="space-y-4">
      <div>
        <label className="block text-gray-900 font-semibold mb-2">
          About shop *
        </label>
        <textarea
          placeholder="Write upto 300 words"
          className="w-full h-50 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
        <div className="text-right text-gray-500 text-sm mt-1">0/300</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <label className="block text-gray-900 font-semibold mb-2">
            Why Choose Your Shop *
          </label>
          <textarea
            placeholder="Highlight your unique value"
            className="w-full h-50 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <div className="text-right text-gray-500 text-sm mt-1">0/200</div>
        </div>
        <div>
          <label className="block text-gray-900 font-semibold mb-2">
            Shop Philosophy *
          </label>
          <textarea
            placeholder="what principles gives your work?"
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
        <label className="block text-gray-900 font-semibold mb-2">
          Shop based in *
        </label>
        <div className="relative">
          <input
            type="text"
            value="Berlin, Germany"
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            readOnly
          />
          <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <LanguageSelector />
    </div>
        </FormSection>

{/* Social Media Links*/}

 <FormSection
          title="Social Media Links"
          description="Connect Your profiles so customers can follow and trust your band."
        >
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="relative">
          <input
            type="text"
            placeholder="Add social links"
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-3">
        {socialLinks.map((link, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md ${
              link.active ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded border border-gray-200 flex items-center justify-center">
                <span className="text-lg">{link.icon}</span>
              </div>
              <span className="text-gray-500">{link.url}</span>
            </div>
            <button className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
        </FormSection>
{/* Team Members Section */}
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
        {/* Store Policies Section */}

          <FormSection
          title="Store Polices"
          description="Please review the default policies below. By checking the box, you confirm that you agree to these terms."
        >
           <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center space-x-9">
        {policies.map((policy, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className={`w-6 h-6 rounded border ${
              policy.checked 
                ? 'bg-primary border-primary' 
                : 'border-primary'
            } flex items-center justify-center`}>
              {policy.checked && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-gray-800">
                {policy.title}
              </h4>
              <p className="text-xs text-gray-500">
                {policy.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
        </FormSection>    

        <div className="flex justify-end space-x-4 pt-6">
        <button className="px-5 py-3 border border-primary text-primary rounded-lg font-jakarta font-medium hover:bg-primary hover:text-white transition-colors">
          Save Draft
        </button>
        <button className="px-5 py-3 bg-gray-200 text-white rounded-lg font-jakarta font-medium hover:bg-gray-300 transition-colors">
          Submit
        </button>
      </div>

</div>
</div>
    



 )
}
export default CreateShopForm