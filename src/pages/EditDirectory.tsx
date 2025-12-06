import React, { useEffect } from 'react'
import edit from '../assets/Edit.svg';
import { useState, useRef } from 'react';
import { CirclePlus, Trash2 } from 'lucide-react';
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { CreateOrUpdateBasicInfo, GetBasicInfoDetails, GetServiceDetails, GetCountryDetails, UploadDirectoryLogo, UploadDirectoryPhotos, ChangeDirectoryPhoto, DeleteDirectoryPhoto, UpdateBusinessHours } from '../Common/ServerAPI';
import { useToast } from '../components/ui/Toast/ToastProvider';
import { useForm, Controller } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface DayType {
  name: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface WeeklyHour {
  day: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

interface DirectoryFormData {
  bussiness_name: string;
  services: string[];
  country_id: string;
  contact: string;
  website: string;
  email: string;
  about: string;
  logo: FileList | null;
  operationMode: "main" | "temporary" | "permanent";
  days: DayType[];
  temporaryStartDate?: string;
  temporaryEndDate?: string;
  photos?: FileList | null;
}


const EditDirectory: React.FC = () => {

  const [serviceData, setServiceData] = useState<any>(null);
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [phoneDialCode, setPhoneDialCode] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [photos, setPhotos] = useState<Array<{ id: string; file: string; file_type: string }>>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState<boolean>(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const { showToast } = useToast();

  // Validation schema
  const validationSchema = yup.object().shape({
    bussiness_name: yup.string().required("Business name is required").min(2, "Business name must be at least 2 characters"),
    services: yup.array().of(yup.string()).min(1, "At least one service is required"),
    country_id: yup.string().required("Country is required"),
    contact: yup.string().required("Contact number is required"),
    website: yup.string().url("Please enter a valid website URL").nullable().optional(),
    email: yup.string().required("Email is required").email("Please enter a valid email address"),
    about: yup.string().required("About section is required").min(10, "About must be at least 10 characters"),
    operationMode: yup.string().oneOf(["main", "temporary", "permanent"]).required(),
    days: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        isOpen: yup.boolean().required(),
        openTime: yup.string().when("isOpen", {
          is: true,
          then: (schema) => schema.required("Open time is required when day is open"),
          otherwise: (schema) => schema.nullable(),
        }),
        closeTime: yup.string().when("isOpen", {
          is: true,
          then: (schema) => schema.required("Close time is required when day is open"),
          otherwise: (schema) => schema.nullable(),
        }),
      })
    ),
    temporaryStartDate: yup.string().when("operationMode", {
      is: "temporary",
      then: (schema) => schema.required("Start date is required"),
      otherwise: (schema) => schema.nullable().optional(),
    }).optional(),
    temporaryEndDate: yup.string().when("operationMode", {
      is: "temporary",
      then: (schema) => schema.required("End date is required"),
      otherwise: (schema) => schema.nullable().optional(),
    }).optional(),
    logo: yup.mixed().nullable().optional(),
    photos: yup.mixed().nullable().optional(),
  });

  const defaultDays: DayType[] = [
    { name: "Monday", isOpen: true, openTime: "10:30", closeTime: "22:30" },
    { name: "Tuesday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
    { name: "Wednesday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
    { name: "Thursday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
    { name: "Friday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
    { name: "Saturday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
    { name: "Sunday", isOpen: false, openTime: "10:30", closeTime: "22:30" },
  ];

  const publicProfileForm = useForm<DirectoryFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      bussiness_name: "",
      services: [],
      country_id: "",
      contact: "",
      website: "",
      email: "",
      about: "",
      logo: null,
      operationMode: "main",
      days: defaultDays,
      temporaryStartDate: "",
      temporaryEndDate: "",
      photos: null,
    },
    mode: "onChange",
  });

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = publicProfileForm;

  const mode = watch("operationMode");
  const services = watch("services") || [];
  const days = watch("days") || defaultDays;


  const toggleDay = (index: number) => {
    const currentDays = [...days];
    currentDays[index].isOpen = !currentDays[index].isOpen;
    setValue("days", currentDays, { shouldValidate: true });
  };

  const updateTime = (index: number, key: "openTime" | "closeTime", value: string) => {
    const currentDays = [...days];
    currentDays[index][key] = value;
    setValue("days", currentDays, { shouldValidate: true });
  };

  // Parse phone number to extract mobile_code and mobile_no
  const parsePhoneNumber = (phoneNumber: string, dialCode?: string) => {
    if (!phoneNumber || !phoneNumber.trim()) {
      return { mobile_code: 0, mobile_no: 0 };
    }

    const cleanNumber = phoneNumber.trim();
    
    // If we have the dial code from PhoneInput, use it (most reliable)
    if (dialCode) {
      // Remove the + from dial code if present
      const code = dialCode.replace(/^\+/, '');
      // Remove the dial code from the phone number
      // The phone number format is: +[dialCode][nationalNumber]
      const numberWithoutCode = cleanNumber.replace(new RegExp(`^\\+?${code.replace(/\+/g, '\\+')}`), '').replace(/\D/g, '');
      
      if (numberWithoutCode && code) {
        return {
          mobile_code: parseInt(code, 10),
          mobile_no: parseInt(numberWithoutCode, 10)
        };
      }
    }

    // Fallback: Extract from phone number string
    // Phone number format from react-international-phone: "+1234567890"
    // The format is always: +[country_code][national_number]
    // Country codes are 1-3 digits, so we need to be smart about parsing
    if (cleanNumber.startsWith('+')) {
      // Remove the + and get all digits
      const digits = cleanNumber.substring(1).replace(/\D/g, '');
      
      if (digits.length >= 10) {
        // Common country code patterns:
        // 1 digit: US (+1), Russia (+7)
        // 2 digits: Most countries (+44 UK, +91 India, +86 China, etc.)
        // 3 digits: Some countries (+1242 Bahamas, etc.)
        
        // Try to determine country code length
        // If total length is 11-12, likely 1-2 digit country code
        // If total length is 13+, likely 2-3 digit country code
        let codeLength = 1;
        if (digits.length >= 12) {
          // Check if first digit is 1 (US/Canada) - single digit code
          if (digits[0] === '1' && digits.length <= 12) {
            codeLength = 1;
          } else {
            codeLength = 2;
          }
        } else if (digits.length >= 13) {
          codeLength = 3;
        } else if (digits.length === 11) {
          // Could be 1 or 2 digit code
          // If starts with 1, it's likely US/Canada (1 digit)
          codeLength = digits[0] === '1' ? 1 : 2;
        }
        
        const code = digits.substring(0, codeLength);
        const number = digits.substring(codeLength);
        
        if (code && number && number.length >= 7) {
          return {
            mobile_code: parseInt(code, 10),
            mobile_no: parseInt(number, 10)
          };
        }
      }
    }

    // Last resort: try to extract just digits
    const allDigits = cleanNumber.replace(/\D/g, '');
    if (allDigits.length >= 10) {
      // Assume first 1-2 digits are country code
      const codeLength = allDigits.length > 11 ? 2 : 1;
      return {
        mobile_code: parseInt(allDigits.substring(0, codeLength), 10),
        mobile_no: parseInt(allDigits.substring(codeLength), 10)
      };
    }

    return { mobile_code: 0, mobile_no: 0 };
  };

  const onSubmit = async (data: DirectoryFormData) => {
    try {
      // Parse phone number with dial code if available
      const { mobile_code, mobile_no } = parsePhoneNumber(data.contact, phoneDialCode);

      // Validate that we got valid phone number parts
      if (!mobile_code || !mobile_no) {
        showToast({
          message: "Please enter a valid phone number",
          type: "error",
          duration: 5000,
        });
        return;
      }

      // Transform form data to match API payload structure
      const payload = {
        bussiness_name: data.bussiness_name,
        country_id: data.country_id,
        website: data.website || null,
        mobile_no: mobile_no,
        mobile_code: mobile_code,
        email: data.email,
        about: data.about,
        service_ids: data.services, // Already an array of service IDs
      };

      console.log("Payload:", payload);
      console.log("Parsed phone - Code:", mobile_code, "Number:", mobile_no);

      const response = await CreateOrUpdateBasicInfo(payload);
      const status = response?.success?.status;

      console.log("response:", response);


      if (status) {
        showToast({
          message: response?.success?.message,
          type: "success",
          duration: 5000,
        });
      } else {
        showToast({
          message: response?.error?.message,
          type: "error",
          duration: 5000,
        });
      }

      // Submit business hours separately
      await handleBusinessHoursSubmit(data);

    } catch (error: any) {
      showToast({
        message: error?.response?.error?.message || "Failed to save directory information",
        type: "error",
        duration: 5000,
      });
    }
  };

  // Handle business hours submission
  const handleBusinessHoursSubmit = async (data: DirectoryFormData) => {
    try {
      let businessHoursPayload: any = {};

      if (data.operationMode === "main") {
        // Status 1: Main hours with weekly_hours
        const weeklyHours = data.days.map((day) => ({
          day: day.name.toLowerCase(),
          is_open: day.isOpen,
          open_time: `${day.openTime}:00`, // Convert "09:00" to "09:00:00"
          close_time: `${day.closeTime}:00`,
        }));

        businessHoursPayload = {
          business_status: 1,
          weekly_hours: weeklyHours,
        };
      } else if (data.operationMode === "temporary") {
        // Status 2: Temporary closed with dates
        businessHoursPayload = {
          business_status: 2,
          temporary_close_start_date: data.temporaryStartDate,
          temporary_close_end_date: data.temporaryEndDate,
        };
      } else if (data.operationMode === "permanent") {
        // Status 3: Permanently closed
        businessHoursPayload = {
          business_status: 3,
        };
      }

      if (Object.keys(businessHoursPayload).length > 0) {
        const response = await UpdateBusinessHours(businessHoursPayload);
        
        if (response?.success?.status || response?.data?.success?.status) {
          console.log("Business hours updated successfully");
        } else {
          showToast({
            message: response?.error?.message || response?.data?.error?.message || "Failed to update business hours",
            type: "error",
            duration: 5000,
          });
        }
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.error?.message || "Failed to update business hours",
        type: "error",
        duration: 5000,
      });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const editPhotoInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddImageClick = () => {
    fileInputRef.current?.click(); // opens file picker
  };

  const handleAddPhotoClick = () => {
    photoInputRef.current?.click(); // opens file picker for photos
  };

  const handleEditPhotoClick = (photoId: string) => {
    editPhotoInputRefs.current[photoId]?.click();
  };

  // Handle photo edit
  const handlePhotoEdit = async (photoId: string, file: File) => {
    setEditingPhotoId(photoId);
    
    try {
      const formData = new FormData();
      formData.append("id", photoId);
      formData.append("file", file);

      const response = await ChangeDirectoryPhoto(formData);

      if (response?.success?.status || response?.data?.success?.status) {
        // Get the updated photo object from response
        const updatedPhoto = response?.data?.data || response?.data || response;
        
        if (updatedPhoto && updatedPhoto.id && updatedPhoto.file) {
          // Find the index of the photo being edited
          const photoIndex = photos.findIndex((photo) => photo.id === photoId);
          
          if (photoIndex !== -1) {
            // Replace the photo at the same index
            const updatedPhotos = [...photos];
            updatedPhotos[photoIndex] = {
              id: updatedPhoto.id,
              file: updatedPhoto.file,
              file_type: updatedPhoto.file_type || updatedPhoto.file_type || "image/jpg"
            };
            setPhotos(updatedPhotos);
            
            // Update preview at the same index
            const updatedPreviews = [...photoPreviews];
            updatedPreviews[photoIndex] = updatedPhoto.file;
            setPhotoPreviews(updatedPreviews);
          }
        } else {
          // Fallback: refetch all photos if response structure is different
          try {
            const basicInfoResponse = await GetBasicInfoDetails();
            const data = basicInfoResponse?.data?.data;
            if (data?.photos && Array.isArray(data.photos)) {
              setPhotos(data.photos);
              setPhotoPreviews(data.photos.map((photo: any) => photo.file || ""));
            }
          } catch (error) {
            console.error("Error refetching photos:", error);
          }
        }

        showToast({
          message: response?.success?.message || response?.data?.success?.message || "Photo updated successfully",
          type: "success",
          duration: 5000,
        });
      } else {
        showToast({
          message: response?.error?.message || response?.data?.error?.message || "Failed to update photo",
          type: "error",
          duration: 5000,
        });
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.error?.message || "Failed to update photo",
        type: "error",
        duration: 5000,
      });
    } finally {
      setEditingPhotoId(null);
    }
  };

  // Handle photo delete
  const handlePhotoDelete = async (photoId: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    setDeletingPhotoId(photoId);

    try {
      const response = await DeleteDirectoryPhoto(photoId);

      if (response?.success?.status || response?.data?.success?.status) {
        // Remove photo from state
        const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
        setPhotos(updatedPhotos);
        setPhotoPreviews(updatedPhotos.map((photo) => photo.file || ""));

        showToast({
          message: response?.success?.message || response?.data?.success?.message || "Photo deleted successfully",
          type: "success",
          duration: 5000,
        });
      } else {
        showToast({
          message: response?.error?.message || response?.data?.error?.message || "Failed to delete photo",
          type: "error",
          duration: 5000,
        });
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.error?.message || "Failed to delete photo",
        type: "error",
        duration: 5000,
      });
    } finally {
      setDeletingPhotoId(null);
    }
  };

  // Convert image URL to blob/file
  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  // Handle photo upload
  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploadingPhotos(true);

    try {
      // Convert existing photo URLs to files if they exist
      const existingPhotoFiles: File[] = [];
      for (const photo of photos) {
        if (photo.file && photo.file.startsWith('http')) {
          try {
            const file = await urlToFile(photo.file, `photo-${photo.id}.jpg`);
            existingPhotoFiles.push(file);
          } catch (error) {
            console.error('Error converting photo URL to file:', error);
          }
        }
      }

      // Combine existing photos (converted to files) with new files
      const allFiles: File[] = [...existingPhotoFiles];
      for (let i = 0; i < files.length; i++) {
        allFiles.push(files[i]);
      }

      // Create FormData with all files
      const formData = new FormData();
      allFiles.forEach((file) => {
        formData.append("file", file);
      });

      // Call the upload API
      const response = await UploadDirectoryPhotos(formData);

      console.log("Upload photos response:", response);

      if (response?.success?.status || response?.data?.success?.status) {
        // Try to get photos from response first
        const photosData = 
          response?.data?.photos || 
          response?.data?.data?.photos || 
          response?.photos ||
          (response?.data?.data && Array.isArray(response.data.data) ? response.data.data : null);
        
        console.log("Photos data from response:", photosData);

        if (photosData && Array.isArray(photosData) && photosData.length > 0) {
          // Update photos from response if available
          setPhotos(photosData);
          setPhotoPreviews(photosData.map((photo: any) => photo.file || ""));
        } else {
          // If response doesn't have photos array, refetch from API to get updated list
          try {
            const basicInfoResponse = await GetBasicInfoDetails();
            const data = basicInfoResponse?.data?.data;
            if (data?.photos && Array.isArray(data.photos)) {
              setPhotos(data.photos);
              setPhotoPreviews(data.photos.map((photo: any) => photo.file || ""));
            }
          } catch (error) {
            console.error("Error refetching photos:", error);
          }
        }
        
        showToast({
          message: response?.success?.message || response?.data?.success?.message || "Photos uploaded successfully",
          type: "success",
          duration: 5000,
        });
      } else {
        showToast({
          message: response?.error?.message || response?.data?.error?.message || "Failed to upload photos",
          type: "error",
          duration: 5000,
        });
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.error?.message || "Failed to upload photos",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsUploadingPhotos(false);
    }
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

  const GetCountries = async () => {
    try {
      const response = await GetCountryDetails();
      setCountryData(response.data.data || []);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const GetBasicInfo = async () => {
    try {
      const response = await GetBasicInfoDetails();
      const data = response.data.data;
      setBasicInfo(data);

      // Populate form with API data
      if (data) {
        setValue("bussiness_name", data.bussiness_name || "");
        setValue("country_id", data.country_id || "");
        // Reconstruct phone number from mobile_code and mobile_no
        if (data.mobile_code && data.mobile_no) {
          const phoneNumber = `+${data.mobile_code}${data.mobile_no}`;
          setValue("contact", phoneNumber);
          setPhoneDialCode(`+${data.mobile_code}`);
        } else {
          setValue("contact", data.contact || "");
        }
        setValue("website", data.website || "");
        setValue("email", data.email || "");
        setValue("about", data.about || "");
        // Extract service IDs from services array (array of objects with id and name)
        if (data.services && Array.isArray(data.services)) {
          const serviceIds = data.services.map((service: any) => service.id || service);
          setValue("services", serviceIds);
        } else if (data.service_ids && Array.isArray(data.service_ids)) {
          // Fallback: if service_ids exists as array of strings
          setValue("services", data.service_ids);
        } else {
          setValue("services", []);
        }
        // Load business hours data
        if (data.business_hours) {
          const businessHours = data.business_hours;
          const businessStatus = businessHours.business_status;
          
          // Map business_status: 1=main, 2=temporary, 3=permanent
          if (businessStatus === 1) {
            setValue("operationMode", "main");
            // Load weekly_hours
            if (businessHours.weekly_hours && Array.isArray(businessHours.weekly_hours)) {
              // Map weekly_hours to days format
              const mappedDays = defaultDays.map((defaultDay) => {
                const dayName = defaultDay.name.toLowerCase();
                const weeklyHour = businessHours.weekly_hours.find(
                  (wh: WeeklyHour) => wh.day.toLowerCase() === dayName
                );
                
                if (weeklyHour) {
                  // Convert time format from "09:00:00" to "09:00"
                  const openTime = weeklyHour.open_time ? weeklyHour.open_time.substring(0, 5) : defaultDay.openTime;
                  const closeTime = weeklyHour.close_time ? weeklyHour.close_time.substring(0, 5) : defaultDay.closeTime;
                  
                  return {
                    name: defaultDay.name,
                    isOpen: weeklyHour.is_open,
                    openTime: openTime,
                    closeTime: closeTime,
                  };
                }
                return defaultDay;
              });
              setValue("days", mappedDays);
            }
          } else if (businessStatus === 2) {
            setValue("operationMode", "temporary");
            // Load temporary close dates
            if (businessHours.temporary_close_start_date) {
              // Convert ISO date to YYYY-MM-DD format
              const startDate = new Date(businessHours.temporary_close_start_date).toISOString().split('T')[0];
              setValue("temporaryStartDate", startDate);
            }
            if (businessHours.temporary_close_end_date) {
              // Convert ISO date to YYYY-MM-DD format
              const endDate = new Date(businessHours.temporary_close_end_date).toISOString().split('T')[0];
              setValue("temporaryEndDate", endDate);
            }
          } else if (businessStatus === 3) {
            setValue("operationMode", "permanent");
          }
        } else {
          // Fallback to old format if business_hours doesn't exist
          if (data.operation_mode) {
            setValue("operationMode", data.operation_mode);
          }
          if (data.days && Array.isArray(data.days)) {
            setValue("days", data.days);
          }
          if (data.temporary_start_date) {
            setValue("temporaryStartDate", data.temporary_start_date);
          }
          if (data.temporary_end_date) {
            setValue("temporaryEndDate", data.temporary_end_date);
          }
        }
        // Set logo URL for preview
        if (data.logo_url) {
          setLogoUrl(data.logo_url);
          setLogoPreview(data.logo_url);
        }
        // Set photos from API response
        if (data.photos && Array.isArray(data.photos)) {
          setPhotos(data.photos);
          setPhotoPreviews(data.photos.map((photo: any) => photo.file || ""));
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

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      GetService();
      GetCountries();
      GetBasicInfo();
      hasFetched.current = true;
    }
  }, []);


  return (
    <main className="flex-1 p-4 flex flex-col items-end gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <div className="w-full bg-white rounded-xl p-4 flex gap-[90px]">
          <div className="flex-1 flex flex-col gap-4">

            {/* SECTION TITLE */}
            <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg">
              Basic Information
            </h2>

            <div className="flex flex-col gap-3">

              {/* ---------------- ROW 1 ---------------- */}
              <div className="flex gap-8">

                {/* Business Name */}
                <div className="w-[530px] flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("bussiness_name")}
                    className={`h-[43px] border rounded-lg px-3 
                       text-[#081021] font-semibold text-base outline-none ${errors.bussiness_name ? "border-red-500" : "border-[#CBD5E1]"
                      }`}
                  />
                  {errors.bussiness_name && (
                    <span className="text-red-500 text-sm">{errors.bussiness_name.message}</span>
                  )}
                </div>

                {/* Services Select + Tags */}
                <div className="w-[530px] flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium">
                    Services <span className="text-red-500">*</span>
                  </label>

                  <div className={`min-h-[43px] border rounded-lg flex items-center gap-2 px-3 py-2 flex-wrap ${errors.services ? "border-red-500" : "border-[#CBD5E1]"
                    }`}>
                    {/* Service Tags */}
                    {services.length > 0 &&
                      services.map((serviceId, index) => {
                        // Find the corresponding service in serviceData
                        const foundService = serviceData?.find(
                          (svc: any) => svc.id === serviceId
                        );

                        // If service is found in serviceData, use its name, otherwise use the ID
                        const displayName = foundService?.name || serviceId;

                        return (
                          <div
                            key={index}
                            className="bg-[#ECEAF8] rounded-md px-3 py-1 flex items-center gap-1.5"
                          >
                            <span className="text-[#081021] font-semibold text-base">
                              {displayName}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newServices = services.filter((_, i) => i !== index);
                                setValue("services", newServices, { shouldValidate: true });
                              }}
                              className="w-3 h-3 text-[#081021] flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}

                    {/* Dropdown */}
                    <div className="relative ml-auto">
                      <select
                        className="appearance-none text-[#64748B] outline-none bg-transparent pr-6 cursor-pointer"
                        value=""
                        onChange={(e) => {
                          const selectedOption = e.target.value;

                          if (!selectedOption) return;

                          if (selectedOption === "other") {
                            setShowCustomInput(true);
                            setServiceInput("");
                          } else if (selectedOption !== "") {
                            const trimmed = selectedOption.trim();
                            if (
                              trimmed &&
                              !services.includes(trimmed) &&
                              services.length < 20
                            ) {
                              const newServices = [...services, trimmed];
                              setValue("services", newServices, { shouldValidate: true });
                              setServiceInput("");
                            }
                            setShowCustomInput(false);
                          }
                        }}
                        onBlur={() => publicProfileForm.trigger("services")}
                      >
                        <option value="" disabled>
                          Add Service
                        </option>
                        {serviceData?.map((service: any) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                        <option value="other">Other (Add Custom Service)</option>
                      </select>

                      {/* Custom arrow */}
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="black"
                        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <path d="M0 0 L5 6 L10 0 Z" />
                      </svg>
                    </div>
                  </div>
                  {errors.services && (
                    <span className="text-red-500 text-sm">{errors.services.message}</span>
                  )}

                  {/* Custom Service Input */}
                  {showCustomInput && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={serviceInput}
                        onChange={(e) => setServiceInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const trimmed = serviceInput.trim();
                            if (
                              trimmed &&
                              !services.includes(trimmed) &&
                              services.length < 20
                            ) {
                              const newServices = [...services, trimmed];
                              setValue("services", newServices, { shouldValidate: true });
                              setServiceInput("");
                              setShowCustomInput(false);
                            }
                          }
                        }}
                        placeholder="Enter custom service name"
                        className="flex-1 h-[41px] border border-[#CBD5E1] rounded-lg px-3 outline-none focus:border-[#7C3AED] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = serviceInput.trim();
                          if (
                            trimmed &&
                            !services.includes(trimmed) &&
                            services.length < 20
                          ) {
                            const newServices = [...services, trimmed];
                            setValue("services", newServices, { shouldValidate: true });
                            setServiceInput("");
                            setShowCustomInput(false);
                          }
                        }}
                        className="px-4 h-[41px] bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors font-medium"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomInput(false);
                          setServiceInput("");
                        }}
                        className="px-4 h-[41px] border border-[#CBD5E1] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* ---------------- ROW 2 ---------------- */}
              <div className="flex gap-8">

                {/* Location */}
                <div className="w-[530px] flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-[530px]">
                    <select
                      {...register("country_id")}
                      className={`h-[43px] w-full border rounded-lg px-3
      text-[#081021] font-semibold text-base
      outline-none bg-white appearance-none ${errors.country_id ? "border-red-500" : "border-[#CBD5E1]"
                        }`}
                    >
                      <option value="">Select Location</option>
                      {countryData.map((country: any) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>

                    {/* Custom dropdown arrow */}
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="#081021"
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <path d="M0 0 L5 6 L10 0 Z" />
                    </svg>
                  </div>
                  {errors.country_id && (
                    <span className="text-red-500 text-sm">{errors.country_id.message}</span>
                  )}
                </div>

                {/* Contact */}
                <div className="w-[530px] flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium">
                    Contact <span className="text-red-500">*</span>
                  </label>

                  <Controller
                    name="contact"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        value={field.value || ""}
                        onChange={(value, countryInfo) => {
                          field.onChange(value);
                          // Store the dial code for parsing
                          // countryInfo can be either a string (value) or an object with country and inputValue
                          if (countryInfo && typeof countryInfo === 'object' && countryInfo.country) {
                            const dialCode = countryInfo.country.dialCode;
                            if (dialCode) {
                              setPhoneDialCode(`+${dialCode}`);
                            }
                          }
                          // Extract dial code from the value if countryInfo doesn't have it
                          if (!phoneDialCode && value) {
                            const match = value.match(/^\+(\d{1,3})/);
                            if (match) {
                              setPhoneDialCode(match[0]);
                            }
                          }
                          publicProfileForm.trigger("contact");
                        }}
                        defaultCountry="us"
                        forceDialCode
                        placeholder="Enter contact number"
                        className={`w-full border rounded-lg ${errors.contact ? "border-red-500" : "border-[#CBD5E1]"
                          }`}
                        inputClassName="w-full px-3 py-2 focus:outline-none"
                        countrySelectorStyleProps={{
                          buttonClassName: "border-r border-gray-300 px-3",
                          dropdownStyleProps: { className: "z-50" }
                        }}
                      />
                    )}
                  />
                  {errors.contact && (
                    <span className="text-red-500 text-sm">{errors.contact.message}</span>
                  )}
                </div>
              </div>

              {/* ---------------- ROW 3 ---------------- */}
              <div className="flex gap-8">

                {/* Website */}
                <div className="w-[530px] flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium">
                    Website
                  </label>
                  <input
                    type="text"
                    {...register("website")}
                    placeholder="https://www.example.com"
                    className={`h-[43px] border rounded-lg px-3 
                       text-[#081021] font-semibold text-base outline-none ${errors.website ? "border-red-500" : "border-[#CBD5E1]"
                      }`}
                  />
                  {errors.website && (
                    <span className="text-red-500 text-sm">{errors.website.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="w-[530px] flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`h-[43px] border rounded-lg px-3 
                       text-[#081021] font-semibold text-base outline-none ${errors.email ? "border-red-500" : "border-[#CBD5E1]"
                      }`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">{errors.email.message}</span>
                  )}
                </div>

              </div>

              {/* ---------------- ABOUT ---------------- */}
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-[#64748B] font-[Poppins] font-medium">
                  About <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("about")}
                  className={`h-[94px] border rounded-lg p-3 text-[#081021] 
                     font-semibold text-base leading-[26px] outline-none resize-none ${errors.about ? "border-red-500" : "border-[#CBD5E1]"
                    }`}
                />
                {errors.about && (
                  <span className="text-red-500 text-sm">{errors.about.message}</span>
                )}
              </div>

            {/* ---------------- LOGO UPLOAD ---------------- */}
            <div className="flex flex-col gap-2.5">
              <label className="text-[#64748B] font-[Poppins] font-medium">Logo</label>

              <div className="flex items-center gap-4">
                <Controller
                  name="logo"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <label className={`w-[82px] h-[82px] bg-white border-2 border-dashed border-[#D5D5D5] 
                               rounded-full flex items-center justify-center overflow-hidden relative ${
                                 isUploadingLogo ? "cursor-wait" : "cursor-pointer"
                               }`}>
                      {isUploadingLogo ? (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="w-6 h-6 border-3 border-[#7077FE] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <>
                          <input
                            {...field}
                            type="file"
                            className="hidden"
                            accept=".jpg,.jpeg,.png"
                            onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploadingLogo(true);
                            
                            // Create preview for selected file
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setLogoPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);

                            // Create FormData with the file
                            const formData = new FormData();
                            formData.append("file", file);
                            
                            try {
                              // Call the upload API
                              const response = await UploadDirectoryLogo(formData);
                              
                              if (response?.success?.status) {
                                // Update logo URL from response if available
                                if (response?.data?.logo_url) {
                                  setLogoUrl(response.data.logo_url);
                                  setLogoPreview(response.data.logo_url);
                                }
                                showToast({
                                  message: response?.success?.message || "Logo uploaded successfully",
                                  type: "success",
                                  duration: 5000,
                                });
                                // Update the form field with the file
                                onChange(e.target.files);
                              } else {
                                // Reset preview on error
                                setLogoPreview(logoUrl);
                                showToast({
                                  message: response?.error?.message || "Failed to upload logo",
                                  type: "error",
                                  duration: 5000,
                                });
                              }
                            } catch (error: any) {
                              // Reset preview on error
                              setLogoPreview(logoUrl);
                              showToast({
                                message: error?.response?.error?.message || "Failed to upload logo",
                                type: "error",
                                duration: 5000,
                              });
                            } finally {
                              setIsUploadingLogo(false);
                            }
                          }
                        }}
                          />
                          {logoPreview ? (
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-[#7077FE] text-2xl">+</span>
                          )}
                        </>
                      )}
                    </label>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <span className="text-[#7077FE] font-semibold text-base cursor-pointer">
                    Upload your logo here
                  </span>
                  <span className="text-[#64748B] text-sm">
                    Accepted file types: .jpg, .jpeg, .png
                  </span>
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>


        { /* Photos Section */}
        <div className="w-full bg-white border border-[#F7F7F7] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#081021] font-[Poppins] font-semibold text-xl">Photos</h2>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* Display existing photos */}
            {photoPreviews.map((preview, index) => {
              const photo = photos[index];
              const photoId = photo?.id;
              const isEditing = editingPhotoId === photoId;
              const isDeleting = deletingPhotoId === photoId;
              
              return (
                <div key={photoId || index} className="w-[267px] h-[184px] bg-[#F8F0F0] rounded-lg relative overflow-hidden">
                  {isEditing || isDeleting ? (
                    <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* EDIT and DELETE ICONS */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    {/* EDIT ICON */}
                    <div
                      className="w-9 h-9 flex items-center justify-center cursor-pointer bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      onClick={() => photoId && handleEditPhotoClick(photoId)}
                      title="Edit photo"
                    >
                      <img src={edit} alt="Edit" className="w-5 h-5" />
                    </div>
                    
                    {/* DELETE ICON */}
                    <div
                      className="w-9 h-9 flex items-center justify-center cursor-pointer bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      onClick={() => photoId && handlePhotoDelete(photoId)}
                      title="Delete photo"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                  </div>

                  {/* Hidden file input for editing this specific photo */}
                  {photoId && (
                    <input
                      type="file"
                      ref={(el) => {
                        editPhotoInputRefs.current[photoId] = el;
                      }}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && photoId) {
                          handlePhotoEdit(photoId, file);
                          // Reset input
                          if (e.target) {
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* Add Photo / Loading State */}
            {isUploadingPhotos ? (
              <div className="w-[267px] h-[184px] bg-white border-2 border-dashed border-[#D5D5D5] 
               rounded-lg flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-4 border-[#7077FE] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[#7077FE] font-semibold text-xs">Uploading...</span>
              </div>
            ) : (
              <div
                className="w-[267px] h-[184px] bg-white border-2 border-dashed border-[#D5D5D5] 
               rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer"
                onClick={handleAddPhotoClick}
              >
                <div className="w-5 h-5">
                  <CirclePlus size={20} color="#7077FE" />
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[#7077FE] font-semibold text-xs">Add image</span>
                  <span className="text-[#64748B] text-xs">Maximum 3 mb</span>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  // Upload photos (previews will be updated from API response)
                  await handlePhotoUpload(files);
                  // Reset input to allow selecting the same file again
                  if (e.target) {
                    e.target.value = '';
                  }
                }
              }}
            />
          </div>
        </div>
        { /* Operating Hours Section */}
        <div className="w-full bg-white rounded-xl p-4">
          <h2 className="text-[#081021] font-semibold text-lg mb-4">
            Operations Information
          </h2>

          {/* =================== RADIO BUTTONS =================== */}
          <div className="flex flex-col gap-3 mb-6">

            {/* Opens with main hours */}
            <div className="flex items-center gap-2 cursor-pointer"
              onClick={() => setValue("operationMode", "main", { shouldValidate: true })}>
              <div className={`w-3 h-3 rounded-full border-2 
          ${mode === "main" ? "bg-[#7077FE] border-[#7077FE]" : "border-gray-300"}`}
              ></div>
              <div>
                <div className="font-semibold text-[#081021]">Opens with main hours</div>
                <div className="text-[#64748B] text-sm">Show when your business is open</div>
              </div>
            </div>

            {/* Temporary closed */}
            <div className="flex items-center gap-2 cursor-pointer"
              onClick={() => setValue("operationMode", "temporary", { shouldValidate: true })}>
              <div className={`w-3 h-3 rounded-full border-2 
          ${mode === "temporary" ? "bg-[#7077FE] border-[#7077FE]" : "border-gray-300"}`}
              ></div>
              <div>
                <div className="font-semibold text-[#081021]">Temporary closed</div>
                <div className="text-[#64748B] text-sm">Show your business will open again</div>
              </div>
            </div>

            {/* Permanently closed */}
            <div className="flex items-center gap-2 cursor-pointer"
              onClick={() => setValue("operationMode", "permanent", { shouldValidate: true })}>
              <div className={`w-3 h-3 rounded-full border-2 
          ${mode === "permanent" ? "bg-[#7077FE] border-[#7077FE]" : "border-gray-300"}`}
              ></div>
              <div>
                <div className="font-semibold text-[#081021]">Permanently closed</div>
                <div className="text-[#64748B] text-sm">Your business no longer exists</div>
              </div>
            </div>
          </div>

          {/* =================== CONDITIONAL SECTION =================== */}

          {mode === "main" && (
            <div className="grid grid-cols-3 gap-x-20 gap-y-12">

              {days.map((day, index) => (
                <div key={index} className="flex flex-col gap-1">

                  {/* TOP ROW: Day Name + Labels */}
                  <div className="flex items-center gap-10">

                    {/* DAY NAME */}
                    <span className="text-[14px] font-['open_sans'] font-semibold text-[#081021] w-24">
                      {day.name}
                    </span>

                    {/* LABELS ROW */}
                    <div className="flex items-center gap-10">
                      <span className="text-[14px] font-['open_sans'] text-[#64748B] w-[120px]">Open at</span>
                      <span className="text-[14px] font-['open_sans'] text-[#64748B] w-[120px]">Closes at</span>
                    </div>
                  </div>

                  {/* SECOND ROW: Checkbox + Inputs */}
                  <div className="flex items-center gap-10">

                    {/* CHECKBOX */}
                    <div className="flex items-center gap-2 w-24">
                      <input
                        id={`day-${index}`}
                        type="checkbox"
                        checked={day.isOpen}
                        onChange={() => toggleDay(index)}
                        className="w-4 h-4 accent-[#7077FE]"
                      />
                      <label
                        htmlFor={`day-${index}`}
                        className="text-[12px] font-['open_sans'] text-[#64748B] cursor-pointer"
                      >
                        {day.isOpen ? "Open" : "Closed"}
                      </label>
                    </div>

                    {/* TIME INPUTS ROW */}
                    <div className="flex items-center gap-10">

                      {/* OPEN TIME INPUT */}
                      <input
                        type="time"
                        value={day.openTime}
                        disabled={!day.isOpen}
                        onChange={(e) => updateTime(index, "openTime", e.target.value)}
                        className={`border border-[#CBD5E1] rounded-lg px-2 py-1 w-[120px] ${!day.isOpen ? "bg-gray-200 opacity-60 cursor-not-allowed" : ""
                          }`}
                      />

                      {/* CLOSE TIME INPUT */}
                      <input
                        type="time"
                        value={day.closeTime}
                        disabled={!day.isOpen}
                        onChange={(e) => updateTime(index, "closeTime", e.target.value)}
                        className={`border border-[#CBD5E1] rounded-lg px-2 py-1 w-[120px] ${!day.isOpen ? "bg-gray-200 opacity-60 cursor-not-allowed" : ""
                          }`}
                      />

                    </div>
                  </div>

                </div>
              ))}

            </div>
          )}


          {/* ----------- 2. TEMPORARY CLOSED ----------- */}
          {mode === "temporary" && (
            <div className="mt-4 flex gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#64748B]">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("temporaryStartDate")}
                  className={`border rounded-lg px-2 py-1 ${errors.temporaryStartDate ? "border-red-500" : "border-[#CBD5E1]"
                    }`}
                />
                {errors.temporaryStartDate && (
                  <span className="text-red-500 text-sm">{errors.temporaryStartDate.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#64748B]">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("temporaryEndDate")}
                  className={`border rounded-lg px-2 py-1 ${errors.temporaryEndDate ? "border-red-500" : "border-[#CBD5E1]"
                    }`}
                />
                {errors.temporaryEndDate && (
                  <span className="text-red-500 text-sm">{errors.temporaryEndDate.message}</span>
                )}
              </div>
            </div>
          )}

          {/* ----------- 3. PERMANENTLY CLOSED ----------- */}
          {mode === "permanent" && (
            <div className="text-sm text-gray-500 mt-3">
              Business profile will show as permanently closed.
            </div>
          )}
        </div>



        { /* Reviews Section */}
        <div className="w-full bg-white rounded-xl p-4">
          <div className="bg-white p-4">
            <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg mb-4">All Reviews</h2>

            <div className="space-y-5">
              {/* Review 1 */}
              <div className="bg-[#F9F9F9] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-stretch gap-2.5">
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-black font-[Poppins] font-semibold text-base">John Doe</span>
                      <div className="w-1.5 h-1.5 bg-[#A1A1A1] rounded-full"></div>
                      <span className="text-[#A1A1A1] text-[12px] font-['open_sans']">Today</span>
                    </div>
                    <p className="text-[#1E1E1E] text-[12px] font-['open_sans'] leading-[20.4px]">
                      We should also take into consideration other factors in detecting hate speech. In case the algorithm mistakenly flags a comment as hate speech
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5">
                  <div className="w-6 h-6">
                    <img src="https://static.codia.ai/image/2025-12-04/e6MiVoWVJn.png" alt="Like" className="w-full h-full" />
                  </div>
                  <div className="w-px h-5 bg-[#E0E0E0]"></div>
                  <div className="flex items-center gap-1 bg-transparent rounded-full px-2.5 py-1.5">
                    <div className="w-6 h-6">
                      <img src="https://static.codia.ai/image/2025-12-04/0jQyhLuXK4.png" alt="Reply" className="w-full h-full" />
                    </div>
                    <span className="text-[#222224] text-xs leading-[26.4px]">Reply</span>
                  </div>
                </div>

                {/* Reply Box */}
                <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 space-y-2.5">
                  <div className="text-[#8A8A8A] text-base leading-[35.2px]">Replay a comment...</div>
                  <div className="flex justify-end">
                    <div className="flex items-center">
                      <div className="flex items-end gap-3 p-1">
                        <div className="bg-white rounded-full px-3 py-2">
                          <span className="text-[#8A8A8A] text-xs text-center">2000 Characters remaining</span>
                        </div>
                        <div className="bg-gradient-to-r from-[#7077FE] to-[#F07EFF] rounded-full px-6 py-3">
                          <span className="text-white font-semibold text-base text-center">Submit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-[#F9F9F9] rounded-lg p-4 space-y-5">
                <div className="flex justify-stretch items-stretch">
                  <div className="flex-1 flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-black font-[Poppins] font-semibold text-base">John Doe</span>
                      <div className="w-1.5 h-1.5 bg-[#A1A1A1] rounded-full"></div>
                      <span className="text-[#A1A1A1] text-[12px] font-['open_sans']">Today</span>
                    </div>
                    <p className="text-[#1E1E1E] text-[12px] font-['open_sans'] leading-[20.4px]">
                      We should also take into consideration other factors in detecting hate speech. In case the algorithm mistakenly flags a comment as hate speech
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5">
                  <div className="w-6 h-6">
                    <img src="https://static.codia.ai/image/2025-12-04/V3hCQqvhhk.png" alt="Like" className="w-full h-full" />
                  </div>
                  <div className="w-px h-5 bg-[#E0E0E0]"></div>
                  <div className="flex items-center gap-1 bg-transparent rounded-full px-2.5 py-1.5">
                    <div className="w-6 h-6">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#1E1E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-[#222224] text-xs leading-[26.4px]">Reply</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        { /* Action Buttons */}
        <div className="flex items-center gap-3 self-end">
          <button
            type="button"
            onClick={() => publicProfileForm.reset()}
            className="bg-white shadow-sm rounded-full px-5 py-3 flex items-center justify-center gap-2"
          >
            <span className="text-[#081021] font-Rubik leading-[16.59px]">Cancel</span>
          </button>

          <button
            type="button"
            onClick={() => {
              publicProfileForm.trigger().then((isValid) => {
                if (isValid) {
                  const data = publicProfileForm.getValues();
                  console.log("Preview data:", data);
                  // TODO: Add preview functionality
                }
              });
            }}
            className="bg-white shadow-sm rounded-full px-5 py-3 flex items-center justify-center gap-2"
          >
            <span className="text-[#081021] font-Rubik leading-[16.59px]">Preview</span>
          </button>

          <button
            type="submit"
            className="bg-[#7077FE] shadow-sm rounded-full px-6 py-3 flex items-center justify-center gap-2"
          >
            <span className="text-white font-Rubik leading-[16.59px]">Save</span>
          </button>
        </div>
      </form>
    </main>
  )
}

export default EditDirectory
