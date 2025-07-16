import React, { useEffect, useRef, useState } from "react";
import { Tab } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  GetCountryDetails,
  GetInterestsDetails,
  GetOrganiZationNumberVerify,
  GetProfessionalDetails,
  GetProfileDetails,
  GetPublicProfileDetails,
  GetServiceDetails,
  GetStateDetails,
  MeDetails,
  SubmitProfileDetails,
  SubmitPublicProfileDetails,
} from "../../../Common/ServerAPI";
import { useToast } from "../../ui/Toast/ToastProvider";
import Select from "react-select";
import Button from "../../ui/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "react-router-dom";



const tabNames = [
  "Basic Information",
  "Contact Information",
  "Social Links",
  "Education",
  "Work Experience",
  "Public Profile Fields",
];

const tabMap = {
  basic: 0,
  contact: 1,
  social: 2,
  education: 3,
  work: 4,
  publicProfile: 5,
};

const UserProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
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
  const [customServiceInput, setCustomServiceInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const public_organization = localStorage.getItem("person_organization");
  const is_disqualify = localStorage.getItem("is_disqualify");
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const { showToast } = useToast();

  useEffect(() => {
    if (tabParam && Object.keys(tabMap).includes(tabParam)) {
      setSelectedIndex(tabMap[tabParam as keyof typeof tabMap]);
    }
  }, [tabParam]);

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
        bio: yup
          .string()
          .required("Professional bio is required")
          .matches(
            /^[a-zA-Z0-9\s.,!?@#$%^&*()_+-=<>;:'"\/\\[\]{}|`~]+$/,
            "Bio contains invalid characters"
          ),
        gender: yup.string().required("Gender is required"),
        dob: yup.string().required("Date of birth is required"),
        quote: yup
          .string()
          .matches(
            /^[a-zA-Z0-9\s.,!?@#$%^&*()_+-=<>;:'"\/\\[\]{}|`~]+$/,
            "Quote contains invalid characters"
          ),
        vision: yup
          .string()
          .matches(
            /^[a-zA-Z0-9\s.,!?@#$%^&*()_+-=<>;:'"\/\\[\]{}|`~]+$/,
            "Vision statement contains invalid characters"
          ),
        professions: yup.array().min(1, "At least one profession is required"),
        interests: yup.array().min(1, "At least one interest is required"),
        identify_uploaded: yup.mixed().nullable(),
      })
    ),
  });
  const contactInfoForm = useForm();
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
              degree: yup
                .string()
                .required("Degree is required")
                .matches(
                  /^[a-zA-Z\s.,-]+$/,
                  "Degree contains invalid characters"
                ),
              institution: yup
                .string()
                .required("Institution is required")
                .matches(
                  /^[a-zA-Z0-9\s.,'-]+$/,
                  "Institution name contains invalid characters"
                ),
              start_date: yup
                .string()
                .required("Start date is required")
                .test(
                  "is-valid-date",
                  "Start date must be a valid date",
                  (value) => {
                    if (!value) return false;
                    const date = new Date(value);
                    const today = new Date();
                    // today.setHours(0, 0, 0, 0); // Reset time to compare dates only
                    return !isNaN(date.getTime()) && date <= today;
                  }
                ),
              end_date: yup.string().optional(),
            })
          )
          .min(1, "At least one education entry is required"),
      })
    ),
  });
  const workExperienceForm = useForm<{
    workExperiences: {
      company: string;
      position: string;
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
              company: yup
                .string()
                .required("Company name is required")
                .matches(
                  /^[a-zA-Z0-9\s.,'-]+$/,
                  "Company name contains invalid characters"
                ),
              position: yup
                .string()
                .required("Position is required")
                .matches(
                  /^[a-zA-Z\s.,-]+$/,
                  "Position contains invalid characters"
                ),
              start_date: yup
                .string()
                .required("Start date is required")
                .test(
                  "is-valid-date",
                  "Start date must be a valid date",
                  (value) => {
                    if (!value) return false;
                    const date = new Date(value);
                    const today = new Date();
                    return !isNaN(date.getTime()) && date <= today;
                  }
                ),
              end_date: yup
                .string()
                .optional()
                .test(
                  "is-after-start",
                  "End date must be after start date",
                  function (value) {
                    if (!value) return true; // optional field
                    const startDate = this.parent.start_date;
                    if (!startDate) return true; // if no start date, validation passes
                    return new Date(value) >= new Date(startDate);
                  }
                ),
            })
          )
          .required("At least one work experience is required"),
      })
    ),
  });
  const publicProfileForm = useForm();

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    formKey: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);

      // Prepare form data
      const formData = new FormData();
      formData.append(formKey, file); // Use dynamic key

      try {
        const res = await SubmitProfileDetails(formData);
        showToast({
          message: res?.success?.message,
          type: "success",
          duration: 5000,
        });
      } catch (error: any) {
        showToast({
          message: error?.response?.data?.error?.message,
          type: "error",
          duration: 5000,
        });
      }
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

  // Tab-specific submit handlers
  const handleBasicInfoSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, basic: true }));

    const normalizeToArray = (input: any) => {
      if (Array.isArray(input)) {
        return input.map(String);
      }
      return input ? [String(input)] : [];
    };

    const payload = {
      first_name: data.firstName || null,
      last_name: data.lastName || null,
      bio: data.bio || null,
      gender: data.gender || null,
      dob: data.dob || null,
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
      const response = await MeDetails();
      localStorage.setItem(
        "profile_picture",
        response?.data?.data?.user.profile_picture
      );
      localStorage.setItem("name", response?.data?.data?.user.name);
      localStorage.setItem("main_name", response?.data?.data?.user.main_name);
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

  const handleSocialLinksSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, social: true }));

    const payload = {
      social_links: {
        facebook: data.facebook,
        twitter: data.twitter,
        linkedin: data.linkedin,
        instagram: data.instagram,
      },
    };

    try {
      const response = await SubmitProfileDetails(payload);
      showToast({
        message: response?.success?.message,
        type: "success",
        duration: 5000,
      });
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

    const payload = {
      education: data.educations.filter(
        (edu: any) => edu.degree && edu.institution // filter out empty entries
      ),
    };

    try {
      const response = await SubmitProfileDetails(payload);
      showToast({
        message: response?.success?.message,
        type: "success",
        duration: 5000,
      });
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

    const payload = {
      work_experience: data.workExperiences.filter(
        (exp: any) => exp.company && exp.position // filter out empty entries
      ),
    };

    try {
      const response = await SubmitProfileDetails(payload);
      showToast({
        message: response?.success?.message,
        type: "success",
        duration: 5000,
      });
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

      if (response.data.data) {
        // Basic Info
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
          // For interests and professions, since they're arrays in the response
          interests: response.data.data?.interests?.map((i: any) => i.id) || [],
          professions:
            response.data.data?.professions?.map((p: any) => p.profession_id) ||
            [],
          vision: response.data.data?.personal_vision_statement,
          identify_uploaded: response.data.data?.identify_uploaded,
        });

        // Contact Info
        contactInfoForm.reset({
          phone: response.data.data?.phone_no || "",
          email: response.data.data?.email || "",
          address:
            response.data.data?.address ||
            response.data.data?.location?.address ||
            "",
          country: response.data.data?.country_id || "",
          state: response.data.data?.state_id || "",
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

  useEffect(() => {
    const countryId = contactInfoForm.watch("country");
    if (countryId) {
      GetState(countryId);
    } else {
      setStates([]);
    }
  }, [contactInfoForm.watch("country")]);

  const fetchVerifyOrganizationNumber = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await GetOrganiZationNumberVerify(formData);
      // Handle the response
      if (res.success) {
        return res;
      }

      showToast({
        message: res?.success?.message,
        type: "success",
        duration: 5000,
      });
      throw new Error(res.message || "Verification failed");
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <>
      <section className="w-full px-2 sm:px-4 lg:px-2 pt-4 pb-10">
        {public_organization === "1" ? (
          is_disqualify === "true" ? (
            <div className="mt-0 shadow overflow-hidden p-8 text-center">
              <div className="py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  User Profile Access Restricted
                </h2>
                <p className="text-gray-600 mb-6">
                  You can access your profile after completing your assessment.
                </p>
                <div className="flex justify-center">
                  <svg
                    className="w-24 h-24 text-purple-500"
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
          ) : (
            <div className="mt-0 bg-white rounded-xl shadow overflow-hidden">
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="relative h-[300px] bg-gray-100">
                  <img
                    src={
                      banner && banner !== "http://localhost:5026/file/"
                        ? banner
                        : "/banner.jpg"
                    }
                    alt="Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if the image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/banner.jpg";
                    }}
                  />
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <label className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-200">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(e, setBanner, "banner")
                        }
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

                  <div className="absolute -bottom-0 left-6 sm:left-10 z-20 group">
                    <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                      <img
                        src={
                          logoPreview &&
                          logoPreview !== "http://localhost:5026/file/"
                            ? logoPreview
                            : "/profile.png"
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
                            className="bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-gray-100"
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
                  <h2 className="text-[24px] font-bold text-[#9747FF] mb-6">
                    My Profile
                  </h2>

                  <Tab.Group
                    selectedIndex={selectedIndex}
                    onChange={setSelectedIndex}
                  >
                    <div className="px-4 sm:px-6 pt-6">
                      <div className="w-full overflow-x-auto no-scrollbar">
                        <div className="inline-block min-w-[900px] lg:min-w-full">
                          <Tab.List className="flex gap-2  flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar">
                            {tabNames.map((tab, index) => (
                              <Tab
                                key={index}
                                className={({ selected }) =>
                                  `flex-shrink-0 
                                  min-w-[120px] 
                                  max-w-[200px] 
                                  text-sm 
                                  font-medium 
                                  py-2.5 
                                  px-4 
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
                                  ${
                                    selected
                                      ? "text-purple-600 bg-[#F8F3FF] shadow-md border-[#ECEEF2] transform"
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

                      <Tab.Panels className="">
                        <Tab.Panel>
                          <form
                            onSubmit={basicInfoForm.handleSubmit(
                              handleBasicInfoSubmit
                            )}
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#F8F3FF] mb-8 p-4 border border-[#ECEEF2] rounded-lg rounded-tl-none rounded-tr-none relative">
                              {/* First Name */}
                              <div>
                                <label>
                                  First Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  {...basicInfoForm.register("firstName")}
                                  placeholder="Enter your First Name"
                                  className={`w-full px-4 py-2 border bg-white ${
                                    basicInfoForm.formState.errors.firstName
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                    basicInfoForm.formState.errors.firstName
                                      ? "focus:ring-red-500"
                                      : "focus:ring-purple-500"
                                  }`}
                                />
                                {basicInfoForm.formState.errors.firstName && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      basicInfoForm.formState.errors.firstName
                                        .message
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Last Name */}
                              <div>
                                <label>
                                  Last Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  {...basicInfoForm.register("lastName")}
                                  placeholder="Enter your Last Name"
                                  className={`w-full px-4 py-2 border bg-white ${
                                    basicInfoForm.formState.errors.lastName
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                    basicInfoForm.formState.errors.lastName
                                      ? "focus:ring-red-500"
                                      : "focus:ring-purple-500"
                                  }`}
                                />
                                {basicInfoForm.formState.errors.lastName && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      basicInfoForm.formState.errors.lastName
                                        .message
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Interests */}
                              <div>
                                <label>
                                  Interests{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <Select
                                  isMulti
                                  options={intereset?.map((interest: any) => ({
                                    value: interest.id,
                                    label: interest.name,
                                  }))}
                                  value={basicInfoForm
                                    .watch("interests")
                                    ?.map((interestId: any) => ({
                                      value: interestId,
                                      label: intereset?.find(
                                        (i: any) => i.id === interestId
                                      )?.name,
                                    }))}
                                  onChange={(selectedOptions) => {
                                    basicInfoForm.setValue(
                                      "interests",
                                      selectedOptions.map(
                                        (option) => option.value
                                      )
                                    );
                                  }}
                                  className="react-select-container"
                                  classNamePrefix="react-select"
                                  placeholder="Select interests..."
                                />
                                {basicInfoForm.formState.errors.interests && (
                                  <p className="text-sm text-red-500 mt-1">
                                    At least one interest is required
                                  </p>
                                )}
                              </div>

                              {/* Profession */}
                              <div>
                                <label>
                                  Professions{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <Select
                                  isMulti
                                  options={professional?.map((prof: any) => ({
                                    value: prof.id,
                                    label: prof.title,
                                  }))}
                                  value={basicInfoForm
                                    .watch("professions")
                                    ?.map((profId: any) => ({
                                      value: profId,
                                      label: professional?.find(
                                        (p: any) => p.id === profId
                                      )?.title,
                                    }))}
                                  onChange={(selectedOptions) => {
                                    basicInfoForm.setValue(
                                      "professions",
                                      selectedOptions.map(
                                        (option) => option.value
                                      )
                                    );
                                  }}
                                  className="react-select-container"
                                  classNamePrefix="react-select"
                                  placeholder="Select professions..."
                                />
                                {basicInfoForm.formState.errors.professions && (
                                  <p className="text-sm text-red-500 mt-1">
                                    At least one profession is required
                                  </p>
                                )}
                              </div>

                              <div>
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
                                        if (
                                          e.target.files &&
                                          e.target.files[0]
                                        ) {
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
                                     <div className="mt-2">
                                    <label
                                      htmlFor="registrationFile"
                                      className="px-4  py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                    >
                                      Verify Identity
                                    </label>
                                    </div>
                                  </>
                                ) : basicInfoForm.watch("identify_uploaded") ==
                                  1 ? (
                                  <span className="px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-sm font-medium text-green-600 flex items-center">
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
                                  <span className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-600 flex items-center">
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
                                  <span className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl text-sm font-medium text-yellow-600 flex items-center">
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
                                        if (
                                          e.target.files &&
                                          e.target.files[0]
                                        ) {
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
                                    <label
                                      htmlFor="registrationFile"
                                      className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                                    >
                                      Verify Identity
                                    </label>
                                  </>
                                )}
                              </div>

                              {/* Gender */}
                              <div>
                                <label>
                                  Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                  {...basicInfoForm.register("gender", {
                                    required: true,
                                  })}
className="
    w-[440px] h-[41px]
    border border-gray-300 rounded-[12px]
    px-[12px] mt-2
    font-normal text-[14px] leading-5
    text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500
  "
  style={{ fontFamily: 'Rubik, sans-serif' }}                                >
                                  <option value="">Select your gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Non-binary">Non-binary</option>
                                </select>
                              </div>

                              {/* Date of Birth */}
                              <div>
                                <label>
                                  Date of Birth{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="date"
                                  {...basicInfoForm.register("dob", {
                                    required: true,
                                  })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                               />
                              </div>

                              {/* Quote on Consciousness */}
                              <div>
                                <label>
                                  Your Quote on Consciousness
                                </label>
                                <input
                                  type="text"
                                  {...basicInfoForm.register("quote")}
                                  placeholder="Enter your quote"
                                  className={`w-full px-4 py-2 border bg-white ${
                                    basicInfoForm.formState.errors.quote
                                      ? "border-red-500"
                                      : "border-purple-400"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                    basicInfoForm.formState.errors.quote
                                      ? "focus:ring-red-500"
                                      : "focus:ring-purple-500"
                                  }`}
                                />
                                {basicInfoForm.formState.errors.quote && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      basicInfoForm.formState.errors.quote
                                        .message
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Professional Bio */}
                              <div>
                                <label >
                                  Professional Bio{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  {...basicInfoForm.register("bio")}
                                  placeholder="Add a short professional bio"
                                  className={`w-full px-4 py-2 border bg-white ${
                                    basicInfoForm.formState.errors.bio
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                    basicInfoForm.formState.errors.bio
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
                                <textarea
                                  rows={4}
                                  {...basicInfoForm.register("vision")}
                                  placeholder="What is your conscious vision?"
                                  className={`w-full px-4 py-2  border ${
                                    basicInfoForm.formState.errors.vision
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                    basicInfoForm.formState.errors.vision
                                      ? "focus:ring-red-500"
                                      : "focus:ring-purple-500"
                                  }`}
                                />
                                {basicInfoForm.formState.errors.vision && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      basicInfoForm.formState.errors.vision
                                        .message
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-6">
                                <Button
                                  variant="white-outline"
                                  className="font-[Plus Jakarta Sans] w-full sm:w-auto text-[18px] px-6 py-3 rounded-full bg-white text-black border border-[#ddd] bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white transition-colors duration-300"
                                  type="button"
                                  onClick={() => basicInfoForm.reset()}
                                >
                                  Reset
                                </Button>
                                <Button
                                  variant="gradient-primary"
                                  className="w-full sm:w-auto rounded-full py-3 px-8 transition-colors duration-500 ease-in-out"
                                  type="submit"
                                  disabled={isSubmitting.basic}
                                >
                                  {isSubmitting.basic
                                    ? "Saving..."
                                    : "Save Basic Info"}
                                </Button>
                              </div>
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#F8F3FF] gap-6 mb-8 p-4 border border-gray-200 rounded-lg rounded-tl-none rounded-tr-none relative">
                              {/* Phone Number */}
                              <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Phone Number{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  {...contactInfoForm.register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                      value: /^[0-9]{10}$/,
                                      message: "Phone must be 10 digits",
                                    },
                                  })}
                                  onKeyDown={(e) => {
                                    if (
                                      !/[0-9]/.test(e.key) &&
                                      e.key !== "Backspace" &&
                                      e.key !== "Tab"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                  className={`w-full px-4 py-2 border bg-white ${
                                    contactInfoForm.formState.errors.phone
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-xl focus:outline-none focus:ring-2 ${
                                    contactInfoForm.formState.errors.phone
                                      ? "focus:ring-red-500"
                                      : "focus:ring-purple-500"
                                  }`}
                                />
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
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="email"
                                  {...contactInfoForm.register("email", {
                                    required: "Email is required",
                                    pattern: {
                                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                      message: "Enter a valid email",
                                    },
                                  })}
                                  className={`w-full px-4 py-2 border bg-white ${
                                    contactInfoForm.formState.errors.email
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-xl focus:outline-none focus:ring-2 ${
                                    contactInfoForm.formState.errors.email
                                      ? "focus:ring-red-500"
                                      : "focus:ring-purple-500"
                                  }`}
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
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Address{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  {...contactInfoForm.register("address", {
                                    required: "Address is required",
                                  })}
                                  placeholder="Enter your address"
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {contactInfoForm.formState.errors.address && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      contactInfoForm.formState.errors.address
                                        .message as string
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Country */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Country{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <select
                                  {...contactInfoForm.register("country", {
                                    required: "Country is required",
                                  })}
                              className="
                                  w-[440px] h-[41px]
                                  border border-gray-300 rounded-[12px]
                                  px-[12px] mt-2
                                  font-normal text-[14px] leading-5
                                  text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500
                                "
                               >                               
                                  <option value="">Select your country</option>
                                  Country
                                  {Country?.map((country: any) => (
                                    <option key={country.id} value={country.id}>
                                      {country.name}
                                    </option>
                                  ))}
                                </select>
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
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  State <span className="text-red-500">*</span>
                                </label>
                                <select
                                  {...contactInfoForm.register("state", {
                                    required: "State is required",
                                  })}
 className="
    w-[440px] h-[41px]
    border border-gray-300 rounded-[12px]
    px-[12px] mt-2
    font-normal text-[14px] leading-5
    text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500
  "
  style={{ fontFamily: 'Rubik, sans-serif' }}                                >
                                  <option value="">Select your state</option>
                                  {states?.map((state: any) => (
                                    <option key={state.id} value={state.id}>
                                      {state.name}
                                    </option>
                                  ))}
                                </select>
                                {contactInfoForm.formState.errors.state && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      contactInfoForm.formState.errors.state
                                        .message as string
                                    }
                                  </p>
                                )}
                              </div>

                              {/* City */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  City
                                </label>
                                <input
                                  type="text"
                                  {...contactInfoForm.register("city")}
                                  placeholder="Enter city"
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>

                              {/* Postal Code */}
                              <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Postal Code{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  {...contactInfoForm.register("postalCode", {
                                    required: "Postal code is required",
                                  })}
                                  placeholder="Enter postal code"
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {contactInfoForm.formState.errors
                                  .postalCode && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      contactInfoForm.formState.errors
                                        .postalCode.message as string
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Communication Preferences */}
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Preferred Method of Communication{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-6">
                                  <label className="inline-flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      {...contactInfoForm.register(
                                        "communication.sms"
                                      )}
                                      className="accent-[#9747FF]"
                                    />
                                    <span className="text-sm text-gray-700">
                                      SMS
                                    </span>
                                  </label>
                                  <label className="inline-flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      {...contactInfoForm.register(
                                        "communication.email"
                                      )}
                                      className="accent-[#9747FF]"
                                    />
                                    <span className="text-sm text-gray-700">
                                      Email
                                    </span>
                                  </label>
                                  <label className="inline-flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      {...contactInfoForm.register(
                                        "communication.whatsapp"
                                      )}
                                      className="accent-[#9747FF]"
                                    />
                                    <span className="text-sm text-gray-700">
                                      WhatsApp
                                    </span>
                                  </label>
                                </div>
                              </div>

                              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-6">
                                <Button
                                  variant="white-outline"
                                  className="font-[Plus Jakarta Sans] w-full sm:w-auto text-[18px] px-6 py-3 rounded-full bg-white text-black border border-[#ddd] bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white transition-colors duration-300"
                                  type="button"
                                  onClick={() => contactInfoForm.reset()}
                                >
                                  Reset
                                </Button>
                                <Button
                                  variant="gradient-primary"
                                  className="w-full sm:w-auto rounded-full py-3 px-8 transition-colors duration-500 ease-in-out"
                                  type="submit"
                                  disabled={isSubmitting.contact}
                                >
                                  {isSubmitting.contact
                                    ? "Saving..."
                                    : "Save Contact Info"}
                                </Button>
                              </div>
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#F8F3FF] mb-8 p-4 border border-gray-200 rounded-lg rounded-tl-none rounded-tr-none relative">
                              {/* Facebook */}
                              <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Facebook
                                </label>
                                <input
                                  type="url"
                                  {...socialLinksForm.register("facebook")}
                                  placeholder="Enter Facebook profile URL"
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>

                              {/* Twitter */}
                              <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Twitter
                                </label>
                                <input
                                  type="url"
                                  {...socialLinksForm.register("twitter")}
                                  placeholder="Enter Twitter profile URL"
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>

                              {/* LinkedIn */}
                              <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  LinkedIn
                                </label>
                                <input
                                  type="url"
                                  {...socialLinksForm.register("linkedin")}
                                  placeholder="Enter LinkedIn profile URL"
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>

                              {/* Instagram */}
                              <div>
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Instagram
                                </label>
                                <input
                                  type="url"
                                  {...socialLinksForm.register("instagram")}
                                  placeholder="Enter Instagram profile URL"
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>

                              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-6">
                                <Button
                                  variant="white-outline"
                                  className="font-[Plus Jakarta Sans] w-full sm:w-auto text-[18px] px-6 py-3 rounded-full bg-white text-black border border-[#ddd] bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white transition-colors duration-300"
                                  type="button"
                                  onClick={() => socialLinksForm.reset()}
                                >
                                  Reset
                                </Button>
                                <Button
                                  variant="gradient-primary"
                                  className="w-full sm:w-auto rounded-full py-3 px-8 transition-colors duration-500 ease-in-out"
                                  type="submit"
                                  disabled={isSubmitting.social}
                                >
                                  {isSubmitting.social
                                    ? "Saving..."
                                    : "Save Social Links"}
                                </Button>
                              </div>
                            </div>
                          </form>
                        </Tab.Panel>

                        {/* Education Tab */}
                        <Tab.Panel>
                          <form
                            onSubmit={educationForm.handleSubmit(
                              handleEducationSubmit
                            )}
                          >
                            {educationForm
                              .watch("educations")
                              ?.map((_education, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 lg:grid-cols-2 bg-[#F8F3FF] gap-6 mb-8 p-4 border border-gray-200 rounded-lg rounded-tl-none rounded-tr-none relative"
                                >
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
                                      Degree{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      {...educationForm.register(
                                        `educations.${index}.degree`
                                      )}
                                      placeholder="Enter your degree"
                                      className={`w-full px-4 py-2 border bg-white ${
                                        educationForm.formState.errors
                                          ?.educations?.[index]?.degree
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        educationForm.formState.errors
                                          ?.educations?.[index]?.degree
                                          ? "focus:ring-red-500"
                                          : "focus:ring-purple-500"
                                      }`}
                                    />
                                    {educationForm.formState.errors
                                      ?.educations?.[index]?.degree && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {
                                          educationForm.formState.errors
                                            .educations[index]?.degree?.message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  {/* Institution */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-2">
                                      Institution{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      {...educationForm.register(
                                        `educations.${index}.institution`
                                      )}
                                      placeholder="Enter institution name"
                                      className={`w-full px-4 py-2 border bg-white ${
                                        educationForm.formState.errors
                                          ?.educations?.[index]?.institution
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        educationForm.formState.errors
                                          ?.educations?.[index]?.institution
                                          ? "focus:ring-red-500"
                                          : "focus:ring-purple-500"
                                      }`}
                                    />
                                    {educationForm.formState.errors
                                      ?.educations?.[index]?.institution && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {
                                          educationForm.formState.errors
                                            .educations[index]?.institution
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  {/* Start Date */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-2">
                                      Start Date{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="date"
                                      {...educationForm.register(
                                        `educations.${index}.start_date`
                                      )}
                                      className={`w-full px-4 py-2 border bg-white ${
                                        educationForm.formState.errors
                                          ?.educations?.[index]?.start_date
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 ${
                                        educationForm.formState.errors
                                          ?.educations?.[index]?.start_date
                                          ? "focus:ring-red-500"
                                          : "focus:ring-purple-500"
                                      }`}
                                    />
                                    {educationForm.formState.errors
                                      ?.educations?.[index]?.start_date && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {
                                          educationForm.formState.errors
                                            .educations[index]?.start_date
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  {/* End Date */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-2">
                                      End Date
                                    </label>
                                    <input
                                      type="date"
                                      {...educationForm.register(
                                        `educations.${index}.end_date`
                                      )}
                                      className={`w-full px-4 py-2 border bg-white ${
                                        educationForm.formState.errors
                                          ?.educations?.[index]?.end_date
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 ${
                                        educationForm.formState.errors
                                          ?.educations?.[index]?.end_date
                                          ? "focus:ring-red-500"
                                          : "focus:ring-purple-500"
                                      }`}
                                    />
                                    {educationForm.formState.errors
                                      ?.educations?.[index]?.end_date && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {
                                          educationForm.formState.errors
                                            .educations[index]?.end_date
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}

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

                            <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-6">
                              <Button
                                variant="white-outline"
                                className="font-[Plus Jakarta Sans] w-full sm:w-auto text-[18px] px-6 py-3 rounded-full bg-white text-black border border-[#ddd] bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white transition-colors duration-300"
                                type="button"
                                onClick={() => educationForm.reset()}
                              >
                                Reset
                              </Button>
                              <Button
                                variant="gradient-primary"
                                className="w-full sm:w-auto rounded-full py-3 px-8 transition-colors duration-500 ease-in-out"
                                type="submit"
                                disabled={isSubmitting.education}
                              >
                                {isSubmitting.education
                                  ? "Saving..."
                                  : "Save Education"}
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
                              ?.map((_experience, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 lg:grid-cols-2 bg-[#F8F3FF] gap-6 mb-8 p-4 border border-gray-200 rounded-lg rounded-tl-none rounded-tr-none relative"
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
                                  <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-2">
                                      Company{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      {...workExperienceForm.register(
                                        `workExperiences.${index}.company`
                                      )}
                                      placeholder="Enter Company Name"
                                      className={`w-full px-4 py-2 border bg-white ${
                                        workExperienceForm.formState.errors
                                          ?.workExperiences?.[index]?.company
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        workExperienceForm.formState.errors
                                          ?.workExperiences?.[index]?.company
                                          ? "focus:ring-red-500"
                                          : "focus:ring-purple-500"
                                      }`}
                                    />
                                    {workExperienceForm.formState.errors
                                      ?.workExperiences?.[index]?.company && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {
                                          workExperienceForm.formState.errors
                                            .workExperiences[index]?.company
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  {/* Position */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-2">
                                      Position{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      {...workExperienceForm.register(
                                        `workExperiences.${index}.position`
                                      )}
                                      placeholder="Enter your Designation"
                                      className={`w-full px-4 py-2 border bg-white ${
                                        workExperienceForm.formState.errors
                                          ?.workExperiences?.[index]?.position
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                        workExperienceForm.formState.errors
                                          ?.workExperiences?.[index]?.position
                                          ? "focus:ring-red-500"
                                          : "focus:ring-purple-500"
                                      }`}
                                    />
                                    {workExperienceForm.formState.errors
                                      ?.workExperiences?.[index]?.position && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {
                                          workExperienceForm.formState.errors
                                            .workExperiences[index]?.position
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  {/* Start Date */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-2">
                                      Start Date{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="date"
                                      {...workExperienceForm.register(
                                        `workExperiences.${index}.start_date`
                                      )}
                                      className={`w-full px-4 py-2 border bg-white ${
                                        workExperienceForm.formState.errors
                                          ?.workExperiences?.[index]?.start_date
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 ${
                                        workExperienceForm.formState.errors
                                          ?.workExperiences?.[index]?.start_date
                                          ? "focus:ring-red-500"
                                          : "focus:ring-purple-500"
                                      }`}
                                    />
                                    {workExperienceForm.formState.errors
                                      ?.workExperiences?.[index]
                                      ?.start_date && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {
                                          workExperienceForm.formState.errors
                                            .workExperiences[index]?.start_date
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  {/* End Date */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-800 mb-2">
                                      End Date
                                    </label>
                                    <input
                                      type="date"
                                      {...workExperienceForm.register(
                                        `workExperiences.${index}.end_date`
                                      )}
                                      className={`w-full px-4 py-2 border bg-white ${
                                        workExperienceForm.formState.errors
                                          ?.workExperiences?.[index]?.end_date
                                          ? "border-red-500"
                                          : "border-gray-300"
                                      } rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 ${
                                        workExperienceForm.formState.errors
                                          ?.workExperiences?.[index]?.end_date
                                          ? "focus:ring-red-500"
                                          : "focus:ring-purple-500"
                                      }`}
                                    />
                                    {workExperienceForm.formState.errors
                                      ?.workExperiences?.[index]?.end_date && (
                                      <p className="text-sm text-red-500 mt-1">
                                        {
                                          workExperienceForm.formState.errors
                                            .workExperiences[index]?.end_date
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}

                            <div className="flex justify-between items-center mt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  workExperienceForm.setValue(
                                    "workExperiences",
                                    [
                                      ...workExperienceForm.getValues(
                                        "workExperiences"
                                      ),
                                      {
                                        company: "",
                                        position: "",
                                        start_date: "",
                                        end_date: "",
                                      },
                                    ]
                                  );
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
                                className="font-[Plus Jakarta Sans] w-full sm:w-auto max-w-[280px] text-[16px] px-6 py-3 rounded-full bg-white text-black border border-[#ddd] hover:bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white transition-colors duration-300"
                                type="button"
                                onClick={() => workExperienceForm.reset()}
                              >
                                Reset
                              </Button>
                              <Button
                                variant="gradient-primary"
                                className="w-full sm:w-auto max-w-[280px] rounded-full py-3 px-6 text-white text-[16px] font-semibold shadow-md transition duration-300 ease-in-out"
                                type="submit"
                                disabled={isSubmitting.work}
                              >
                                {isSubmitting.work
                                  ? "Saving..."
                                  : "Save Work Experiences"}
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
                            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#F8F3FF] gap-6 mb-8 p-4 border border-gray-200 rounded-lg rounded-tl-none rounded-tr-none relative">
                              {/* Title */}
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Title <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  {...publicProfileForm.register("title", {
                                    required: true,
                                  })}
                                  rows={3}
                                  placeholder="Enter a brief title or role"
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {publicProfileForm.formState.errors.title && (
                                  <p className="text-sm text-red-500 mt-1">
                                    Title is required
                                  </p>
                                )}
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  About Us{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                  {...publicProfileForm.register("aboutUs", {
                                    required:
                                      "About Us description is required",
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
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Featured Image{" "}
                                  <span className="text-gray-500 text-xs">
                                    (Upload an image that represents your
                                    service)
                                  </span>
                                </label>
                                <input
                                
                                  type="file"
                                  accept="image/*"
                                  {...publicProfileForm.register(
                                    "featuredImage"
                                  )}
                                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
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

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Services Offered
                                </label>
                                <div className="flex gap-2 items-center">
                                  <select
                                    value={serviceInput}
                                    onChange={(e) => {
                                      if (e.target.value === "other") {
                                        setShowCustomInput(true);
                                        setServiceInput("");
                                      } else if (e.target.value !== "") {
          const trimmed = e.target.value.trim();
          if (
            trimmed &&
            !services.includes(trimmed) &&
            services.length < 20
          ) {
            const newServices = [...services, trimmed];
            setServices(newServices);
            publicProfileForm.setValue("services", newServices);
            setServiceInput(""); // reset
          }
          setShowCustomInput(false);
        }
                                    }}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="">Select a service</option>
      {serviceData?.map((service: { id: string; name: string }) => (
  <option key={service.id} value={service.id}>
    {service.name}
  </option>
))}
      <option value="other">Other (Add Custom Service)</option>
    </select>

    {showCustomInput && (
      <>
        <input
          type="text"
          value={customServiceInput}
          onChange={(e) => setCustomServiceInput(e.target.value)}
          placeholder="Enter custom service"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              publicProfileForm.setValue("services", newServices);
              setCustomServiceInput("");
              setShowCustomInput(false);
            }
          }}
          className="px-3 py-2 text-sm font-bold bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
          disabled={services.length >= 20 || !customServiceInput}
        >
          +
        </button>
      </>
    )}
    </div>

                                {/* Display selected services */}
                                {services.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {services.map(
                                      (serviceId: string, index) => {
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
                                                  services.filter(
                                                    (_, i) => i !== index
                                                  )
                                                );
                                              }}
                                              className="ml-2 text-purple-600 hover:text-red-500 font-bold"
                                            >
                                              ×
                                            </button>
                                          </span>
                                        );
                                      }
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Tags Field */}
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Tags <span className="text-red-500">*</span>
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
                                          onClick={() => removeTag(idx)}
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
                                    onChange={(e) =>
                                      setInputValue(e.target.value)
                                    }
                                    onKeyDown={handleTagKeyDown}
                                  />
                                </div>
                              </div>

                              {/* Notify Email */}
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-800 mb-2">
                                  Notify Email{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="email"
                                  {...publicProfileForm.register(
                                    "notifyEmail",
                                    {
                                      required: "Email is required",
                                      pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email",
                                      },
                                    }
                                  )}
                                  className={`w-full px-4 py-2 border bg-white ${
                                    publicProfileForm.formState.errors
                                      .notifyEmail
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-xl focus:outline-none focus:ring-2 ${
                                    publicProfileForm.formState.errors
                                      .notifyEmail
                                      ? "focus:ring-red-500"
                                      : "focus:ring-purple-500"
                                  }`}
                                />
                                {publicProfileForm.formState.errors
                                  .notifyEmail && (
                                  <p className="text-sm text-red-500 mt-1">
                                    {
                                      publicProfileForm.formState.errors
                                        .notifyEmail.message as string
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-6">
                                <Button
                                  variant="white-outline"
                                  className="font-[Plus Jakarta Sans] w-full sm:w-auto text-[18px] px-6 py-3 rounded-full bg-white text-black border border-[#ddd] bg-gradient-to-r hover:from-[#7077FE] hover:to-[#7077FE] hover:text-white transition-colors duration-300"
                                  type="button"
                                  onClick={() => publicProfileForm.reset()}
                                >
                                  Reset
                                </Button>
                                <Button
                                  variant="gradient-primary"
                                  className="w-full sm:w-auto rounded-full py-3 px-8 transition-colors duration-500 ease-in-out"
                                  type="submit"
                                  disabled={isSubmitting.public}
                                >
                                  {isSubmitting.public
                                    ? "Saving..."
                                    : "Save Public Profile"}
                                </Button>
                              </div>
                            </div>
                          </form>
                        </Tab.Panel>
                      </Tab.Panels>
                    </div>
                  </Tab.Group>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="max-w-6xl mt-0 shadow overflow-hidden p-8 text-center">
            <div className="py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Person Profile Feature Coming Soon
              </h2>
              <p className="text-gray-600 mb-6">
                We're working hard to bring this feature to you. Please check
                back later!
              </p>
              <div className="flex justify-center">
                <svg
                  className="w-24 h-24 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default UserProfilePage;
