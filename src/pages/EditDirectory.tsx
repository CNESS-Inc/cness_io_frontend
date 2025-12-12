import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { CirclePlus, SquarePen, Clock, Trash2 } from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {
  CreateOrUpdateBasicInfo,
  GetBasicInfoDetails,
  GetServiceDetails,
  UploadDirectoryLogo,
  UploadDirectoryPhotos,
  ChangeDirectoryPhoto,
  // DeleteDirectoryPhoto,
  UpdateBusinessHours,
  GetAllDirectoryReviews,
  CreateDirectoryReviewReply,
  GetDirectoryReviewReplies,
  LikeDirectoryReview,
  LikeDirectoryReviewReply,
  UpdateDirectoryReviewReply,
  DeleteDirectoryReviewReply,
  CreateOrUpdateDirectoryReview,
  DeleteDirectoryPhoto,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LocationSearchDropdown from "../components/LocationSearch/LocationSearchDropdown";
import CreatableSelect from "react-select/creatable";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

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
interface DeleteConfirmation {
  isOpen: boolean;
  photoId: string | null;
  photoIndex: number | null;
}

const EditDirectory: React.FC = () => {
  // const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    placeId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [phoneDialCode, setPhoneDialCode] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [photos, setPhotos] = useState<
    Array<{ id: string; file: string; file_type: string }>
  >([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState<boolean>(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);
  const [directoryInfoId, setDirectoryInfoId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation>({
      isOpen: false,
      photoId: null,
      photoIndex: null,
    });

  // Review states
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({
    pageNo: 1,
    hasMore: true,
    loadingMore: false,
  });
  const [openReplyInputs, setOpenReplyInputs] = useState<Set<string>>(
    new Set()
  );
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<
    Record<string, boolean>
  >({});
  const [childReviews, setChildReviews] = useState<Record<string, any[]>>({});
  const [loadingChildReviews, setLoadingChildReviews] = useState<
    Record<string, boolean>
  >({});
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyTexts, setEditReplyTexts] = useState<Record<string, string>>(
    {}
  );
  const [submittingEditReply, setSubmittingEditReply] = useState<
    Record<string, boolean>
  >({});
  const [deletingReply, setDeletingReply] = useState<Record<string, boolean>>(
    {}
  );
  const [pagination, setPagination] = useState<
    Record<string, { pageNo: number; hasMore: boolean; loadingMore: boolean }>
  >({});
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReviewText, setEditReviewText] = useState<Record<string, string>>(
    {}
  );
  const [editReviewRating, setEditReviewRating] = useState<
    Record<string, number>
  >({});
  const [submittingEditReview, setSubmittingEditReview] = useState<
    Record<string, boolean>
  >({});

  const { showToast } = useToast();

  // Validation schema
  const validationSchema = yup.object().shape({
    bussiness_name: yup
      .string()
      .required("Business name is required")
      .min(2, "Business name must be at least 2 characters"),
    services: yup
      .array()
      .of(yup.string())
      .min(1, "At least one service is required"),
    contact: yup.string().required("Contact number is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email address"),
    about: yup
      .string()
      .required("About section is required")
      .min(10, "About must be at least 10 characters"),
    operationMode: yup
      .string()
      .oneOf(["main", "temporary", "permanent"])
      .required(),
    days: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        isOpen: yup.boolean().required(),
        openTime: yup.string().when("isOpen", {
          is: true,
          then: (schema) =>
            schema.required("Open time is required when day is open"),
          otherwise: (schema) => schema.nullable(),
        }),
        closeTime: yup.string().when("isOpen", {
          is: true,
          then: (schema) =>
            schema.required("Close time is required when day is open"),
          otherwise: (schema) => schema.nullable(),
        }),
      })
    ),
    temporaryStartDate: yup
      .string()
      .when("operationMode", {
        is: "temporary",
        then: (schema) => schema.required("Start date is required"),
        otherwise: (schema) => schema.nullable().optional(),
      })
      .optional(),
    temporaryEndDate: yup
      .string()
      .when("operationMode", {
        is: "temporary",
        then: (schema) => schema.required("End date is required"),
        otherwise: (schema) => schema.nullable().optional(),
      })
      .optional(),
    logo: yup.mixed().nullable().optional(),
    photos: yup.mixed().nullable().optional(),
  });

  const defaultDays: DayType[] = [
    { name: "Monday", isOpen: true, openTime: "10:00", closeTime: "19:00" },
    { name: "Tuesday", isOpen: false, openTime: "10:00", closeTime: "19:00" },
    { name: "Wednesday", isOpen: false, openTime: "10:00", closeTime: "19:00" },
    { name: "Thursday", isOpen: false, openTime: "10:00", closeTime: "19:00" },
    { name: "Friday", isOpen: false, openTime: "10:00", closeTime: "19:00" },
    { name: "Saturday", isOpen: false, openTime: "10:00", closeTime: "19:00" },
    { name: "Sunday", isOpen: false, openTime: "10:00", closeTime: "19:00" },
  ];

  const publicProfileForm = useForm<DirectoryFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: {
      bussiness_name: "",
      services: [],
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

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "41px",
      borderRadius: "12px",
      color: "#6269FF",
      fontSize: "14px",
      fontWeight: 400,
      borderWidth: "1px",
      borderColor: state.isFocused ? "#CBD5E1" : "#CBD5E1",
      backgroundColor: "white",
      paddingLeft: "0px",
      paddingRight: "0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#CBD5E1",
      },
    }),
    valueContainer: (base: any) => ({
      ...base,
      flexWrap: "wrap",
      maxHeight: "auto",
      padding: "0",
      margin: "0",
      "&:has(.react-select__placeholder)": {
        paddingLeft: "12px",
      },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "#ECEAF8",
      color: "#6269FF",
      borderRadius: "5px",
      height: "36px",
      minWidth: "fit-content",
      width: "auto",
      padding: "7px 10px",
      gap: "6px",
      opacity: 1,
      margin: "4px 3.5px",
      alignItems: "center",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#000000",
      fontWeight: "500",
      fontSize: "14px",
      padding: 0,
      lineHeight: "normal",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "#000000",
      backgroundColor: "transparent",
      padding: 0,
      width: "16px",
      height: "16px",
      marginLeft: "6px",
      ":hover": {
        backgroundColor: "transparent",
        color: "#4A50D5",
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: 14,
      color: "#9CA3AF",
      marginLeft: "0", // Remove left margin from placeholder
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      paddingRight: "8px", // Keep only minimal padding for indicators
    }),
    input: (base: any) => ({
      ...base,
      margin: "0", // Remove margin from input
      padding: "0", // Remove padding from input
    }),
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = publicProfileForm;

  const mode = watch("operationMode");
  const services = watch("services") || [];
  const days = watch("days") || defaultDays;

  const toggleDay = (index: number) => {
    const currentDays = [...days];
    currentDays[index].isOpen = !currentDays[index].isOpen;
    setValue("days", currentDays, { shouldValidate: true });
  };

  const updateTime = (
    index: number,
    key: "openTime" | "closeTime",
    value: string
  ) => {
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
      const code = dialCode.replace(/^\+/, "");
      // Remove the dial code from the phone number
      // The phone number format is: +[dialCode][nationalNumber]
      const numberWithoutCode = cleanNumber
        .replace(new RegExp(`^\\+?${code.replace(/\+/g, "\\+")}`), "")
        .replace(/\D/g, "");

      if (numberWithoutCode && code) {
        return {
          mobile_code: parseInt(code, 10),
          mobile_no: parseInt(numberWithoutCode, 10),
        };
      }
    }

    // Fallback: Extract from phone number string
    // Phone number format from react-international-phone: "+1234567890"
    // The format is always: +[country_code][national_number]
    // Country codes are 1-3 digits, so we need to be smart about parsing
    if (cleanNumber.startsWith("+")) {
      // Remove the + and get all digits
      const digits = cleanNumber.substring(1).replace(/\D/g, "");

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
          if (digits[0] === "1" && digits.length <= 12) {
            codeLength = 1;
          } else {
            codeLength = 2;
          }
        } else if (digits.length >= 13) {
          codeLength = 3;
        } else if (digits.length === 11) {
          // Could be 1 or 2 digit code
          // If starts with 1, it's likely US/Canada (1 digit)
          codeLength = digits[0] === "1" ? 1 : 2;
        }

        const code = digits.substring(0, codeLength);
        const number = digits.substring(codeLength);

        if (code && number && number.length >= 7) {
          return {
            mobile_code: parseInt(code, 10),
            mobile_no: parseInt(number, 10),
          };
        }
      }
    }

    // Last resort: try to extract just digits
    const allDigits = cleanNumber.replace(/\D/g, "");
    if (allDigits.length >= 10) {
      // Assume first 1-2 digits are country code
      const codeLength = allDigits.length > 11 ? 2 : 1;
      return {
        mobile_code: parseInt(allDigits.substring(0, codeLength), 10),
        mobile_no: parseInt(allDigits.substring(codeLength), 10),
      };
    }

    return { mobile_code: 0, mobile_no: 0 };
  };

  const onSubmit = async (data: DirectoryFormData) => {
    setIsSubmitting(true); // Start loading

    try {
      // Parse phone number with dial code if available
      const { mobile_code, mobile_no } = parsePhoneNumber(
        data.contact,
        phoneDialCode
      );

      // Validate that we got valid phone number parts
      if (!mobile_code || !mobile_no) {
        showToast({
          message: "Please enter a valid phone number",
          type: "error",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }

      // Transform form data to match API payload structure
      const payload = {
        bussiness_name: data.bussiness_name,
        location: selectedLocation || null,
        website: data.website || null,
        mobile_no: mobile_no,
        mobile_code: mobile_code,
        email: data.email,
        about: data.about,
        service_ids: data.services,
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
        // navigate("/dashboard/DashboardDirectory");
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
        message:
          error?.response?.error?.message ||
          "Failed to save directory information",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false); // Stop loading regardless of success/error
    }
  };

  // Handle business hours submission
  const handleBusinessHoursSubmit = async (data: DirectoryFormData) => {
    try {
      let businessHoursPayload: any = {};

      if (data.operationMode === "main") {
        const weeklyHours = data.days.map((day) => ({
          day: day.name.toLowerCase(),
          is_open: day.isOpen,
          open_time: `${day.openTime}:00`,
          close_time: `${day.closeTime}:00`,
        }));

        businessHoursPayload = {
          business_status: 1,
          weekly_hours: weeklyHours,
        };
      } else if (data.operationMode === "temporary") {
        businessHoursPayload = {
          business_status: 2,
          temporary_close_start_date: data.temporaryStartDate,
          temporary_close_end_date: data.temporaryEndDate,
        };
      } else if (data.operationMode === "permanent") {
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
            message:
              response?.error?.message ||
              response?.data?.error?.message ||
              "Failed to update business hours",
            type: "error",
            duration: 5000,
          });
        }
      }
    } catch (error: any) {
      showToast({
        message:
          error?.response?.error?.message || "Failed to update business hours",
        type: "error",
        duration: 5000,
      });
    }
  };

  const photoInputRef = useRef<HTMLInputElement>(null);
  const editPhotoInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>(
    {}
  );

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
              file_type:
                updatedPhoto.file_type || updatedPhoto.file_type || "image/jpg",
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
              setPhotoPreviews(
                data.photos.map((photo: any) => photo.file || "")
              );
            }
          } catch (error) {
            console.error("Error refetching photos:", error);
          }
        }

        showToast({
          message:
            response?.success?.message ||
            response?.data?.success?.message ||
            "Photo updated successfully",
          type: "success",
          duration: 5000,
        });
      } else {
        showToast({
          message:
            response?.error?.message ||
            response?.data?.error?.message ||
            "Failed to update photo",
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
    // Remove the window.confirm from here
    setDeletingPhotoId(photoId);

    try {
      const response = await DeleteDirectoryPhoto(photoId);

      if (response?.success?.status || response?.data?.success?.status) {
        // Remove photo from state
        const updatedPhotos = photos.filter((photo) => photo.id !== photoId);
        setPhotos(updatedPhotos);
        setPhotoPreviews(updatedPhotos.map((photo) => photo.file || ""));

        showToast({
          message:
            response?.success?.message ||
            response?.data?.success?.message ||
            "Photo deleted successfully",
          type: "success",
          duration: 5000,
        });
      } else {
        showToast({
          message:
            response?.error?.message ||
            response?.data?.error?.message ||
            "Failed to delete photo",
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
        if (photo.file && photo.file.startsWith("http")) {
          try {
            const file = await urlToFile(photo.file, `photo-${photo.id}.jpg`);
            existingPhotoFiles.push(file);
          } catch (error) {
            console.error("Error converting photo URL to file:", error);
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
          (response?.data?.data && Array.isArray(response.data.data)
            ? response.data.data
            : null);

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
              setPhotoPreviews(
                data.photos.map((photo: any) => photo.file || "")
              );
            }
          } catch (error) {
            console.error("Error refetching photos:", error);
          }
        }

        showToast({
          message:
            response?.success?.message ||
            response?.data?.success?.message ||
            "Photos uploaded successfully",
          type: "success",
          duration: 5000,
        });
      } else {
        showToast({
          message:
            response?.error?.message ||
            response?.data?.error?.message ||
            "Failed to upload photos",
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

  const GetBasicInfo = async () => {
    try {
      const response = await GetBasicInfoDetails();
      const data = response.data.data;

      // Populate form with API data
      if (data) {
        // Store directory_info_id and user_id for reviews
        if (data.id) {
          setDirectoryInfoId(data.id);
        }
        if (data.user_id) {
          setUserId(data.user_id);
        }

        setValue("bussiness_name", data.bussiness_name || "");
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
          const serviceIds = data.services.map(
            (service: any) => service.id || service
          );
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
            if (
              businessHours.weekly_hours &&
              Array.isArray(businessHours.weekly_hours)
            ) {
              // Map weekly_hours to days format
              const mappedDays = defaultDays.map((defaultDay) => {
                const dayName = defaultDay.name.toLowerCase();
                const weeklyHour = businessHours.weekly_hours.find(
                  (wh: WeeklyHour) => wh.day.toLowerCase() === dayName
                );

                if (weeklyHour) {
                  // Convert time format from "09:00:00" to "09:00"
                  const openTime = weeklyHour.open_time
                    ? weeklyHour.open_time.substring(0, 5)
                    : defaultDay.openTime;
                  const closeTime = weeklyHour.close_time
                    ? weeklyHour.close_time.substring(0, 5)
                    : defaultDay.closeTime;

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
              const startDate = new Date(
                businessHours.temporary_close_start_date
              )
                .toISOString()
                .split("T")[0];
              setValue("temporaryStartDate", startDate);
            }
            if (businessHours.temporary_close_end_date) {
              // Convert ISO date to YYYY-MM-DD format
              const endDate = new Date(businessHours.temporary_close_end_date)
                .toISOString()
                .split("T")[0];
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
        // Load location data
        if (data.location) {
          setSelectedLocation(data.location);
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
      // showToast({
      //   message: error?.response?.data?.error?.message,
      //   type: "error",
      //   duration: 5000,
      // });
    }
  };

  // Fetch reviews with pagination
  const fetchReviews = async (pageNo: number = 1, append: boolean = false) => {
    if (!directoryInfoId) {
      return;
    }

    try {
      if (append) {
        setReviewsPagination((prev) => ({ ...prev, loadingMore: true }));
      } else {
        setLoadingReviews(true);
      }

      const response = await GetAllDirectoryReviews(directoryInfoId, pageNo, 5);
      if (response?.success?.status && response?.data?.data) {
        const reviewsData = response.data.data.rows || [];
        const totalCount = response.data.data.count || 0;

        setReviews((prev) => {
          const updatedReviews = append
            ? [...prev, ...reviewsData]
            : reviewsData;
          const currentLoaded = updatedReviews.length;
          const hasMore = currentLoaded < totalCount;

          setReviewsPagination({ pageNo, hasMore, loadingMore: false });
          return updatedReviews;
        });
      }
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
    } finally {
      if (append) {
        setReviewsPagination((prev) => ({ ...prev, loadingMore: false }));
      } else {
        setLoadingReviews(false);
      }
    }
  };

  // Load more reviews on scroll
  const loadMoreReviews = async () => {
    if (!reviewsPagination.hasMore || reviewsPagination.loadingMore) {
      return;
    }
    await fetchReviews(reviewsPagination.pageNo + 1, true);
  };

  // Toggle reply input for a review
  const toggleReplyInput = (reviewId: string) => {
    setOpenReplyInputs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
        setReplyTexts((prevTexts) => {
          const newTexts = { ...prevTexts };
          delete newTexts[reviewId];
          return newTexts;
        });
      } else {
        newSet.add(reviewId);
        fetchChildReviews(reviewId);
      }
      return newSet;
    });
  };

  // Fetch child reviews for a parent review with pagination
  const fetchChildReviews = async (
    reviewId: string,
    pageNo: number = 1,
    append: boolean = false
  ) => {
    try {
      if (append) {
        setPagination((prev) => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], loadingMore: true },
        }));
      } else {
        setLoadingChildReviews((prev) => ({ ...prev, [reviewId]: true }));
      }

      const response = await GetDirectoryReviewReplies(reviewId, pageNo, 5);
      if (response?.success?.status && response?.data?.data) {
        const replies = response.data.data.rows || [];
        const totalCount = response.data.data.count || 0;
        const currentLoaded = append
          ? (pagination[reviewId]?.pageNo || 0) * 5 + replies.length
          : replies.length;
        const hasMore = currentLoaded < totalCount;

        setChildReviews((prev) => ({
          ...prev,
          [reviewId]: append
            ? [...(prev[reviewId] || []), ...replies]
            : replies,
        }));

        setPagination((prev) => ({
          ...prev,
          [reviewId]: {
            pageNo: pageNo,
            hasMore: hasMore,
            loadingMore: false,
          },
        }));
      }
    } catch (error: any) {
      console.error("Error fetching child reviews:", error);
    } finally {
      if (append) {
        setPagination((prev) => ({
          ...prev,
          [reviewId]: { ...prev[reviewId], loadingMore: false },
        }));
      } else {
        setLoadingChildReviews((prev) => ({ ...prev, [reviewId]: false }));
      }
    }
  };

  // Load more child reviews on scroll
  const loadMoreChildReviews = async (reviewId: string) => {
    const paginationInfo = pagination[reviewId];
    if (
      !paginationInfo ||
      !paginationInfo.hasMore ||
      paginationInfo.loadingMore
    ) {
      return;
    }
    await fetchChildReviews(reviewId, paginationInfo.pageNo + 1, true);
  };

  // Handle like parent review
  const handleLikeReview = async (reviewId: string) => {
    if (!directoryInfoId) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const payload = {
        directory_info_id: directoryInfoId,
        review_id: reviewId,
      };

      await LikeDirectoryReview(payload);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                is_liked: !review.is_liked,
                likes_count: review.is_liked
                  ? Math.max(0, (review.likes_count || 0) - 1)
                  : (review.likes_count || 0) + 1,
              }
            : review
        )
      );
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to like review",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle like child review (reply)
  const handleLikeReply = async (reviewId: string, replyId: string) => {
    if (!directoryInfoId) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const payload = {
        directory_info_id: directoryInfoId,
        review_id: reviewId,
        reply_id: replyId,
      };

      await LikeDirectoryReviewReply(payload);

      setChildReviews((prevChildReviews) => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.map((reply: any) =>
          reply.id === replyId
            ? {
                ...reply,
                is_liked: !reply.is_liked,
                likes_count: reply.is_liked
                  ? Math.max(0, (reply.likes_count || 0) - 1)
                  : (reply.likes_count || 0) + 1,
              }
            : reply
        );
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies,
        };
      });
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to like reply",
        type: "error",
        duration: 3000,
      });
    }
  };

  // Handle edit parent review
  const handleEditReview = (
    reviewId: string,
    currentText: string,
    currentRating: number
  ) => {
    setEditingReviewId(reviewId);
    setEditReviewText((prev) => ({ ...prev, [reviewId]: currentText }));
    setEditReviewRating((prev) => ({ ...prev, [reviewId]: currentRating }));
  };

  // Handle cancel edit review
  const handleCancelEditReview = (reviewId: string) => {
    setEditingReviewId(null);
    setEditReviewText((prev) => {
      const newTexts = { ...prev };
      delete newTexts[reviewId];
      return newTexts;
    });
    setEditReviewRating((prev) => {
      const newRatings = { ...prev };
      delete newRatings[reviewId];
      return newRatings;
    });
  };

  // Handle update parent review
  const handleUpdateReview = async (reviewId: string) => {
    const editText = editReviewText[reviewId]?.trim();
    const editRating = editReviewRating[reviewId];

    if (!editText || !editRating) {
      showToast({
        message: "Please provide both rating and description",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!directoryInfoId) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setSubmittingEditReview((prev) => ({ ...prev, [reviewId]: true }));
      const payload = {
        directory_info_id: directoryInfoId,
        description: editText,
        rating: editRating,
      };

      const response = await CreateOrUpdateDirectoryReview(payload);

      if (response?.success?.status && response?.data?.data) {
        const updatedReview = response.data.data;

        setReviews((prevReviews) =>
          prevReviews.map((review: any) =>
            review.id === reviewId ? updatedReview : review
          )
        );

        showToast({
          message: "Review updated successfully",
          type: "success",
          duration: 3000,
        });

        setEditingReviewId(null);
        setEditReviewText((prev) => {
          const newTexts = { ...prev };
          delete newTexts[reviewId];
          return newTexts;
        });
        setEditReviewRating((prev) => {
          const newRatings = { ...prev };
          delete newRatings[reviewId];
          return newRatings;
        });
      }
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to update review",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingEditReview((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // Handle submit reply
  const handleSubmitReply = async (reviewId: string) => {
    const replyText = replyTexts[reviewId]?.trim();

    if (!replyText) {
      showToast({
        message: "Please enter a reply",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!directoryInfoId) {
      showToast({
        message: "Directory information is missing",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setSubmittingReply((prev) => ({ ...prev, [reviewId]: true }));
      const payload = {
        directory_info_id: directoryInfoId,
        review_id: reviewId,
        text: replyText,
      };

      const response = await CreateDirectoryReviewReply(payload);

      if (response?.success?.status && response?.data?.data) {
        const newReply = response.data.data;

        setChildReviews((prevChildReviews) => {
          const currentReplies = prevChildReviews[reviewId] || [];
          return {
            ...prevChildReviews,
            [reviewId]: [newReply, ...currentReplies],
          };
        });

        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  reply_count: (review.reply_count || 0) + 1,
                }
              : review
          )
        );
      }

      showToast({
        message: "Reply submitted successfully",
        type: "success",
        duration: 3000,
      });

      setReplyTexts((prev) => {
        const newTexts = { ...prev };
        delete newTexts[reviewId];
        return newTexts;
      });
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to submit reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // Handle edit reply
  const handleEditReply = (replyId: string, currentText: string) => {
    setEditingReplyId(replyId);
    setEditReplyTexts((prev) => ({ ...prev, [replyId]: currentText }));
  };

  // Handle cancel edit
  const handleCancelEdit = (replyId: string) => {
    setEditingReplyId(null);
    setEditReplyTexts((prev) => {
      const newTexts = { ...prev };
      delete newTexts[replyId];
      return newTexts;
    });
  };

  // Handle update reply
  const handleUpdateReply = async (reviewId: string, replyId: string) => {
    const editText = editReplyTexts[replyId]?.trim();

    if (!editText) {
      showToast({
        message: "Please enter a reply",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setSubmittingEditReply((prev) => ({ ...prev, [replyId]: true }));
      const payload = {
        id: replyId,
        text: editText,
      };

      await UpdateDirectoryReviewReply(payload);

      setChildReviews((prevChildReviews) => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.map((reply: any) =>
          reply.id === replyId ? { ...reply, text: editText } : reply
        );
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies,
        };
      });

      showToast({
        message: "Reply updated successfully",
        type: "success",
        duration: 3000,
      });

      setEditingReplyId(null);
      setEditReplyTexts((prev) => {
        const newTexts = { ...prev };
        delete newTexts[replyId];
        return newTexts;
      });
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to update reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setSubmittingEditReply((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  // Handle delete reply
  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) {
      return;
    }

    try {
      setDeletingReply((prev) => ({ ...prev, [replyId]: true }));
      const payload = {
        id: replyId,
      };

      await DeleteDirectoryReviewReply(payload);

      setChildReviews((prevChildReviews) => {
        const currentReplies = prevChildReviews[reviewId] || [];
        const updatedReplies = currentReplies.filter(
          (reply: any) => reply.id !== replyId
        );
        return {
          ...prevChildReviews,
          [reviewId]: updatedReplies,
        };
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                reply_count: Math.max(0, (review.reply_count || 0) - 1),
              }
            : review
        )
      );

      showToast({
        message: "Reply deleted successfully",
        type: "success",
        duration: 3000,
      });
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to delete reply",
        type: "error",
        duration: 3000,
      });
    } finally {
      setDeletingReply((prev) => ({ ...prev, [replyId]: false }));
    }
  };

  const hasFetched = useRef(false);

  // Fetch reviews when userId is available
  useEffect(() => {
    if (userId) {
      fetchReviews(1, false);
    }
  }, [userId]);

  useEffect(() => {
    if (!hasFetched.current) {
      GetService();
      GetBasicInfo();
      hasFetched.current = true;
    }
  }, []);

  return (
    <main className="flex-1 p-2 sm:p-4 flex flex-col items-end gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        {/* Basic Information Section */}
        <div className="w-full bg-white rounded-xl p-4 sm:p-6 flex flex-col lg:flex-row gap-4 lg:gap-[90px]">
          <div className="flex-1 flex flex-col gap-4">
            {/* SECTION TITLE */}
            <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg sm:text-xl">
              Basic Information
            </h2>

            <div className="flex flex-col gap-4 sm:gap-3">
              {/* ---------------- ROW 1 ---------------- */}
              <div className="flex flex-col xl:flex-row gap-4 xl:gap-8">
                {/* Business Name */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium text-sm sm:text-base">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("bussiness_name")}
                    className={`h-[43px] border rounded-lg px-3 
                       text-[#081021] font-semibold text-sm sm:text-base outline-none ${
                         errors.bussiness_name
                           ? "border-red-500"
                           : "border-[#CBD5E1]"
                       }`}
                  />
                  {errors.bussiness_name && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      {errors.bussiness_name.message}
                    </span>
                  )}
                </div>

                {/* Services */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium text-sm sm:text-base">
                    Services <span className="text-red-500">*</span>
                  </label>

                  <CreatableSelect
                    isMulti
                    options={
                      serviceData?.map((service: any) => ({
                        value: service.id,
                        label: service.name,
                      })) || []
                    }
                    value={services.map((serviceId: string) => {
                      const foundService = serviceData?.find(
                        (svc: any) => svc.id === serviceId
                      );

                      const displayName = foundService?.name || serviceId;

                      return {
                        value: serviceId,
                        label: displayName,
                      };
                    })}
                    onChange={(selectedOptions) => {
                      const normalizedServices = selectedOptions.map(
                        (option: any) => option.value
                      );

                      setValue("services", normalizedServices, {
                        shouldValidate: true,
                      });
                    }}
                    styles={customStyles}
                    classNamePrefix="react-select"
                    placeholder="Select services..."
                    noOptionsMessage={() => "No services available"}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />

                  {errors.services && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      {errors.services.message}
                    </span>
                  )}
                </div>
              </div>

              {/* ---------------- ROW 2 ---------------- */}
              <div className="flex flex-col xl:flex-row gap-4 xl:gap-8">
                {/* Location */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium text-sm sm:text-base">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <LocationSearchDropdown
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    placeholder="Search for a location..."
                  />
                </div>

                {/* Contact */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium text-sm sm:text-base">
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
                          if (
                            countryInfo &&
                            typeof countryInfo === "object" &&
                            countryInfo.country
                          ) {
                            const dialCode = countryInfo.country.dialCode;
                            if (dialCode) {
                              setPhoneDialCode(`+${dialCode}`);
                            }
                          }
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
                        className={`w-full border rounded-lg ${
                          errors.contact ? "border-red-500" : "border-[#CBD5E1]"
                        }`}
                        inputClassName="h-[43px]! w-full px-3 focus:outline-none text-sm sm:text-base border-none"
                        countrySelectorStyleProps={{
                          buttonClassName:
                            "h-[43px] border-r border-gray-300 px-3 flex items-center",
                          buttonStyle: {
                            height: "43px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          },
                          dropdownStyleProps: { className: "z-50" },
                        }}
                      />
                    )}
                  />
                  {errors.contact && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      {errors.contact.message}
                    </span>
                  )}
                </div>
              </div>

              {/* ---------------- ROW 3 ---------------- */}
              <div className="flex flex-col xl:flex-row gap-4 xl:gap-8">
                {/* Website */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium text-sm sm:text-base">
                    Website
                  </label>
                  <input
                    type="text"
                    {...register("website")}
                    placeholder="https://www.example.com"
                    className={`h-[43px] border rounded-lg px-3 
                       text-[#081021] font-semibold text-sm sm:text-base outline-none ${
                         errors.website ? "border-red-500" : "border-[#CBD5E1]"
                       }`}
                  />
                  {errors.website && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      {errors.website.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-[#64748B] font-[Poppins] font-medium text-sm sm:text-base">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`h-[43px] border rounded-lg px-3 
                       text-[#081021] font-semibold text-sm sm:text-base outline-none ${
                         errors.email ? "border-red-500" : "border-[#CBD5E1]"
                       }`}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              {/* ---------------- ABOUT ---------------- */}
              <div className="w-full flex flex-col gap-1.5">
                <label className="text-[#64748B] font-[Poppins] font-medium text-sm sm:text-base">
                  About <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("about")}
                  className={`min-h-[94px] border rounded-lg p-3 text-[#081021] 
                     font-semibold text-sm sm:text-base leading-[26px] outline-none resize-none ${
                       errors.about ? "border-red-500" : "border-[#CBD5E1]"
                     }`}
                />
                {errors.about && (
                  <span className="text-red-500 text-xs sm:text-sm">
                    {errors.about.message}
                  </span>
                )}
              </div>

              {/* ---------------- LOGO UPLOAD ---------------- */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[#64748B] font-[Poppins] font-medium text-sm sm:text-base">
                  Logo
                </label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Controller
                    name="logo"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <label
                        className={`w-[82px] h-[82px] bg-white rounded-full 
               flex items-center justify-center overflow-hidden relative ${
                 isUploadingLogo ? "cursor-wait" : "cursor-pointer"
               }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='61' ry='61' stroke='%23D5D5D5' stroke-width='1' stroke-dasharray='12%2c12' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
                        }}
                      >
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

                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setLogoPreview(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);

                                  const formData = new FormData();
                                  formData.append("file", file);

                                  try {
                                    const response = await UploadDirectoryLogo(
                                      formData
                                    );

                                    if (response?.success?.status) {
                                      if (response?.data?.logo_url) {
                                        setLogoUrl(response.data.logo_url);
                                        setLogoPreview(response.data.logo_url);
                                      }
                                      showToast({
                                        message:
                                          response?.success?.message ||
                                          "Logo uploaded successfully",
                                        type: "success",
                                        duration: 5000,
                                      });
                                      onChange(e.target.files);
                                    } else {
                                      setLogoPreview(logoUrl);
                                      showToast({
                                        message:
                                          response?.error?.message ||
                                          "Failed to upload logo",
                                        type: "error",
                                        duration: 5000,
                                      });
                                    }
                                  } catch (error: any) {
                                    setLogoPreview(logoUrl);
                                    showToast({
                                      message:
                                        error?.response?.error?.message ||
                                        "Failed to upload logo",
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
                              <span className="text-[#7077FE] text-2xl">
                                <img
                                  src="/image_upload.png"
                                  className="h-[26px]"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </label>
                    )}
                  />

                  <div className="flex flex-col gap-2">
                    <span className="text-[#7077FE] font-semibold text-[16px] leading-[15px] tracking-normal font-['Open_Sans'] cursor-pointer">
                      Upload your logo here
                    </span>
                    <span className="text-[#64748B] text-[14px] leading-[15px] tracking-normal font-normal font-['Open_Sans']">
                      Accepted file types: .jpg, .jpeg, .png
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <div className="w-full bg-white border border-[#F7F7F7] rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg sm:text-xl">
              Photos
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Display existing photos */}
            {photoPreviews.map((preview, index) => {
              const photo = photos[index];
              const photoId = photo?.id;
              const isEditing = editingPhotoId === photoId;
              const isDeleting = deletingPhotoId === photoId;

              return (
                <div
                  key={photoId || index}
                  className="w-full h-[184px] bg-[#F8F0F0] rounded-lg relative overflow-hidden"
                >
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
                      <SquarePen className="w-4 h-4" />
                    </div>

                    {/* DELETE ICON */}
                    <div
                      className="w-9 h-9 flex items-center justify-center cursor-pointer bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        if (photoId) {
                          setDeleteConfirmation({
                            isOpen: true,
                            photoId: photoId,
                            photoIndex: index,
                          });
                        }
                      }}
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
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
                          if (e.target) {
                            e.target.value = "";
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
              <div
                className="w-full h-[184px] bg-white border-2 border-dashed border-[#D5D5D5] 
      rounded-lg flex flex-col items-center justify-center gap-2"
              >
                <div className="w-8 h-8 border-4 border-[#7077FE] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[#7077FE] font-semibold text-xs">
                  Uploading...
                </span>
              </div>
            ) : (
              <div
                className="w-full h-[184px] bg-white 
      rounded-lg flex flex-col items-center justify-center 
      gap-1 cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23D5D5D5' stroke-width='1' stroke-dasharray='6%2c6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                }}
                onClick={handleAddPhotoClick}
              >
                <div className="w-5 h-5">
                  <CirclePlus size={20} color="#7077FE" />
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[#7077FE] font-semibold text-xs">
                    Add image
                  </span>
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
                  await handlePhotoUpload(files);
                  if (e.target) {
                    e.target.value = "";
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Operating Hours Section */}
        <div className="w-full bg-white rounded-xl p-4 sm:p-6">
          <h2 className="text-[#081021] font-semibold text-lg sm:text-xl mb-4">
            Operations Information
          </h2>

          <div className="my-4">
            <div className="flex items-center mb-2">
              <Clock fill="#D9D9D9" className="h-4.5 w-4.5 text-white me-2" />
              <div className="font-semibold text-[#081021] text-sm sm:text-base">
                Opens with main hours
              </div>
            </div>
            <div>
              <div className="font-semibold text-[#081021] text-xs">Hours</div>
              <div className="text-[#64748B] text-sm">
                Set main business hours or mark your business as closed
              </div>
            </div>
          </div>

          {/* =================== RADIO BUTTONS =================== */}
          <div className="flex flex-col gap-3 mb-6">
            {/* Opens with main hours */}
            <div
              className="flex items-start gap-2 cursor-pointer"
              onClick={() =>
                setValue("operationMode", "main", { shouldValidate: true })
              }
            >
              <div
                className={`w-4 h-4 rounded-full border-5 mt-1
                 ${
                   mode === "main"
                     ? "border-[#7077FE] bg-white"
                     : "border-gray-300 bg-white group-hover:border-gray-400"
                 }`}
              ></div>
              <div>
                <div className="font-semibold text-[#081021] text-sm">
                  Opens with main hours
                </div>
                <div className="text-[#64748B] text-xs sm:text-sm">
                  Show when your business is open
                </div>
              </div>
            </div>

            {/* Temporary closed */}
            <div
              className="flex items-start gap-2 cursor-pointer"
              onClick={() =>
                setValue("operationMode", "temporary", { shouldValidate: true })
              }
            >
              <div
                className={`w-4 h-4 rounded-full border-5 mt-1
                ${
                  mode === "temporary"
                    ? "border-[#7077FE] bg-white"
                    : "border-gray-300 bg-white group-hover:border-gray-400"
                }`}
              ></div>
              <div>
                <div className="font-semibold text-[#081021] text-sm sm:text-base">
                  Temporary closed
                </div>
                <div className="text-[#64748B] text-xs sm:text-sm">
                  Show your business will open again
                </div>
              </div>
            </div>

            {/* Permanently closed */}
            <div
              className="flex items-start gap-2 cursor-pointer"
              onClick={() =>
                setValue("operationMode", "permanent", { shouldValidate: true })
              }
            >
              <div
                className={`w-4 h-4 rounded-full border-5 mt-1
                ${
                  mode === "permanent"
                    ? "border-[#7077FE] bg-white"
                    : "border-gray-300 bg-white group-hover:border-gray-400"
                }`}
              ></div>
              <div>
                <div className="font-semibold text-[#081021] text-sm sm:text-base">
                  Permanently closed
                </div>
                <div className="text-[#64748B] text-xs sm:text-sm">
                  Your business no longer exists
                </div>
              </div>
            </div>
          </div>

          {/* =================== CONDITIONAL SECTION =================== */}

          {mode === "main" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 lg:gap-x-2 gap-y-6 sm:gap-y-8 2xl:gap-y-12">
              {days.map((day, index) => {
                const colPosition = index % 3;
                return (
                  <div
                    key={index}
                    className={`
                    ${colPosition === 0 ? "2xl:justify-self-start" : ""}
                    ${colPosition === 1 ? "2xl:justify-self-center" : ""}
                    ${colPosition === 2 ? "2xl:justify-self-end" : ""}
                  `}
                  >
                    <div className="flex flex-col gap-1">
                      {/* TOP ROW: Day Name + Labels */}
                      <div className="flex justify-start">
                        <span className="text-[14px] font-['open_sans'] font-semibold text-[#081021] w-20 sm:w-24 shrink-0">
                          {day.name}
                        </span>
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="text-[14px] font-['open_sans'] text-[#64748B] w-[100px] lg:w-[120px]">
                            Open at
                          </span>
                          <span className="text-[14px] font-['open_sans'] text-[#64748B] w-[100px] lg:w-[120px]">
                            Closes at
                          </span>
                        </div>
                      </div>
                      {/* SECOND ROW: Checkbox + Inputs */}
                      <div className="flex justify-start">
                        <div className="flex items-center gap-2 w-20 sm:w-24 shrink-0">
                          <input
                            id={`day-${index}`}
                            type="checkbox"
                            checked={day.isOpen}
                            onChange={() => toggleDay(index)}
                            className="w-4 h-4 accent-[#7077FE] shrink-0"
                          />
                          <label
                            htmlFor={`day-${index}`}
                            className="text-[12px] font-['open_sans'] text-[#64748B] cursor-pointer"
                          >
                            {day.isOpen ? "Open" : "Closed"}
                          </label>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <div className="flex items-center gap-1 w-full sm:w-auto">
                            <span className="sm:hidden text-xs text-[#64748B] w-12 shrink-0">
                              Open:
                            </span>
                            <input
                              type="time"
                              value={day.openTime}
                              disabled={!day.isOpen}
                              onChange={(e) =>
                                updateTime(index, "openTime", e.target.value)
                              }
                              className={`border border-[#CBD5E1] rounded-lg px-2 py-1 w-full sm:w-[100px] lg:w-[120px] text-sm ${
                                !day.isOpen
                                  ? "bg-gray-200 opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-1 w-full sm:w-auto">
                            <span className="sm:hidden text-xs text-[#64748B] w-12 shrink-0">
                              Close:
                            </span>
                            <input
                              type="time"
                              value={day.closeTime}
                              disabled={!day.isOpen}
                              onChange={(e) =>
                                updateTime(index, "closeTime", e.target.value)
                              }
                              className={`border border-[#CBD5E1] rounded-lg px-2 py-1 w-full sm:w-[100px] lg:w-[120px] text-sm ${
                                !day.isOpen
                                  ? "bg-gray-200 opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ----------- 2. TEMPORARY CLOSED ----------- */}
          {mode === "temporary" && (
            <div className="flex items-center">
              <p className="me-6 text-[#081021] text-[14px] ">Date</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm text-[#64748B]">
                    Start Date
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("temporaryStartDate")}
                      className={`border h-[43px] rounded-lg px-2 py-2 sm:py-1 text-sm w-full appearance-none
              [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden
              [&::-webkit-clear-button]:hidden [&::-webkit-datetime-edit-ampm-field]:hidden
              ${
                errors.temporaryStartDate
                  ? "border-red-500"
                  : "border-[#CBD5E1]"
              }`}
                    />
                    {/* Custom Calendar Icon - Clickable */}
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer bg-transparent border-none p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        if (input && input.type === "date") {
                          input.showPicker();
                        }
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#64748B]"
                      >
                        <path
                          d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.6949 13.7H15.7039M15.6949 16.7H15.7039M11.995 13.7H12.004M11.995 16.7H12.004M8.29431 13.7H8.30329M8.29431 16.7H8.30329"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {errors.temporaryStartDate && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      {errors.temporaryStartDate.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm text-[#64748B]">
                    End Date
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("temporaryEndDate")}
                      className={`border h-[43px] rounded-lg px-2 py-2 sm:py-1 text-sm w-full appearance-none
              [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden
              [&::-webkit-clear-button]:hidden [&::-webkit-datetime-edit-ampm-field]:hidden
              ${
                errors.temporaryEndDate ? "border-red-500" : "border-[#CBD5E1]"
              }`}
                    />
                    {/* Custom Calendar Icon - Clickable */}
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer bg-transparent border-none p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        if (input && input.type === "date") {
                          input.showPicker();
                        }
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#64748B]"
                      >
                        <path
                          d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.6949 13.7H15.7039M15.6949 16.7H15.7039M11.995 13.7H12.004M11.995 16.7H12.004M8.29431 13.7H8.30329M8.29431 16.7H8.30329"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {errors.temporaryEndDate && (
                    <span className="text-red-500 text-xs sm:text-sm">
                      {errors.temporaryEndDate.message}
                    </span>
                  )}
                </div>
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

        {/* Reviews Section */}
        <div className="w-full bg-white rounded-xl p-4">
          <div className="bg-white">
            <h2 className="text-[#081021] font-[Poppins] font-semibold text-lg sm:text-xl my-4">
              All Reviews
            </h2>

            {loadingReviews ? (
              <div className="text-center py-8 text-[#64748B]">
                Loading reviews...
              </div>
            ) : reviews.length > 0 ? (
              <div
                className="space-y-5 max-h-[800px] overflow-y-auto"
                onScroll={(e) => {
                  const target = e.target as HTMLElement;
                  const scrollBottom =
                    target.scrollHeight -
                    target.scrollTop -
                    target.clientHeight;
                  if (
                    scrollBottom < 100 &&
                    reviewsPagination.hasMore &&
                    !reviewsPagination.loadingMore
                  ) {
                    loadMoreReviews();
                  }
                }}
              >
                {reviews.map((review: any) => {
                  const reviewDate = review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "";

                  return (
                    <div
                      key={review.id}
                      className="bg-[#F9F9F9] rounded-lg p-4 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-stretch gap-2.5">
                        <div className="flex-1 flex flex-col justify-center gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* {review.profile?.profile_picture && (
                              <img
                                src={review.profile.profile_picture}
                                alt={`${review.profile.first_name} ${review.profile.last_name}`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )} */}
                            <span className="text-black font-[Poppins] font-semibold text-sm sm:text-base">
                              {`${review.profile?.first_name || ""} ${
                                review.profile?.last_name || ""
                              }`.trim() || "Anonymous"}
                            </span>
                            <div className="hidden sm:block w-1.5 h-1.5 bg-[#A1A1A1] rounded-full"></div>
                            <span className="text-[#A1A1A1] text-[12px] font-['open_sans']">
                              {reviewDate}
                            </span>
                            {/* {review.is_my_review && (
                              <>
                                <div className="hidden sm:block w-1.5 h-1.5 bg-[#A1A1A1] rounded-full"></div>
                                <span className="text-[#7077FE] text-[12px] font-['open_sans']">
                                  Your review
                                </span>
                              </>
                            )} */}
                          </div>

                          {/* Rating */}
                          {/* {editingReviewId !== review.id ? (
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-[#FACC15] fill-[#FACC15]"
                                      : "text-[#94A3B8]"
                                  }`}
                                  strokeWidth={1.2}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    setEditReviewRating((prev) => ({
                                      ...prev,
                                      [review.id]: star,
                                    }))
                                  }
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <=
                                      (editReviewRating[review.id] ||
                                        review.rating)
                                        ? "text-[#FACC15] fill-[#FACC15]"
                                        : "text-[#94A3B8]"
                                    }`}
                                    strokeWidth={1.2}
                                  />
                                </button>
                              ))}
                            </div>
                          )} */}

                          {/* Edit Mode or Display Mode */}
                          {editingReviewId === review.id ? (
                            <div className="space-y-2">
                              <textarea
                                className="w-full outline-none resize-none font-['open_sans'] text-[#1E1E1E] bg-transparent border border-[#E0E0E0] rounded-lg p-3 text-xs sm:text-[12px]"
                                placeholder="Edit your review..."
                                value={editReviewText[review.id] || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value.length <= 2000) {
                                    setEditReviewText((prev) => ({
                                      ...prev,
                                      [review.id]: value,
                                    }));
                                  }
                                }}
                                rows={4}
                              />
                              <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-3">
                                <span className="font-['open_sans'] text-[#8A8A8A] text-xs">
                                  {2000 -
                                    (editReviewText[review.id]?.length ||
                                      0)}{" "}
                                  Characters remaining
                                </span>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCancelEditReview(review.id)
                                    }
                                    className="px-4 py-2 rounded-full font-[Poppins] font-medium text-sm text-[#64748B] hover:bg-gray-100"
                                    disabled={submittingEditReview[review.id]}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateReview(review.id)
                                    }
                                    disabled={
                                      submittingEditReview[review.id] ||
                                      !editReviewText[review.id]?.trim()
                                    }
                                    className="bg-linear-to-r from-[#7077FE] to-[#F07EFF] text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {submittingEditReview[review.id]
                                      ? "Updating..."
                                      : "Update"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[#1E1E1E] text-xs sm:text-[12px] font-['open_sans'] leading-[20.4px]">
                              {review.description}
                            </p>
                          )}
                        </div>
                        {/* Edit Button for Parent Review */}
                        {review.is_my_review &&
                          editingReviewId !== review.id && (
                            <button
                              type="button"
                              onClick={() =>
                                handleEditReview(
                                  review.id,
                                  review.description,
                                  review.rating
                                )
                              }
                              className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs self-start sm:self-start"
                            >
                              Edit
                            </button>
                          )}
                      </div>

                      {/* Like / Reply Section */}
                      {editingReviewId !== review.id && (
                        <div className="flex items-center gap-2.5 p-2.5">
                          {/* Like Icon */}
                          <button
                            type="button"
                            onClick={() => handleLikeReview(review.id)}
                            className={`w-6 h-6 flex items-center justify-center ${
                              review.is_liked
                                ? "text-[#7077FE]"
                                : "text-[#1E1E1E]"
                            }`}
                          >
                            {review.is_liked ? (
                              <img
                                src="https://static.codia.ai/image/2025-12-04/e6MiVoWVJn.png"
                                alt="Like"
                                className="w-full h-full"
                              />
                            ) : (
                              <img
                                src="https://static.codia.ai/image/2025-12-04/V3hCQqvhhk.png"
                                alt="Like"
                                className="w-full h-full"
                              />
                            )}
                            {review.likes_count > 0 && (
                              <span className="ml-1 text-[#1E1E1E] text-xs font-['open_sans']">
                                {review.likes_count}
                              </span>
                            )}
                          </button>
                          <div className="w-px h-5 bg-[#E0E0E0]"></div>
                          {/* Reply Button */}
                          <button
                            type="button"
                            onClick={() => toggleReplyInput(review.id)}
                            className="flex items-center gap-1 bg-transparent rounded-full px-2.5 py-1.5"
                          >
                            <div className="w-6 h-6">
                              <img
                                src="https://static.codia.ai/image/2025-12-04/0jQyhLuXK4.png"
                                alt="Reply"
                                className="w-full h-full"
                              />
                            </div>
                            <span className="text-[#222224] text-xs leading-[26.4px]">
                              Reply{" "}
                              {review.reply_count > 0 &&
                                `(${review.reply_count})`}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Reply Input Section */}
                      {openReplyInputs.has(review.id) && (
                        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4 sm:p-5 max-w-[700px]">
                          <textarea
                            className="w-full outline-none resize-none font-['open_sans'] text-[#8A8A8A] bg-transparent text-sm sm:text-base leading-[35.2px]"
                            placeholder="Reply a comment..."
                            value={replyTexts[review.id] || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 2000) {
                                setReplyTexts((prev) => ({
                                  ...prev,
                                  [review.id]: value,
                                }));
                              }
                            }}
                            rows={3}
                          />
                          <div className="flex justify-end">
                            <div className="flex items-center">
                              <div className="flex flex-col sm:flex-row items-end gap-3 p-1">
                                <div className="bg-white rounded-full px-3 py-2">
                                  <span className="text-[#8A8A8A] text-xs text-center">
                                    {2000 -
                                      (replyTexts[review.id]?.length || 0)}{" "}
                                    Characters remaining
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => toggleReplyInput(review.id)}
                                    className="px-4 py-2 rounded-full font-[Poppins] font-medium text-sm text-[#64748B] hover:bg-gray-100"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSubmitReply(review.id)}
                                    disabled={
                                      submittingReply[review.id] ||
                                      !replyTexts[review.id]?.trim()
                                    }
                                    className="bg-linear-to-r from-[#7077FE] to-[#F07EFF] rounded-full px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <span className="text-white font-semibold text-sm sm:text-base text-center">
                                      {submittingReply[review.id]
                                        ? "Submitting..."
                                        : "Submit"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Child Reviews (Replies) */}
                      {openReplyInputs.has(review.id) && (
                        <div className="space-y-3">
                          <div
                            className="space-y-3 max-h-[600px] overflow-y-auto"
                            onScroll={(e) => {
                              const target = e.target as HTMLElement;
                              const scrollBottom =
                                target.scrollHeight -
                                target.scrollTop -
                                target.clientHeight;
                              if (
                                scrollBottom < 100 &&
                                pagination[review.id]?.hasMore &&
                                !pagination[review.id]?.loadingMore
                              ) {
                                loadMoreChildReviews(review.id);
                              }
                            }}
                          >
                            {loadingChildReviews[review.id] ? (
                              <div className="text-center py-4 text-[#64748B] text-xs">
                                Loading replies...
                              </div>
                            ) : childReviews[review.id] &&
                              childReviews[review.id].length > 0 ? (
                              <>
                                {childReviews[review.id].map(
                                  (childReview: any) => {
                                    const childReviewDate =
                                      childReview.createdAt
                                        ? new Date(
                                            childReview.createdAt
                                          ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })
                                        : "";

                                    return (
                                      <div
                                        key={childReview.id}
                                        className="bg-[#F9F9F9] rounded-lg p-4 space-y-3"
                                      >
                                        <div className="flex flex-col sm:flex-row sm:justify-stretch sm:items-stretch">
                                          <div className="flex-1 flex flex-col justify-center gap-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                              {childReview.profile
                                                ?.profile_picture && (
                                                <img
                                                  src={
                                                    childReview.profile
                                                      .profile_picture
                                                  }
                                                  alt={`${childReview.profile.first_name} ${childReview.profile.last_name}`}
                                                  className="w-6 h-6 rounded-full object-cover"
                                                />
                                              )}
                                              <span className="text-black font-[Poppins] font-semibold text-sm sm:text-base">
                                                {`${
                                                  childReview.profile
                                                    ?.first_name || ""
                                                } ${
                                                  childReview.profile
                                                    ?.last_name || ""
                                                }`.trim() || "Anonymous"}
                                              </span>
                                              <div className="hidden sm:block w-1.5 h-1.5 bg-[#A1A1A1] rounded-full"></div>
                                              <span className="text-[#A1A1A1] text-[12px] font-['open_sans']">
                                                {childReviewDate}
                                              </span>
                                            </div>

                                            {/* Edit Mode or Display Mode */}
                                            {editingReplyId ===
                                            childReview.id ? (
                                              <div className="space-y-2">
                                                <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4 sm:p-5 space-y-2.5">
                                                  <textarea
                                                    className="w-full outline-none resize-none font-['open_sans'] text-[#8A8A8A] bg-transparent text-sm sm:text-base leading-[35.2px]"
                                                    placeholder="Edit your reply..."
                                                    value={
                                                      editReplyTexts[
                                                        childReview.id
                                                      ] || ""
                                                    }
                                                    onChange={(e) => {
                                                      const value =
                                                        e.target.value;
                                                      if (
                                                        value.length <= 2000
                                                      ) {
                                                        setEditReplyTexts(
                                                          (prev) => ({
                                                            ...prev,
                                                            [childReview.id]:
                                                              value,
                                                          })
                                                        );
                                                      }
                                                    }}
                                                    rows={3}
                                                  />
                                                  <div className="flex justify-end">
                                                    <div className="flex items-center">
                                                      <div className="flex flex-col sm:flex-row items-end gap-3 p-1">
                                                        <div className="bg-white rounded-full px-3 py-2">
                                                          <span className="text-[#8A8A8A] text-xs text-center">
                                                            {2000 -
                                                              (editReplyTexts[
                                                                childReview.id
                                                              ]?.length ||
                                                                0)}{" "}
                                                            Characters remaining
                                                          </span>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              handleCancelEdit(
                                                                childReview.id
                                                              )
                                                            }
                                                            className="px-4 py-2 rounded-full font-[Poppins] font-medium text-sm text-[#64748B] hover:bg-gray-100"
                                                            disabled={
                                                              submittingEditReply[
                                                                childReview.id
                                                              ]
                                                            }
                                                          >
                                                            Cancel
                                                          </button>
                                                          <button
                                                            type="button"
                                                            onClick={() =>
                                                              handleUpdateReply(
                                                                review.id,
                                                                childReview.id
                                                              )
                                                            }
                                                            disabled={
                                                              submittingEditReply[
                                                                childReview.id
                                                              ] ||
                                                              !editReplyTexts[
                                                                childReview.id
                                                              ]?.trim()
                                                            }
                                                            className="bg-linear-to-r from-[#7077FE] to-[#F07EFF] rounded-full px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                          >
                                                            <span className="text-white font-semibold text-sm sm:text-base text-center">
                                                              {submittingEditReply[
                                                                childReview.id
                                                              ]
                                                                ? "Updating..."
                                                                : "Update"}
                                                            </span>
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <p className="text-[#1E1E1E] text-xs sm:text-[12px] font-['open_sans'] leading-[20.4px]">
                                                {childReview.text ||
                                                  childReview.description}
                                              </p>
                                            )}
                                          </div>
                                          {/* Edit/Delete Buttons */}
                                          {childReview.is_my_reply &&
                                            editingReplyId !==
                                              childReview.id && (
                                              <div className="flex items-center space-x-2 self-start mt-2 sm:mt-0">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleEditReply(
                                                      childReview.id,
                                                      childReview.text ||
                                                        childReview.description
                                                    )
                                                  }
                                                  className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs"
                                                  disabled={
                                                    deletingReply[
                                                      childReview.id
                                                    ]
                                                  }
                                                >
                                                  Edit
                                                </button>
                                                <span className="text-[#E0E0E0]">
                                                  |
                                                </span>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeleteReply(
                                                      review.id,
                                                      childReview.id
                                                    )
                                                  }
                                                  className="text-[#EF4444] hover:text-[#DC2626] font-['open_sans'] text-xs"
                                                  disabled={
                                                    deletingReply[
                                                      childReview.id
                                                    ]
                                                  }
                                                >
                                                  {deletingReply[childReview.id]
                                                    ? "Deleting..."
                                                    : "Delete"}
                                                </button>
                                              </div>
                                            )}
                                        </div>

                                        {/* Like Button for Child Review */}
                                        {editingReplyId !== childReview.id && (
                                          <div className="flex items-center gap-2.5 p-2.5">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleLikeReply(
                                                  review.id,
                                                  childReview.id
                                                )
                                              }
                                              className={`w-6 h-6 flex items-center justify-center ${
                                                childReview.is_liked
                                                  ? "text-[#7077FE]"
                                                  : "text-[#1E1E1E]"
                                              }`}
                                            >
                                              {childReview.is_liked ? (
                                                <img
                                                  src="https://static.codia.ai/image/2025-12-04/e6MiVoWVJn.png"
                                                  alt="Like"
                                                  className="w-full h-full"
                                                />
                                              ) : (
                                                <img
                                                  src="https://static.codia.ai/image/2025-12-04/V3hCQqvhhk.png"
                                                  alt="Like"
                                                  className="w-full h-full"
                                                />
                                              )}
                                              {childReview.likes_count > 0 && (
                                                <span className="ml-1 text-[#1E1E1E] text-xs font-['open_sans']">
                                                  {childReview.likes_count}
                                                </span>
                                              )}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                                {/* Load More Indicator */}
                                {pagination[review.id]?.loadingMore && (
                                  <div className="text-center py-4 text-[#64748B] text-xs">
                                    Loading more replies...
                                  </div>
                                )}
                                {pagination[review.id]?.hasMore &&
                                  !pagination[review.id]?.loadingMore && (
                                    <div className="text-center py-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          loadMoreChildReviews(review.id)
                                        }
                                        className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs"
                                      >
                                        Load more replies
                                      </button>
                                    </div>
                                  )}
                              </>
                            ) : (
                              <div className="text-center py-2 text-[#64748B] text-xs">
                                No replies yet
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Load More Indicator for Parent Reviews */}
                {reviewsPagination.loadingMore && (
                  <div className="text-center py-4 text-[#64748B] text-xs">
                    Loading more reviews...
                  </div>
                )}
                {reviewsPagination.hasMore &&
                  !reviewsPagination.loadingMore && (
                    <div className="text-center py-2">
                      <button
                        type="button"
                        onClick={loadMoreReviews}
                        className="text-[#7077FE] hover:text-[#5a61e8] font-['open_sans'] text-xs"
                      >
                        Load more reviews
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-center py-8 text-[#64748B]">
                No reviews yet
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 self-end w-full sm:w-auto">
          <button
            type="button"
            onClick={() => publicProfileForm.reset()}
            className="bg-white shadow-sm rounded-full px-5 py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="text-[#081021] font-Rubik leading-[16.59px] text-sm sm:text-base">
              Cancel
            </span>
          </button>

          {/* <button
            type="button"
            onClick={() => {
              publicProfileForm.trigger().then((isValid) => {
                if (isValid) {
                  const data = publicProfileForm.getValues();
                  console.log("Preview data:", data);
                }
              });
            }}
            className="bg-white shadow-sm rounded-full px-5 py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="text-[#081021] font-Rubik leading-[16.59px] text-sm sm:text-base">
              Preview
            </span>
          </button> */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#7077FE] shadow-sm rounded-full px-6 py-3 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white font-Rubik leading-[16.59px] text-sm sm:text-base">
                  Saving...
                </span>
              </>
            ) : (
              <span className="text-white font-Rubik leading-[16.59px] text-sm sm:text-base">
                Save
              </span>
            )}
          </button>
        </div>
      </form>
      {deleteConfirmation.isOpen && (
        <Modal
          isOpen={deleteConfirmation.isOpen}
          onClose={() =>
            setDeleteConfirmation({
              isOpen: false,
              photoId: null,
              photoIndex: null,
            })
          }
        >
          <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this photo? This action cannot be
              undone.
            </p>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                onClick={() =>
                  setDeleteConfirmation({
                    isOpen: false,
                    photoId: null,
                    photoIndex: null,
                  })
                }
                className="rounded-full text-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300 px-6 py-4 text-[18px] font-[Plus_Jakarta_Sans] font-medium w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  if (deleteConfirmation.photoId) {
                    await handlePhotoDelete(deleteConfirmation.photoId);
                    setDeleteConfirmation({
                      isOpen: false,
                      photoId: null,
                      photoIndex: null,
                    });
                  }
                }}
                className="transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden cursor-pointer flex justify-center items-center gap-[7px] rounded-full bg-[#7077FE] text-white text-[18px] font-[Plus_Jakarta_Sans] font-medium w-full sm:w-auto py-2 px-6 sm:py-3 sm:px-8"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default EditDirectory;
