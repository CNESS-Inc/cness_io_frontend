import React, { useEffect, useState } from "react";
import altprofile from "../assets/altprofile.png";
import { useNavigate } from "react-router-dom";
import {
  GetCountryDetails,
  GetInterestsDetails,
  GetProfessionalDetails,
  GetSocialProfileDetails,
  SubmitSocialProfileDetails,
} from "../Common/ServerAPI";
import CreatableSelect from "react-select/creatable";

// Add these custom styles for the select components
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "43px",
    borderRadius: "7px",
    paddingLeft: "8px",
    color: "#6269FF",
    fontSize: "14px",
    fontWeight: 400,
    borderWidth: "1px",
    borderColor: state.isFocused ? "#A259FF" : "#CBD5E1",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(162, 89, 255, 0.2)" : "none",
    transition: "all 0.2s ease-in-out",
    backgroundColor: "white",
    "&:hover": {
      borderColor: "#A259FF",
    },
  }),
  valueContainer: (base: any) => ({
    ...base,
    flexWrap: "wrap",
    maxHeight: "auto",
    gap: "6px",
    paddingTop: "4px",
    paddingBottom: "4px",
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "#ECEAF8",
    color: "#6269FF",
    borderRadius: "5px",
    fontSize: "12px",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "#081021",
    fontWeight: "500",
    fontSize: "12px",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "#081021",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#ff4444",
    },
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: "14px",
    color: "#64748B",
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};

// ================================
// 🔹 INPUT COMPONENT
// ================================
const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-[#CBD5E1] rounded-[7px] h-[43px] px-4 text-[#081021] text-base outline-none focus:border-[#A259FF] focus:ring-2 focus:ring-[#A259FF]/20"
    />
  </div>
);

// ================================
// 🔹 SELECT COMPONENT
// ================================
const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize">
      {label}
    </label>

    <div className="relative">
      <select
        className="border border-[#CBD5E1] rounded-[7px] h-[43px] px-3 text-[#081021] text-base outline-none w-full appearance-none focus:border-[#A259FF] focus:ring-2 focus:ring-[#A259FF]/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Custom Black Arrow */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="black">
          <path d="M0 0 L5 6 L10 0 Z" />
        </svg>
      </span>
    </div>
  </div>
);

// ================================
// 🔹 TEXTAREA COMPONENT
// ================================
const TextAreaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize">
      {label}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-[#CBD5E1] rounded-[7px] min-h-[81px] p-3 text-[#081021] text-base outline-none resize-none focus:border-[#A259FF] focus:ring-2 focus:ring-[#A259FF]/20"
    />
  </div>
);

const UserProfileForm: React.FC = () => {
  // ================================
  // 🔹 FORM STATE
  // ================================
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate();

  // Interest data state
  const [interests, setInterests] = useState<string[]>([]);
  const [professions, setProfessions] = useState<string[]>([]);

  // Available options for dropdowns
  const [interestOptions, setInterestOptions] = useState<any[]>([]);
  const [professionOptions, setProfessionOptions] = useState<any[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);

  const [locations , setLocations] = useState<any>([])

  const locationOptions = locations.map((loc: any) => loc.name);

    const GetCountry = async () => {
      try {
        const response = await GetCountryDetails();
        console.log("🚀 ~ GetCountry ~ response:", response)
        setLocations(response.data.data);
      } catch (error: any) {
        console.log("🚀 ~ GetCountry ~ error:", error)
      }
    };
      const handleLocationChange = (selectedCountry: string) => {
    // Here you can either store just the country name
    setLocation(selectedCountry);
  };

    useEffect(() => {
      GetCountry()
    }, [])
    
  // ================================
  // 🔹 HANDLE INTERESTS CHANGE
  // ================================
  const handleInterestsChange = (selectedOptions: any) => {
    const normalizedInterests = selectedOptions.map((option: any) => {
      // If it's a custom option, use the label
      if (option.__isNew__) {
        return option.label;
      }
      return option.value;
    });
    setInterests(normalizedInterests);
  };

  // ================================
  // 🔹 HANDLE PROFESSIONS CHANGE
  // ================================
  const handleProfessionsChange = (selectedOptions: any) => {
    const normalizedProfessions = selectedOptions.map((option: any) => {
      // If it's a custom option, use the label
      if (option.__isNew__) {
        return option.label;
      }
      return option.value;
    });
    setProfessions(normalizedProfessions);
  };

  // ================================
  // 🔹 FORMAT CURRENT VALUES FOR SELECT COMPONENTS
  // ================================
  const formatCurrentInterests = () => {
    return interests.map((interestId) => {
      // Find the interest in interestOptions to get its label
      const foundInterest = interestOptions.find(
        (option) => option.value === interestId
      );

      // If it's a custom interest (not found in options), use the ID as label
      if (!foundInterest) {
        // Check if it's already a string (custom interest)
        return {
          value: interestId,
          label: interestId,
        };
      }

      // Return with proper label from options
      return {
        value: foundInterest.value,
        label: foundInterest.label,
      };
    });
  };

  const formatCurrentProfessions = () => {
    return professions.map((professionId) => {
      // Find the profession in professionOptions to get its label
      const foundProfession = professionOptions.find(
        (option) => option.value === professionId
      );

      // If it's a custom profession (not found in options), use the ID as label
      if (!foundProfession) {
        // Check if it's already a string (custom profession)
        return {
          value: professionId,
          label: professionId,
        };
      }

      // Return with proper label from options
      return {
        value: foundProfession.value,
        label: foundProfession.label,
      };
    });
  };

  // ================================
  // 🔹 FETCH INTEREST AND PROFESSION OPTIONS
  // ================================
  const fetchOptions = async () => {
    setLoading(true);
    try {
      // Fetch interests data
      const interestsResponse = await GetInterestsDetails();
      // Fetch professions data
      const professionsResponse = await GetProfessionalDetails();

      // Format interests data - map to {value, label} format
      const formattedInterestOptions =
        interestsResponse?.data?.data?.map((interest: any) => ({
          value: interest.id,
          label: interest.name,
        })) || [];

      // Format professions data - based on your API response
      const formattedProfessionOptions =
        professionsResponse?.data?.data?.map((prof: any) => ({
          value: prof.id,
          label: prof.title,
        })) || [];

      // Set the formatted options
      setInterestOptions(formattedInterestOptions);
      setProfessionOptions(formattedProfessionOptions);
    } catch (error) {
      console.error("Error fetching options:", error);
      setInterestOptions([]);
      setProfessionOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 🔹 FETCH PROFILE DATA
  // ================================
  const fetchMeDetails = async () => {
    try {
      const res = await GetSocialProfileDetails();
      console.log("Profile data:", res?.data?.data);

      if (res?.data?.data) {
        const profileData = res.data.data;

        // Set basic fields
        setFirstName(profileData.first_name || "");
        setLastName(profileData.last_name || "");
        setUserId(`${profileData.user?.username || ""}`);
        setProfilePicture(profileData.profile_picture || altprofile);
        setAbout(profileData.about_us || "");

        // Set location from location object
         if (profileData.country?.name) {
          setLocation(profileData.country.name);
        }
        // If location is stored differently in your API, adjust accordingly
        else if (profileData.location) {
          // Extract just the country part
          const locationParts = [profileData.country?.name]
            .filter(Boolean)
            .join("");
          setLocation(locationParts || "");
        }

        // Set interests - extract IDs from the array of objects
        if (profileData.interests && Array.isArray(profileData.interests)) {
          const interestIds = profileData.interests.map(
            (interest: any) => interest.id
          );
          setInterests(interestIds);
        }

        // Set professions - extract profession_id from the array of objects
        if (profileData.professions && Array.isArray(profileData.professions)) {
          const professionIds = profileData.professions.map(
            (prof: any) => prof.profession_id
          );
          setProfessions(professionIds);
        }
      }
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  // ================================
  // 🔹 HANDLE SAVE
  // ================================
const handleSave = async () => {
  try {
    // Find the selected country object from locations
    const selectedCountry = locations.find((loc: any) => loc.name === location);
    const countryId = selectedCountry?.id || "";

    // Prepare data for API
    const payload = {
      first_name: firstName,
      last_name: lastName,
      about_us: about,
      username: userId.startsWith("@") ? userId.substring(1) : userId,
      professions: professions.map((professionId) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (uuidRegex.test(professionId)) {
          return professionId;
        }
        return professionId;
      }),
      interests: interests.map((interestId) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (uuidRegex.test(interestId)) {
          return interestId;
        }
        
        return interestId;
      }),
      country_id: countryId,
    };

    console.log("Saving data:", payload);
    const response = await SubmitSocialProfileDetails(payload);
    if(response.success){
      navigate(`/dashboard/Profile`);
    }
    // Navigate back
  } catch (error) {
    console.error("Error saving profile:", error);
    // showToast error message here
  }
};

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await fetchOptions();
        await fetchMeDetails();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // ================================
  // 🔹 UI LAYOUT
  // ================================
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-full">
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7077FE]"></div>
        </div>
      ) : (
        <>
          {/* PROFILE IMAGE + EDIT */}
          <div className="flex flex-col items-start gap-2 mb-6">
            <img
              src={profilePicture || altprofile}
              className="w-[77px] h-[77px] rounded-full object-cover"
              alt="Profile"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = altprofile;
              }}
            />
            <button className="text-[#7077FE] font-semibold text-[16px] ml-5">
              Edit
            </button>
          </div>

          {/* ROW 1 */}
          <div className="flex gap-[26px] w-full">
            <InputField
              label="First name"
              value={firstName}
              onChange={setFirstName}
            />
            <InputField
              label="Last name"
              value={lastName}
              onChange={setLastName}
            />
          </div>

          {/* ROW 2 */}
          <div className="flex gap-[26px] mt-4">
            <InputField label="User ID" value={userId} onChange={setUserId} />
             <SelectField
          label="Country"  // Changed from "Location" to "Country"
          value={location}
          options={locationOptions}
          onChange={handleLocationChange}
        />
          </div>

          {/* ABOUT */}
          <div className="mt-4">
            <TextAreaField label="About" value={about} onChange={setAbout} />
          </div>

          <div className="flex gap-[26px] w-full">
            {/* Interests */}
            <div className="mt-4 w-full">
              <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize block mb-2">
                My Interests
              </label>
              <CreatableSelect
                isMulti
                options={interestOptions}
                value={formatCurrentInterests()}
                onChange={handleInterestsChange}
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
                  !interests.some(
                    (interest) =>
                      interest.toLowerCase() === inputValue.trim().toLowerCase()
                  )
                }
                isLoading={loading}
              />
            </div>

            {/* Profession */}
            <div className="mt-4 w-full">
              <label className="text-[#64748B] font-medium text-sm font-[poppins] capitalize block mb-2">
                My Profession
              </label>
              <CreatableSelect
                isMulti
                options={professionOptions}
                value={formatCurrentProfessions()}
                onChange={handleProfessionsChange}
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
                  !professions.some(
                    (profession) =>
                      profession.toLowerCase() ===
                      inputValue.trim().toLowerCase()
                  )
                }
                isLoading={loading}
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end w-full mt-8 gap-3">
            {/* BACK BUTTON */}
            <button
              onClick={() => navigate(`/dashboard/Profile`)}
              className="font-['Plus Jakarta Sans'] text-[14px] px-6 py-2 rounded-full border border-[#ddd] 
                text-black bg-white hover:bg-linear-to-r hover:from-[#7077FE] hover:to-[#7077FE] 
                hover:text-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out 
                w-full sm:w-auto flex justify-center items-center"
              type="button"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              className="font-['Plus Jakarta Sans'] text-[14px] text-white w-full sm:w-auto rounded-full py-2 px-6 flex justify-center items-center transition-colors duration-500 ease-in-out bg-[#7077FE] hover:bg-[#5a60d6]"
              type="button"
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfileForm;
