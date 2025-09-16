// import Parterform from "../components/zohoforms/Patnerform";
import image from "../assets/partner.jpg";
import verified from "../assets/verified.svg";
import partner from "../assets/partner.png";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { useState } from "react";
import { createPartnerInquiry } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

const cards = [
  {
    title: "Brand Visibility",
    body: "Showcase your organization within the CNESS ecosystem.",
  },
  {
    title: "Access to Community",
    body: "Connect with certified professionals, organizations, and changemakers.",
  },
  {
    title: "Thought Leadership",
    body: "Position your brand as a purpose-driven leader.",
  },
  {
    title: "Collaboration Opportunities",
    body: "Co-create initiatives, events, and learning programs.",
  },
  {
    title: "Recognition & Credibility",
    body: "Get listed as an official CNESS Partner and build trust.",
  },
];

type PartnerPayload = {
  organization_name: string;
  contact_person_name: string;
  phone_number: string;
  email: string;
  industry_sector: string;
  website_link: string;
  about: string;
  reason_to_partner: string;
  organization_size: string;
  areas_of_collabration: string;
  status?: "pending" | "approved" | "rejected";
};

const BecomePartner = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<PartnerPayload>({
    organization_name: "",
    contact_person_name: "",
    phone_number: "",
    email: "",
    industry_sector: "",
    website_link: "",
    about: "",
    reason_to_partner: "",
    organization_size: "",
    areas_of_collabration: "",
    status: "pending",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.phone_number || data.phone_number.replace(/\D/g, "").length < 7) {
      showToast({
        message: "Please enter a valid phone number with at least 7 digits.",
        type: "error",
        duration: 1500,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createPartnerInquiry(data);

      if (res?.success?.statusCode === 200) {
        showToast({
          message: "Your partnership request has been submitted successfully.",
          type: "success",
          duration: 2000,
        });

        setData({
          organization_name: "",
          contact_person_name: "",
          phone_number: "",
          email: "",
          industry_sector: "",
          website_link: "",
          about: "",
          reason_to_partner: "",
          organization_size: "",
          areas_of_collabration: "",
          status: "pending",
        });
      }
    } catch (err: any) {
      console.error("Submit failed", err);
      const errorMsg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "We encountered an unexpected error. Please try again.";
      showToast({
        message: `Submission failed: ${errorMsg}`,
        type: "error",
        duration: 2500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-0">
        <div
          className="px-5 py-[10px]"
          style={{
            background:
              "linear-gradient(128.73deg, #FFFFFF 27.75%, #FEDFDF 100.43%, #F1A5E5 101.52%)",
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-stretch gap-5 py-10">
            <div className="w-full lg:w-1/3 py-[63px] px-[35px] gap-6 bg-white rounded-[40px]">
              <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[42px] lg:text-3xl xl:text-[42px] md:leading-[54px] lg:leading-[40px] xl:leading-[54px] text-wrap">
                <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                  Partner&nbsp;
                </span>
                <span className="text-[#1A1A1A]">with CNESS</span>
              </h1>
              <h5 className="py-3 font-['Open_Sans',Helvetica] text-base font-normal text-[#64748B] leading-[24px]">
                Collaborate to drive impact, innovation, and sustainable growth.
              </h5>
              <div className="pt-6">
                <button
                  className="py-4 px-5 font-['Open_Sans',Helvetica] text-black font-medium text-sm text-white rounded-full"
                  onClick={() => {
                    const element = document.getElementById("apply_partner");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  style={{
                    background:
                      "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                  }}
                >
                  Apply as a Partner
                </button>
              </div>
            </div>
            <div className="w-full h-full lg:w-2/3 rounded-[40px]">
              <img
                src={image}
                alt="partner main poster"
                className="w-full h-[427px] lg:h-full object-cover object-top pointer-events-none select-none rounded-[40px]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div className="py-12 flex flex-col justify-center items-center mx-auto">
          <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] leading-[54px]">
            <span className="text-black">What is </span>
            <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              Partner?
            </span>
          </h1>
          <h5 className="py-3 px-5 sm:px-10 md:px-20 font-['Open_Sans',Helvetica] font-normal text-base text-center text-[#64748B] leading-[24px]">
            Partner by CNESS is designed to bring together organisations,
            institutions, and change makers who share a vision for conscious
            growth. As a partner, you gain opportunities to collaborate,
            co-create, and amplify your impact through our ecosystem. The
            program helps you build visibility, connect with a purpose-driven
            community, and access exclusive resources. By partnering with CNESS,
            you not only strengthen your brand but also contribute to shaping a
            future of meaningful progress. Together, we create partnerships that
            drive purpose, innovation, and lasting change.
          </h5>
        </div>

        <div className="flex justify-center items-center mx-auto w-full bg-[#F5F7F9]">
          <div className="mx-auto w-full px-[20px] md:px-[60px] py-[50px]">
            <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] leading-[54px] text-center">
              <span className="text-black">Benefits of </span>
              <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                Being a Partner
              </span>
            </h1>
            <div className="mx-auto mt-8 w-full 2xl:w-7xl flex flex-wrap justify-center items-stretch gap-6 md:gap-8">
              {cards.map((c, i) => (
                <div key={i} className="w-full sm:w-[300px] flex">
                  <Card title={c.title} body={c.body} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="apply_partner" className="w-full bg-white py-10 px-5 lg:px-10">
          <h1 className="pb-10 font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] leading-[54px] text-center">
            <span className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              Application Form
            </span>
          </h1>

          <div className="grid xl:grid-cols-[275px_1fr] gap-10 items-stretch">
            <div className="hidden xl:flex rounded-[20px] overflow-hidden">
              <img
                src={partner}
                alt="Handshake"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="rounded-[25px] bg-[#F7F7F7] p-[20px] lg:p-[30px] flex flex-col">
              <form
                className="w-full flex flex-col flex-1"
                onSubmit={handleSubmit}
              >
                <div className="mx-auto w-full max-w-[760px] 2xl:max-w-none grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
                  <Field label="Organization Name">
                    <Input
                      name="organization_name"
                      placeholder="Enter your name"
                      value={data.organization_name}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field label="Contact Person Name">
                    <Input
                      name="contact_person_name"
                      placeholder="Enter your name"
                      value={data.contact_person_name}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field label="Phone Number">
                    <PhoneInputField
                      name="phone_number"
                      value={data.phone_number}
                      onChange={(val) =>
                        setData((d) => ({ ...d, phone_number: val }))
                      }
                      defaultCountry="us"
                      placeholder="Enter your phone number"
                    />
                  </Field>
                  <Field label="Email Address">
                    <Input
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      placeholder="Mail ID"
                      type="email"
                      required
                    />
                  </Field>

                  <Field label="Industry / Sector">
                    <Input
                      name="industry_sector"
                      placeholder="Enter your years of experience"
                      value={data.industry_sector}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Website / Social Media Link (if any)">
                    <Input
                      name="website_link"
                      placeholder="Enter your link"
                      value={data.website_link}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field label="Brief About Your Organization (150–200 words)">
                    <TextArea
                      name="about"
                      placeholder="Add Notes..."
                      value={data.about}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Why do you want to partner with CNESS?">
                    <TextArea
                      name="reason_to_partner"
                      placeholder="Add Notes..."
                      value={data.reason_to_partner}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field label="Organization Size (No. of employees / scale)">
                    <Input
                      name="organization_size"
                      placeholder="Select your Availability"
                      value={data.organization_size}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Areas of Collaboration (e.g., Events, Tech, etc.)">
                    <Input
                      name="areas_of_collabration"
                      placeholder="Select your Availability"
                      value={data.areas_of_collabration}
                      onChange={handleChange}
                    />
                  </Field>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full px-[20px] py-[10px] text-base font-normal text-white disabled:opacity-60"
                    style={{
                      background:
                        "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
                    }}
                  >
                    {isSubmitting ? "Submitting…" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <div className="rounded-xl border border-gray-200 bg-white p-0">
          <Parterform
            // Use your actual Marketplace form’s public URL (formperma link)
            src="https://forms.zohopublic.com/vijicn1/form/BecameaPartner/formperma/P95-zn1fVjDdH3Gfzw89mzvoDjgtPhOOdEKmZRE7crI"
            title="Became a partner Submission"
            minHeight={900}
          />
        </div> */}
      </div>
    </>
  );
};

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="w-full h-full rounded-[20px] border border-[#DFDFDF] bg-white p-5 flex flex-col justify-center items-center">
      <div className="mb-4 grid h-[58px] w-[58px] place-items-center rounded-[10px] bg-[#6340FF]/10 p-3">
        <img src={verified} className="w-[34px] h[34px]" />
      </div>

      <h3 className="text-lg font-medium text-[#222224] leading-[24px]">
        {title}
      </h3>
      <p className="mt-2 text-center text-sm font-normal leading-[24px] text-[#64748B]">
        {body}
      </p>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-[5px] ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[15px] text-black font-normal">{label}</span>
      {children}
    </label>
  );
}

function Input({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full h-full rounded-sm border-2 border-[#EEEEEE] bg-white pt-[15px] px-[12px] pb-[17px] text-[14px] outline-none focus:border-[#C9C9FF] placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs placeholder:leading-[20px]"
    />
  );
}

function TextArea({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
}) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      placeholder={placeholder}
      className="h-full w-full resize-none rounded-sm bg-white p-[10px] text-[14px] outline-none"
    />
  );
}

function PhoneInputField({
  name = "phone",
  value,
  onChange,
  defaultCountry = "us",
  placeholder = "Enter your phone number",
}: {
  name?: string;
  value: string;
  onChange: (val: string) => void;
  defaultCountry?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} />

      <PhoneInput
        value={value}
        onChange={onChange}
        defaultCountry={defaultCountry as any}
        forceDialCode
        placeholder={placeholder}
        required
        className="
          h-full rounded-sm border-2 border-[#EEEEEE] bg-white
          pt-[7px] pb-[8px] text-[14px] outline-none
          focus-within:border-[#C9C9FF]
        "
        inputClassName="
          flex-1 !border-0 outline-none !p-0 !m-0
          placeholder:text-[#6E7179] placeholder:font-normal placeholder:text-xs"
        countrySelectorStyleProps={{
          buttonClassName: `
              !bg-transparent !border-0 !shadow-none !rounded-none
              !px-2 flex items-center
              border-r border-[#EEEEEE]
            `,
          dropdownStyleProps: {
            className: "!z-[9999]",
          },
          dropdownArrowClassName: "hidden",
        }}
      />
    </div>
  );
}

export default BecomePartner;
