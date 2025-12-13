import React, { useEffect, useRef, useState } from "react";
import { Tab } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  GetCountryDetails,
  GetInterestsDetails,
  GetProfessionalDetails,
  GetProfileDetails,
  GetPublicProfileDetails,
  GetServiceDetails,
  GetStateDetails,
  MeDetails,
  removeProfileImage,
  SubmitProfileDetails,
  SubmitPublicProfileDetails,
} from "../../../Common/ServerAPI";
import { useToast } from "../../ui/Toast/ToastProvider";
import Select from "react-select";
import Button from "../../ui/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Modal from "../../ui/Modal";
import Cropper from "../../ui/Cropper";
import {
  parsePhoneNumberFromString,
  getExampleNumber,
} from "libphonenumber-js/min";
import examples from "libphonenumber-js/examples.mobile.json";
import { getCountryCallingCode, getCountries } from "libphonenumber-js/min";
import Monthpicker from "../../ui/Monthpicker";
import postalCodes from "postal-codes-js";

const callingCodeToISO: Record<string, string> = {};
getCountries().forEach((iso) => {
  const code = "+" + getCountryCallingCode(iso as any);
  // If some calling codes map to multiple countries, last one wins — good fallback.
  callingCodeToISO[code] = iso;
});

// Helper function to map country names to ISO codes for postal code validation
const countryNameToISO: Record<string, string> = {
  "United States": "US",
  "United Kingdom": "GB",
  Canada: "CA",
  Australia: "AU",
  Germany: "DE",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Netherlands: "NL",
  Belgium: "BE",
  Switzerland: "CH",
  Austria: "AT",
  Sweden: "SE",
  Norway: "NO",
  Denmark: "DK",
  Finland: "FI",
  Poland: "PL",
  "Czech Republic": "CZ",
  Portugal: "PT",
  Greece: "GR",
  Ireland: "IE",
  "New Zealand": "NZ",
  Japan: "JP",
  "South Korea": "KR",
  China: "CN",
  India: "IN",
  Brazil: "BR",
  Mexico: "MX",
  Argentina: "AR",
  Chile: "CL",
  Colombia: "CO",
  Peru: "PE",
  "South Africa": "ZA",
  Singapore: "SG",
  Malaysia: "MY",
  Thailand: "TH",
  Indonesia: "ID",
  Philippines: "PH",
  Vietnam: "VN",
  Turkey: "TR",
  Russia: "RU",
  Ukraine: "UA",
  Israel: "IL",
  "United Arab Emirates": "AE",
  "Saudi Arabia": "SA",
  Egypt: "EG",
};

const tabNames = [
  "Basic Information",
  "Contact Information",
  "Social Links",
  "Education",
  "Work",
  // "Public Profile Fields",
];

const genderOptions = [
  { value: "", label: "Select Your Gender" }, // Use empty string for default
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

const countryCode = [
  "+1",
  "+20",
  "+30",
  "+32",
  "+33",
  "+34",
  "+36",
  "+39",
  "+44",
  "+44",
  "+44",
  "+49",
  "+51",
  "+53",
  "+55",
  "+56",
  "+57",
  "+58",
  "+60",
  "+61",
  "+61",
  "+61",
  "+62",
  "+64",
  "+65",
  "+66",
  "+81",
  "+82",
  "+84",
  "+86",
  "+91",
  "+92",
  "+93",
  "+94",
  "+95",
  "+98",
  "+1242",
  "+1246",
  "+1264",
  "+1268",
  "+1284",
  "+1340",
  "+1441",
  "+1473",
  "+1671",
  "+1684",
  "+1767",
  "+1849",
  "+1876",
  "+1939",
  "+212",
  "+213",
  "+216",
  "+218",
  "+220",
  "+221",
  "+222",
  "+223",
  "+224",
  "+225",
  "+226",
  "+227",
  "+228",
  "+229",
  "+230",
  "+231",
  "+232",
  "+233",
  "+234",
  "+235",
  "+236",
  "+237",
  "+238",
  "+239",
  "+240",
  "+241",
  "+242",
  "+243",
  "+244",
  "+245",
  "+246",
  "+248",
  "+249",
  "+250",
  "+251",
  "+252",
  "+253",
  "+254",
  "+255",
  "+256",
  "+257",
  "+258",
  "+260",
  "+261",
  "+262",
  "+263",
  "+264",
  "+265",
  "+266",
  "+267",
  "+268",
  "+269",
  "+290",
  "+291",
  "+297",
  "+298",
  "+299",
  "+350",
  "+351",
  "+352",
  "+353",
  "+354",
  "+355",
  "+356",
  "+357",
  "+358",
  "+358",
  "+359",
  "+370",
  "+371",
  "+372",
  "+373",
  "+374",
  "+375",
  "+376",
  "+377",
  "+378",
  "+379",
  "+380",
  "+381",
  "+382",
  "+383",
  "+385",
  "+386",
  "+387",
  "+389",
  "+420",
  "+421",
  "+423",
  "+500",
  "+500",
  "+501",
  "+502",
  "+503",
  "+504",
  "+505",
  "+506",
  "+507",
  "+508",
  "+509",
  "+590",
  "+590",
  "+591",
  "+592",
  "+593",
  "+594",
  "+595",
  "+596",
  "+597",
  "+598",
  "+599",
  "+672",
  "+673",
  "+675",
  "+676",
  "+677",
  "+678",
  "+679",
  "+680",
  "+681",
  "+682",
  "+683",
  "+685",
  "+686",
  "+687",
  "+688",
  "+689",
  "+690",
  "+691",
  "+692",
  "+850",
  "+852",
  "+853",
  "+855",
  "+856",
  "+880",
  "+886",
  "+960",
  "+961",
  "+962",
  "+963",
  "+964",
  "+965",
  "+966",
  "+967",
  "+968",
  "+970",
  "+971",
  "+972",
  "+973",
  "+974",
  "+975",
  "+976",
  "+977",
  "+992",
  "+993",
  "+994",
  "+995",
  "+996",
  "+998",
];

interface SocialLink {
  platform: string;
  url: string;
}

function parseMonthYear(value?: string | null) {
  if (!value) return null;
  // expected stored format: "2021-03"
  const parts = value.split("-");
  if (parts.length !== 2) return null;
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1; // JS months 0-11
  if (isNaN(year) || isNaN(month)) return null;
  return new Date(year, month, 1);
}

const getMaxDigits = (isoCountry: string): number => {
  try {
    const example = getExampleNumber(isoCountry as any, examples); // examples.mobile.json
    const national = example?.nationalNumber || "";
    return national.length || 10;
  } catch {
    return 10; // fallback when unknown
  }
};

// format digits (numbers only) to the country's national representation
const formatPhoneForCountry = (digits: string, isoCountry: string): string => {
  // parse expects a string of digits or a string with +country prefix, but it's okay with digits + country param
  const phone = parsePhoneNumberFromString(digits, isoCountry as any);
  if (phone) return phone.formatNational(); // e.g. (987) 654-3210 or 98765 43210
  // if library can't format, do a simple grouped format (fallback)
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const socialPlatforms = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "pinterest", label: "Pinterest" },
  { value: "snapchat", label: "Snapchat" },
  { value: "reddit", label: "Reddit" },
  { value: "dribbble", label: "Dribbble" },
  { value: "behance", label: "Behance" },
  { value: "medium", label: "Medium" },
  { value: "telegram", label: "Telegram" },
  { value: "discord", label: "Discord" },
];

const countryCodeOptions = countryCode.map((code) => ({
  value: code,
  label: code,
}));

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "44px",
    borderRadius: "12px",
    borderColor: state.isFocused ? "#7077FE" : "#D1D5DB",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(112, 119, 254, 0.2)" : "none",
    paddingLeft: "8px",
    fontFamily: "Rubik, sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      borderColor: "#7077FE",
    },
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#9CA3AF",
    fontSize: "14px",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#E0E7FF"
      : state.isFocused
        ? "#F3F4F6"
        : "white",
    color: "#111827",
    padding: "10px 12px",
    fontSize: "14px",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#111827",
    fontSize: "14px",
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999, // Ensure high z-index
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "41px",
    borderRadius: "12px",
    paddingLeft: "8px",
    color: "#6269FF",
    fontSize: "14px",
    fontWeight: 400,
    borderWidth: "1px",
    borderColor: state.isFocused ? "#A259FF" : "#D1D5DB", // Purple on focus
    boxShadow: state.isFocused ? "0 0 0 2px rgba(162, 89, 255, 0.5)" : "none", // smooth glow
    transition: "all 0.2s ease-in-out",

    backgroundColor: "white",
  }),
  valueContainer: (base: any) => ({
    ...base,
    flexWrap: "wrap", // Ensure items wrap inside the value container
    maxHeight: "auto",
    gap: "6px",
    paddingTop: "6px",
    paddingBottom: "6px",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#f3f1ff",
    color: "#6269FF",
    borderRadius: "8px",
    fontSize: "13px",
    // padding: '2px 6px',
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#6269FF", // darker text (Tailwind slate-700)
    fontWeight: "500",
    fontSize: "11px",
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: 14,
    color: "#9CA3AF",
  }),
};

const tabMap = {
  basic: 0,
  contact: 1,
  social: 2,
  education: 3,
  work: 4,
  public: 5,
};

const UserProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [banner, setBanner] = useState<any>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});
  const [_profileData, setProfileData] = useState<any>(null);
  const [intereset, setInterestData] = useState<any>(null);
  const [professional, setProfessionalData] = useState<any>(null);
  const [Country, setCountry] = useState<any>(null);
  const [states, setStates] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any>(null);

  // Create a ref to store Country for validation
  const countryRef = useRef(Country);
  const [customServiceInput, setCustomServiceInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [basicData, setBasicData] = useState<any>(null);
  const [_loading, setLoading] = useState(false);

  const [cropModal, setCropModal] = useState<{
    open: boolean;
    src: string;
    type: "profile" | "banner" | null;
    setter?: React.Dispatch<React.SetStateAction<string | null>>;
  }>({
    open: false,
    src: "",
    type: null,
  });
  // const public_organization = localStorage.getItem("person_organization");
  // const is_disqualify = localStorage.getItem("is_disqualify");
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [uploadProgress, setUploadProgress] = useState<{
    type: "profile" | "banner" | null;
    message: string;
  }>({ type: null, message: "" });
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    platform: "",
    url: "",
  });
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(() => {
    const initialSocialLinks: Record<string, string> = {};
    socialPlatforms.forEach((platform) => {
      initialSocialLinks[platform.value] = "";
    });
    return initialSocialLinks;
  });
  console.log("🚀 ~ UserProfilePage ~ socialLinks:", socialLinks);
  const getAvailablePlatforms = () => {
    return socialPlatforms.filter(
      (platform) =>
        !socialLinks[platform.value] || socialLinks[platform.value] === ""
    );
  };

  // const [uploadIdentify, setUploadIdentify] = useState<any>({
  //   message: "Uploading",
  //   loading: false,
  // });

  const { showToast } = useToast();

  useEffect(() => {
    if (tabParam && Object.keys(tabMap).includes(tabParam)) {
      setSelectedIndex(tabMap[tabParam as keyof typeof tabMap]);
    }
  }, [tabParam]);

  const validateSocialUrl = (platform: string, url: string): boolean => {
    const urlPatterns: { [key: string]: RegExp } = {
      facebook: /^(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/,
      twitter: /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/.+/,
      linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+/,
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+/,
      youtube: /^(https?:\/\/)?(www\.)?(youtube)\.(com)\/.+/,
      tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+/,
      pinterest: /^(https?:\/\/)?(in\.)?pinterest\.com\/.+/,
      snapchat: /^(https?:\/\/)?(www\.)?snapchat\.com\/.+/,
      reddit: /^(https?:\/\/)?(www\.)?reddit\.com\/.+/,
      github: /^(https?:\/\/)?(www\.)?github\.com\/.+/,
      dribbble: /^(https?:\/\/)?(www\.)?dribbble\.com\/.+/,
      behance: /^(https?:\/\/)?(www\.)?behance\.net\/.+/,
      medium: /^(https?:\/\/)?(www\.)?medium\.com\/.+/,
      whatsapp: /^(https?:\/\/)?(wa\.me\/|api\.whatsapp\.com\/).+/,
      telegram: /^(https?:\/\/)?(t\.me\/|telegram\.me\/).+/,
      discord: /^(https?:\/\/)?(discord\.gg\/|discord\.com\/).+/,
      slack: /^(https?:\/\/)?.+.slack\.com\/.+/,
      skype: /^(skype:|https?:\/\/).+/,
    };

    const pattern = urlPatterns[platform];
    if (!pattern) return true; // If no pattern defined, accept any valid URL

    return pattern.test(url);
  };
  // Update handleAddSocialLink to track changes
  const handleAddSocialLink = (platform: string, url: string) => {
    if (platform && url) {
      const isValid = validateSocialUrl(platform, url);
      if (!isValid) {
        showToast({
          message: `Please enter a valid ${socialPlatforms.find((p) => p.value === platform)?.label
            } URL`,
          type: "error",
          duration: 5000,
        });
        return;
      }

      setSocialLinks((prev) => ({
        ...prev,
        [platform]: url,
      }));

      setNewSocialLink({ platform: "", url: "" });
      setShowSocialModal(false);
      handleFormChange("social"); // Track changes

      showToast({
        message: `${socialPlatforms.find((p) => p.value === platform)?.label
          } link added successfully`,
        type: "success",
        duration: 3000,
      });
    }
  };

  // Update handleRemoveSocialLink to track changes
  const handleRemoveSocialLink = (platform: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: "",
    }));
    handleFormChange("social"); // Track changes
  };

  // Separate form handlers for each tab
  const basicInfoForm = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      gender: "",
      dob: "",
      quote: "",
      vision: "",
      professions: [],
      interests: [],
      identify_uploaded: null,
      custom_profession: "",
    },
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup
          .string()
          .required("First name is required")
          .matches(/^[a-zA-Z\s'-]+$/, "First name can only contain letters."),
        lastName: yup
          .string()
          .required("Last name is required")
          .matches(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters"),
        // Remove required validation for bio, keep only character validation if needed
        bio: yup.string().matches(
          /^[a-zA-Z0-9\s.,!?@#$%^&*()_+-=<>;:'"\/\\[\]{}|`~]*$/, // Added * to allow empty strings
          "Bio contains invalid characters"
        ),
        // Remove required validation for gender
        gender: yup.string(),
        dob: yup
          .string()
          .required("Date of birth is required")
          .test(
            "is-18-plus",
            "You are not allowed to use the social media platform unless you are over 18 years old.",
            function (value) {
              if (!value) return false;
              const dob = new Date(value);
              const today = new Date();
              const age = today.getFullYear() - dob.getFullYear();
              const m = today.getMonth() - dob.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                return age - 1 >= 18;
              }
              return age >= 18;
            }
          ),
        // Remove required validation for quote, keep only character validation if needed
        quote: yup.string().matches(
          /^[a-zA-Z0-9\s.,!?@#$%^&*()_+-=<>;:'"\/\\[\]{}|`~]*$/, // Added * to allow empty strings
          "Quote contains invalid characters"
        ),
        // Remove required validation for vision, keep only character validation if needed
        vision: yup
          .string()
          .transform((value) => (value === "" ? null : value)) // Transform empty string to null
          .nullable()
          .matches(
            /^[a-zA-Z0-9\s\S]*$/, // This allows ALL characters including special characters
            "Vision statement contains invalid characters"
          ),
        professions: yup.array().min(1, "At least one profession is required"),
        // Remove required validation for interests
        interests: yup.array(),
        identify_uploaded: yup.mixed().nullable(),
        custom_profession: yup.string().nullable(),
      })
    ),
  });
  /*const contactInfoForm = useForm({
    defaultValues: {
      country_code: countryCode[0],
      phone: "",
    },
  });*/
  const contactInfoForm = useForm({
    defaultValues: {
      country_code: countryCode[0],
      phone: "",
      email: "",
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      communication: {
        sms: false,
        email: false,
        whatsapp: false,
      },
    },
    resolver: yupResolver(
      yup.object().shape({
        // Keep validation only for these 3 fields
        phone: yup.string().required("Phone number is required"),
        // .matches(/^[0-9]{8,13}$/, "Phone must be between 8-13 digits"),
        email: yup
          .string()
          .required("Email is required")
          .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email"),
        country: yup.string().required("Country is required"),

        // Remove validation for other fields
        country_code: yup.string(),
        address: yup.string(),
        state: yup.string(),
        city: yup.string(),
        postalCode: yup
          .string()
          .test(
            "is-valid-postal-code",
            "Enter a valid postal code",
            function (value) {
              // Allow empty values (field isn't required)
              if (!value) return true;

              // Get the country data from ref
              const countryArray = countryRef.current;
              const countryId = this.parent.country;

              if (!countryId || !countryArray) return true; // Skip validation if no country selected

              try {
                // Find the country object from the Country array
                const selectedCountry = countryArray.find(
                  (c: any) => String(c.id) === String(countryId)
                );
                if (!selectedCountry || !selectedCountry.name) return true;

                // Map country name to ISO code
                const isoCode = countryNameToISO[selectedCountry.name];
                if (!isoCode) return true; // Skip validation if country not in our mapping

                // Validate the postal code using ISO code
                const isValid = postalCodes.validate(
                  isoCode,
                  value.toUpperCase()
                );
                return isValid === true;
              } catch (error) {
                // If validation throws an error, consider it valid (country might not be supported)
                return true;
              }
            }
          ),
        communication: yup.object().shape({
          sms: yup.boolean(),
          email: yup.boolean(),
          whatsapp: yup.boolean(),
        }),
      })
    ),
  });
  // Update the socialLinksForm initialization with validation
  const socialLinksForm = useForm();

  const educationForm = useForm({
    defaultValues: {
      educations: [
        {
          degree: "",
          institution: "",
          start_date: "",
          end_date: "",
        },
      ],
    },
    resolver: yupResolver(
      yup.object().shape({
        educations: yup
          .array()
          .of(
            yup.object().shape({
              degree: yup.string(),
              institution: yup.string(),
              start_date: yup.string(),
              end_date: yup.string(),
            })
          )
          .test(
            "at-least-one-field",
            "At least one education field must be filled",
            function (educations) {
              if (!educations || educations.length === 0) return true;

              return educations.some(
                (edu) =>
                  edu.degree ||
                  edu.institution ||
                  edu.start_date ||
                  edu.end_date
              );
            }
          ),
      })
    ),
  });
  const workExperienceForm = useForm<{
    workExperiences: {
      company: string;
      position: string;
      roles_responsibilities?: string;
      work_city?: string;
      work_state?: string;
      work_country?: string;
      currently_working?: boolean;
      start_date: string;
      end_date?: string;
    }[];
  }>({
    defaultValues: {
      workExperiences: [
        {
          company: "",
          position: "",
          start_date: "",
          end_date: "",
        },
      ],
    },
    resolver: yupResolver(
      yup.object().shape({
        workExperiences: yup
          .array()
          .of(
            yup.object().shape({
              company: yup.string(),
              position: yup.string(),
              roles_responsibilities: yup.string(),
              work_city: yup.string(),
              work_state: yup.string(),
              work_country: yup.string(),
              currently_working: yup.boolean(),
              start_date: yup.string(),
              end_date: yup.string(),
            })
          )
          .test(
            "at-least-one-field",
            "At least one work experience field must be filled",
            function (workExperiences) {
              if (!workExperiences || workExperiences.length === 0) return true;

              return workExperiences.some(
                (exp) =>
                  exp.company ||
                  exp.position ||
                  exp.start_date ||
                  exp.end_date ||
                  exp.roles_responsibilities ||
                  exp.work_city ||
                  exp.work_state ||
                  exp.work_country
              );
            }
          ),
      })
    ) as any, // Use type assertion to bypass TypeScript error
  });
  const publicProfileForm = useForm();

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    formKey: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    // Open cropping modal — DO NOT upload yet
    setCropModal({
      open: true,
      src: previewUrl,
      type: formKey,
      setter: setter,
    });
  };

  const handleCropSave = async (blob: Blob, previewUrl: string) => {
    if (!cropModal.setter) return;

    // Update the preview immediately
    cropModal.setter(previewUrl);

    // Convert blob -> file for backend
    const croppedFile = new File([blob], "cropped.jpg", { type: "image/jpeg" });

    setUploadProgress({
      type: cropModal.type,
      message: "Uploading cropped image...",
    });
    setCropModal({
      open: false,
      src: "",
      type: null,
      setter: undefined,
    });

    try {
      const formData = new FormData();

      if (cropModal.type === "profile") {
        formData.append("profile", croppedFile);
      } else {
        formData.append("banner", croppedFile);
      }

      const res = await SubmitProfileDetails(formData);

      // Fetch updated user profile
      const response = await MeDetails();
      const userData = response?.data?.data?.user;

      if (cropModal.type === "profile" && userData.profile_picture) {
        cropModal.setter(userData.profile_picture);
        localStorage.setItem("profile_picture", userData.profile_picture);
      }

      if (cropModal.type === "banner" && userData.profile_banner) {
        cropModal.setter(userData.profile_banner);
      }
      showToast({
        message: res?.success?.message,
        type: "success",
        duration: 5000,
      });
    } catch (err: any) {
      showToast({
        message: err?.response?.data?.error?.message || "Image upload failed",
        type: "error",
        duration: 5000,
      });
    }

    setCropModal({
      open: false,
      src: "",
      type: null,
      setter: undefined,
    });

    setUploadProgress({ type: null, message: "" });
  };
  // Add these functions inside your UserProfilePage component

  const handleRemoveProfileImage = async () => {
    try {
      setUploadProgress({
        type: "profile",
        message: "Removing profile image...",
      });

      const response = await removeProfileImage("profile");

      if (response.success) {
        setLogoPreview(null);
        showToast({
          message:
            response.success.message || "Profile image removed successfully",
          type: "success",
          duration: 5000,
        });

        // Update localStorage if needed
        localStorage.removeItem("profile_picture");
      }
    } catch (error: any) {
      setUploadProgress({ type: null, message: "" });
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to remove profile image",
        type: "error",
        duration: 5000,
      });
    } finally {
      setUploadProgress({ type: null, message: "" });
    }
  };

  const handleRemoveBannerImage = async () => {
    try {
      setUploadProgress({
        type: "banner",
        message: "Removing banner image...",
      });

      const response = await removeProfileImage("banner");

      if (response.success) {
        setBanner(null);
        showToast({
          message:
            response.success.message || "Banner image removed successfully",
          type: "success",
          duration: 5000,
        });
      }
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to remove banner image",
        type: "error",
        duration: 5000,
      });
    } finally {
      setUploadProgress({ type: null, message: "" });
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const GetService = async () => {
    try {
      const response = await GetServiceDetails();
      setServiceData(response.data.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  // const handleCancel = () => {
  //   // Reset all forms
  //   basicInfoForm.reset();
  //   contactInfoForm.reset();
  //   socialLinksForm.reset();
  //   educationForm.reset();
  //   workExperienceForm.reset();
  //   publicProfileForm.reset();

  //   setBanner(null);
  //   setLogoPreview(null);
  //   setTags([]);
  // };

  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, boolean>>(
    {
      basic: false,
      contact: false,
      social: false,
      education: false,
      work: false,
      public: false,
    }
  );

  // Track form changes
  const handleFormChange = (formKey: keyof typeof unsavedChanges) => {
    setUnsavedChanges((prev) => ({ ...prev, [formKey]: true }));
  };

  const handleTabChange = async (newIndex: number) => {
    // If there are unsaved changes in the current tab, save them first
    const currentTabKey = Object.keys(tabMap).find(
      (key) => tabMap[key as keyof typeof tabMap] === selectedIndex
    );

    const saveCurrentTabChanges = async (tabKey: string) => {
      try {
        setIsSubmitting((prev) => ({ ...prev, [tabKey]: true }));

        switch (tabKey) {
          case "basic":
            const basicData = basicInfoForm.getValues();
            await handleBasicInfoSubmit(basicData);
            break;

          case "contact":
            const contactData = contactInfoForm.getValues();
            await handleContactInfoSubmit(contactData);
            break;

          case "social":
            await handleSocialLinksSubmit();
            break;

          case "education":
            const educationData = educationForm.getValues();
            await handleEducationSubmit(educationData);
            break;

          case "work":
            const workData = workExperienceForm.getValues();
            await handleWorkExperienceSubmit(workData);
            break;

          case "public":
            const publicData = publicProfileForm.getValues();
            await handlePublicProfileSubmit(publicData);
            break;
        }

        // Reset unsaved changes for this tab
        setUnsavedChanges((prev) => ({ ...prev, [tabKey]: false }));
      } catch (error) {
        console.error(`Failed to save ${tabKey} changes:`, error);
        // Optionally show error toast
      } finally {
        setIsSubmitting((prev) => ({ ...prev, [tabKey]: false }));
      }
    };

    if (currentTabKey && unsavedChanges[currentTabKey]) {
      await saveCurrentTabChanges(currentTabKey);
    }

    // Then change the tab
    setSelectedIndex(newIndex);
  };

  // Tab-specific submit handlers
  const handleBasicInfoSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, basic: true }));

    const normalizeToArray = (input: any) => {
      if (Array.isArray(input)) {
        return input.map((item) => {
          // Keep strings as strings, convert numbers to strings if needed
          if (typeof item === "string") return item;
          if (typeof item === "number") return String(item);
          return String(item);
        });
      }
      return input ? [String(input)] : [];
    };

    const payload = {
      first_name: data.firstName || null,
      last_name: data.lastName || null,
      bio: data.bio || "",
      gender: data.gender || "",
      dob: data.dob || "",
      opinion_on_counsciouness: data.quote || null,
      personal_vision_statement: data.vision || null,
      professions: normalizeToArray(data.professions),
      interests: normalizeToArray(data.interests),
    };

    try {
      const res = await SubmitProfileDetails(payload);
      showToast({
        message: res?.success?.message,
        type: "success",
        duration: 5000,
      });

      setUnsavedChanges((prev) => ({ ...prev, basic: false }));

      const lastIndex = tabNames.length - 1;
      if (selectedIndex < lastIndex) setSelectedIndex((prev) => prev + 1);

      const response = await MeDetails();
      localStorage.setItem(
        "profile_picture",
        response?.data?.data?.user.profile_picture
      );
      localStorage.setItem("name", response?.data?.data?.user.name);
      localStorage.setItem("main_name", response?.data?.data?.user.main_name);

      let isAdult = false;
      const dobString = response?.data?.data?.user?.dob;
      const dob = new Date(dobString);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age >= 18) {
        isAdult = true;
      } else {
        isAdult = false;
      }
      localStorage.setItem(
        "isAdult",
        response?.data?.data?.user?.is_adult
          ? response?.data?.data?.user?.is_adult
          : JSON.stringify(isAdult)
      );
      localStorage.setItem(
        "margaret_name",
        response?.data?.data?.user.margaret_name
      );
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, basic: false }));
    }
  };

  const handleContactInfoSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, contact: true }));

    const payload = {
      country_code: data.country_code || null,
      phone_no: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      country: data.country || null,
      state: data.state || null,
      city: data.city || null,
      postal_code: data.postalCode || null,
      communication: [
        ...(data.communication?.sms ? ["sms"] : []),
        ...(data.communication?.email ? ["email"] : []),
        ...(data.communication?.whatsapp ? ["whatsapp"] : []),
      ],
    };

    try {
      const response = await SubmitProfileDetails(payload);
      showToast({
        message: response?.success?.message,
        type: "success",
        duration: 5000,
      });

      // Reset unsaved changes for this tab
      setUnsavedChanges((prev) => ({ ...prev, contact: false }));

      const lastIndex = tabNames.length - 1;
      if (selectedIndex < lastIndex) setSelectedIndex((prev) => prev + 1);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, contact: false }));
    }
  };

  const handleSocialLinksSubmit = async () => {
    setIsSubmitting((prev) => ({ ...prev, social: true }));

    // Filter out empty social links
    const payload = {
      social_links: Object.fromEntries(
        Object.entries(socialLinks).filter(([_, url]) => url.trim() !== "")
      ),
    };

    try {
      const response = await SubmitProfileDetails(payload);
      showToast({
        message: response?.success?.message,
        type: "success",
        duration: 5000,
      });

      // Reset unsaved changes for this tab
      setUnsavedChanges((prev) => ({ ...prev, social: false }));

      const lastIndex = tabNames.length - 1;
      if (selectedIndex < lastIndex) setSelectedIndex((prev) => prev + 1);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, social: false }));
    }
  };

  const handleEducationSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, education: true }));

    // Filter out completely empty education entries
    const payload = {
      education: data.educations.filter(
        (edu: any) =>
          edu.degree || edu.institution || edu.start_date || edu.end_date
      ),
    };

    // If no education data at all, submit empty array
    const finalPayload =
      payload.education.length > 0 ? payload : { education: [] };

    try {
      const response = await SubmitProfileDetails(finalPayload);
      showToast({
        message: response?.success?.message,
        type: "success",
        duration: 5000,
      });

      // Reset unsaved changes for this tab
      setUnsavedChanges((prev) => ({ ...prev, education: false }));

      const lastIndex = tabNames.length - 1;
      if (selectedIndex < lastIndex) setSelectedIndex((prev) => prev + 1);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, education: false }));
    }
  };

  const handleWorkExperienceSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, work: true }));

    // Filter out completely empty work experience entries
    const payload = {
      work_experience: data.workExperiences.filter(
        (exp: any) =>
          exp.company || exp.position || exp.start_date || exp.end_date
      ),
    };

    // If no work experience data at all, submit empty array
    const finalPayload =
      payload.work_experience.length > 0 ? payload : { work_experience: [] };

    try {
      const response = await SubmitProfileDetails(finalPayload);
      showToast({
        message: response?.success?.message,
        type: "success",
        duration: 5000,
      });

      // Reset unsaved changes for this tab
      setUnsavedChanges((prev) => ({ ...prev, work: false }));

      const lastIndex = tabNames.length - 1;
      if (selectedIndex < lastIndex) setSelectedIndex((prev) => prev + 1);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, work: false }));
    }
  };

  const handlePublicProfileSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, public: true }));

    try {
      const formData = new FormData();

      // Convert services array to JSON string if it's not already
      const servicesValue = Array.isArray(services)
        ? JSON.stringify(services)
        : services;

      formData.append("person_service", servicesValue);
      formData.append("tags", JSON.stringify(tags));
      formData.append("notify_email", data.notifyEmail);
      formData.append("title", data.title);
      formData.append("about_us", data.aboutUs);

      const email = data.emailAddress || data.notifyEmail;
      formData.append("email_address", email);

      if (data.featuredImage && data.featuredImage[0]) {
        formData.append("file", data.featuredImage[0]);
      }

      const response = await SubmitPublicProfileDetails(formData);
      showToast({
        message: response?.success?.message,
        type: "success",
        duration: 5000,
      });

      // Reset unsaved changes for this tab
      setUnsavedChanges((prev) => ({ ...prev, public: false }));
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting((prev) => ({ ...prev, public: false }));
    }
  };

  const GetProfile = async () => {
    try {
      const response = await GetProfileDetails();
      setProfileData(response.data.data);
      console.log("response.data.data", response.data.data);

      if (response.data.data) {
        const professions = response.data.data?.professions || [];
        const interests = response.data.data?.interests || [];
        const professionValues = professions.map((prof: any) => {
          if (prof.profession_id) {
            return prof.profession_id;
          }
          return prof.title;
        });

        const interestValues = interests.map((interest: any) => {
          if (interest.id) {
            return interest.id;
          }
          return interest.title;
        });

        const socialLinksData = response.data.data?.social_links || {};
        const initializedSocialLinks: Record<string, string> = {};

        if (Object.keys(socialLinksData).length === 0) {
          ["facebook", "twitter", "linkedin", "instagram"].map((el) => {
            initializedSocialLinks[el] = " ";
          });
        } else {
          socialPlatforms.forEach((platform) => {
            initializedSocialLinks[platform.value] =
              socialLinksData[platform.value] || "";
          });
        }

        console.log(
          initializedSocialLinks,
          "initializedSocialLinks---initializedSocialLinks"
        );
        setSocialLinks(initializedSocialLinks);

        basicInfoForm.reset({
          firstName: response.data.data?.first_name || "",
          lastName: response.data.data?.last_name || "",
          bio:
            response.data.data?.bio ||
            response.data.data?.professional_bio ||
            "",
          gender: response.data?.data.gender || "",
          dob: response.data.data?.dob
            ? response.data.data?.dob.split("T")[0]
            : "",
          quote: response.data.data?.opinion_on_counsciouness || "",
          interests: interestValues, // Use the mapped values
          professions: professionValues, // Use the mapped values
          vision: response.data.data?.personal_vision_statement,
          identify_uploaded: response.data.data?.identify_uploaded,
        });

        // Contact Info
        contactInfoForm.reset({
          country_code: response.data.data?.country_code || "",
          phone: response.data.data?.phone_no || "",
          email: response?.data?.data?.email || "",
          address:
            response.data.data?.address ||
            response.data.data?.location?.address ||
            "",
          country:
            response.data.data?.country_id !== undefined &&
              response.data.data?.country_id !== null
              ? String(response.data.data?.country_id)
              : "",
          state:
            response.data.data?.state_id !== undefined &&
              response.data.data?.state_id !== null
              ? String(response.data.data?.state_id)
              : "",
          city: response.data.data?.location?.city || "",
          postalCode: response.data.data?.location?.postal_code || "",
          communication: {
            sms: response.data.data?.communication_sms || false,
            email: response.data.data?.communication_email || false,
            whatsapp: response.data.data?.communication_whatsapp || false,
          },
        });
        // Social Links
        socialLinksForm.reset({
          facebook: response.data.data?.social_links?.facebook || "",
          twitter: response.data.data?.social_links?.twitter || "",
          linkedin: response.data.data?.social_links?.linkedin || "",
          instagram: response.data.data?.social_links?.instagram || "",
        });

        // Education - using the first education entry if available
        // In GetProfile function, update the education part:
        if (response.data.data?.education?.length > 0) {
          educationForm.reset({
            educations: response.data.data?.education.map((edu: any) => ({
              id: edu.id || "",
              degree: edu.degree || "",
              institution: edu.institution || "",
              start_date: edu.start_date || "",
              end_date: edu.end_date || "",
            })),
          });
        } else {
          educationForm.reset({
            educations: [
              {
                degree: "",
                institution: "",
                start_date: "",
                end_date: "",
              },
            ],
          });
        }

        // Work Experience - using the first work experience if available
        if (response.data.data?.work_experience?.length > 0) {
          workExperienceForm.reset({
            workExperiences: response.data.data?.work_experience.map(
              (exp: any) => ({
                id: exp.id || "",
                company: exp.company || "",
                position: exp.position || "",
                roles_responsibilities: exp.roles_responsibilities || "",
                work_city: exp.work_city || "",
                work_state: exp.work_state || "",
                work_country: exp.work_country || "",
                currently_working: exp.currently_working || false,
                start_date: exp.start_date || "",
                end_date: exp.end_date || "",
              })
            ),
          });
        } else {
          workExperienceForm.reset({
            workExperiences: [
              {
                company: "",
                position: "",
                roles_responsibilities: "",
                work_city: "",
                work_state: "",
                work_country: "",
                start_date: "",
                end_date: "",
              },
            ],
          });
        }

        // Set profile picture if available
        if (response.data.data?.profile_picture) {
          setLogoPreview(response.data.data?.profile_picture);
        }
        if (response.data.data?.profile_banner) {
          setBanner(response.data.data?.profile_banner);
        }
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const GetPublicProfile = async () => {
    try {
      const response = await GetPublicProfileDetails();
      const profileData = response.data.data;

      publicProfileForm.reset({
        title: profileData?.title || "",
        notifyEmail: profileData?.notify_email || "",
        emailAddress: profileData?.email_address || "",
        aboutUs: profileData?.about_us || "",
      });
      if (profileData?.tags) {
        setTags(profileData?.tags);
      }
      if (profileData?.person_service) {
        // Extract just the id values from each object in the array
        const serviceIds = profileData.person_service.map(
          (service: any) => service.id
        );
        setServices(serviceIds);
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const GetInterest = async () => {
    try {
      const response = await GetInterestsDetails();
      setInterestData(response.data.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };
  const GetProfessional = async () => {
    try {
      const response = await GetProfessionalDetails();
      setProfessionalData(response.data.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
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
  const GetState = async (countryId: any) => {
    try {
      const response = await GetStateDetails(countryId);
      setStates(response.data.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const hasFetched = useRef(false);

  // Update countryRef whenever Country changes
  useEffect(() => {
    countryRef.current = Country;
  }, [Country]);

  useEffect(() => {
    if (!hasFetched.current) {
      GetProfile();
      GetPublicProfile();
      GetInterest();
      GetProfessional();
      GetCountry();
      GetService();
      hasFetched.current = true;
    }
  }, []);

  const selectedCountry = contactInfoForm.watch("country");
  const selectedState = contactInfoForm.watch("state");

  useEffect(() => {
    if (selectedCountry) {
      const countryObj = Country?.find(
        (c: any) => String(c.id) === String(selectedCountry)
      );
      GetState(countryObj?.id).then(() => {
        if (selectedState) {
          console.log("🚀 ~ UserProfilePage ~ selectedState:", selectedState);
          contactInfoForm.setValue("state", selectedState);
        }
      });
    } else {
      contactInfoForm.setValue("state", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /*const fetchVerifyOrganizationNumber = async (file: File) => {
    try {
      setUploadIdentify({
        ...uploadIdentify,
        loading: true,
      });
      const formData = new FormData();
      formData.append("file", file);
      const res = await GetOrganiZationNumberVerify(formData);
      // Handle the response
      if (res.success) {
        // return res;

        const { setValue } = basicInfoForm;
        setValue("identify_uploaded", res?.data?.data?.status);

        setUploadIdentify({
          ...uploadIdentify,
          loading: false,
        });

        return showToast({
          message: res?.success?.message,
          type: "success",
          duration: 5000,
        });
      }

      throw new Error(res.message || "Verification failed");
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };*/

  const MeDetail = async () => {
    try {
      setLoading(true);
      const response = await MeDetails();
      // response?.data?.data?.user should contain the user object
      setBasicData(response?.data?.data?.user);
    } catch (error) {
      console.error("Error fetching me details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    MeDetail();
  }, []);

  useEffect(() => {
    if (basicData?.email) {
      contactInfoForm.setValue("email", basicData.email);
    }
  }, [basicData, contactInfoForm]);

  return (
    <>
      <section className="w-full px-1 sm:px-2 lg:px-1 pt-2 pb-10">
        {/* {public_organization === "1" ? ( */}
        {/* is_disqualify === "true" ? (
            <div className="mt-0 shadow overflow-hidden p-6 sm:p-8 text-center">
              <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                  User Profile Access Restricted
                </h2>
                <p className="text-gray-600 mb-6">
                  You can access your profile after completing your assessment.
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
          ) : ( */}
        <div className="mt-0 bg-white rounded-xl shadow overflow-hidden">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="relative h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] bg-gray-100">
              {uploadProgress.type === "banner" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg
                      className="animate-spin h-8 w-8 mx-auto mb-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-sm">{uploadProgress.message}</p>
                  </div>
                </div>
              )}
              <img
                src={
                  banner &&
                    banner !== "null" &&
                    banner !== "undefined" &&
                    banner.startsWith("blob:")
                    ? banner // This will show the blob URL preview
                    : banner &&
                      banner !== "null" &&
                      banner !== "undefined" &&
                      banner.startsWith("http") &&
                      banner !== "http://localhost:5026/file/"
                      ? banner
                      : "https://cdn.cness.io/userprofilebanner.svg"
                }
                alt="Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://cdn.cness.io/userprofilebanner.svg";
                }}
              />
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-2 z-10">
                <label className="cursor-pointer bg-white p-1.5 sm:p-2 rounded-full shadow hover:bg-gray-200">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onClick={(e) => (e.currentTarget.value = "")}
                    onChange={(e) => handleImageChange(e, setBanner, "banner")}
                  />
                  <PhotoIcon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600" />
                </label>
                {banner &&
                  banner !== "null" &&
                  banner !== "undefined" &&
                  banner.startsWith("http") &&
                  banner !== "http://localhost:5026/file/" && (
                    <button
                      onClick={handleRemoveBannerImage}
                      className="bg-white p-1.5 sm:p-2 rounded-full shadow hover:bg-red-100"
                      disabled={uploadProgress.type === "banner"}
                    >
                      <TrashIcon className="w-4 sm:w-5 h-4 sm:h-5 text-red-600" />
                    </button>
                  )}
              </div>

              <div className="absolute bottom-0 left-4 sm:left-6 md:left-8 z-20 group">
                <div className="relative w-24 h-24 sm:w-28 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  {uploadProgress.type === "profile" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                      <div className="text-white text-center">
                        <svg
                          className="animate-spin h-5 w-5 mx-auto mb-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="text-sm">{uploadProgress.message}</p>
                      </div>
                    </div>
                  )}
                  <img
                    src={
                      !logoPreview ||
                        logoPreview === "null" ||
                        logoPreview === "undefined" ||
                        !logoPreview.startsWith("http") ||
                        logoPreview === "http://localhost:5026/file/"
                        ? "/profile.jpg"
                        : logoPreview
                    }
                    alt="Profile"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback if the image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/profile.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <label
                        className="bg-white p-1.5 rounded-full shadow cursor-pointer"
                        title="Upload Photo"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageChange(e, setLogoPreview, "profile")
                          }
                        />
                        <PhotoIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600" />
                      </label>
                      {logoPreview &&
                        logoPreview !== "null" &&
                        logoPreview !== "undefined" &&
                        logoPreview.startsWith("http") &&
                        logoPreview !== "http://localhost:5026/file/" && (
                          <button
                            onClick={handleRemoveProfileImage}
                            className="bg-white p-1.5 rounded-full shadow hover:bg-red-100"
                            disabled={uploadProgress.type === "profile"}
                            title="Remove Photo"
                          >
                            <TrashIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-600" />
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
              <h2 className="text-[20px] sm:text-[24px] poppins font-bold text-[#9747FF] mb-4 sm:mb-6">
                My Profile
              </h2>
              <Tab.Group
                selectedIndex={selectedIndex}
                onChange={handleTabChange}
              >
                <div className="w-full overflow-x-auto no-scrollbar">
                  <div className="inline-block min-w-full">
                    <Tab.List className="flex flex-wrap justify-start gap-2 items-end overflow-x-auto no-scrollbar">
                      {tabNames.map((tab, index) => (
                        <Tab
                          key={index}
                          className={({ selected }) =>
                            `shrink-0 
                                  min-w-[120px]  
                                    max-w-[200px] 
                                  text-sm 
                                  font-medium 
                                  poppins
                                   py-2
                                  px-3 
                                  rounded-lg 
                                  rounded-bl-none
                                  rounded-br-none
                                  whitespace-nowrap 
                                  overflow-hidden 
                                  text-ellipsis 
                                  text-center
                                  transition-all 
                                  duration-200 
                                  focus:outline-none
                                  border
                                  ${selected
                              ? "text-purple-600 h-[45px] bg-[#F8F3FF] shadow-md border-[#ECEEF2] border-b-0 transform"
                              : "text-gray-500 bg-white border-[#ECEEF2] border-b-0 hover:text-purple-500"
                            }`
                          }
                        >
                          {tab}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                </div>
                {/* Tab Content Panel */}

                <Tab.Panel>
                  <form
                    onSubmit={basicInfoForm.handleSubmit(handleBasicInfoSubmit)}
                    onKeyDown={(e) => {
                      // Prevent form submission when Enter is pressed in any input
                      if (
                        e.key === "Enter" &&
                        e.target instanceof HTMLInputElement
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-[#F8F3FF] mb-8 p-3 sm:p-4 md:p-6 rounded-lg rounded-tl-none rounded-tr-none relative">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...basicInfoForm.register("firstName")}
                          onChange={(e) => {
                            basicInfoForm.setValue("firstName", e.target.value);
                            handleFormChange("basic");
                          }}
                          placeholder="Enter your First Name"
                          className={`w-full px-4 py-2 h-[41px] border bg-white ${basicInfoForm.formState.errors.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                            } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${basicInfoForm.formState.errors.firstName
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                            }`}
                          maxLength={40}
                        />
                        {basicInfoForm.formState.errors.firstName && (
                          <p className="text-sm text-red-500 mt-1">
                            {basicInfoForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...basicInfoForm.register("lastName")}
                          onChange={(e) => {
                            basicInfoForm.setValue("lastName", e.target.value);
                            handleFormChange("basic");
                          }}
                          placeholder="Enter your Last Name"
                          className={`w-full px-4 py-2 border h-[41px] bg-white ${basicInfoForm.formState.errors.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                            } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${basicInfoForm.formState.errors.lastName
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                            }`}
                          maxLength={40}
                        />
                        {basicInfoForm.formState.errors.lastName && (
                          <p className="text-sm text-red-500 mt-1">
                            {basicInfoForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                      {/* Interests */}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Interests
                        </label>
                        <CreatableSelect
                          isMulti
                          options={
                            intereset?.map((interest: any) => ({
                              value: interest.id,
                              label: interest.name,
                            })) || []
                          }
                          value={basicInfoForm
                            .watch("interests")
                            ?.map((interestValue: any) => {
                              if (
                                typeof interestValue === "string" &&
                                !interestValue.includes("-")
                              ) {
                                return {
                                  value: interestValue,
                                  label: interestValue,
                                };
                              }

                              const foundInterest = intereset?.find(
                                (i: any) => i.id === interestValue
                              );

                              if (!foundInterest) {
                                const profileInterest =
                                  _profileData?.interests?.find(
                                    (i: any) => i.id === interestValue
                                  );
                                if (profileInterest) {
                                  return {
                                    value: interestValue,
                                    label:
                                      profileInterest.name ||
                                      profileInterest.title ||
                                      interestValue,
                                  };
                                }
                              }

                              return {
                                value: interestValue,
                                label: foundInterest?.name || interestValue,
                              };
                            })}
                          onChange={(selectedOptions) => {
                            const normalizedInterests = selectedOptions.map(
                              (option: any) => option.value
                            );

                            basicInfoForm.setValue(
                              "interests",
                              normalizedInterests
                            );
                            handleFormChange("basic");
                          }}
                          styles={customStyles}
                          classNamePrefix="react-select"
                          placeholder="Select interests or type to add custom..."
                          noOptionsMessage={({ inputValue }) =>
                            inputValue
                              ? `Press Enter to add "${inputValue}" as custom interest`
                              : "No options"
                          }
                          formatCreateLabel={(inputValue) =>
                            `Add "${inputValue}" as custom interest`
                          }
                          isValidNewOption={(inputValue) =>
                            inputValue.trim().length > 0 &&
                            inputValue.trim().length <= 50 &&
                            !basicInfoForm
                              .watch("interests")
                              ?.some(
                                (interest: any) =>
                                  typeof interest === "string" &&
                                  interest.toLowerCase() ===
                                  inputValue.trim().toLowerCase()
                              )
                          }
                        />
                      </div>

                      {/* Profession */}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Professions <span className="text-red-500">*</span>
                        </label>
                        <CreatableSelect
                          isMulti
                          options={
                            professional?.map((prof: any) => ({
                              value: prof.id,
                              label: prof.title,
                            })) || []
                          }
                          value={basicInfoForm
                            .watch("professions")
                            ?.map((profValue: any) => {
                              if (
                                typeof profValue === "string" &&
                                !profValue.includes("-")
                              ) {
                                return {
                                  value: profValue,
                                  label: profValue,
                                };
                              }

                              const foundProf = professional?.find(
                                (p: any) => p.id === profValue
                              );

                              if (!foundProf) {
                                const profileProf =
                                  _profileData?.professions?.find(
                                    (p: any) => p.profession_id === profValue
                                  );
                                if (profileProf) {
                                  return {
                                    value: profValue,
                                    label: profileProf.title || profValue,
                                  };
                                }
                              }

                              return {
                                value: profValue,
                                label: foundProf?.title || profValue,
                              };
                            })}
                          onChange={(selectedOptions) => {
                            const normalizedProfessions = selectedOptions.map(
                              (option: any) => option.value
                            );

                            basicInfoForm.setValue(
                              "professions",
                              normalizedProfessions
                            );
                            handleFormChange("basic");
                          }}
                          styles={customStyles}
                          classNamePrefix="react-select"
                          placeholder="Select professions or type to add custom..."
                          noOptionsMessage={({ inputValue }) =>
                            inputValue
                              ? `Press Enter to add "${inputValue}" as custom profession`
                              : "No options"
                          }
                          formatCreateLabel={(inputValue) =>
                            `Add "${inputValue}" as custom profession`
                          }
                          isValidNewOption={(inputValue) =>
                            inputValue.trim().length > 0 &&
                            inputValue.trim().length <= 50 &&
                            !basicInfoForm
                              .watch("professions")
                              ?.some(
                                (prof: any) =>
                                  typeof prof === "string" &&
                                  prof.toLowerCase() ===
                                  inputValue.trim().toLowerCase()
                              )
                          }
                        />
                        {basicInfoForm.formState.errors.professions && (
                          <p className="text-sm text-red-500 mt-1">
                            At least one profession is required
                          </p>
                        )}
                      </div>
                      {/* <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Upload Document{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            {basicInfoForm.watch("identify_uploaded") ==
                              null ? (
                              <>
                                <input
                                  type="file"
                                  id="registrationFile"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      try {
                                        const file = e.target.files[0];
                                        await fetchVerifyOrganizationNumber(
                                          file
                                        );
                                      } catch (error) {
                                        console.error(
                                          "File upload failed:",
                                          error
                                        );
                                      }
                                    }
                                  }}
                                />
                                <div className="mt-5 flex ">
                                  <label
                                    htmlFor="registrationFile"
                                    className="px-4 py-2 flex h-[41px] bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                  >
                                    {uploadIdentify.loading
                                      ? uploadIdentify.message
                                      : "Verify Identity"}
                                    <div>
                                      {uploadIdentify.loading && (
                                        <div className="inset-0 ms-2 w-[20px] h-[20px] flex items-center justify-center">
                                          <div className="text-black w-full h-full text-center">
                                            <svg
                                              className="animate-spin w-full h-full mx-auto text-black"
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                            >
                                              <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                              ></circle>
                                              <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                              ></path>
                                            </svg>
                                            
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </label>
                                </div>
                              </>
                            ) : basicInfoForm.watch("identify_uploaded") ==
                              1 ? (
                              <span className="px-4 py-2 h-[41px] bg-green-50 border border-green-200 rounded-xl text-sm font-medium text-green-600 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                Verified
                              </span>
                            ) : basicInfoForm.watch("identify_uploaded") ==
                              2 ? (
                              <span className="px-4 py-2 h-[41px] bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                Rejected
                              </span>
                            ) : basicInfoForm.watch("identify_uploaded") ==
                              0 ? (
                              <span className="px-4 py-2 h-[41px] bg-yellow-50 border border-yellow-200 rounded-xl text-sm font-medium text-yellow-600 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Pending
                              </span>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  id="registrationFile"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={async (e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      try {
                                        const file = e.target.files[0];
                                        await fetchVerifyOrganizationNumber(
                                          file
                                        );
                                      } catch (error) {
                                        console.error(
                                          "File upload failed:",
                                          error
                                        );
                                      }
                                    }
                                  }}
                                />
                                <div className="mt-5">
                                  <label
                                    htmlFor="registrationFile"
                                    className="px-4 py-2 h-[41px] bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                  >
                                    Verify Identity
                                  </label>
                                </div>
                              </>
                            )}
                          </div> */}
                      {/* Gender Dropdown - Styled like the Interests Field */}
                      <div className="w-full col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
                          Gender
                        </label>
                        <Select
                          options={genderOptions}
                          styles={customSelectStyles}
                          value={genderOptions.find(
                            (opt) => opt.value === basicInfoForm.watch("gender")
                          )}
                          onChange={(selectedOption) => {
                            const value = selectedOption?.value || "";
                            basicInfoForm.setValue("gender", value);
                            handleFormChange("basic");
                          }}
                          isSearchable={false}
                        />
                        {basicInfoForm.formState.errors.gender && (
                          <p className="text-sm text-red-500 mt-1">
                            {basicInfoForm.formState.errors.gender.message ||
                              "This field is required"}
                          </p>
                        )}
                      </div>
                      {/* Date of Birth */}
                      <div className="col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
                          Date of Birth
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          {...basicInfoForm.register("dob", {
                            required: true,
                          })}
                          onChange={(e) => {
                            basicInfoForm.setValue("dob", e.target.value);
                            handleFormChange("basic");
                          }}
                          onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                            e.currentTarget.showPicker()
                          }
                          className={`w-full px-3 sm:px-4 py-2 h-10 sm:h-[41px] text-sm border bg-white ${basicInfoForm.formState.errors.dob
                              ? "border-red-500"
                              : "border-gray-300"
                            } rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 ${basicInfoForm.formState.errors.dob
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                            }`}
                        />
                        {basicInfoForm.formState.errors.dob && (
                          <p className="text-sm text-red-500 mt-1">
                            {basicInfoForm.formState.errors.dob.message ||
                              "This field is required"}
                          </p>
                        )}
                      </div>
                      {/* Quote on Consciousness */}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Your Quote on Consciousness
                        </label>
                        <input
                          type="text"
                          {...basicInfoForm.register("quote")}
                          onChange={(e) => {
                            basicInfoForm.setValue("quote", e.target.value);
                            handleFormChange("basic");
                          }}
                          placeholder="Enter your quote"
                          className={`w-full px-4 py-2 h-[41px] border bg-white ${basicInfoForm.formState.errors.quote
                              ? "border-red-500"
                              : "border-gray-300"
                            } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${basicInfoForm.formState.errors.quote
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                            }`}
                        />
                        {basicInfoForm.formState.errors.quote && (
                          <p className="text-sm text-red-500 mt-1">
                            {basicInfoForm.formState.errors.quote.message}
                          </p>
                        )}
                      </div>
                      {/* Professional Bio */}
                      <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Describe Yourself
                        </label>
                        <textarea
                          rows={4}
                          {...basicInfoForm.register("bio")}
                          onChange={(e) => {
                            basicInfoForm.setValue("bio", e.target.value);
                            handleFormChange("basic");
                          }}
                          placeholder="Add a short professional bio"
                          className={`w-full px-4 py-2 border bg-white ${basicInfoForm.formState.errors.bio
                              ? "border-red-500"
                              : "border-gray-300"
                            } rounded-xl min-h-[100px] resize-y text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${basicInfoForm.formState.errors.bio
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                            }`}
                        />
                        {basicInfoForm.formState.errors.bio && (
                          <p className="text-sm text-red-500 mt-1">
                            {basicInfoForm.formState.errors.bio.message}
                          </p>
                        )}
                      </div>
                      {/* Vision Statement - Full Width */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Personal Vision Statement
                        </label>
                        <input
                          type="text"
                          {...basicInfoForm.register("vision")}
                          onChange={(e) => {
                            basicInfoForm.setValue("vision", e.target.value);
                            handleFormChange("basic");
                          }}
                          placeholder="What is your conscious vision?"
                          className={`w-full px-4 py-3 border bg-white ${basicInfoForm.formState.errors.vision
                              ? "border-red-500"
                              : "border-gray-300"
                            } rounded-xl text-sm placeholder-gray-400 
                            focus:outline-none focus:ring-2 ${basicInfoForm.formState.errors.vision
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                            } transition-all`}
                        />
                        {basicInfoForm.formState.errors.vision && (
                          <p className="text-sm text-red-500 mt-1">
                            {basicInfoForm.formState.errors.vision.message}
                          </p>
                        )}
                      </div>
                    </div>
                   <div className="w-full flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <Button
                        variant="white-outline"
                        className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
            hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
            shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
                        type="button"
                        onClick={() => {
                          const currentEmail = contactInfoForm.getValues("email");
                          contactInfoForm.reset();
                          // Restore the email after reset
                          contactInfoForm.setValue("email", currentEmail);
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="gradient-primary"
                        className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                        type="submit"
                        disabled={isSubmitting.basic}
                      >
                        {isSubmitting.basic ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Tab.Panel>

                {/* Contact Information Tab */}
                <Tab.Panel>
                  <form
                    onSubmit={contactInfoForm.handleSubmit(
                      handleContactInfoSubmit
                    )}
                  >
             <div className="grid grid-cols-1 md:grid-cols-2 bg-[#F8F3FF] gap-3 sm:gap-4 md:gap-6 mb-8 p-3 sm:p-4 md:p-6 rounded-lg rounded-tl-none rounded-tr-none relative">
                      {/* Privacy note - full width on mobile, spans 2 columns on desktop */}
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-xs text-gray-500 text-center sm:text-left px-2 sm:px-0">
                          Your phone number and email are never displayed on
                          your public profile.
                        </p>
                      </div>

                      {/* Phone Number */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <div className="w-full sm:w-32 mb-2 sm:mb-0">
                            <Select
                              options={countryCodeOptions}
                              styles={{
                                ...customSelectStyles,
                                control: (base) => ({
                                  ...base,
                                  minHeight: "44px",
                                  fontSize: "14px",
                                }),
                              }}
                              value={
                                countryCodeOptions.find(
                                  (opt) =>
                                    opt.value ===
                                    contactInfoForm.watch("country_code")
                                ) || countryCodeOptions[0]
                              }
                              onChange={(selectedOption) => {
                                const value =
                                  selectedOption?.value || countryCode[0];
                                contactInfoForm.setValue("country_code", value);
                                handleFormChange("contact");
                              }}
                              isSearchable={true}
                              placeholder="Code"
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="tel"
                              placeholder="Enter Your Phone Number"
                              value={contactInfoForm.watch("phone") || ""}
                              onChange={(e) => {
                                const selectedCallingCode =
                                  contactInfoForm.watch("country_code") ||
                                  "+91";
                                const isoCountry =
                                  callingCodeToISO[selectedCallingCode] || "IN";
                                let digits = e.target.value.replace(/\D/g, "");
                                const maxDigits = getMaxDigits(isoCountry);
                                if (digits.length > maxDigits)
                                  digits = digits.slice(0, maxDigits);
                                let formatted: string;

if (isoCountry === "US") {
  // 🚫 Do NOT auto-format US numbers
  formatted = digits;
} else {
  formatted = formatPhoneForCountry(digits, isoCountry);

  // remove trunk prefix (0) for countries like IN, EG, MA, etc.
  formatted = formatted.replace(/^0+/, "");
}
                                contactInfoForm.setValue("phone", formatted, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                                handleFormChange("contact");
                              }}
                              onKeyDown={(e) => {
                                if (
                                  !/^\d$/.test(e.key) &&
                                  e.key !== "Backspace" &&
                                  e.key !== "Delete" &&
                                  e.key !== "ArrowLeft" &&
                                  e.key !== "ArrowRight" &&
                                  e.key !== "Tab"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border bg-white ${
                                contactInfoForm.formState.errors.phone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl h-11 sm:h-[46px] focus:outline-none focus:ring-2 placeholder:text-sm placeholder:text-gray-400 ${
                                contactInfoForm.formState.errors.phone
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                          </div>
                          
                          {/*<input
                            type="tel"
                            placeholder="Enter Your Phone Number"
                            value={contactInfoForm.watch("phone") || ""}
                            onChange={(e) => {
                              const selectedCallingCode =
                                contactInfoForm.watch("country_code") || "+91";
                              const isoCountry =
                                callingCodeToISO[selectedCallingCode] || "IN";
                              let digits = e.target.value.replace(/\D/g, "");
                              const maxDigits = getMaxDigits(isoCountry);
                              if (digits.length > maxDigits)
                                digits = digits.slice(0, maxDigits);
                              const formatted = formatPhoneForCountry(
                                digits,
                                isoCountry
                              );
                              contactInfoForm.setValue("phone", formatted, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              handleFormChange("contact"); // Track changes
                            }}
                            onKeyDown={(e) => {
                              if (
                                !/^\d$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight" &&
                                e.key !== "Tab"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            className={`w-full px-4 py-2 border bg-white ${contactInfoForm.formState.errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                              } rounded-xl h-[41px] focus:outline-none focus:ring-2 placeholder:text-sm placeholder:text-gray-400 ${contactInfoForm.formState.errors.phone
                                ? "focus:ring-red-500"
                                : "focus:ring-purple-500"
                              }`}
                          />*/}
                        </div>
                        {contactInfoForm.formState.errors.phone && (
                          <p className="text-sm text-red-500 mt-1">
                            {
                              contactInfoForm.formState.errors.phone
                                .message as string
                            }
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="Enter Your Email"
                          {...contactInfoForm.register("email")}
                          onChange={(e) => {
                            contactInfoForm.setValue("email", e.target.value);
                            handleFormChange("contact");
                          }}
                          readOnly
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border bg-gray-100 text-gray-600 cursor-not-allowed ${
                            contactInfoForm.formState.errors.email
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-xl h-11 sm:h-[46px] focus:outline-none`}
                        />
                        {contactInfoForm.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {
                              contactInfoForm.formState.errors.email
                                .message as string
                            }
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="col-span-1 md:col-span-2 lg:col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          {...contactInfoForm.register("address")}
                          onChange={(e) => {
                            contactInfoForm.setValue("address", e.target.value);
                            handleFormChange("contact");
                          }}
                          placeholder="Enter your address"
                          className="w-full h-11 sm:h-[46px] px-3 sm:px-4 py-2 sm:py-3 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Country */}
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={
                            Country
                              ? Country.map((country: any) => ({
                                value: String(country.id),
                                label: country.name,
                              }))
                              : []
                          }
                          value={
                            Country
                              ? Country.find(
                                (c: any) =>
                                  String(c.id) ===
                                  contactInfoForm.watch("country")
                              )
                                ? {
                                  value: contactInfoForm.watch("country"),
                                  label:
                                    Country.find(
                                      (c: any) =>
                                        String(c.id) ===
                                        contactInfoForm.watch("country")
                                    )?.name || "Select your country",
                                }
                                : null
                              : null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption?.value
                              ? String(selectedOption.value)
                              : "";
                            contactInfoForm.setValue("country", value);
                            handleFormChange("contact");
                          }}
                          onBlur={() => contactInfoForm.trigger("country")}
                          styles={{
                            ...customSelectStyles,
                            control: (base) => ({
                              ...base,
                              minHeight: "44px",
                              fontSize: "14px",
                            }),
                            menu: (provided) => ({
                              ...provided,
                              fontSize: "14px",
                            }),
                          }}
                          placeholder="Select your country"
                          isSearchable
                          classNamePrefix="react-select"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                        {contactInfoForm.formState.errors.country && (
                          <p className="text-sm text-red-500 mt-1">
                            {
                              contactInfoForm.formState.errors.country
                                .message as string
                            }
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <Select
                          isDisabled={!contactInfoForm.watch("country")}
                          options={
                            states.length > 0
                              ? states.map((state: any) => ({
                                  value: String(state.id),
                                  label: state.name,
                                }))
                              : []
                          }
                          value={
                            contactInfoForm.watch("state") && states.length > 0
                              ? states.find(
                                  (s: any) =>
                                    String(s.id) ===
                                    String(contactInfoForm.watch("state"))
                                )
                                ? {
                                    value: String(
                                      contactInfoForm.watch("state")
                                    ),
                                    label: states.find(
                                      (s: any) =>
                                        String(s.id) ===
                                        String(contactInfoForm.watch("state"))
                                    )?.name,
                                  }
                                : null
                              : null
                          }
                          onChange={(selectedOption) => {
                            const value = selectedOption?.value
                              ? String(selectedOption.value)
                              : "";
                            contactInfoForm.setValue("state", value);
                            handleFormChange("contact");
                          }}
                          styles={{
                            ...customSelectStyles,
                            control: (base) => ({
                              ...base,
                              minHeight: "44px",
                              fontSize: "14px",
                            }),
                          }}
                          placeholder="Select your state"
                          isSearchable
                          classNamePrefix="react-select"
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                        />
                      </div>

                      {/* City */}
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          {...contactInfoForm.register("city")}
                          onChange={(e) => {
                            contactInfoForm.setValue("city", e.target.value);
                            handleFormChange("contact");
                          }}
                          placeholder="Enter city"
                          className="w-full h-11 sm:h-[46px] px-3 sm:px-4 py-2 sm:py-3 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Postal Code */}
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          {...contactInfoForm.register("postalCode")}
                          onChange={(e) => {
                            contactInfoForm.setValue(
                              "postalCode",
                              e.target.value
                            );
                            handleFormChange("contact");
                          }}
                          placeholder="Enter postal code"
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 border h-11 sm:h-[46px] bg-white ${
                            contactInfoForm.formState.errors.postalCode
                              ? "border-red-500"
                              : "border-gray-300"
                            } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${contactInfoForm.formState.errors.postalCode
                              ? "focus:ring-red-500"
                              : "focus:ring-purple-500"
                            } uppercase`}
                          style={{ textTransform: "uppercase" }}
                        />
                        {contactInfoForm.formState.errors.postalCode && (
                          <p className="text-sm text-red-500 mt-1">
                            {
                              contactInfoForm.formState.errors.postalCode
                                .message as string
                            }
                          </p>
                        )}
                      </div>

                      {/* Communication Preferences */}
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Method of Communication
                        </label>
                        <div className="flex flex-wrap gap-4 sm:gap-6">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              {...contactInfoForm.register("communication.sms")}
                              onChange={(e) => {
                                const currentCommunication =
                                  contactInfoForm.watch("communication");
                                const updatedCommunication = {
                                  ...currentCommunication,
                                  sms: e.target.checked,
                                };
                                contactInfoForm.setValue(
                                  "communication",
                                  updatedCommunication
                                );
                                handleFormChange("contact");
                              }}
                              className="accent-[#9747FF] w-4 h-4 sm:w-5 sm:h-5"
                            />
                            <span className="text-sm text-gray-700">SMS</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              {...contactInfoForm.register(
                                "communication.email"
                              )}
                              onChange={(e) => {
                                const currentCommunication =
                                  contactInfoForm.watch("communication");
                                const updatedCommunication = {
                                  ...currentCommunication,
                                  email: e.target.checked,
                                };
                                contactInfoForm.setValue(
                                  "communication",
                                  updatedCommunication
                                );
                                handleFormChange("contact");
                              }}
                              className="accent-[#9747FF] w-4 h-4 sm:w-5 sm:h-5"
                            />
                            <span className="text-sm text-gray-700">Email</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              {...contactInfoForm.register(
                                "communication.whatsapp"
                              )}
                              onChange={(e) => {
                                const currentCommunication =
                                  contactInfoForm.watch("communication");
                                const updatedCommunication = {
                                  ...currentCommunication,
                                  whatsapp: e.target.checked,
                                };
                                contactInfoForm.setValue(
                                  "communication",
                                  updatedCommunication
                                );
                                handleFormChange("contact");
                              }}
                              className="accent-[#9747FF] w-4 h-4 sm:w-5 sm:h-5"
                            />
                            <span className="text-sm text-gray-700">
                              WhatsApp
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
                      <Button
                        variant="white-outline"
                        className="font-['Plus Jakarta Sans'] text-sm sm:text-[14px] px-4 sm:px-6 py-2.5 sm:py-2 rounded-full border border-gray-300 text-black bg-white hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
                        type="button"
                        onClick={() => contactInfoForm.reset()}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="gradient-primary"
                        className="font-['Plus Jakarta Sans'] text-sm sm:text-[14px] w-full sm:w-auto rounded-full py-2.5 sm:py-2 px-4 sm:px-6 flex justify-center transition-colors duration-500 ease-in-out"
                        type="submit"
                        disabled={isSubmitting.contact}
                      >
                        {isSubmitting.contact ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Tab.Panel>

                {/* Social Links Tab */}
                <Tab.Panel>
                  <form
                    onSubmit={socialLinksForm.handleSubmit(
                      handleSocialLinksSubmit
                    )}
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 bg-[#F8F3FF] mb-8 p-3 sm:p-4 md:p-6 rounded-lg rounded-tl-none rounded-tr-none relative">
                      {/* Render social links that have values OR custom social links */}
                      {socialPlatforms
                        .filter((platform) => socialLinks[platform.value])
                        .map((platform) => {
                          // Count how many social links have values
                          const activeSocialLinksCount = Object.values(
                            socialLinks
                          ).filter((url) => url).length;

                          // Only show delete button if there's more than 1 active social link
                          const showDeleteButton = activeSocialLinksCount > 1;

                          return (
                            <div key={platform.value} className="relative">
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                {platform.label}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="url"
                                  value={socialLinks[platform.value] || ""}
                                  onChange={(e) => {
                                    setSocialLinks((prev) => ({
                                      ...prev,
                                      [platform.value]: e.target.value,
                                    }));
                                    handleFormChange("social"); // Track changes
                                  }}
                                  placeholder={`https://${platform.value}.com/`}
                                  className="w-full px-4 py-2 h-[41px] border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {/* Show delete button only if there are more than 1 active social links */}
                                {showDeleteButton && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleRemoveSocialLink(platform.value);
                                      handleFormChange("social"); // Track changes
                                    }}
                                    className="px-3 text-red-500 hover:text-red-700 transition-colors"
                                    title={`Remove ${platform.label} link`}
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                      {/* Add More Social Links Button - Show only if there are available platforms */}
                      {getAvailablePlatforms().length > 0 && (
                        <div className="md:col-span-2">
                          <button
                            type="button"
                            onClick={() => setShowSocialModal(true)}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Add More Social Links
                          </button>
                        </div>
                      )}
                    </div>

                    <Modal
                      isOpen={showSocialModal}
                      onClose={() => {
                        setShowSocialModal(false);
                        setNewSocialLink({ platform: "", url: "" });
                      }}
                    >
                      <div className="p-0 lg:min-w-[450px] md:min-w-[450px] min-w-[300px]">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Add Social Link
                        </h3>

                        <div className="space-y-4">
                          {/* Platform Select */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Platform <span className="text-red-500">*</span>
                            </label>
                            <Select
                              options={getAvailablePlatforms()}
                              value={socialPlatforms.find(
                                (p) => p.value === newSocialLink.platform
                              )}
                              onChange={(selectedOption) =>
                                setNewSocialLink((prev) => ({
                                  ...prev,
                                  platform: selectedOption?.value || "",
                                }))
                              }
                              styles={customSelectStyles}
                              placeholder="Select platform"
                              isSearchable
                              menuPortalTarget={document.body}
                              menuPosition="fixed"
                            />
                          </div>

                          {/* URL Input */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              URL <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="url"
                              value={newSocialLink.url}
                              onChange={(e) =>
                                setNewSocialLink((prev) => ({
                                  ...prev,
                                  url: e.target.value,
                                }))
                              }
                              placeholder={`Enter ${socialPlatforms.find(
                                (p) => p.value === newSocialLink.platform
                              )?.label || "social media"
                                } URL`}
                              className="w-full px-4 py-2 h-[41px] border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <Button
                            onClick={() => {
                              setShowSocialModal(false);
                              setNewSocialLink({ platform: "", url: "" });
                            }}
                            variant="white-outline"
                            className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
            hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
            shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
                            type="button"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="gradient-primary"
                            onClick={() =>
                              handleAddSocialLink(
                                newSocialLink.platform,
                                newSocialLink.url
                              )
                            }
                            disabled={
                              !newSocialLink.platform || !newSocialLink.url
                            }
                            className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-500 ease-in-out"
                          >
                            Add Link
                          </Button>
                        </div>
                      </div>
                    </Modal>

                   <div className="w-full flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <Button
                        variant="white-outline"
                        className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
        hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
        shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
                        type="button"
                        onClick={() => {
                          // Reset all social links to empty
                          const resetSocialLinks: Record<string, string> = {};
                          socialPlatforms.forEach((platform) => {
                            resetSocialLinks[platform.value] = "";
                          });
                          setSocialLinks(resetSocialLinks);
                          // Clear unsaved changes
                          setUnsavedChanges((prev) => ({
                            ...prev,
                            social: false,
                          }));
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="gradient-primary"
                        className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                        type="submit"
                        disabled={isSubmitting.social}
                      >
                        {isSubmitting.social ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Tab.Panel>

                {/* Education Tab */}
                <Tab.Panel>
                  <form
                    onSubmit={educationForm.handleSubmit(handleEducationSubmit)}
                  >
                    {educationForm
                      .watch("educations")
                      ?.map((_education: any, index) => {
                        const educationErrors =
                          educationForm.formState.errors?.educations?.[index];
                        const hasEducationError =
                          educationErrors &&
                          (educationErrors.degree ||
                            educationErrors.institution ||
                            educationErrors.start_date ||
                            educationErrors.end_date);

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 bg-[#F8F3FF] gap-3 sm:gap-4 md:gap-6 mb-8 p-3 sm:p-4 md:p-6 rounded-lg rounded-tl-none rounded-tr-none relative overflow-visible">
                            {/* Add remove button */}
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const educations =
                                    educationForm.getValues("educations");
                                  if (educations) {
                                    const newEducations = [...educations];
                                    newEducations.splice(index, 1);
                                    educationForm.setValue(
                                      "educations",
                                      newEducations
                                    );
                                    handleFormChange("education"); // Track changes
                                  }
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}

                            {/* Degree */}
                            <div>
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                Degree
                              </label>
                              <input
                                type="text"
                                {...educationForm.register(
                                  `educations.${index}.degree`
                                )}
                                onChange={(e) => {
                                  educationForm.setValue(
                                    `educations.${index}.degree`,
                                    e.target.value
                                  );
                                  handleFormChange("education"); // Track changes
                                }}
                                placeholder="Enter your degree"
                                className={`w-full px-4 py-2 border bg-white ${educationErrors?.degree
                                    ? "border-red-500"
                                    : "border-gray-300"
                                  } rounded-xl h-[41px] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${educationErrors?.degree
                                    ? "focus:ring-red-500"
                                    : "focus:ring-purple-500"
                                  }`}
                              />
                              {educationErrors?.degree && (
                                <p className="text-sm text-red-500 mt-1">
                                  {educationErrors.degree.message}
                                </p>
                              )}
                            </div>

                            {/* Institution */}
                            <div>
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                Institution
                              </label>
                              <input
                                type="text"
                                {...educationForm.register(
                                  `educations.${index}.institution`
                                )}
                                onChange={(e) => {
                                  educationForm.setValue(
                                    `educations.${index}.institution`,
                                    e.target.value
                                  );
                                  handleFormChange("education"); // Track changes
                                }}
                                placeholder="Enter institution name"
                                className={`w-full h-[41px] px-4 py-2 border bg-white ${educationErrors?.institution
                                    ? "border-red-500"
                                    : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${educationErrors?.institution
                                    ? "focus:ring-red-500"
                                    : "focus:ring-purple-500"
                                  }`}
                              />
                              {educationErrors?.institution && (
                                <p className="text-sm text-red-500 mt-1">
                                  {educationErrors.institution.message}
                                </p>
                              )}
                            </div>

                            {/* Start Date */}
                            <div className="relative">
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                Start Date
                              </label>

                              {!educationForm.watch(
                                `educations.${index}.start_date`
                              ) && (
                                <span className="absolute left-4 top-[38px] text-gray-400 pointer-events-none text-sm">
                                  Select month & year
                                </span>
                              )}

                              <Controller
                                control={educationForm.control}
                                name={`educations.${index}.start_date`}
                                rules={{
                                  required: "Start date is required",
                                  validate: (startVal) => {
                                    const endVal = educationForm.getValues(
                                      `educations.${index}.end_date`
                                    );

                                    if (!startVal || !endVal) return true;

                                    const start = parseMonthYear(startVal);
                                    const end = parseMonthYear(endVal);

                                    if (!start || !end) return "";

                                    if (start >= end)
                                      return "Start date must be earlier than end date";

                                    return true;
                                  },
                                }}
                                render={({ field }) => (
                                  <Monthpicker
                                    value={field.value || ""}
                                    onChange={(val) => {
                                      field.onChange(val);
                                      // force validation for both so cross-check runs
                                      educationForm.trigger(
                                        `educations.${index}.start_date`
                                      );
                                      educationForm.trigger(
                                        `educations.${index}.end_date`
                                      );
                                      handleFormChange("education");
                                    }}
                                    // placeholder="Select Month & Year"
                                  />
                                )}
                              />

                              {educationErrors?.start_date && (
                                <p className="text-sm text-red-500 mt-1">
                                  {educationErrors.start_date.message}
                                </p>
                              )}
                            </div>

                            {/* End Date */}
                            <div className="relative">
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                End Date
                              </label>

                              {!educationForm.watch(
                                `educations.${index}.end_date`
                              ) && (
                                <span className="absolute left-4 top-[38px] text-gray-400 pointer-events-none text-sm">
                                  Select month & year
                                </span>
                              )}

                              <Controller
                                control={educationForm.control}
                                name={`educations.${index}.end_date`}
                                rules={{
                                  required: "End date is required",
                                  validate: (endVal) => {
                                    const startVal = educationForm.getValues(
                                      `educations.${index}.start_date`
                                    );

                                    if (!startVal || !endVal) return true;

                                    const start = parseMonthYear(startVal);
                                    const end = parseMonthYear(endVal);

                                    if (!start || !end) return "";

                                    const minEnd = new Date(start);
                                    minEnd.setMonth(minEnd.getMonth() + 1);

                                    if (end < minEnd)
                                      return "End date must be at least 1 month after start date";

                                    return true;
                                  },
                                }}
                                render={({ field }) => (
                                  <Monthpicker
                                    value={field.value || ""}
                                    onChange={(val) => {
                                      field.onChange(val);
                                      educationForm.trigger(
                                        `educations.${index}.start_date`
                                      );
                                      educationForm.trigger(
                                        `educations.${index}.end_date`
                                      );
                                      handleFormChange("education");
                                    }}
                                    //placeholder="Select Month & Year"
                                  />
                                )}
                              />

                              {educationErrors?.end_date && (
                                <p className="text-sm text-red-500 mt-1">
                                  {educationErrors.end_date.message}
                                </p>
                              )}
                            </div>
                            {/* Individual education entry error */}
                            {hasEducationError && (
                              <div className="md:col-span-2">
                                <p className="text-sm text-red-500 mt-2 text-center">
                                  Please fill at least one field for this
                                  education entry
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* Global education form error */}
                    {educationForm.formState.errors.educations &&
                      educationForm.formState.errors.educations.root && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600 text-center">
                            {
                              educationForm.formState.errors.educations.root
                                ?.message
                            }
                          </p>
                        </div>
                      )}

                    <div className="flex justify-between items-center mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const currentEducations =
                            educationForm.getValues("educations") || [];
                          educationForm.setValue("educations", [
                            ...currentEducations,
                            {
                              degree: "",
                              institution: "",
                              start_date: "",
                              end_date: "",
                            },
                          ]);
                          handleFormChange("education"); // Track changes
                        }}
                        className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Add Another Education
                      </button>
                    </div>

                   <div className="w-full flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <Button
                        variant="white-outline"
                        className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
                        type="button"
                        onClick={() => {
                          educationForm.reset();
                          // Clear unsaved changes
                          setUnsavedChanges((prev) => ({
                            ...prev,
                            education: false,
                          }));
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="gradient-primary"
                        className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                        type="submit"
                        disabled={isSubmitting.education}
                      >
                        {isSubmitting.education ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Tab.Panel>

                {/* Work Experience Tab */}
                <Tab.Panel>
                  <form
                    onSubmit={workExperienceForm.handleSubmit(
                      handleWorkExperienceSubmit
                    )}
                  >
                    {workExperienceForm
                      .watch("workExperiences")
                      ?.map((_experience, index) => {
                        const experienceErrors =
                          workExperienceForm.formState.errors
                            ?.workExperiences?.[index];
                        const hasExperienceError =
                          experienceErrors &&
                          (experienceErrors.company ||
                            experienceErrors.position ||
                            experienceErrors.start_date ||
                            experienceErrors.end_date ||
                            experienceErrors.roles_responsibilities ||
                            experienceErrors.work_city ||
                            experienceErrors.work_state ||
                            experienceErrors.work_country);

                        return (
                          <div
                            key={index}
                            className="flex flex-wrap bg-[#F8F3FF] gap-6 mb-8 p-4 rounded-lg rounded-tl-none rounded-tr-none relative"
                          >
                            {/* Add remove button */}
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const experiences = [
                                    ...workExperienceForm.getValues(
                                      "workExperiences"
                                    ),
                                  ];
                                  experiences.splice(index, 1);
                                  workExperienceForm.setValue(
                                    "workExperiences",
                                    experiences
                                  );
                                  handleFormChange("work"); // Track changes
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}

                            {/* Company */}
                            <div className="w-full lg:w-[48%]">
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                Company
                              </label>
                              <input
                                type="text"
                                {...workExperienceForm.register(
                                  `workExperiences.${index}.company`
                                )}
                                maxLength={40}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  workExperienceForm.setValue(
                                    `workExperiences.${index}.company`,
                                    value,
                                    { shouldValidate: true }
                                  );
                                  handleFormChange("work");
                                }}
                                onBlur={() => {
                                  workExperienceForm.trigger(
                                    `workExperiences.${index}.company`
                                  );
                                }}
                                placeholder="Enter Company Name"
                                className={`w-full h-[41px] px-4 py-2 border bg-white ${experienceErrors?.company
                                    ? "border-red-500"
                                    : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${experienceErrors?.company
                                    ? "focus:ring-red-500"
                                    : "focus:ring-purple-500"
                                  }`}
                              />
                              {experienceErrors?.company && (
                                <p className="text-sm text-red-500 mt-1">
                                  {experienceErrors.company.message}
                                </p>
                              )}
                            </div>

                            {/* Position */}
                            <div className="lg:w-[48%] w-full">
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                Position
                              </label>
                              <input
                                type="text"
                                {...workExperienceForm.register(
                                  `workExperiences.${index}.position`
                                )}
                                maxLength={40}
                                onChange={(e) => {
                                  workExperienceForm.setValue(
                                    `workExperiences.${index}.position`,
                                    e.target.value
                                  );
                                  handleFormChange("work");
                                }}
                                placeholder="Enter your Designation"
                                className={`w-full h-[41px] px-4 py-2 border bg-white ${experienceErrors?.position
                                    ? "border-red-500"
                                    : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${experienceErrors?.position
                                    ? "focus:ring-red-500"
                                    : "focus:ring-purple-500"
                                  }`}
                              />
                              {experienceErrors?.position && (
                                <p className="text-sm text-red-500 mt-1">
                                  {experienceErrors.position.message}
                                </p>
                              )}
                            </div>

                            {/* Roles & Responsibilities */}
                            <div className="lg:w-[48%] w-full">
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                Roles & Responsibilities
                              </label>
                              <textarea
                                {...workExperienceForm.register(
                                  `workExperiences.${index}.roles_responsibilities`
                                )}
                                rows={5}
                                onChange={(e) => {
                                  workExperienceForm.setValue(
                                    `workExperiences.${index}.roles_responsibilities`,
                                    e.target.value
                                  );
                                  handleFormChange("work");
                                }}
                                placeholder="Describe your key roles and responsibilities"
                                className={`w-full px-4 py-2 border bg-white ${experienceErrors?.roles_responsibilities
                                    ? "border-red-500"
                                    : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${experienceErrors?.roles_responsibilities
                                    ? "focus:ring-red-500"
                                    : "focus:ring-purple-500"
                                  }`}
                              />
                              {experienceErrors?.roles_responsibilities && (
                                <p className="text-sm text-red-500 mt-1">
                                  {
                                    experienceErrors.roles_responsibilities
                                      .message
                                  }
                                </p>
                              )}
                            </div>

                            {/* City */}
                            <div className="lg:w-[48%] w-full">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                {...workExperienceForm.register(
                                  `workExperiences.${index}.work_city`
                                )}
                                onChange={(e) => {
                                  workExperienceForm.setValue(
                                    `workExperiences.${index}.work_city`,
                                    e.target.value
                                  );
                                  handleFormChange("work");
                                }}
                                placeholder="Enter city"
                                className={`w-full h-[41px] px-4 py-2 border bg-white ${experienceErrors?.work_city
                                    ? "border-red-500"
                                    : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${experienceErrors?.work_city
                                    ? "focus:ring-red-500"
                                    : "focus:ring-purple-500"
                                  }`}
                              />
                              {experienceErrors?.work_city && (
                                <p className="text-sm text-red-500 mt-1">
                                  {experienceErrors.work_city.message}
                                </p>
                              )}
                            </div>

                            {/* Start Date */}
                            <div className="lg:w-[48%] w-full">
                              <label className="block text-sm font-medium text-gray-800 mb-2">
                                Start Date
                              </label>

                              <Controller
                                control={workExperienceForm.control}
                                name={`workExperiences.${index}.start_date`}
                                rules={{
                                  validate: (startVal) => {
                                    const endVal = workExperienceForm.getValues(
                                      `workExperiences.${index}.end_date`
                                    );

                                    if (!startVal || !endVal) return true;

                                    const start = new Date(startVal);
                                    const end = new Date(endVal);

                                    if (start > end) {
                                      return "Start date cannot be after end date";
                                    }

                                    return true;
                                  },
                                }}
                                render={({ field }) => (
                                  <Monthpicker
                                    value={field.value || ""}
                                    onChange={(val) => {
                                      field.onChange(val);
                                      workExperienceForm.trigger(
                                        `workExperiences.${index}.start_date`
                                      );
                                      workExperienceForm.trigger(
                                        `workExperiences.${index}.end_date`
                                      );
                                      handleFormChange("work");
                                    }}
                                    placeholder="Select Month & Year"
                                  />
                                )}
                              />

                              {experienceErrors?.start_date && (
                                <p className="text-sm text-red-500 mt-1">
                                  {experienceErrors.start_date.message}
                                </p>
                              )}
                            </div>

                            {/* End Date (hide when currently working) */}
                            {!workExperienceForm.watch(
                              `workExperiences.${index}.currently_working`
                            ) && (
                              <div className="lg:w-[48%] md:w-[48%] w-full">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  End Date
                                </label>

                                <Controller
                                  control={workExperienceForm.control}
                                  name={`workExperiences.${index}.end_date`}
                                  rules={{
                                    validate: (endVal) => {
                                      const startVal =
                                        workExperienceForm.getValues(
                                          `workExperiences.${index}.start_date`
                                        );
                                      if (!startVal || !endVal) return true;

                                      const start = new Date(startVal);
                                      const end = new Date(endVal);

                                      if (end < start) {
                                        return "End date cannot be before start date";
                                      }

                                      // Optional: enforce at least 1 month difference
                                      const minEnd = new Date(start);
                                      minEnd.setMonth(minEnd.getMonth() + 1);
                                      if (end < minEnd) {
                                        return "End date must be at least 1 month after start date";
                                      }

                                      return true;
                                    },
                                  }}
                                  render={({ field }) => (
                                    <Monthpicker
                                      value={field.value || ""}
                                      onChange={(val) => {
                                        field.onChange(val);
                                        workExperienceForm.trigger(
                                          `workExperiences.${index}.end_date`
                                        );
                                        workExperienceForm.trigger(
                                          `workExperiences.${index}.start_date`
                                        );
                                        handleFormChange("work");
                                      }}
                                      placeholder="Select Month & Year"
                                    />
                                  )}
                                />

                                {experienceErrors?.end_date && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {experienceErrors.end_date.message}
                                  </p>
                                )}
                              </div>
                            )}
                            {/* Currently Working */}
                            <div className="w-full flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={
                                  !!workExperienceForm.watch(
                                    `workExperiences.${index}.currently_working`
                                  )
                                }
                                onChange={(e) => {
                                  const checked = (e.target as HTMLInputElement)
                                    .checked;
                                  workExperienceForm.setValue(
                                    `workExperiences.${index}.currently_working`,
                                    checked
                                  );
                                  if (checked)
                                    workExperienceForm.setValue(
                                      `workExperiences.${index}.end_date`,
                                      ""
                                    );
                                  handleFormChange("work");
                                }}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                id={`currently_working_${index}`}
                              />
                              <label
                                htmlFor={`currently_working_${index}`}
                                className="ml-2 block text-sm text-gray-800"
                              >
                                Currently Working
                              </label>
                            </div>

                            {/* Individual work experience entry error */}
                            {hasExperienceError && (
                              <div className="md:col-span-2 w-full">
                                <p className="text-sm text-red-500 mt-2 text-center">
                                  Please fill at least one field for this work
                                  experience entry
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {/* Global work experience form error */}
                    {workExperienceForm.formState.errors.workExperiences &&
                      workExperienceForm.formState.errors.workExperiences
                        .root && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600 text-center">
                            {
                              workExperienceForm.formState.errors
                                .workExperiences.root?.message
                            }
                          </p>
                        </div>
                      )}

                    <div className="flex justify-between items-center mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          workExperienceForm.setValue("workExperiences", [
                            ...workExperienceForm.getValues("workExperiences"),
                            {
                              company: "",
                              position: "",
                              start_date: "",
                              end_date: "",
                            },
                          ]);
                          handleFormChange("work");
                        }}
                        className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Add Another Experience
                      </button>
                    </div>

                    <div className="md:col-span-2 flex flex-col sm:flex-row sm:justify-end items-center gap-4 mt-6">
                      <Button
                        variant="white-outline"
                        className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
         hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
         shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
                        type="button"
                        onClick={() => {
                          workExperienceForm.reset();
                          setUnsavedChanges((prev) => ({
                            ...prev,
                            work: false,
                          }));
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="gradient-primary"
                        className="font-['Plus Jakarta Sans'] text-[14px] not-last:w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                        type="submit"
                        disabled={isSubmitting.work}
                      >
                        {isSubmitting.work ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Tab.Panel>

                {/* Public Profile Fields Tab */}
                <Tab.Panel>
                  <form
                    onSubmit={publicProfileForm.handleSubmit(
                      handlePublicProfileSubmit
                    )}
                  >
                <div className="bg-[#F8F3FF] space-y-4 md:space-y-6 mb-8 p-3 sm:p-4 md:p-6 rounded-lg rounded-tl-none rounded-tr-none relative">
                      {/* Title */}
                      <div className="w-full">
                      <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1.5 sm:mb-2">
                          Title
                        </label>
                        <textarea
                          {...publicProfileForm.register("title", {
                            required: true,
                          })}
                          onChange={(e) => {
                            publicProfileForm.setValue("title", e.target.value);
                            handleFormChange("public"); // Add this line
                          }}
                          rows={3}
                          placeholder="Enter a brief title or role"
                          className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          About Us
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <textarea
                          {...publicProfileForm.register("aboutUs", {
                            required: "About Us description is required",
                            minLength: {
                              value: 50,
                              message:
                                "Description should be at least 50 characters",
                            },
                            maxLength: {
                              value: 1000,
                              message:
                                "Description should not exceed 1000 characters",
                            },
                          })}
                          onChange={(e) => {
                            publicProfileForm.setValue(
                              "aboutUs",
                              e.target.value
                            );
                            handleFormChange("public"); // Track changes
                          }}
                          rows={5}
                          placeholder="Tell us about yourself, your services, and your approach..."
                          className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {publicProfileForm.formState.errors.aboutUs && (
                          <p className="text-sm text-red-500 mt-1">
                            {
                              publicProfileForm.formState.errors.aboutUs
                                .message as string
                            }
                          </p>
                        )}
                      </div>

                      {/* Featured Image Upload */}
                      <div className="md:col-span-2 mt-1">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Featured Image{" "}
                          <span className="text-gray-500 text-xs">
                            (Upload an image that represents your service)
                          </span>
                        </label>
                        <div className="relative w-full">
                          <input
                            type="file"
                            accept="image/*"
                            {...publicProfileForm.register("featuredImage")}
                            onChange={(e) => {
                              publicProfileForm.setValue(
                                "featuredImage",
                                e.target.files
                              );
                              handleFormChange("public");
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            style={{ cursor: "pointer" }}
                          />
                          <div className="flex items-center w-full h-[45px] px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm text-gray-800 focus-within:ring-2 focus-within:ring-purple-500">
                            <button
                              type="button"
                              tabIndex={-1}
                              className="mr-3 px-5 py-2 bg-[#7077FE] text-white rounded-full text-sm font-medium hover:bg-[#5a60d6] transition"
                              style={{ minWidth: 0 }}
                              onClick={() => {
                                // trigger file input click
                                const input = document.querySelector(
                                  'input[type="file"][name="featuredImage"]'
                                ) as HTMLInputElement | null;
                                if (input) input.click();
                              }}
                            >
                              Choose File
                            </button>
                            <span className="flex-1 truncate text-gray-500">
                              {publicProfileForm.watch("featuredImage") &&
                                publicProfileForm.watch("featuredImage").length >
                                0 ? (
                                publicProfileForm.watch("featuredImage")[0]
                                  ?.name
                              ) : (
                                <span className="text-gray-400">
                                  No file chosen
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Services Offered */}
                      {/* <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Services Offered
                                </label>
                                <input
                                  type="text"
                                  {...publicProfileForm.register("services")}
                                  placeholder="Enter a service you offer"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div> */}

                      <div className="md:col-span-2 mt-2">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Services Offered
                        </label>
                        <div className="flex gap-2 items-center">
                          <Select
                            className="w-full h-[41px]"
                            classNamePrefix="react-select"
                            options={[
                              ...(serviceData?.map(
                                (service: { id: string; name: string }) => ({
                                  value: service.id,
                                  label: service.name,
                                })
                              ) || []),
                              {
                                value: "other",
                                label: "Other (Add Custom Service)",
                              },
                            ]}
                            styles={customSelectStyles}
                            value={
                              serviceInput
                                ? {
                                  value: serviceInput,
                                  label: serviceInput,
                                }
                                : undefined
                            }
                            onChange={(selectedOption) => {
                              if (!selectedOption) return;

                              if (selectedOption.value === "other") {
                                setShowCustomInput(true);
                                setServiceInput("");
                              } else if (selectedOption.value !== "") {
                                const trimmed = selectedOption.value.trim();
                                if (
                                  trimmed &&
                                  !services.includes(trimmed) &&
                                  services.length < 20
                                ) {
                                  const newServices = [...services, trimmed];
                                  setServices(newServices);
                                  publicProfileForm.setValue(
                                    "services",
                                    newServices
                                  );
                                  setServiceInput("");
                                  handleFormChange("public"); // Track changes
                                }
                                setShowCustomInput(false);
                              }
                            }}
                            onBlur={() => publicProfileForm.trigger("services")}
                            isSearchable={false}
                            placeholder="Select a service"
                          />

                          {showCustomInput && (
                            <>
                              <input
                                type="text"
                                value={customServiceInput}
                                onChange={(e) =>
                                  setCustomServiceInput(e.target.value)
                                }
                                placeholder="Enter custom service"
                                className={`w-full h-[41px] px-4 py-2 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const trimmed = customServiceInput.trim();
                                  if (
                                    trimmed &&
                                    !services.includes(trimmed) &&
                                    services.length < 20
                                  ) {
                                    const newServices = [...services, trimmed];
                                    setServices(newServices);
                                    publicProfileForm.setValue(
                                      "services",
                                      newServices
                                    );
                                    setCustomServiceInput("");
                                    setShowCustomInput(false);
                                    handleFormChange("public"); // Track changes
                                  }
                                }}
                                className="px-3 py-2 text-sm font-bold bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
                                disabled={
                                  services.length >= 20 || !customServiceInput
                                }
                              >
                                +
                              </button>
                            </>
                          )}
                        </div>

                        {/* Display selected services */}
                        {services.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {services.map((serviceId: string, index) => {
                              // Find the corresponding service in serviceData
                              const foundService = serviceData?.find(
                                (svc: any) => svc.id === serviceId
                              );

                              // If service is found in serviceData, use its name, otherwise use the ID
                              const displayName =
                                foundService?.name || serviceId;

                              return (
                                <span
                                  key={`${serviceId}-${index}`}
                                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[14px] flex items-center"
                                >
                                  {displayName}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setServices(
                                        services.filter((_, i) => i !== index)
                                      );
                                      handleFormChange("public"); // Track changes
                                    }}
                                    className="ml-2 text-purple-600 hover:text-red-500 font-bold"
                                  >
                                    ×
                                  </button>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Tags Field */}
                      {/* Tags Field */}
                      <div className="md:col-span-2 mt-2">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Tags
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2">
                          <div className="flex flex-wrap gap-2 mb-1">
                            {tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="flex items-center bg-[#f3f1ff] text-[#6269FF] px-3 py-1 rounded-full text-[14px]"
                              >
                                {tag}
                                <button
                                  onClick={() => {
                                    removeTag(idx);
                                    handleFormChange("public"); // Track changes
                                  }}
                                  className="ml-1 text-[#6269FF] hover:text-red-500 font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            className="w-full text-sm bg-white focus:outline-none placeholder-gray-400"
                            placeholder="Add tags (e.g. therapy, online, free-consult)"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && inputValue.trim()) {
                                e.preventDefault();
                                const newTag = inputValue.trim();
                                if (!tags.includes(newTag)) {
                                  setTags([...tags, newTag]);
                                  setInputValue("");
                                  handleFormChange("public"); // Track changes
                                }
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Notify Email 
                      <div className="md:col-span-2 mt-2">
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          Notify Email
                          {/* <span className="text-red-500">*</span> 
                        </label>
                        <input
  type="email"
  placeholder="Enter Your Notify Email"
  {...publicProfileForm.register("notifyEmail", {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email",
    },
  })}
  className={`w-full h-[41px] px-4 py-2 border bg-white placeholder:text-[#9CA3AF] text-[14px]
    ${publicProfileForm.formState.errors.notifyEmail ? "border-red-500" : "border-gray-300"}
    rounded-xl focus:outline-none focus:ring-2 
    ${
      publicProfileForm.formState.errors.notifyEmail
        ? "focus:ring-red-500"
        : "focus:ring-purple-500"
    }`}
/>
                        {publicProfileForm.formState.errors.notifyEmail && (
                          <p className="text-sm text-red-500 mt-1">
                            {
                              publicProfileForm.formState.errors.notifyEmail
                                .message as string
                            }
                          </p>
                        )}
                      </div>*/}
                    </div>
                   <div className="w-full flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
                      <Button
                        variant="white-outline"
                        className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] text-black bg-white 
        hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white 
        shadow-sm hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto flex justify-center"
                        type="button"
                        onClick={() => {
                          publicProfileForm.reset();
                          // Clear unsaved changes
                          setUnsavedChanges((prev) => ({
                            ...prev,
                            public: false,
                          }));
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="gradient-primary"
                        className="font-['Plus Jakarta Sans'] text-[14px] w-full sm:w-auto rounded-full py-2 px-6 flex justify-center transition-colors duration-500 ease-in-out"
                        type="submit"
                        disabled={isSubmitting.public}
                      >
                        {isSubmitting.public ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Tab.Panel>
              </Tab.Group>
            </div>
          </div>
        </div>
        {/* ) */}
        {/* // ) : (
        //   <div className="max-w-6xl mt-0 shadow overflow-hidden p-8 text-center">
        //     <div className="py-12">
        //       <h2 className="text-2xl font-bold text-gray-800 mb-4">
        //         Person Profile Feature Coming Soon
        //       </h2>
        //       <p className="text-gray-600 mb-6">
        //         We're working hard to bring this feature to you. Please check
        //         back later!
        //       </p>
        //       <div className="flex justify-center">
        //         <svg
        //           className="w-24 h-24 text-purple-500"
        //           fill="none"
        //           stroke="currentColor"
        //           viewBox="0 0 24 24"
        //           xmlns="http://www.w3.org/2000/svg"
        //         >
        //           <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             strokeWidth={2}
        //             d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        //           />
        //         </svg>
        //       </div>
        //     </div>
        //   </div>
        // )} */}

        {cropModal.open && cropModal.type && (
          <Cropper
            imageSrc={cropModal.src}
            type={cropModal.type}
            onClose={() =>
              setCropModal({
                open: false,
                src: "",
                type: null,
                setter: undefined,
              })
            }
            onSave={handleCropSave}
          />
        )}
      </section>
    </>
  );
};

export default UserProfilePage;
