import React, { useEffect, useRef, useState } from "react";
import { Tab } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import DashboardLayout from "../../../layout/Dashboard/dashboardlayout";
import {
  GetIndustryDetails,
  GetOrganizationListingDetails,
  GetOrganiZationProfileDetails,
  GetServiceDetails,
  SubmitOrganizationDetails,
  SubmitOrganizationListingDetails,
} from "../../../Common/ServerAPI";

const tabNames = [
  "Basic Information",
  "Contact Information",
  "Social Links",
  "Organization Mission & Vision Values",
  "Public View Under Directory",
];

// Define types for each tab's form data
type BasicInfoFormData = {
  organizationName: string;
  legalBusinessName?: string;
  businessRegistrationNumber: string;
  website: string;
  industry: string;
  yearOfEstablishment: string;
  organizationSize: string;
  headquartersLocation: string;
  operatingLocations?: string;
};

type ContactInfoFormData = {
  primaryContactName: string;
  designation: string;
  phone: string;
  email: string;
};

type SocialLinksFormData = {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
};

type MissionVisionFormData = {
  missionStatement: string;
  visionStatement: string;
  coreValues: string;
};

type PublicViewFormData = {
  services: string[];
  tags: string[];
  email: string;
  officialAddress: string;
  phone: string;
  optionalEmail?: string;
};

interface Service {
  id: string; // or number, depending on your data
  name: string;
}

const OrganaizationProfilepage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  console.log("🚀 ~ OrganaizationProfilepage ~ logoPreview:", logoPreview);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [services, setServices] = useState<any[]>([]);
  console.log("🚀 ~ OrganaizationProfilepage ~ services:", services);
  const [serviceInput, setServiceInput] = useState("");
  const [industry, setIndustryData] = useState<any>(null);
  const [serviceData, setServiceData] = useState<any>(null);

  const public_organization = localStorage.getItem("person_organization");

  // Create separate form instances for each tab
  const basicInfoForm = useForm<BasicInfoFormData>({
    mode: "onBlur",
  });

  const contactInfoForm = useForm<ContactInfoFormData>({
    mode: "onBlur",
  });

  const socialLinksForm = useForm<SocialLinksFormData>({
    mode: "onBlur",
  });

  const missionVisionForm = useForm<MissionVisionFormData>({
    mode: "onBlur",
  });

  const publicViewForm = useForm<PublicViewFormData>({
    mode: "onBlur",
    defaultValues: {
      services: [],
      tags: [],
    },
  });

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    formKey: string // "profile" or "banner"
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
        await SubmitOrganizationDetails(formData);
      } catch (error) {
        console.error(`Error uploading ${formKey}:`, error);
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
        publicViewForm.setValue("tags", [...tags, newTag]);
      }
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
    publicViewForm.setValue("tags", newTags);
  };

  // const handleServiceAdd = () => {
  //   const trimmed = serviceInput.trim();
  //   if (trimmed && !services.includes(trimmed) && services.length < 20) {
  //     const newServices = [...services, trimmed];
  //     setServices(newServices);
  //     setServiceInput("");
  //     publicViewForm.setValue("services", newServices);
  //   }
  // };

  // const removeService = (index: number) => {
  //   const updated = [...services];
  //   updated.splice(index, 1);
  //   setServices(updated);
  //   publicViewForm.setValue("services", updated);
  // };

  const handleCancel = () => {
    // Reset all forms
    basicInfoForm.reset();
    contactInfoForm.reset();
    socialLinksForm.reset();
    missionVisionForm.reset();
    publicViewForm.reset();

    // Reset other states
    setBanner(null);
    setLogoPreview(null);
    setTags([]);
    setServices([]);
  };

  // Submit handlers for each tab
  const submitBasicInfo = async (data: BasicInfoFormData) => {
    console.log("Basic Info submitted:", data);
    const payload = {
      organization_name: data.organizationName || null,
      business_name: data.legalBusinessName || null,
      business_registration_number: data.businessRegistrationNumber || null,
      web_url: data.website || null,
      industry_id: data.industry || null,
      year_of_establishment: data.yearOfEstablishment || null,
      employee_size: data.organizationSize || null,
      headquarters_location: data.headquartersLocation || null,
      operating_regions: data.operatingLocations || null,
    };

    try {
      await SubmitOrganizationDetails(payload);
    } catch (error) {
      console.error("Error saving basic info:", error);
      // Error handling
    }
  };

  const submitContactInfo = async (data: ContactInfoFormData) => {
    const payload = {
      primary_contact_person_name: data.primaryContactName || null,
      designation: data.designation || null,
      official_email_address: data.email || null,
      contact_number: data.phone || null,
    };

    try {
      await SubmitOrganizationDetails(payload);
    } catch (error) {
      console.error("Error saving basic info:", error);
      // Error handling
    }
  };

  const submitSocialLinks = async (data: SocialLinksFormData) => {
    console.log("Social Links submitted:", data);
    const payload = {
      facebook: data.facebook || null,
      twitter: data.twitter || null,
      linkedin: data.linkedin || null,
      instagram: data.instagram || null, // Add to form if needed
      youtube: data.youtube || null,
    };

    try {
      await SubmitOrganizationDetails(payload);
    } catch (error) {
      console.error("Error saving basic info:", error);
      // Error handling
    }
  };

  const submitMissionVision = async (data: MissionVisionFormData) => {
    console.log("Mission & Vision submitted:", data);
    const payload = {
      mission_statement: data.missionStatement || null,
      vision_statement: data.visionStatement || null,
      core_values: data.coreValues || null,
    };

    try {
      await SubmitOrganizationDetails(payload);
    } catch (error) {
      console.error("Error saving basic info:", error);
      // Error handling
    }
  };

  const submitPublicView = async (data: PublicViewFormData) => {
    console.log("Public View submitted:", data);

    // Transform services array to just IDs
    const serviceIds = services?.map((service) => service);

    const payload = {
      notify_email_address: data.email || null,
      contact_number: data.phone || null,
      official_address: data.officialAddress || null,
      organization_service: serviceIds, // Now just an array of strings
      tags: tags,
    };

    try {
      const response = await SubmitOrganizationListingDetails(payload);
      console.log("Success:", response);
    } catch (error) {
      console.error("Error saving basic info:", error);
      // Error handling
    }
  };

  const GetOrganizationProfile = async () => {
    try {
      const response = await GetOrganiZationProfileDetails();
      const profileData = response.data.data;

      // Reset basic info form with the fetched data
      basicInfoForm.reset({
        organizationName: profileData.organization_name || "",
        legalBusinessName: profileData.business_name || "",
        businessRegistrationNumber:
          profileData.business_registration_number || "",
        website: profileData.web_url || "",
        industry: profileData.industry_id || "",
        yearOfEstablishment: profileData.year_of_establishment || "",
        organizationSize: profileData.employee_size || "",
        headquartersLocation: profileData.headquarters_location || "",
        operatingLocations: profileData.operating_regions || "",
      });

      // Reset contact info form with the fetched data
      contactInfoForm.reset({
        primaryContactName: profileData.primary_contact_person_name || "",
        designation: profileData.designation || "",
        email: profileData.official_email_address || "",
        phone: profileData.contact_number || "",
      });

      // Reset social links form with the fetched data
      socialLinksForm.reset({
        facebook: profileData.facebook || "",
        twitter: profileData.twitter || "",
        linkedin: profileData.linkedin || "",
        instagram: profileData.instagram || "", // Add if you have this field
        youtube: profileData.youtube || "", // Add if you have this field
      });

      missionVisionForm.reset({
        missionStatement: profileData.mission_statement || "",
        visionStatement: profileData.vision_statement || "",
        coreValues: profileData.core_values || "",
      });

      if (response.data.data.profile_url) {
        setLogoPreview(response.data.data.profile_url);
      }
      if (response.data.data.banner_url) {
        setBanner(response.data.data.banner_url);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Optionally show error to user
    }
  };
  const GetOrganizationListingProfile = async () => {
    try {
      const response = await GetOrganizationListingDetails();
      const profileData = response.data.data;

      // // Reset public view form
      publicViewForm.reset({
        email: profileData.notify_email_address || "",
        phone: profileData.contact_number || "",
        optionalEmail: profileData.alternative_email || "",
        officialAddress: profileData.official_address || "",
      });

      // Set services and tags from API data
      if (profileData.organization_service) {
        // Extract just the id values from each object in the array
        const serviceIds = profileData.organization_service.map(
          (service: any) => service.id
        );
        console.log("🚀 ~ GetOrganizationListingProfile ~ serviceIds:", serviceIds)
        setServices(serviceIds);
      }
      if (profileData.tags) {
        setTags(profileData.tags);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Optionally show error to user
    }
  };

  const GetIndustry = async () => {
    try {
      const response = await GetIndustryDetails();
      setIndustryData(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const GetService = async () => {
    try {
      const response = await GetServiceDetails();
      setServiceData(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      GetIndustry();
      GetOrganizationProfile();
      GetOrganizationListingProfile();
      GetService();
      hasFetched.current = true;
    }
  }, []);

  return (
    <>
      <DashboardLayout>
        {public_organization === "2" ? (
          <div className="max-w-6xl mx-auto mt-0 bg-white rounded-xl shadow overflow-hidden">
            <div className="relative h-[300px] bg-gray-100">
              <img
                src={banner || "/default-banner.jpg"}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <label className="cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-200">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, setBanner, "banner")}
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

              <div className="absolute -bottom-0 left-6 z-20 group">
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  <img
                    src={logoPreview || "/default-logo.jpg"}
                    alt="Profile"
                    className="object-cover w-full h-full"
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
              <h2 className="text-[22px] font-bold text-[#9747FF] mb-6">
                My Profile
              </h2>

              <Tab.Group
                selectedIndex={selectedIndex}
                onChange={setSelectedIndex}
              >
                <div className="px-6 pt-6">
                  {/* Tab Header */}
                  <Tab.List className="flex gap-3">
                    {tabNames.map((tab, index) => (
                      <Tab
                        key={index}
                        className={({ selected }) =>
                          `px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 focus-visible:outline-none ${
                            selected
                              ? "text-purple-600 bg-white shadow-md border-t-2 border-x-2 border-purple-600 -mb-[1px]"
                              : "text-gray-500 bg-transparent hover:text-purple-500"
                          }`
                        }
                      >
                        {tab}
                      </Tab>
                    ))}
                  </Tab.List>

                  {/* Tab Content Panel */}
                  <Tab.Panels className="pt-6">
                    {/* Basic info */}
                    <Tab.Panel>
                      <form
                        onSubmit={basicInfoForm.handleSubmit(submitBasicInfo)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Organization Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Organization Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...basicInfoForm.register("organizationName", {
                                required: "Organization name is required",
                              })}
                              placeholder="Enter your organization name"
                              className={`w-full px-4 py-2 border ${
                                basicInfoForm.formState.errors.organizationName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                basicInfoForm.formState.errors.organizationName
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {basicInfoForm.formState.errors
                              .organizationName && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  basicInfoForm.formState.errors
                                    .organizationName.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Legal Business Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Legal Business Name (if different)
                            </label>
                            <input
                              type="text"
                              {...basicInfoForm.register("legalBusinessName")}
                              placeholder="Enter legal business name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Business Registration Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Business Registration Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...basicInfoForm.register(
                                "businessRegistrationNumber",
                                {
                                  required: "Registration number is required",
                                }
                              )}
                              placeholder="Enter registration number"
                              className={`w-full px-4 py-2 border ${
                                basicInfoForm.formState.errors
                                  .businessRegistrationNumber
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                basicInfoForm.formState.errors
                                  .businessRegistrationNumber
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              This will remain private. Used for verification.
                            </p>
                            {basicInfoForm.formState.errors
                              .businessRegistrationNumber && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  basicInfoForm.formState.errors
                                    .businessRegistrationNumber.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Website */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Website <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="url"
                              {...basicInfoForm.register("website", {
                                required: "Website is required",
                                pattern: {
                                  value:
                                    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                                  message: "Enter a valid website URL",
                                },
                              })}
                              placeholder="https://yourwebsite.com"
                              className={`w-full px-4 py-2 border ${
                                basicInfoForm.formState.errors.website
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                basicInfoForm.formState.errors.website
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {basicInfoForm.formState.errors.website && (
                              <p className="text-sm text-red-500 mt-1">
                                {basicInfoForm.formState.errors.website.message}
                              </p>
                            )}
                          </div>

                          {/* Industry */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Industry <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...basicInfoForm.register("industry", {
                                required: "Industry is required",
                              })}
                              className={`w-full px-4 py-2 border ${
                                basicInfoForm.formState.errors.industry
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 ${
                                basicInfoForm.formState.errors.industry
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            >
                              <option value="">Select your industry</option>
                              {industry?.map((industry: any) => (
                                <option key={industry.id} value={industry.id}>
                                  {industry.name}
                                </option>
                              ))}
                            </select>
                            {basicInfoForm.formState.errors.industry && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  basicInfoForm.formState.errors.industry
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          {/* Year of Establishment */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Year Of Establishment{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...basicInfoForm.register(
                                "yearOfEstablishment",
                                {
                                  required: "Year is required",
                                }
                              )}
                              className={`w-full px-4 py-2 border ${
                                basicInfoForm.formState.errors
                                  .yearOfEstablishment
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 ${
                                basicInfoForm.formState.errors
                                  .yearOfEstablishment
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            >
                              <option value="">Select year</option>
                              {Array.from(
                                { length: 125 },
                                (_, i) => new Date().getFullYear() - i
                              ).map((year) => (
                                <option key={year} value={year.toString()}>
                                  {year}
                                </option>
                              ))}
                            </select>
                            {basicInfoForm.formState.errors
                              .yearOfEstablishment && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  basicInfoForm.formState.errors
                                    .yearOfEstablishment.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Organization Size */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Organization Size{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...basicInfoForm.register("organizationSize", {
                                required: "Organization size is required",
                              })}
                              className={`w-full px-4 py-2 border ${
                                basicInfoForm.formState.errors.organizationSize
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 ${
                                basicInfoForm.formState.errors.organizationSize
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            >
                              <option value="">Select size</option>
                              <option value="1-10">1-10</option>
                              <option value="11-50">11-50</option>
                              <option value="51-200">51-200</option>
                              <option value="201-1000">201-1000</option>
                              <option value="1000+">1000+</option>
                            </select>
                            {basicInfoForm.formState.errors
                              .organizationSize && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  basicInfoForm.formState.errors
                                    .organizationSize.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Headquarters Location */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Headquarters Location{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...basicInfoForm.register(
                                "headquartersLocation",
                                {
                                  required: "Headquarters location is required",
                                }
                              )}
                              placeholder="Enter city, state, country"
                              className={`w-full px-4 py-2 border ${
                                basicInfoForm.formState.errors
                                  .headquartersLocation
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                basicInfoForm.formState.errors
                                  .headquartersLocation
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {basicInfoForm.formState.errors
                              .headquartersLocation && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  basicInfoForm.formState.errors
                                    .headquartersLocation.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Operating Locations with Add More functionality - optional placeholder */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Operating Locations
                            </label>
                            <textarea
                              rows={3}
                              {...basicInfoForm.register("operatingLocations")}
                              placeholder="Enter city, state, country and address. Use line breaks for multiple locations."
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        {/* Action buttons for this tab */}
                        <div className="flex justify-end gap-4 mt-6">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition"
                          >
                            Save Basic Info
                          </button>
                        </div>
                      </form>
                    </Tab.Panel>

                    {/*contact info */}
                    <Tab.Panel>
                      <form
                        onSubmit={contactInfoForm.handleSubmit(
                          submitContactInfo
                        )}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Primary Contact Person Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Primary Contact Person Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...contactInfoForm.register(
                                "primaryContactName",
                                {
                                  required: "Primary contact name is required",
                                }
                              )}
                              placeholder="Enter full name"
                              className={`w-full px-4 py-2 border ${
                                contactInfoForm.formState.errors
                                  .primaryContactName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                contactInfoForm.formState.errors
                                  .primaryContactName
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {contactInfoForm.formState.errors
                              .primaryContactName && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  contactInfoForm.formState.errors
                                    .primaryContactName.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Designation */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Designation{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...contactInfoForm.register("designation", {
                                required: "Designation is required",
                              })}
                              className={`w-full px-4 py-2 border ${
                                contactInfoForm.formState.errors.designation
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 ${
                                contactInfoForm.formState.errors.designation
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            >
                              <option value="">Select designation</option>
                              <option value="Founder">Founder</option>
                              <option value="CEO">CEO</option>
                              <option value="COO">COO</option>
                              <option value="Manager">Manager</option>
                              <option value="Director">Director</option>
                            </select>
                            {contactInfoForm.formState.errors.designation && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  contactInfoForm.formState.errors.designation
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Contact Number{" "}
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
                              className={`w-full px-4 py-2 border ${
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
                                {contactInfoForm.formState.errors.phone.message}
                              </p>
                            )}
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Official Email address{" "}
                              <span className="text-red-500">*</span>
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
                              className={`w-full px-4 py-2 border ${
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
                                {contactInfoForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons for this tab */}
                        <div className="flex justify-end gap-4 mt-6">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition"
                          >
                            Save Contact Info
                          </button>
                        </div>
                      </form>
                    </Tab.Panel>

                    {/* Social links */}
                    <Tab.Panel>
                      <form
                        onSubmit={socialLinksForm.handleSubmit(
                          submitSocialLinks
                        )}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Facebook */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Facebook
                            </label>
                            <input
                              type="url"
                              {...socialLinksForm.register("facebook", {
                                pattern: {
                                  value:
                                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                                  message: "Enter a valid URL",
                                },
                              })}
                              placeholder="Enter Facebook profile URL"
                              className={`w-full px-4 py-2 border ${
                                socialLinksForm.formState.errors.facebook
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                socialLinksForm.formState.errors.facebook
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {socialLinksForm.formState.errors.facebook && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  socialLinksForm.formState.errors.facebook
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          {/* Twitter */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Twitter
                            </label>
                            <input
                              type="url"
                              {...socialLinksForm.register("twitter", {
                                pattern: {
                                  value:
                                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                                  message: "Enter a valid URL",
                                },
                              })}
                              placeholder="Enter Twitter profile URL"
                              className={`w-full px-4 py-2 border ${
                                socialLinksForm.formState.errors.twitter
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                socialLinksForm.formState.errors.twitter
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {socialLinksForm.formState.errors.twitter && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  socialLinksForm.formState.errors.twitter
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          {/* LinkedIn */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              LinkedIn
                            </label>
                            <input
                              type="url"
                              {...socialLinksForm.register("linkedin", {
                                pattern: {
                                  value:
                                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                                  message: "Enter a valid URL",
                                },
                              })}
                              placeholder="Enter LinkedIn profile URL"
                              className={`w-full px-4 py-2 border ${
                                socialLinksForm.formState.errors.linkedin
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                socialLinksForm.formState.errors.linkedin
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {socialLinksForm.formState.errors.linkedin && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  socialLinksForm.formState.errors.linkedin
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          {/* Instagram */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Instagram
                            </label>
                            <input
                              type="url"
                              {...socialLinksForm.register("instagram", {
                                pattern: {
                                  value:
                                    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/,
                                  message: "Enter a valid URL",
                                },
                              })}
                              placeholder="Enter Instagram profile URL"
                              className={`w-full px-4 py-2 border ${
                                socialLinksForm.formState.errors.instagram
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                socialLinksForm.formState.errors.instagram
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {socialLinksForm.formState.errors.instagram && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  socialLinksForm.formState.errors.instagram
                                    .message
                                }
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Youtube
                            </label>
                            <input
                              type="url"
                              {...socialLinksForm.register("youtube", {
                                pattern: {
                                  value:
                                    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
                                  message: "Enter a valid YouTube URL",
                                },
                              })}
                              placeholder="Enter YouTube channel URL"
                              className={`w-full px-4 py-2 border ${
                                socialLinksForm.formState.errors.youtube
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                socialLinksForm.formState.errors.youtube
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {socialLinksForm.formState.errors.youtube && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  socialLinksForm.formState.errors.youtube
                                    .message
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons for this tab */}
                        <div className="flex justify-end gap-4 mt-6">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition"
                          >
                            Save Social Links
                          </button>
                        </div>
                      </form>
                    </Tab.Panel>

                    {/* Organization Mission & Vision Values */}
                    <Tab.Panel>
                      <form
                        onSubmit={missionVisionForm.handleSubmit(
                          submitMissionVision
                        )}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Organization Mission Statement */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Organization Mission Statement{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={4}
                              {...missionVisionForm.register(
                                "missionStatement",
                                {
                                  required: "Mission statement is required",
                                }
                              )}
                              placeholder="Enter your mission statement"
                              className={`w-full px-4 py-2 border ${
                                missionVisionForm.formState.errors
                                  .missionStatement
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                missionVisionForm.formState.errors
                                  .missionStatement
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {missionVisionForm.formState.errors
                              .missionStatement && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  missionVisionForm.formState.errors
                                    .missionStatement.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Vision Statement */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Vision Statement{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={4}
                              {...missionVisionForm.register(
                                "visionStatement",
                                {
                                  required: "Vision statement is required",
                                }
                              )}
                              placeholder="Enter your vision statement"
                              className={`w-full px-4 py-2 border ${
                                missionVisionForm.formState.errors
                                  .visionStatement
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                missionVisionForm.formState.errors
                                  .visionStatement
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {missionVisionForm.formState.errors
                              .visionStatement && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  missionVisionForm.formState.errors
                                    .visionStatement.message
                                }
                              </p>
                            )}
                          </div>

                          {/* Core Values */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Core Values{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={4}
                              {...missionVisionForm.register("coreValues", {
                                required: "Core values are required",
                              })}
                              placeholder="List your core values"
                              className={`w-full px-4 py-2 border ${
                                missionVisionForm.formState.errors.coreValues
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                missionVisionForm.formState.errors.coreValues
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {missionVisionForm.formState.errors.coreValues && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  missionVisionForm.formState.errors.coreValues
                                    .message
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons for this tab */}
                        <div className="flex justify-end gap-4 mt-6">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition"
                          >
                            Save Mission & Vision
                          </button>
                        </div>
                      </form>
                    </Tab.Panel>

                    {/* Services with Add More functionality */}

                    <Tab.Panel>
                      <form
                        onSubmit={publicViewForm.handleSubmit(submitPublicView)}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Services Input */}
                          <div className="md:col-span-2 mb-6">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Services{" "}
                              <span className="text-gray-500 text-xs">
                                (Add up to 20)
                              </span>{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2 items-center">
                              <select
                                value={serviceInput}
                                onChange={(e) =>
                                  setServiceInput(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="">Select a service</option>
                                {serviceData?.map((service: any) => (
                                  <option key={service.id} value={service.id}>
                                    {service.name}
                                  </option>
                                ))}
                                {/* Add more options as needed */}
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  const trimmed = serviceInput.trim();
                                  if (
                                    trimmed &&
                                    !services.includes(trimmed) &&
                                    services.length < 20
                                  ) {
                                    setServices([...services, trimmed]);
                                    setServiceInput("");
                                  }
                                }}
                                className="px-3 py-2 text-sm font-bold bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
                                disabled={
                                  services.length >= 20 || !serviceInput
                                }
                              >
                                +
                              </button>
                            </div>

                            {/* Display added services */}
                            {services.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {services.map(
                                  (serviceItem: string | Service, index) => {
                                    const serviceId =
                                      typeof serviceItem === "object"
                                        ? serviceItem.id
                                        : serviceItem;

                                    // Debug output
                                    console.log(
                                      "Current service ID:",
                                      serviceId
                                    );
                                    console.log(
                                      "All serviceData:",
                                      serviceData
                                    );

                                    // Loose equality check (== instead of ===) to handle string/number mismatches
                                    const foundService = serviceData?.find(
                                      (svc: Service) => {
                                        console.log(
                                          `Comparing ${
                                            svc.id
                                          } (${typeof svc.id}) with ${serviceId} (${typeof serviceId})`
                                        );
                                        return svc.id == serviceId; // Note: using == for type coercion
                                      }
                                    );
                                    console.log(
                                      "🚀 ~ OrganaizationProfilepage ~ foundService:",
                                      foundService
                                    );

                                    if (!foundService) {
                                      console.warn(
                                        `No service found for ID: ${serviceId}`
                                      );
                                    }

                                    const displayName =
                                      foundService?.name || serviceId;

                                    return (
                                      <span
                                        key={serviceId || index} // Prefer serviceId, fallback to index
                                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
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

                          {/* Tags Input */}
                          {/* Tags Field */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Tags <span className="text-red-500">*</span>
                            </label>
                            <div className="w-full border border-gray-300 rounded-xl px-3 py-2">
                              <div className="flex flex-wrap gap-2 mb-1">
                                {tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                                  >
                                    {tag}
                                    <button
                                      onClick={() => removeTag(idx)}
                                      className="ml-1 text-purple-600 hover:text-red-500 font-bold"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                              <input
                                type="text"
                                className="w-full text-sm focus:outline-none placeholder-gray-400"
                                placeholder="Add tags (e.g. therapy, online, free-consult)"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                              />
                            </div>
                          </div>

                          {/* Notify Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Notify Email{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              {...publicViewForm.register("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Enter a valid email",
                                },
                              })}
                              className={`w-full px-4 py-2 border ${
                                publicViewForm.formState.errors.email
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl focus:outline-none focus:ring-2 ${
                                publicViewForm.formState.errors.email
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {publicViewForm.formState.errors.email && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  publicViewForm.formState.errors.email
                                    .message as string
                                }
                              </p>
                            )}
                          </div>

                          {/* Official Address (Geo) */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Official Address{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Enter full address"
                              {...publicViewForm.register("officialAddress", {
                                required: "Official address is required",
                              })}
                              className={`w-full px-4 py-2 border ${
                                publicViewForm.formState.errors.officialAddress
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${
                                publicViewForm.formState.errors.officialAddress
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {publicViewForm.formState.errors
                              .officialAddress && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  publicViewForm.formState.errors
                                    .officialAddress.message as string
                                }
                              </p>
                            )}
                          </div>

                          {/* Phone Number */}
                          <div>
                                 {" "}
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                                 {" "}
                            <input
                              type="tel"
                              {...publicViewForm.register("phone", {
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
                              className={`w-full px-4 py-2 border ${
                                publicViewForm.formState.errors.phone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl focus:outline-none focus:ring-2 ${
                                publicViewForm.formState.errors.phone
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {publicViewForm.formState.errors.phone && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  publicViewForm.formState.errors.phone
                                    .message as string
                                }
                              </p>
                            )}
                          </div>

                          {/* Optional Email */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email address{" "}
                              <span className="text-gray-500 text-xs">
                                (optional)
                              </span>
                            </label>
                            <input
                              type="email"
                              {...publicViewForm.register("optionalEmail", {
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Enter a valid email",
                                },
                              })}
                              className={`w-full px-4 py-2 border ${
                                publicViewForm.formState.errors.optionalEmail
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl focus:outline-none focus:ring-2 ${
                                publicViewForm.formState.errors.optionalEmail
                                  ? "focus:ring-red-500"
                                  : "focus:ring-purple-500"
                              }`}
                            />
                            {publicViewForm.formState.errors.optionalEmail && (
                              <p className="text-sm text-red-500 mt-1">
                                {
                                  publicViewForm.formState.errors.optionalEmail
                                    .message as string
                                }
                              </p>
                            )}
                          </div>
                        </div>
                        {/* Action buttons for this tab */}
                        <div className="flex justify-end gap-4 mt-6">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition"
                          >
                            Save Public View
                          </button>
                        </div>
                      </form>
                    </Tab.Panel>
                  </Tab.Panels>
                </div>
              </Tab.Group>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto mt-0 bg-white rounded-xl shadow overflow-hidden p-8 text-center">
            <div className="py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Organization Profile Feature Coming Soon
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
      </DashboardLayout>
    </>
  );
};

export default OrganaizationProfilepage;
