import React, { useEffect, useRef, useState } from "react";
import { Tab } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/solid";
import DashboardLayout from "../../../layout/Dashboard/dashboardlayout";
import {
  GetCountryDetails,
  GetInterestsDetails,
  GetProfessionalDetails,
  GetProfileDetails,
  GetPublicProfileDetails,
  GetStateDetails,
  SubmitProfileDetails,
  SubmitPublicProfileDetails,
} from "../../../Common/ServerAPI";

const tabNames = [
  "Basic Information",
  "Contact Information",
  "Social Links",
  "Education",
  "Work Experience",
  "Public Profile Fields",
];

const UserProfilePage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});
  const [profileData, setProfileData] = useState<any>(null);
  console.log("🚀 ~ UserProfilePage ~ profileData:", profileData);
  const [intereset, setInterestData] = useState<any>(null);
  const [professional, setProfessionalData] = useState<any>(null);
  const [Country, setCountry] = useState<any>(null);
  const [states, setStates] = useState<any[]>([]);

  const public_organization = localStorage.getItem("person_organization");

  // Separate form handlers for each tab
  const basicInfoForm = useForm();
  const contactInfoForm = useForm();
  const socialLinksForm = useForm();
  const educationForm = useForm();
  const workExperienceForm = useForm();
  const publicProfileForm = useForm();

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
        await SubmitProfileDetails(formData);
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
      }
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
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
    console.log("🚀 ~ handleBasicInfoSubmit ~ raw form data:", data);
    setIsSubmitting((prev) => ({ ...prev, basic: true }));

    // Normalize health and profession to arrays of strings
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
      professions: normalizeToArray(data.profession),
      interests: normalizeToArray(data.interests),
    };

    try {
      await SubmitProfileDetails(payload);
    } catch (error) {
      console.error("Error saving basic info:", error);
      // Error handling
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
      console.log("Contact info saved:", response.data);
    } catch (error) {
      console.error("Error saving contact info:", error);
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
      await SubmitProfileDetails(payload);
      // Handle success (e.g. toast notification or UI update)
    } catch (error) {
      console.error("Error saving social links:", error);
      // Handle error (e.g. show error message to user)
    } finally {
      setIsSubmitting((prev) => ({ ...prev, social: false }));
    }
  };
  const handleEducationSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, education: true }));

    // Wrap the single education object inside an array
    const payload = { education: [data] };

    try {
      const response = await SubmitProfileDetails(payload);
      console.log("Education saved:", response.data);
    } catch (error) {
      console.error("Error saving education:", error);
    } finally {
      setIsSubmitting((prev) => ({ ...prev, education: false }));
    }
  };

  const handleWorkExperienceSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, work: true }));

    // Wrap single work experience inside an array
    const payload = { work_experience: [data] };

    try {
      const response = await SubmitProfileDetails(payload);
      console.log("Work experience saved:", response.data);
    } catch (error) {
      console.error("Error saving work experience:", error);
    } finally {
      setIsSubmitting((prev) => ({ ...prev, work: false }));
    }
  };

  const handlePublicProfileSubmit = async (data: any) => {
    setIsSubmitting((prev) => ({ ...prev, public: true }));

    try {
      const formData = new FormData();

      formData.append("service_offered", data.services);
      formData.append("tags", JSON.stringify(tags));
      formData.append("notify_email", data.notifyEmail);
      formData.append("title", data.title);

      const email = data.emailAddress || data.notifyEmail;
      formData.append("email_address", email);

      if (data.featuredImage && data.featuredImage[0]) {
        formData.append("file", data.featuredImage[0]);
      }

      const response = await SubmitPublicProfileDetails(formData);
      console.log("Public profile saved:", response.data);
    } catch (error) {
      console.error("Error saving public profile:", error);
    } finally {
      setIsSubmitting((prev) => ({ ...prev, public: false }));
    }
  };

  const GetProfile = async () => {
    try {
      const response = await GetProfileDetails();
      setProfileData(response.data.data);

      // Set default values for each form
      if (response.data.data) {
        // Basic Info
        basicInfoForm.reset({
          firstName: response.data.data.first_name || "",
          lastName: response.data.data.last_name || "",
          bio:
            response.data.data.bio || response.data.data.professional_bio || "",
          gender: response.data.data.gender || "",
          dob: response.data.data.dob
            ? response.data.data.dob.split("T")[0]
            : "", // Format date if needed
          quote: response.data.data.opinion_on_counsciouness || "",
          // For interests and professions, since they're arrays in the response
          interests: response.data.data.interests?.[0].id || "",
          profession: response.data.data.professions?.[0].profession_id || "",
          vision: response.data.data.personal_vision_statement,
        });

        // Contact Info
        contactInfoForm.reset({
          phone: response.data.data.phone_no || "",
          email: response.data.data.email || "",
          address:
            response.data.data.address ||
            response.data.data.location?.address ||
            "",
          country: response.data.data.country_id || "",
          state: response.data.data.state_id || "",
          city: response.data.data.location?.city || "",
          postalCode: response.data.data.location?.postal_code || "",
          communication: {
            sms: response.data.data.communication_sms || false,
            email: response.data.data.communication_email || false,
            whatsapp: response.data.data.communication_whatsapp || false,
          },
        });
        console.log(
          "🚀 ~ GetProfile ~ response.data.data.state_id:",
          response.data.data.state_id
        );

        // Social Links
        socialLinksForm.reset({
          facebook: response.data.data.social_links?.facebook || "",
          twitter: response.data.data.social_links?.twitter || "",
          linkedin: response.data.data.social_links?.linkedin || "",
          instagram: response.data.data.social_links?.instagram || "",
        });

        // Education - using the first education entry if available
        if (response.data.data.education?.length > 0) {
          educationForm.reset({
            degree: response.data.data.education[0].degree || "",
            institution: response.data.data.education[0].institution || "",
            startDate: response.data.data.education[0].start_date || "",
            endDate: response.data.data.education[0].end_date || "",
          });
        }

        // Work Experience - using the first work experience if available
        if (response.data.data.work_experience?.length > 0) {
          workExperienceForm.reset({
            company: response.data.data.work_experience[0].company || "",
            position: response.data.data.work_experience[0].position || "",
            start_date: response.data.data.work_experience[0].start_date || "",
            end_date: response.data.data.work_experience[0].end_date || "",
          });
        }

        // Set profile picture if available
        if (response.data.data.profile_picture) {
          setLogoPreview(response.data.data.profile_picture);
        }
        if (response.data.data.profile_banner) {
          setBanner(response.data.data.profile_banner);
        }

        // Set tags if available (assuming tags are in the response)
        // setTags(response.data.tags || []);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const GetPublicProfile = async () => {
    try {
      const response = await GetPublicProfileDetails();
      const profileData = response.data.data;

      publicProfileForm.reset({
        title: profileData.title || "",
        services: profileData.service_offered || "",
        notifyEmail: profileData.notify_email || "",
        emailAddress: profileData.email_address || "",
      });
      if (profileData.tags) {
        setTags(profileData.tags);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const GetInterest = async () => {
    try {
      const response = await GetInterestsDetails();
      setInterestData(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const GetProfessional = async () => {
    try {
      const response = await GetProfessionalDetails();
      setProfessionalData(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const GetCountry = async () => {
    try {
      const response = await GetCountryDetails();
      setCountry(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  const GetState = async (countryId: any) => {
    try {
      const response = await GetStateDetails(countryId);
      setStates(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
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
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    const countryId = contactInfoForm.watch("country");
    console.log("🚀 ~ useEffect ~ countryId:", countryId);
    if (countryId) {
      GetState(countryId);
    } else {
      setStates([]);
    }
  }, [contactInfoForm.watch("country")]);

  return (
    <>
      <DashboardLayout>
        {public_organization === "1" ? (
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
                  {/* Tab Header - remains the same */}
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
                    {/* Basic Information Tab */}
                    <Tab.Panel>
                      <form
                        onSubmit={basicInfoForm.handleSubmit(
                          handleBasicInfoSubmit
                        )}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* First Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...basicInfoForm.register("firstName", {
                                required: true,
                              })}
                              placeholder="Enter your First Name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {basicInfoForm.formState.errors.firstName && (
                              <p className="text-sm text-red-500 mt-1">
                                First name is required
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
                              {...basicInfoForm.register("lastName", {
                                required: true,
                              })}
                              placeholder="Enter your Last Name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {basicInfoForm.formState.errors.lastName && (
                              <p className="text-sm text-red-500 mt-1">
                                Last name is required
                              </p>
                            )}
                          </div>

                          {/* Interests */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Interests <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...basicInfoForm.register("interests", {
                                required: true,
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">Select your Interest</option>

                              {intereset?.map((interest: any) => (
                                <option key={interest.id} value={interest.id}>
                                  {interest.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Profession */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Profession <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...basicInfoForm.register("profession", {
                                required: true,
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">Select your profession</option>
                              {professional?.map((profession: any) => (
                                <option
                                  key={profession.id}
                                  value={profession.id}
                                >
                                  {profession.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Gender */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...basicInfoForm.register("gender", {
                                required: true,
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="">Select your gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Non-binary">Non-binary</option>
                            </select>
                          </div>

                          {/* Date of Birth */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
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
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Your Quote on Consciousness
                            </label>
                            <input
                              type="text"
                              {...basicInfoForm.register("quote")}
                              placeholder="Enter your quote"
                              className="w-full px-4 py-2 border border-purple-400 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Professional Bio */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Professional Bio{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...basicInfoForm.register("bio", {
                                required: true,
                              })}
                              placeholder="Add a short professional bio"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            {/*contact info */}
                          </div>

                          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                            <button
                              type="button"
                              onClick={() => basicInfoForm.reset()}
                              className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                            >
                              Reset
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting.basic}
                              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
                            >
                              {isSubmitting.basic
                                ? "Saving..."
                                : "Save Basic Info"}
                            </button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...contactInfoForm.register("address", {
                                required: "Address is required",
                              })}
                              placeholder="Enter your address"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                              Country <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...contactInfoForm.register("country", {
                                required: "Country is required",
                              })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

                          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                            <button
                              type="button"
                              onClick={() => contactInfoForm.reset()}
                              className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                            >
                              Reset
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting.contact}
                              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
                            >
                              {isSubmitting.contact
                                ? "Saving..."
                                : "Save Contact Info"}
                            </button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Facebook */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Facebook
                            </label>
                            <input
                              type="url"
                              {...socialLinksForm.register("facebook")}
                              placeholder="Enter Facebook profile URL"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                            <button
                              type="button"
                              onClick={() => socialLinksForm.reset()}
                              className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                            >
                              Reset
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting.social}
                              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
                            >
                              {isSubmitting.social
                                ? "Saving..."
                                : "Save Social Links"}
                            </button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Degree */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Degree <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...educationForm.register("degree", {
                                required: true,
                              })}
                              placeholder="Enter your degree"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {educationForm.formState.errors.degree && (
                              <p className="text-sm text-red-500 mt-1">
                                Degree is required
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
                              {...educationForm.register("institution")}
                              placeholder="Enter institution name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Start Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              {...educationForm.register("startDate")}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* End Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              {...educationForm.register("endDate")}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                            <button
                              type="button"
                              onClick={() => educationForm.reset()}
                              className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                            >
                              Reset
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting.education}
                              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
                            >
                              {isSubmitting.education
                                ? "Saving..."
                                : "Save Education"}
                            </button>
                          </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Company */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Company <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...workExperienceForm.register("company", {
                                required: true,
                              })}
                              placeholder="Enter Company Name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {workExperienceForm.formState.errors.company && (
                              <p className="text-sm text-red-500 mt-1">
                                Company is required
                              </p>
                            )}
                          </div>

                          {/* Position */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Position <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              {...workExperienceForm.register("position")}
                              placeholder="Enter your Designation"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Start Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              {...workExperienceForm.register("start_date")}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* End Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              End Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              {...workExperienceForm.register("end_date")}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                            <button
                              type="button"
                              onClick={() => workExperienceForm.reset()}
                              className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                            >
                              Reset
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting.work}
                              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
                            >
                              {isSubmitting.work
                                ? "Saving..."
                                : "Save Work Experience"}
                            </button>
                          </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {publicProfileForm.formState.errors.title && (
                              <p className="text-sm text-red-500 mt-1">
                                Title is required
                              </p>
                            )}
                          </div>

                          {/* Featured Image Upload */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Featured Image{" "}
                              <span className="text-gray-500 text-xs">
                                (Upload an image that represents your service)
                              </span>
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              {...publicProfileForm.register("featuredImage")}
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Services Offered */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Services Offered
                            </label>
                            <input
                              type="text"
                              {...publicProfileForm.register("services")}
                              placeholder="Enter a service you offer"
                              className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

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
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-800 mb-2">
                              Notify Email{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              {...publicProfileForm.register("notifyEmail", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                  message: "Enter a valid email",
                                },
                              })}
                              className={`w-full px-4 py-2 border ${
                                publicProfileForm.formState.errors.notifyEmail
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-xl focus:outline-none focus:ring-2 ${
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
                          </div>

                          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                            <button
                              type="button"
                              onClick={() => publicProfileForm.reset()}
                              className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 shadow-sm hover:bg-gray-100 transition"
                            >
                              Reset
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting.public}
                              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
                            >
                              {isSubmitting.public
                                ? "Saving..."
                                : "Save Public Profile"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </Tab.Panel>
                  </Tab.Panels>
                </div>
              </Tab.Group>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mt-0  shadow overflow-hidden p-8 text-center">
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
      </DashboardLayout>
    </>
  );
};

export default UserProfilePage;
