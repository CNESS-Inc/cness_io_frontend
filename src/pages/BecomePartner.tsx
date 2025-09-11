// import Parterform from "../components/zohoforms/Patnerform";
import image from '../assets/partner.jpg';
import verified from '../assets/verified.svg';
import partner from '../assets/partner.png';
import 'react-international-phone/style.css';
import { PhoneInput } from 'react-international-phone';
import { useState } from 'react';
import { createPartnerInquiry } from '../Common/ServerAPI';

export const COUNTRIES = [
  { code: "AF", dial: "+93", label: "+93" },
  { code: "AL", dial: "+355", label: "+355" },
  { code: "DZ", dial: "+213", label: "+213" },
  { code: "AS", dial: "+1684", label: "+1684" },
  { code: "AD", dial: "+376", label: "+376" },
  { code: "AO", dial: "+244", label: "+244" },
  { code: "AI", dial: "+1264", label: "+1264" },
  { code: "AG", dial: "+1268", label: "+1268" },
  { code: "AR", dial: "+54", label: "+54" },
  { code: "AM", dial: "+374", label: "+374" },
  { code: "AW", dial: "+297", label: "+297" },
  { code: "AU", dial: "+61", label: "+61" },
  { code: "AT", dial: "+43", label: "+43" },
  { code: "AZ", dial: "+994", label: "+994" },
  { code: "BS", dial: "+1242", label: "+1242" },
  { code: "BH", dial: "+973", label: "+973" },
  { code: "BD", dial: "+880", label: "+880" },
  { code: "BB", dial: "+1246", label: "+1246" },
  { code: "BY", dial: "+375", label: "+375" },
  { code: "BE", dial: "+32", label: "+32" },
  { code: "BZ", dial: "+501", label: "+501" },
  { code: "BJ", dial: "+229", label: "+229" },
  { code: "BM", dial: "+1441", label: "+1441" },
  { code: "BT", dial: "+975", label: "+975" },
  { code: "BO", dial: "+591", label: "+591" },
  { code: "BA", dial: "+387", label: "+387" },
  { code: "BW", dial: "+267", label: "+267" },
  { code: "BR", dial: "+55", label: "+55" },
  { code: "IO", dial: "+246", label: "+246" },
  { code: "VG", dial: "+1284", label: "+1284" },
  { code: "BN", dial: "+673", label: "+673" },
  { code: "BG", dial: "+359", label: "+359" },
  { code: "BF", dial: "+226", label: "+226" },
  { code: "BI", dial: "+257", label: "+257" },
  { code: "KH", dial: "+855", label: "+855" },
  { code: "CM", dial: "+237", label: "+237" },
  { code: "CA", dial: "+1", label: "+1" },
  { code: "CV", dial: "+238", label: "+238" },
  { code: "BQ", dial: "+599", label: "+599" },
  { code: "KY", dial: "+1345", label: "+1345" },
  { code: "CF", dial: "+236", label: "+236" },
  { code: "TD", dial: "+235", label: "+235" },
  { code: "CL", dial: "+56", label: "+56" },
  { code: "CN", dial: "+86", label: "+86" },
  { code: "CX", dial: "+61", label: "+61" },
  { code: "CC", dial: "+61", label: "+61" },
  { code: "CO", dial: "+57", label: "+57" },
  { code: "KM", dial: "+269", label: "+269" },
  { code: "CD", dial: "+243", label: "+243" },
  { code: "CG", dial: "+242", label: "+242" },
  { code: "CK", dial: "+682", label: "+682" },
  { code: "CR", dial: "+506", label: "+506" },
  { code: "CI", dial: "+225", label: "+225" },
  { code: "HR", dial: "+385", label: "+385" },
  { code: "CU", dial: "+53", label: "+53" },
  { code: "CW", dial: "+599", label: "+599" },
  { code: "CY", dial: "+357", label: "+357" },
  { code: "CZ", dial: "+420", label: "+420" },
  { code: "DK", dial: "+45", label: "+45" },
  { code: "DJ", dial: "+253", label: "+253" },
  { code: "DM", dial: "+1767", label: "+1767" },
  { code: "DO", dial: "+1", label: "+1" },
  { code: "EC", dial: "+593", label: "+593" },
  { code: "EG", dial: "+20", label: "+20" },
  { code: "SV", dial: "+503", label: "+503" },
  { code: "GQ", dial: "+240", label: "+240" },
  { code: "ER", dial: "+291", label: "+291" },
  { code: "EE", dial: "+372", label: "+372" },
  { code: "ET", dial: "+251", label: "+251" },
  { code: "FK", dial: "+500", label: "+500" },
  { code: "FO", dial: "+298", label: "+298" },
  { code: "FJ", dial: "+679", label: "+679" },
  { code: "FI", dial: "+358", label: "+358" },
  { code: "FR", dial: "+33", label: "+33" },
  { code: "GF", dial: "+594", label: "+594" },
  { code: "PF", dial: "+689", label: "+689" },
  { code: "GA", dial: "+241", label: "+241" },
  { code: "GM", dial: "+220", label: "+220" },
  { code: "GE", dial: "+995", label: "+995" },
  { code: "DE", dial: "+49", label: "+49" },
  { code: "GH", dial: "+233", label: "+233" },
  { code: "GI", dial: "+350", label: "+350" },
  { code: "GR", dial: "+30", label: "+30" },
  { code: "GL", dial: "+299", label: "+299" },
  { code: "GD", dial: "+1473", label: "+1473" },
  { code: "GP", dial: "+590", label: "+590" },
  { code: "GU", dial: "+1671", label: "+1671" },
  { code: "GT", dial: "+502", label: "+502" },
  { code: "GG", dial: "+44", label: "+44" },
  { code: "GN", dial: "+224", label: "+224" },
  { code: "GW", dial: "+245", label: "+245" },
  { code: "GY", dial: "+592", label: "+592" },
  { code: "HT", dial: "+509", label: "+509" },
  { code: "HN", dial: "+504", label: "+504" },
  { code: "HK", dial: "+852", label: "+852" },
  { code: "HU", dial: "+36", label: "+36" },
  { code: "IS", dial: "+354", label: "+354" },
  { code: "IN", dial: "+91", label: "+91" },
  { code: "ID", dial: "+62", label: "+62" },
  { code: "IR", dial: "+98", label: "+98" },
  { code: "IQ", dial: "+964", label: "+964" },
  { code: "IE", dial: "+353", label: "+353" },
  { code: "IM", dial: "+44", label: "+44" },
  { code: "IL", dial: "+972", label: "+972" },
  { code: "IT", dial: "+39", label: "+39" },
  { code: "JM", dial: "+1876", label: "+1876" },
  { code: "JP", dial: "+81", label: "+81" },
  { code: "JE", dial: "+44", label: "+44" },
  { code: "JO", dial: "+962", label: "+962" },
  { code: "KZ", dial: "+7", label: "+7" },
  { code: "KE", dial: "+254", label: "+254" },
  { code: "KI", dial: "+686", label: "+686" },
  { code: "XK", dial: "+383", label: "+383" }, // Kosovo (not ISO official, commonly XK)
  { code: "KW", dial: "+965", label: "+965" },
  { code: "KG", dial: "+996", label: "+996" },
  { code: "LA", dial: "+856", label: "+856" },
  { code: "LV", dial: "+371", label: "+371" },
  { code: "LB", dial: "+961", label: "+961" },
  { code: "LS", dial: "+266", label: "+266" },
  { code: "LR", dial: "+231", label: "+231" },
  { code: "LY", dial: "+218", label: "+218" },
  { code: "LI", dial: "+423", label: "+423" },
  { code: "LT", dial: "+370", label: "+370" },
  { code: "LU", dial: "+352", label: "+352" },
  { code: "MO", dial: "+853", label: "+853" },
  { code: "MK", dial: "+389", label: "+389" },
  { code: "MG", dial: "+261", label: "+261" },
  { code: "MW", dial: "+265", label: "+265" },
  { code: "MY", dial: "+60", label: "+60" },
  { code: "MV", dial: "+960", label: "+960" },
  { code: "ML", dial: "+223", label: "+223" },
  { code: "MT", dial: "+356", label: "+356" },
  { code: "MH", dial: "+692", label: "+692" },
  { code: "MQ", dial: "+596", label: "+596" },
  { code: "MR", dial: "+222", label: "+222" },
  { code: "MU", dial: "+230", label: "+230" },
  { code: "YT", dial: "+262", label: "+262" },
  { code: "MX", dial: "+52", label: "+52" },
  { code: "FM", dial: "+691", label: "+691" },
  { code: "MD", dial: "+373", label: "+373" },
  { code: "MC", dial: "+377", label: "+377" },
  { code: "MN", dial: "+976", label: "+976" },
  { code: "ME", dial: "+382", label: "+382" },
  { code: "MS", dial: "+1664", label: "+1664" },
  { code: "MA", dial: "+212", label: "+212" },
  { code: "MZ", dial: "+258", label: "+258" },
  { code: "MM", dial: "+95", label: "+95" },
  { code: "NA", dial: "+264", label: "+264" },
  { code: "NR", dial: "+674", label: "+674" },
  { code: "NP", dial: "+977", label: "+977" },
  { code: "NL", dial: "+31", label: "+31" },
  { code: "NC", dial: "+687", label: "+687" },
  { code: "NZ", dial: "+64", label: "+64" },
  { code: "NI", dial: "+505", label: "+505" },
  { code: "NE", dial: "+227", label: "+227" },
  { code: "NG", dial: "+234", label: "+234" },
  { code: "NU", dial: "+683", label: "+683" },
  { code: "NF", dial: "+672", label: "+672" },
  { code: "KP", dial: "+850", label: "+850" },
  { code: "MP", dial: "+1670", label: "+1670" },
  { code: "NO", dial: "+47", label: "+47" },
  { code: "OM", dial: "+968", label: "+968" },
  { code: "PK", dial: "+92", label: "+92" },
  { code: "PW", dial: "+680", label: "+680" },
  { code: "PS", dial: "+970", label: "+970" },
  { code: "PA", dial: "+507", label: "+507" },
  { code: "PG", dial: "+675", label: "+675" },
  { code: "PY", dial: "+595", label: "+595" },
  { code: "PE", dial: "+51", label: "+51" },
  { code: "PH", dial: "+63", label: "+63" },
  { code: "PL", dial: "+48", label: "+48" },
  { code: "PT", dial: "+351", label: "+351" },
  { code: "PR", dial: "+1", label: "+1" },
  { code: "QA", dial: "+974", label: "+974" },
  { code: "RE", dial: "+262", label: "+262" },
  { code: "RO", dial: "+40", label: "+40" },
  { code: "RU", dial: "+7", label: "+7" },
  { code: "RW", dial: "+250", label: "+250" },
  { code: "BL", dial: "+590", label: "+590" },
  { code: "SH", dial: "+290", label: "+290" },
  { code: "KN", dial: "+1869", label: "+1869" },
  { code: "LC", dial: "+1758", label: "+1758" },
  { code: "MF", dial: "+590", label: "+590" },
  { code: "PM", dial: "+508", label: "+508" },
  { code: "VC", dial: "+1784", label: "+1784" },
  { code: "WS", dial: "+685", label: "+685" },
  { code: "SM", dial: "+378", label: "+378" },
  { code: "ST", dial: "+239", label: "+239" },
  { code: "SA", dial: "+966", label: "+966" },
  { code: "SN", dial: "+221", label: "+221" },
  { code: "RS", dial: "+381", label: "+381" },
  { code: "SC", dial: "+248", label: "+248" },
  { code: "SL", dial: "+232", label: "+232" },
  { code: "SG", dial: "+65", label: "+65" },
  { code: "SX", dial: "+1721", label: "+1721" },
  { code: "SK", dial: "+421", label: "+421" },
  { code: "SI", dial: "+386", label: "+386" },
  { code: "SB", dial: "+677", label: "+677" },
  { code: "SO", dial: "+252", label: "+252" },
  { code: "ZA", dial: "+27", label: "+27" },
  { code: "KR", dial: "+82", label: "+82" },
  { code: "SS", dial: "+211", label: "+211" },
  { code: "ES", dial: "+34", label: "+34" },
  { code: "LK", dial: "+94", label: "+94" },
  { code: "SD", dial: "+249", label: "+249" },
  { code: "SR", dial: "+597", label: "+597" },
  { code: "SJ", dial: "+47", label: "+47" },
  { code: "SZ", dial: "+268", label: "+268" },
  { code: "SE", dial: "+46", label: "+46" },
  { code: "CH", dial: "+41", label: "+41" },
  { code: "SY", dial: "+963", label: "+963" },
  { code: "TW", dial: "+886", label: "+886" },
  { code: "TJ", dial: "+992", label: "+992" },
  { code: "TZ", dial: "+255", label: "+255" },
  { code: "TH", dial: "+66", label: "+66" },
  { code: "TL", dial: "+670", label: "+670" },
  { code: "TG", dial: "+228", label: "+228" },
  { code: "TK", dial: "+690", label: "+690" },
  { code: "TO", dial: "+676", label: "+676" },
  { code: "TT", dial: "+1868", label: "+1868" },
  { code: "TN", dial: "+216", label: "+216" },
  { code: "TR", dial: "+90", label: "+90" },
  { code: "TM", dial: "+993", label: "+993" },
  { code: "TC", dial: "+1649", label: "+1649" },
  { code: "TV", dial: "+688", label: "+688" },
  { code: "VI", dial: "+1340", label: "+1340" },
  { code: "UG", dial: "+256", label: "+256" },
  { code: "UA", dial: "+380", label: "+380" },
  { code: "AE", dial: "+971", label: "+971" },
  { code: "GB", dial: "+44", label: "+44" },
  { code: "US", dial: "+1", label: "+1" },
  { code: "UY", dial: "+598", label: "+598" },
  { code: "UZ", dial: "+998", label: "+998" },
  { code: "VU", dial: "+678", label: "+678" },
  { code: "VA", dial: "+39", label: "+39" },
  { code: "VE", dial: "+58", label: "+58" },
  { code: "VN", dial: "+84", label: "+84" },
  { code: "WF", dial: "+681", label: "+681" },
  { code: "EH", dial: "+212", label: "+212" },
  { code: "YE", dial: "+967", label: "+967" },
  { code: "ZM", dial: "+260", label: "+260" },
  { code: "ZW", dial: "+263", label: "+263" },
  { code: "AX", dial: "+358", label: "+358" }
];

const cards = [
  {
    title: 'Brand Visibility',
    body: 'Showcase your organization within the CNESS ecosystem.',
  },
  {
    title: 'Access to Community',
    body: 'Connect with certified professionals, organizations, and changemakers.',
  },
  {
    title: 'Thought Leadership',
    body: 'Position your brand as a purpose-driven leader.',
  },
  {
    title: 'Collaboration Opportunities',
    body: 'Co-create initiatives, events, and learning programs.',
  },
  {
    title: 'Recognition & Credibility',
    body: 'Get listed as an official CNESS Partner and build trust.',
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
  status?: 'pending' | 'approved' | 'rejected';
};

const BecomePartner = () => {
  const [data, setData] = useState<PartnerPayload>({
    organization_name: '',
    contact_person_name: '',
    phone_number: '',
    email: '',
    industry_sector: '',
    website_link: '',
    about: '',
    reason_to_partner: '',
    organization_size: '',
    areas_of_collabration: '',
    status: 'pending',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const payload: PartnerPayload = { ...data, status: 'pending' };
      await createPartnerInquiry(payload);
      setData({
        organization_name: '',
        contact_person_name: '',
        phone_number: '',
        email: '',
        industry_sector: '',
        website_link: '',
        about: '',
        reason_to_partner: '',
        organization_size: '',
        areas_of_collabration: '',
        status: 'pending',
      });
    } catch (err: any) {
      console.error('Submit failed', err);
      alert(err?.response?.data?.error?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-0">
        <div className="px-5 py-[10px]"
          style={{
            background:
              "linear-gradient(128.73deg, #FFFFFF 27.75%, #FEDFDF 100.43%, #F1A5E5 101.52%)",
          }}
        >
          <div className="flex justify-center items-center gap-5 pb-10">
            <div className="w-full h-full lg:w-1/3 py-[63px] px-[35px] gap-6 bg-white rounded-[40px]">
              <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[42px] leading-[54px]">
                <span
                  className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
                >
                  Partner&nbsp;
                </span>
                <span className="text-[#1A1A1A]">with CNESS</span>
              </h1>
              <h5 className="py-3 font-['Open_Sans',Helvetica] text-base font-normal text-[#64748B] leading-[24px]">
                Collaborate to drive impact, innovation, and sustainable growth.
              </h5>
              <div className="pt-6">
                <button className="py-4 px-5 font-['Open_Sans',Helvetica] text-black font-medium text-sm text-white rounded-full"
                  style={{
                    background: "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
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
                className="w-full h-[427px] lg:h-full pointer-events-none select-none rounded-[40px]"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <div className="py-12 flex flex-col justify-center items-center mx-auto">
          <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] leading-[54px]">
            <span className="text-black">What is </span>
            <span
              className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
            >
              Partner?
            </span>
          </h1>
          <h5 className="py-3 px-20 font-['Open_Sans',Helvetica] font-normal text-base text-center text-[#64748B] leading-[24px]">
            Partner by CNESS is designed to bring together organisations, institutions, and change makers who share a vision for conscious growth. As a partner, you gain opportunities to collaborate, co-create, and amplify your impact through our ecosystem. The program helps you build visibility, connect with a purpose-driven community, and access exclusive resources. By partnering with CNESS, you not only strengthen your brand but also contribute to shaping a future of meaningful progress. Together, we create partnerships that drive purpose, innovation, and lasting change.
          </h5>
        </div>
        <div className="flex justify-center items-center mx-auto w-full bg-[#F5F7F9]">
          <div className="mx-auto max-w-[1160px] px-[60px] py-[50px]">
            <h1 className="font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] leading-[54px] text-center">
              <span className="text-black">Benefits of </span>
              <span
                className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
              >
                Being a Partner
              </span>
            </h1>

            <div className="mx-auto mt-8 grid w-full max-w-[982px] grid-cols-1 gap-10 md:grid-cols-3">
              {cards.slice(0, 3).map((c, i) => (
                <Card key={i} title={c.title} body={c.body} />
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 w-fit mx-auto">
              {cards.slice(3).map((c, i) => (
                <Card key={i} title={c.title} body={c.body} />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full bg-white py-10 px-10">
          <h1 className="pb-10 font-['Poppins',Helvetica] font-medium text-2xl md:text-[32px] leading-[54px] text-center">
            <span
              className="bg-gradient-to-b from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
            >
              Application Form
            </span>
          </h1>

          <div className="grid grid-cols-[275px_1fr] gap-10 items-stretch">
            <div className="rounded-[20px] overflow-hidden">
              <img
                src={partner}
                alt="Handshake"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="rounded-[25px] bg-[#F7F7F7] p-[30px] flex flex-col">
              <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
                <div className="mx-auto w-full max-w-[760px] grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <Field label="Organization Name">
                    <Input name="organization_name" placeholder="Enter your name" value={data.organization_name}
                      onChange={handleChange} required />
                  </Field>
                  <Field label="Contact Person Name">
                    <Input name="contact_person_name" placeholder="Enter your name" value={data.contact_person_name}
                      onChange={handleChange} required />
                  </Field>

                  <Field label="Phone Number">
                    <PhoneInputField name="phone_number" value={data.phone_number}
                      onChange={(val) => setData((d) => ({ ...d, phone_number: val }))}
                      defaultCountry="us"
                      placeholder="Enter your phone number" />
                  </Field>
                  <Field label="Email Address">
                    <Input name="email" value={data.email}
                      onChange={handleChange} placeholder="Mail ID" type="email" required />
                  </Field>

                  <Field label="Industry / Sector">
                    <Input name="industry_sector" placeholder="Enter your years of experience" value={data.industry_sector}
                      onChange={handleChange} />
                  </Field>
                  <Field label="Website / Social Media Link (if any)">
                    <Input name="website_link" placeholder="Enter your link" value={data.website_link}
                      onChange={handleChange} />
                  </Field>

                  <Field label="Brief About Your Organization (150–200 words)">
                    <TextArea name="about" placeholder="Add Notes..." value={data.about}
                      onChange={handleChange} />
                  </Field>
                  <Field label="Why do you want to partner with CNESS?">
                    <TextArea name="reason_to_partner" placeholder="Add Notes..." value={data.reason_to_partner}
                      onChange={handleChange} />
                  </Field>

                  <Field label="Organization Size (No. of employees / scale)">
                    <Input name="organization_size" placeholder="Select your Availability" value={data.organization_size}
                      onChange={handleChange} />
                  </Field>
                  <Field label="Areas of Collaboration (e.g., Events, Tech, etc.)">
                    <Input name="areas_of_collabration" placeholder="Select your Availability" value={data.areas_of_collabration}
                      onChange={handleChange} />
                  </Field>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full px-[20px] py-[10px] text-base font-normal text-white disabled:opacity-60"
                    style={{
                      background:
                        'linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)',
                    }}
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit'}
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
  )
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="w-full md:w-[300px] h-full rounded-[20px] border border-[#DFDFDF] bg-white p-5 flex flex-col justify-center items-center">
      <div className="mb-4 grid h-[58px] w-[58px] place-items-center rounded-[10px] bg-[#6340FF]/10 p-3">
        <img
          src={verified}
          className="w-[34px] h[34px]"
        />
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
    <label className={`flex flex-col gap-[5px] ${full ? 'md:col-span-2' : ''}`}>
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
  type = 'text',
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

export default BecomePartner