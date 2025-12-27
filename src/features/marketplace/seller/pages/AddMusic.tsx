import InputField from '../components/SellerUI/InputField';
import PageHeader from '../components/SellerUI/PgHeader';
import SectionTitle from '../components/SellerUI/SectionLabel';
import Textarea from '../components/SellerUI/Textarea';
import UploadBox from '../components/SellerUI/Uploadsection';
import ActionButtons from '../components/SellerUI/SellerActionbuttons';
import TestimonialSection from '../../buyer/components/Testimonial';
import Footer from '../../buyer/components/Footer';
import ProfileImageUpload from '../components/SellerUI/Imageupload';
import defaultimage from "../../../../assets/defaultmusic.svg";
import addmusic from "../../../../assets/addmusic.svg";
import uploadtrack from "../../../../assets/uploadtrack.svg";
import price from "../../../../assets/price.svg";
import AudioUpload from "../components/SellerUI/AudioUpload";
import { Plus } from 'lucide-react';
import SamplerTrack from '../components/SellerUI/Sampletrack';
import Toggle from '../components/SellerUI/Toggle';
export default function AddMusic() {

  const handleFileUpload = (f: File)=>console.log(f.name)

  return (
    <>
    <div className="w-full flex flex-col pb-16">

      {/* HEADER */}
      <div className="px-6 pt-20 w-full">
        <PageHeader 
          title="Add Product (Music)"
          description="Add a short summary that clearly describes what the product is and how it benefits users."
          icon={addmusic}
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
        <InputField label="Product Name" required />
        <UploadBox 
          label="Echoes of Imagination" 
          description="Share a brief video that captures the essence your imagination"
          onUpload={handleFileUpload}
        />
      </div>

      <Textarea 
        label="Short Brief"
        required
        height="120px"
        description="A brief explanation that allows users to easily understand the product."
      />


 

  </div>
</div>
      </div>

      {/* SECTION 2 — Upload Track */}
       <div className="mt-6">
      <SectionTitle 
        title="Upload Track"
        description="Only MP3 format is accepted. Please ensure you own the rights to your content and any background music used. Refer to our content guidelines for details."
        icon={uploadtrack}
      />

<AudioUpload 
icon={<Plus size={15} strokeWidth={2} />}
  title="Add your audio track"
  description="Upload your audio file to share your music, podcast, or sound creation."
  required
  showWarning
   warningMessage="Before uploading, please take a moment to review our recording tips provided here."
/>
        <div className="mt-4">
 <SamplerTrack 
  title="Upload a sample track"
  description="Add a 30-second audio preview highlighting the memorable part of your free audio."
  onUpload={(file)=>console.log("Selected:", file.name)}
/>
</div>
      </div>

      {/* SECTION 3 — SOCIAL */}
       <div className="mt-6">
      <SectionTitle 
        title="Pricing Information"
        description="Let your community know you better. Your details will be shown on your profile."
        icon={price}
      />


      

      <div className="px-6 mt-4">
        <div className="border border-[#F3F3F3] rounded-2xl p-6 grid md:grid-cols-3 gap-8">
        <InputField label="Product Price" required />
         <InputField label="Discount Price" required />
          <InputField label="Discount percentage" required />

        </div>

      </div>
              <div className="px-6 mt-4">

<Toggle
  title="Enable ask your price"
  description="Enable this option to let users request a discounted price. If you approve the request, you will earn loyalty points."
  showAction                 // show right button
  actionLabel="Know more"    // button text
  onActionClick={() => console.log("Open modal with details")}
 />
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





