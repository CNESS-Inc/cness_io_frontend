import React, { useEffect } from 'react'
import { useState } from 'react'
import { CreateSellerShop, GetCountryDetails, GetSellerShop, GetUserScoreResult, RemoveAllExtraBanner, RemoveSellerDocument, RemoveSpecificExtraBanner, RemoveTeamMember, RemoveTeamMemberImage, SaveExtraBanners, UpdateSellerShop, UploadSellerDocument } from '../Common/ServerAPI';
import { useToast } from '../components/ui/Toast/ToastProvider';
import { CiFacebook, CiInstagram, CiLinkedin, CiYoutube } from 'react-icons/ci';
import { RiTwitterXFill } from 'react-icons/ri';
import { IoLogoTiktok } from 'react-icons/io5';
import { FaPinterestP } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import uploadimg from '../assets/upload.svg';

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

// interface InputFieldProps {
//   label: string
//   placeholder: string
//   required?: boolean
//   fullWidth?: boolean
//   type?: string
//   name: string
//   value: string
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   error?: string
// }

// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   placeholder,
//   name,
//   required = false,
//   fullWidth = false,
//   type = 'text',
//   value,
//   onChange,
//   error
// }) => {
//   return (
//     <div className={fullWidth ? 'col-span-full' : ''}>
//       <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">
//         {label}
//       </label>
//       <input
//         type={type}
//         placeholder={placeholder}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//         required={required}
//       />
//       {error && <div className="text-red-500">{error}</div>}
//     </div>
//   )
// }

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    let maxLength = label === "YYYY" ? 4 : 2;
    const truncated = inputValue.slice(0, maxLength);
    onChange(truncated);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        placeholder={label}
        onChange={handleChange}
        className={`${label === "YYYY" ? "w-20" : "w-14"} px-3 py-2 border ${error ? "border-red-500" : "border-gray-200"
          } rounded-md text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        maxLength={label === "YYYY" ? 4 : 2}
      />
    </div>
  );
};

const socialMediaPlatforms = [
  { key: 'facebook_url', name: 'Facebook', icon: <CiFacebook size={25} className='text-gray-500' /> },
  { key: 'instagram_url', name: 'Instagram', icon: <CiInstagram size={25} className='text-gray-500' /> },
  { key: 'youtube_url', name: 'YouTube', icon: <CiYoutube size={25} className='text-gray-500' /> },
  { key: 'twitter_url', name: 'Twitter', icon: <RiTwitterXFill size={25} className='text-gray-500' /> },
  { key: 'tiktok_url', name: 'Tiktok', icon: <IoLogoTiktok size={25} className='text-gray-500' /> },
  { key: 'linkedin_url', name: 'LinkedIn', icon: <CiLinkedin size={25} className='text-gray-500' /> },
  { key: 'pinterest_url', name: 'Pinterest', icon: <FaPinterestP size={25} className='text-gray-500' /> },
] as const;

const availableLanguages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
];

interface FileUploadProps {
  label?: string;
  description?: string;
  recommendation?: string;
  required?: boolean;
  className?: string;
  fileType: string;
  onUploadSuccess?: (url: string) => void;
  defaultPreview?: string;
  error?: string;
  onRemove?: () => Promise<void>;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  recommendation,
  required,
  className,
  fileType,
  onUploadSuccess,
  defaultPreview,
  error,
  onRemove
}) => {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setPreview(defaultPreview || null);
  }, [defaultPreview]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (fileType === 'government-id') {
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        showToast({
          message: "Only image or PDF files are allowed",
          type: "error",
          duration: 3000,
        });
        return;
      }
    } else {
      if (!file.type.startsWith("image/")) {
        showToast({
          message: "Please upload an image file",
          type: "error",
          duration: 3000,
        });
        return;
      }
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        message: "File size should be less than 5MB",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append(getFormDataKey(fileType), file);

    try {
      const response = await UploadSellerDocument(fileType, formData);
      const responseData = response?.data?.data;

      let uploadedUrl = "";

      if (fileType === 'extra-banners') {
        const banners = responseData?.extra_banners;
        if (banners && banners.length > 0) {
          const latestBanner = banners[banners.length - 1];
          uploadedUrl = latestBanner.banner_url;
        }
      } else if (fileType === 'team-member-image') {
        uploadedUrl = responseData?.profile_image_url || "";
      } else if (fileType === 'government-id') {
        uploadedUrl = responseData?.secure_url || "";
      } else if (fileType === 'shop-logo') {
        uploadedUrl = responseData?.shop_logo_url || "";
      } else if (fileType === 'shop-banner') {
        uploadedUrl = responseData?.shop_banner_url || "";
      }

      if (uploadedUrl) {
        setPreview(uploadedUrl);
        onUploadSuccess?.(uploadedUrl);
        showToast({
          message: "File uploaded successfully",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Upload failed",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (onRemove) {
      await onRemove();
      setPreview(null);
    } else {
      try {
        await RemoveSellerDocument(fileType);
        setPreview(null);
        onUploadSuccess?.("");
        showToast({
          message: "File removed successfully",
          type: "success",
          duration: 3000,
        });
      } catch (error: any) {
        showToast({
          message: "Failed to remove file",
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  const getFormDataKey = (type: string): string => {
    const keyMap: { [key: string]: string } = {
      "government-id": "government_id_document",
      "shop-logo": "shop_logo",
      "shop-banner": "shop_banner",
      "extra-banners": "extra_banners",
      "team-member-image": "profile_image",
    };
    return keyMap[type] || type;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div>
      {label && (
        <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-4">
          {label} {required && "*"}
        </label>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-dashed border-[#CBD5E1]"
          } ${className}`}
        style={{
          borderStyle: "dashed",
          borderWidth: "3px",
          borderRadius: "6px",
          // @ts-ignore — allow non-standard style prop
          borderDasharray: "8,8",
        }}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className={`${fileType === 'team-member-image' ? 'w-[90px] h-[90px]' : 'w-[140px] h-[140px]'} object-cover rounded-lg`}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <img
                src={uploadimg}
                alt="upload"
                className={`w-10 h-10 text-gray-400 transition-all duration-300 mt-8`}
              />
              {isUploading ? (
                <p className="text-primary">Uploading...</p>
              ) : (
                <>
                  <p className="font-[poppins] text-[16px] text-[#242E3A]">{description || "Drag & drop or click to upload"}</p>
                  {recommendation && (
                    <p className="font-['Open_Sans'] text-[14px] text-[#665B5B]">
                      {recommendation}
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

const CreateShopForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isEligible, setIsEligible] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [country, setCountry] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const [formData, setFormData] = useState({
    owner_full_name: "",
    owner_date_of_birth: "",
    owner_mobile_number: "",
    ssn_or_ein: "",
    owner_address: "",
    government_id_document: "",
    shop_name: "",
    shop_logo: "",
    shop_banner: "",
    about_shop: "",
    why_choose_your_shop: "",
    shop_philosophy: "",
    shop_base_country_id: "",
    languages_supported: [] as string[],
    social_links: {
      facebook_url: "",
      instagram_url: "",
      youtube_url: "",
      twitter_url: "",
      tiktok_url: "",
      linkedin_url: "",
      pinterest_url: "",
    },
    team_members: [] as Array<{
      id?: string;
      name: string;
      role: string;
      profile_image: string;
      display_order: number;
    }>,
    store_policies: {
      terms_and_conditions: "By using this shop, you agree to our terms and conditions. We reserve the right to update these terms at any time.",
      licensing_and_usage: "All products include standard and commercial usage rights. Resale of digital files is prohibited.",
      refund_policy: "Refunds are available within 12 hours of purchase if you haven't downloaded the product. After download, all sales are final.",
    },
  });

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.owner_full_name.trim()) newErrors.owner_full_name = "Owner name is required";
    if (!formData.owner_date_of_birth) newErrors.owner_date_of_birth = "Date of birth is required";
    if (!formData.owner_mobile_number.trim()) newErrors.owner_mobile_number = "Mobile number is required";
    if (!formData.ssn_or_ein.trim()) newErrors.ssn_or_ein = "SSN/EIN is required";
    if (!formData.owner_address.trim()) newErrors.owner_address = "Address is required";
    if (!formData.government_id_document) newErrors.government_id_document = "Government ID is required";
    if (!formData.shop_name.trim()) newErrors.shop_name = "Shop name is required";
    if (!formData.shop_logo) newErrors.shop_logo = "Shop logo is required";
    if (!formData.shop_banner) newErrors.shop_banner = "Shop banner is required";
    if (!formData.about_shop.trim()) newErrors.about_shop = "About shop is required";
    if (!formData.why_choose_your_shop.trim()) newErrors.why_choose_your_shop = "This field is required";
    if (!formData.shop_philosophy.trim()) newErrors.shop_philosophy = "Shop philosophy is required";
    if (!formData.shop_base_country_id) newErrors.shop_base_country_id = "Country is required";

    if (formData.owner_mobile_number && !/^\+?[\d\s-()]+$/.test(formData.owner_mobile_number)) {
      newErrors.owner_mobile_number = "Invalid mobile number format";
    }

    if (formData.ssn_or_ein && !/^\d{3}-\d{2}-\d{4}$/.test(formData.ssn_or_ein)) {
      newErrors.ssn_or_ein = "Invalid format. Use XXX-XX-XXXX";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.text-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }

    return Object.keys(newErrors).length === 0;
  };

  const [policies, setPolicies] = useState([
    {
      title: "Terms & Conditions",
      description: "Using this shop means you agree to our terms and conditions",
      checked: false,
    },
    {
      title: "Licensing & usage",
      description: "Products include standard and commercial usage rights",
      checked: false,
    },
    {
      title: "Refund Policy",
      description: "Refunds available within 12 hours of purchase",
      checked: false,
    },
  ]);

  const togglePolicy = (index: number) => {
    setPolicies((prev) =>
      prev.map((policy, i) =>
        i === index ? { ...policy, checked: !policy.checked } : policy
      )
    );
  };

  const [extraBanners, setExtraBanners] = useState<Array<{ id?: string; url: string }>>([
    { url: "" },
    { url: "" },
    { url: "" }
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchRatingDetails();
    loadShopData();
    GetCountry();
  }, []);

  const fetchRatingDetails = async () => {
    try {
      const res = await GetUserScoreResult();
      const badge = res?.data?.data?.badge
      if (badge === null) {
        setIsEligible(false)
      } else {
        setIsEligible(true)
      }
    } catch (error: any) {
      console.log('error', error)
    }
  };

  const GetCountry = async () => {
    try {
      const response = await GetCountryDetails();
      setCountry(response.data.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const loadShopData = async () => {
    try {
      const response = await GetSellerShop();
      if (response?.data?.data) {
        const data = response.data.data;

        // if (data.verification_status === "pending") {
        //   setIsSubmitted(true);
        //   return;
        // }

        if (data.verification_status === "approved") {
          setIsApproved(true);
          return;
        }

        setFormData({
          owner_full_name: data.owner_full_name || "",
          owner_date_of_birth: data.owner_date_of_birth || "",
          owner_mobile_number: data.owner_mobile_number || "",
          ssn_or_ein: data.ssn_or_ein || "",
          owner_address: data.owner_address || "",
          government_id_document: data.government_id_document || "",
          shop_name: data?.shop?.shop_name || "",
          shop_logo: data?.shop?.shop_logo || "",
          shop_banner: data?.shop?.shop_banner || "",
          about_shop: data?.shop?.about_shop || "",
          why_choose_your_shop: data?.shop?.why_choose_your_shop || "",
          shop_philosophy: data?.shop?.shop_philosophy || "",
          shop_base_country_id: data?.shop?.shop_base_country_id || "",
          languages_supported: data?.shop?.languages_supported || [],
          social_links: {
            facebook_url: data?.shop?.social_links?.facebook_url || "",
            instagram_url: data?.shop?.social_links?.instagram_url || "",
            youtube_url: data?.shop?.social_links?.youtube_url || "",
            twitter_url: data?.shop?.social_links?.twitter_url || "",
            tiktok_url: data?.shop?.social_links?.tiktok_url || "",
            linkedin_url: data?.shop?.social_links?.linkedin_url || "",
            pinterest_url: data?.shop?.social_links?.pinterest_url || "",
          },
          // Load team members with IDs
          team_members: data?.shop?.team_members?.map((member: any) => ({
            id: member.id,
            name: member.name || "",
            role: member.role || "",
            profile_image: member.profile_image || "",
            display_order: member.display_order || 0,
          })) || [],
          store_policies: data.shop?.store_policies || {
            terms_and_conditions: "By using this shop, you agree to our terms and conditions. We reserve the right to update these terms at any time.",
            licensing_and_usage: "All products include standard and commercial usage rights. Resale of digital files is prohibited.",
            refund_policy: "Refunds are available within 12 hours of purchase if you haven't downloaded the product. After download, all sales are final.",
          },
        });

        // Load extra banners with IDs
        if (data?.shop?.extra_banners && Array.isArray(data.shop.extra_banners)) {
          const bannerData = data.shop.extra_banners.map((b: any) => ({
            id: b.id,
            url: b.banner_url || "",
          }));

          const newBanners = [{ url: "" }, { url: "" }, { url: "" }];
          bannerData.forEach((banner: { id?: string; url: string }, idx: number) => {
            if (idx < 3) newBanners[idx] = banner;
          });
          setExtraBanners(newBanners);
        }

        if (data.owner_date_of_birth) {
          const [y, m, d] = data.owner_date_of_birth.split("-");
          setYear(y || "");
          setMonth(m || "");
          setDay(d || "");
        }
      }
    } catch (error) {
      console.log("No existing shop data");
    }
  };

  useEffect(() => {
    if (!month || !day || !year) {
      setDateError("");
      setFormData((prev) => ({ ...prev, owner_date_of_birth: "" }));
      return;
    }

    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
      setDateError("Month must be between 01 and 12");
      return;
    }

    if (dayNum < 1 || dayNum > 31) {
      setDateError("Day must be between 01 and 31");
      return;
    }

    if (year.length !== 4 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setDateError("Enter a valid 4-digit year");
      return;
    }

    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (
      date.getFullYear() !== yearNum ||
      date.getMonth() !== monthNum - 1 ||
      date.getDate() !== dayNum
    ) {
      setDateError("Invalid date");
      return;
    }

    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    setDateError("");
    setFormData((prev) => ({ ...prev, owner_date_of_birth: formattedDate }));
  }, [month, day, year]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement;
    const { name } = target;

    let value = target.value;

    setFormData(prev => ({ ...prev, [name]: value }));

    const toStr = (v: unknown) => (v === undefined || v === null ? "" : String(v));
    const valStr = toStr(value).trim();

    let message = "";
    switch (name) {
      case "owner_full_name":
        if (!valStr) message = "Owner name is required";
        break;

      case "owner_date_of_birth":
        if (!value) message = "Date of birth is required";
        break;

      case "owner_mobile_number":
        if (!valStr) {
          message = "Mobile number is required";
        } else if (!/^\+?[\d\s\-()]+$/.test(valStr)) {
          message = "Invalid mobile number format";
        }
        break;

      case "ssn_or_ein":
        if (!valStr) {
          message = "SSN/EIN is required";
        } else if (!/^\d{3}-\d{2}-\d{4}$/.test(valStr)) {
          message = "Invalid format. Use XXX-XX-XXXX";
        }
        break;

      case "owner_address":
        if (!valStr) message = "Address is required";
        break;

      case "shop_name":
        if (!valStr) message = "Shop name is required";
        break;

      case "about_shop":
        if (!valStr) message = "About shop is required";
        break;

      case "why_choose_your_shop":
        if (!valStr) message = "This field is required";
        break;

      case "shop_philosophy":
        if (!valStr) message = "Shop philosophy is required";
        break;

      case "shop_base_country_id":
        if (!valStr) message = "Country is required";
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: message }));
  };

  // Handle textarea with character limit
  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: string,
    maxLength: number
  ) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getAvailablePlatforms = () => {
    return socialMediaPlatforms.filter((platform) => {
      return formData.social_links && !formData.social_links[platform.key];
    });
  };

  const getAddedPlatforms = () => {
    if (formData.social_links) {
      return socialMediaPlatforms.filter((platform) => formData.social_links[platform.key]);
    }
    return [];
  };

  const handleAddSocialLink = (platformKey: string, url: string) => {
    try {
      new URL(url);
      setFormData((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [platformKey]: url,
        },
      }));
      setSelectedPlatform("");
    } catch {
      showToast({
        message: "Please enter a valid URL",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleRemoveSocialLink = (platformKey: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platformKey]: "",
      },
    }));
  };

  const getAvailableLanguages = () => {
    const languagesSupported = formData.languages_supported || [];

    return availableLanguages?.filter(
      (lang) => !languagesSupported.includes(lang)
    );
  };

  const handleAddLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages_supported: Array.isArray(prev.languages_supported)
        ? [...prev.languages_supported, language]
        : [language],
    }));
    setSelectedLanguage("");
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages_supported: prev.languages_supported.filter((lang) => lang !== language),
    }));
  };

  const handleTeamMemberImageUpload = async (index: number, url: string) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.map((member, i) =>
        i === index ? { ...member, profile_image: url } : member
      ),
    }));
  };

  const handleRemoveTeamMember = async (index: number, memberId?: string) => {
    if (memberId) {
      // API to remove from backend
      try {
        await RemoveTeamMember(memberId);
        showToast({
          message: "Team member removed successfully",
          type: "success",
          duration: 3000,
        });
      } catch (error: any) {
        showToast({
          message: error?.response?.data?.error?.message || "Failed to remove team member",
          type: "error",
          duration: 3000,
        });
        return;
      }
    }

    // Remove from state
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((_, i) => i !== index).map((member, i) => ({
        ...member,
        display_order: i + 1,
      })),
    }));
  };

  const handleRemoveTeamMemberImage = async (index: number, memberId?: string) => {
    if (memberId) {
      try {
        await RemoveTeamMemberImage(memberId);

        // Clear the image from state
        setFormData((prev) => ({
          ...prev,
          team_members: prev.team_members.map((member, i) =>
            i === index ? { ...member, profile_image: "" } : member
          ),
        }));

        showToast({
          message: "Team member image removed successfully",
          type: "success",
          duration: 3000,
        });
      } catch (error: any) {
        showToast({
          message: error?.response?.data?.error?.message || "Failed to remove image",
          type: "error",
          duration: 3000,
        });
      }
    } else {
      // clear from state
      setFormData((prev) => ({
        ...prev,
        team_members: prev.team_members.map((member, i) =>
          i === index ? { ...member, profile_image: "" } : member
        ),
      }));
    }
  };

  const handleAddTeamMember = () => {
    if (!Array.isArray(formData.team_members)) {
      formData.team_members = [];
    }

    if (formData.team_members.length >= 4) {
      showToast({
        message: "Maximum 4 team members allowed",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      team_members: [
        ...prev.team_members,
        {
          name: "",
          role: "",
          profile_image: "",
          display_order: prev.team_members.length + 1,
        },
      ],
    }));
  };

  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const handleExtraBannerUpload = (index: number, url: string) => {
    const newBanners = [...extraBanners];
    newBanners[index] = { url };
    setExtraBanners(newBanners);
  };

  const handleExtraBannerRemove = async (index: number) => {
    const banner = extraBanners[index];

    if (!banner?.url) {
      // clear the state
      const newBanners = [...extraBanners];
      newBanners[index] = { url: "" };
      setExtraBanners(newBanners);
      return;
    }

    if (banner.id) {
      try {
        await RemoveSpecificExtraBanner(banner.id);

        const newBanners = [...extraBanners];
        newBanners[index] = { url: "" };
        setExtraBanners(newBanners);

        showToast({
          message: "Banner removed successfully",
          type: "success",
          duration: 3000,
        });
      } catch (error: any) {
        showToast({
          message: error?.response?.data?.error?.message || "Failed to remove banner",
          type: "error",
          duration: 3000,
        });
      }
    } else {
      // clear from state
      const newBanners = [...extraBanners];
      newBanners[index] = { url: "" };
      setExtraBanners(newBanners);
    }
  };

  const handleSaveExtraBanners = async () => {
    const validBanners = extraBanners.filter(
      (banner) => typeof banner.url === "string" && banner.url.trim() !== ""
    );

    // remove all
    if (validBanners.length === 0) {
      try {
        await RemoveAllExtraBanner();
        return;
      } catch (error: any) {
        console.log("No banners to remove or already removed");
        return;
      }
    }

    const payload = {
      banner_urls: validBanners.map(b => b.url),
    };

    try {
      const response = await SaveExtraBanners(payload);

      // Update state with IDs from response
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const savedBanners = response.data.data;
        const newBanners = [{ id: "", url: "" }, { id: "", url: "" }, { id: "", url: "" }];

        savedBanners.forEach((banner: any, idx: number) => {
          if (idx < 3) {
            newBanners[idx] = {
              id: banner.id,
              url: banner.banner_url,
            };
          }
        });

        setExtraBanners(newBanners);
      }

      showToast({
        message: "Banners saved successfully",
        type: "success",
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to save banners",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      await handleSaveExtraBanners();
      const { status, ...payloadWithoutStatus } = formData as any;

      if (isApproved) {
        // update if seller approved
        await UpdateSellerShop(payloadWithoutStatus);
      } else {
        // create if not approved
        const payload = { ...payloadWithoutStatus, status: "draft" };
        await CreateSellerShop(payload);
      }

      setErrors({});

      await loadShopData();

      showToast({
        message: "Draft saved successfully",
        type: "success",
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to save draft",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast({
        message: "Please fill all required fields correctly",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await handleSaveExtraBanners();
      if (isApproved) {
        const { status, ...payloadWithoutStatus } = formData as any;
        await UpdateSellerShop(payloadWithoutStatus);

        showToast({
          message: "Shop updated successfully",
          type: "success",
          duration: 3000,
        });
      } else {
        const payload = { ...formData, status: "submitted" };
        await CreateSellerShop(payload);
        setIsSubmitted(true);

        showToast({
          message: "Shop submitted successfully",
          type: "success",
          duration: 3000,
        });
      }

      setErrors({});
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || `Failed to ${isApproved ? 'update' : 'submit'} shop`,
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop Approved for Review!</h2>
          <p className="text-gray-600 mb-6">
            Your shop has been successfully submitted for approval. Our team will review your submission and notify you once it's approved. This typically takes 2-3 business days.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isEligible ? (
        <>
          {/* Header */}
          <header className="w-full bg-white border-b border-gray-200 pt-4 pb-3 px-6">
            <h1 className="font-poppins font-semibold text-[20px] leading-[115%] text-[#242E3A] capitalize">
              Create your shop
            </h1>
            <p className="font-['Open_Sans'] font-normal text-[14px] leading-[26px] text-[#665B5B]">
              Set up your shop in minutes and start sharing your products with the world.
            </p>
          </header>

          <div className="max-w-8xl mx-auto px-6 py-10 space-y-10">
            {/* Basic Information */}
            <FormSection
              title="Basic Information"
              description="Name your shop and add your primary visuals. Recommended sizes help your brand look sharp everywhere"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">Owner Name *</label>
                    <input
                      type="text"
                      name="owner_full_name"
                      value={formData.owner_full_name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.owner_full_name && <p className="text-red-500 text-sm mt-1">{errors.owner_full_name}</p>}
                  </div>

                  <div>
                    <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">Owner DOB *</label>
                    <div className="flex space-x-2">
                      <DateInput label="MM" value={month} onChange={setMonth} error={dateError} />
                      <DateInput label="DD" value={day} onChange={setDay} error={dateError} />
                      <DateInput label="YYYY" value={year} onChange={setYear} error={dateError} />
                    </div>
                    {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">Owner Mobile Number *</label>
                    <input
                      type="tel"
                      name="owner_mobile_number"
                      value={formData.owner_mobile_number}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.owner_mobile_number && <p className="text-red-500 text-sm mt-1">{errors.owner_mobile_number}</p>}
                  </div>

                  <div>
                    <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">SSN / EIN *</label>
                    <input
                      type="text"
                      name="ssn_or_ein"
                      value={formData.ssn_or_ein}
                      onChange={handleChange}
                      placeholder="XXX-XX-XXXX"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.ssn_or_ein && <p className="text-red-500 text-sm mt-1">{errors.ssn_or_ein}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">Owner Address *</label>
                    <textarea
                      name="owner_address"
                      value={formData.owner_address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      rows={3}
                      className="w-full h-43 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    {errors.owner_address && <p className="text-red-500 text-sm mt-1">{errors.owner_address}</p>}
                  </div>

                  <FileUpload
                    label="Government ID Upload"
                    required
                    fileType="government-id"
                    onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, government_id_document: url }))}
                    defaultPreview={formData.government_id_document}
                    error={errors.government_id_document}
                  />
                </div>

                <div>
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">Shop Name *</label>
                  <input
                    type="text"
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleChange}
                    placeholder="Enter your shop name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.shop_name && <p className="text-red-500 text-sm mt-1">{errors.shop_name}</p>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <FileUpload
                    label="Shop Logo"
                    recommendation="Recommended 120 X 120 px"
                    fileType="shop-logo"
                    onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, shop_logo: url }))}
                    defaultPreview={formData.shop_logo}
                    error={errors.shop_logo}
                  />
                  <div className="lg:col-span-2">
                    <FileUpload
                      label="Shop Banner"
                      recommendation="Recommended 1128 X 340 px"
                      fileType="shop-banner"
                      onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, shop_banner: url }))}
                      defaultPreview={formData.shop_banner}
                    />
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Extra Banners */}
            <FormSection
              title="Extra Banners (Optional)"
              description="Optional promotional banners to showcase your shop or offers"
            >

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {extraBanners.map((banner, index) => (
                  <FileUpload
                    key={index}
                    recommendation="Recommended 360 X 200 px"
                    fileType="extra-banners"
                    onUploadSuccess={(url) => handleExtraBannerUpload(index, url)}
                    defaultPreview={banner.url}
                    onRemove={async () => await handleExtraBannerRemove(index)}
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
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">About Shop *</label>
                  <textarea
                    value={formData.about_shop}
                    onChange={(e) => handleTextareaChange(e, "about_shop", 300)}
                    placeholder="Write up to 300 words"
                    rows={4}
                    className="w-full h-50 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <div className="text-right text-gray-500 text-sm mt-1">
                    {errors.about_shop && <p className="text-red-500 text-sm">{errors.about_shop}</p>}
                    <p className="text-gray-500 text-sm ml-auto">{formData?.about_shop?.length}/300</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">Why Choose Your Shop *</label>
                    <textarea
                      value={formData.why_choose_your_shop}
                      onChange={(e) => handleTextareaChange(e, "why_choose_your_shop", 200)}
                      placeholder="Highlight your unique value"
                      rows={4}
                      className="w-full h-50 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    <div className="text-right text-gray-500 text-sm mt-1">
                      {errors.why_choose_your_shop && <p className="text-red-500 text-sm">{errors.why_choose_your_shop}</p>}
                      <p className="text-gray-500 text-sm ml-auto">{formData?.why_choose_your_shop?.length}/200</p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">Shop Philosophy *</label>
                    <textarea
                      value={formData.shop_philosophy}
                      onChange={(e) => handleTextareaChange(e, "shop_philosophy", 200)}
                      placeholder="What principles guide your work?"
                      rows={4}
                      className="w-full h-50 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                    <div className="text-right text-gray-500 text-sm mt-1">
                      {errors.shop_philosophy && <p className="text-red-500 text-sm">{errors.shop_philosophy}</p>}
                      <p className="text-gray-500 text-sm ml-auto">{formData?.shop_philosophy?.length}/200</p>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Operational Details */}
            <FormSection
              title="Operational Details"
              description="Define the country where your shop is based and languages you support"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Shop Based In *</label>
                  <select
                    value={formData.shop_base_country_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shop_base_country_id: e.target.value,
                      }))
                    }
                    className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                  >
                    <option value="">Select country</option>
                    {country?.map((country: any) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.shop_base_country_id && <p className="text-red-500 text-sm mt-1">{errors.shop_base_country_id}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Languages Supported</label>
                  <div className="space-y-3">
                    {formData.languages_supported && formData.languages_supported.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.languages_supported.map((lang) => (
                          <span
                            key={lang}
                            className="flex items-center space-x-2 bg-[#7077FE] text-white px-5 py-2 rounded-full"
                          >
                            <span className="font-['Open_Sans'] font-normal text-[14px]">{lang}</span>
                            <button
                              onClick={() => handleRemoveLanguage(lang)}
                              className="w-4 h-4 flex items-center justify-center hover:text-gray-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <select
                      value={selectedLanguage}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddLanguage(e.target.value);
                        }
                      }}
                      className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                    >
                      <option value="">Select language</option>
                      {getAvailableLanguages().map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Social Media */}
            <FormSection
              title="Social Media Links"
              description="Connect Your profiles so customers can follow and trust your brand."
            >

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block font-['Open_Sans'] font-semibold text-[16px] text-[#242E3A] mb-2">
                    Add Social Links
                  </label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-md bg-white text-[#242E3A] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                  >
                    <option value="">Select platform</option>
                    {getAvailablePlatforms().map((platform) => (
                      <option key={platform.key} value={platform.key}>
                        {platform.name}
                      </option>
                    ))}
                  </select>

                  {selectedPlatform && (
                    <input
                      type="url"
                      placeholder={`Enter ${socialMediaPlatforms.find((p) => p.key === selectedPlatform)?.name} URL`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          handleAddSocialLink(selectedPlatform, e.currentTarget.value.trim());
                          e.currentTarget.value = "";
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mt-3"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-900 mb-2">Added Links</label>
                  <div className="space-y-3">
                    {getAddedPlatforms().length === 0 ? (
                      <p className="text-gray-400 text-sm py-4 text-center">No links added yet</p>
                    ) : (
                      getAddedPlatforms().map((platform) => (
                        <div
                          key={platform.key}
                          className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-md"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {platform?.icon}
                            <span className="text-sm truncate">{formData.social_links[platform.key]}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveSocialLink(platform.key)}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
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
                  <button
                    onClick={handleAddTeamMember}
                    disabled={formData.team_members?.length >= 4}
                    className={`px-5 py-3 rounded-lg font-jakarta font-medium transition-colors ${formData.team_members?.length >= 4
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#7077FE] text-white hover:bg-[#5A61E8]'
                      }`}
                  >
                    Add members
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formData.team_members?.map((member, index) => (
                    <div key={member.id || index} className="bg-white border border-gray-200 rounded-xl p-4 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="h-[140px] w-[140px]">
                          <FileUpload
                            fileType="team-member-image"
                            onUploadSuccess={(url) => handleTeamMemberImageUpload(index, url)}
                            defaultPreview={member.profile_image}
                            className='h-[140px] w-[140px]'
                            onRemove={async () => await handleRemoveTeamMemberImage(index, member.id)}
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveTeamMember(index, member.id)}
                          className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-red-100 transition"
                        >
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
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#242E3A] mb-2">
                            Role
                          </label>
                          <input
                            type="text"
                            placeholder="Role"
                            value={member.role}
                            onChange={(e) => handleTeamMemberChange(index, "role", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>

            {/* Store Policies */}
            <FormSection
              title="Store Policies *"
              description="Please review the default policies below. By checking the box, you confirm that you agree to these terms."
            >
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center space-x-4">
                  {policies.map((policy, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 cursor-pointer p-4 hover:bg-gray-50 rounded-lg transition"
                      onClick={() => togglePolicy(index)}
                    >
                      <div
                        className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors duration-200 cursor-pointer ${policy.checked
                          ? "bg-[#7077FE] border-[#7077FE]"
                          : "border-[#7077FE]"
                          }`}
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
                      <div className="flex-1">
                        <h4 className="font-poppins font-semibold text-gray-800">
                          {policy.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{policy.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.store_policies && (
                  <p className="text-red-500 text-sm mt-4">{errors.store_policies}</p>
                )}
              </div>
            </FormSection>

            {!isApproved ? (
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type='button'
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="px-5 py-3 border border-primary text-primary rounded-lg font-jakarta font-medium transition-colors hover:bg-[#7077FE] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-jakarta font-medium hover:bg-[#7077FE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-6">
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-5 py-3 bg-[#7077FE] text-white rounded-lg font-jakarta font-medium hover:bg-[#7077FE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="m-5 shadow overflow-hidden p-6 sm:p-8 text-center">
          <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Shop Creation Restricted
            </h2>
            <p className="text-gray-600 mb-6">
              Only certified members can open their own shop.
              Become an{" "}
              <a
                href='/dashboard/assesmentcertification'
                className="text-[#7077FE] font-semibold">
                Aspiring Certified Member
              </a>
              {" "}to unlock this feature and start selling.
            </p>
            <div className="flex justify-center">
              <svg
                className="w-16 sm:w-24 h-16 sm:h-24 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateShopForm;