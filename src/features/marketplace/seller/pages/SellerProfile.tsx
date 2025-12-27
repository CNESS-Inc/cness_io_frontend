import InputField from '../components/SellerUI/InputField';
import PageHeader from '../components/SellerUI/PgHeader';
import SectionTitle from '../components/SellerUI/SectionLabel';
import Textarea from '../components/SellerUI/Textarea';
import UploadBox from '../components/SellerUI/Uploadsection';
import ToggleSwitch from '../components/SellerUI/Toggle';
import ActionButtons from '../components/SellerUI/SellerActionbuttons';
import PhoneField from '../components/SellerUI/PhoneNumber';
import TestimonialSection from '../../buyer/components/Testimonial';
import Footer from '../../buyer/components/Footer';
import ProfileImageUpload from '../components/SellerUI/Imageupload';
import defaultimage from "../../../../assets/defaultVector.svg";

export default function SellerProfile() {

  const handleFileUpload = (f: File)=>console.log(f.name)
  const handleToggleChange = (t:string,v:boolean)=>console.log(t,v)

  return (
    <>
    <div className="w-full flex flex-col pb-16">

      {/* HEADER */}
      <div className="px-6 pt-20 w-full">
        <PageHeader 
          title="My Seller Profile"
          description="Update your core identity & grow your presence professionally."
          icon="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-26/eTGZp1F226.png"
        />
      </div>

<div className="px-6 pt-10">
  <div className="border border-[#F3F3F3] p-6 rounded-2xl grid md:grid-cols-[260px_1fr] gap-10 items-start">

    {/* LEFT IMAGE */}
    <ProfileImageUpload 
      defaultImage={defaultimage}
      width={249}
      height={247}
      rounded={false}
      className="w-full max-w-[249px] mx-auto md:mx-0"
    />

    {/* RIGHT BLOCK */}
    <div className="flex flex-col gap-6 w-full">

      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Unique Name" required />
        <UploadBox 
          label="Know Me From Myself" 
          description="Share a quick intro video to build trust."
          onUpload={handleFileUpload}
        />
      </div>

      <Textarea 
        label="Short Introduction"
        required
        height="120px"
        description="Let your users dive deeper into your identity and what you offer. Write between 300 & 400 characters."
      />


 

  </div>
</div>
      </div>

      {/* SECTION 2 — PERSONAL INFORMATION */}
       <div className="mt-6">
      <SectionTitle 
        title="Personal Information"
        description="Your personal information remains private and will never be shared without your consent."
        icon="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-26/VAYAn32z2J.png"
      />

      <div className="px-6 mt-6">
        <div className="border border-[#F3F3F3] rounded-2xl p-6 grid gap-6">

          <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Tax ID / EIN" required
              description="Your Tax ID / EIN is securely protected and will only be used for verification purposes."
              />
            <InputField label="Primary Location" required value="Santa Monica, CA, USA" />
          </div>

          <div className="grid md:grid-cols-3 gap-6  mt-8">
            <InputField label="Email Address" value="nandhiji@cness.co" 
             description="Hidden to public"/>
            <PhoneField label="Phone Number" 
            value="+1 399 300 424"
            description="Hidden to public"/>
            <InputField label="Postal Code" />
          </div>

        </div>
      </div>
      </div>

      {/* SECTION 3 — SOCIAL */}
       <div className="mt-6">
      <SectionTitle 
        title="Social Information"
        description="Let your community know you better. Your details will be shown on your profile."
        icon="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-26/j9ZrrYOoS9.png"
      />

      <div className="px-6 mt-4">
        <div className="border border-[#F3F3F3] rounded-2xl p-6 grid md:grid-cols-2 gap-8">

          {/* BIG TEXTAREA */}
          <Textarea 
            label="Seller's Philosophy"
            height="420px"
            description="Your Sellerial Philosophy reflects the values and vision behind how you 
choose & present content."
          />

          {/* TOGGLE BOX */}
          <div className="rounded-xl bg-[#f6f6f6] p-6 flex flex-col gap-6">
            <ToggleSwitch 
              title="Allow User to Message You"
              description="Enabling this allows users to message you directly through 
the CNESS Messenger."
              onChange={(v)=>handleToggleChange("msg",v)}
            />
            <ToggleSwitch 
              title="Allow User to Resonate You"
              description="Enabling this allows users to follow you directly through 
the CNESS social media."
              onChange={(v)=>handleToggleChange("follow",v)}
            />
            <ToggleSwitch 
              title="Show Product Reviews"
              description="Enabling this shows customer feedback to help others 
make informed choices."
            />
            <ToggleSwitch 
              title="Show Top Products"
              description="Feature your top-performing products to help users quickly find 
what’s highly rated and frequently purchased."
            />
          </div>
        </div>
      </div>
</div>
      {/* WEBSITE & TAGS */}
      <div className="px-6 mt-8">
        <div className="grid md:grid-cols-2 gap-6">
          <InputField label="Website Link" />
          <InputField label="Tags" />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <ActionButtons />


    </div>
    <TestimonialSection />
    <Footer />
    </>
  );
}





