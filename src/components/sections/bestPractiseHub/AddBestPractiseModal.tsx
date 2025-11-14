import cloud from "../../../assets/cloud-add.svg";
import Button from "../../ui/Button";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState, useEffect } from "react";
import CustomRichTextEditor from "./CustomRichTextEditor";

// Base64 upload adapter
// class Base64UploadAdapter {
//   private loader: any;
//   private reader: FileReader;

//   constructor(loader: any) {
//     this.loader = loader;
//     this.reader = new FileReader();
//   }

//   upload() {
//     return new Promise((resolve, reject) => {
//       this.reader.addEventListener("load", () => {
//         resolve({ default: this.reader.result });
//       });
//       this.reader.addEventListener("error", (err) => reject(err));
//       this.reader.addEventListener("abort", () => reject());
//       this.loader.file.then((file: File) => {
//         this.reader.readAsDataURL(file);
//       });
//     });
//   }

//   abort() {
//     this.reader.abort();
//   }
// }

// function Base64UploadAdapterPlugin(editor: any) {
//   editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
//     return new Base64UploadAdapter(loader);
//   };
// }

// const editorConfig = {
//   extraPlugins: [Base64UploadAdapterPlugin],
//   toolbar: {
//     items: [
//       "bold",
//       "italic",
//       "underline",
//       "strikethrough",
//       "|",
//       "fontSize",
//       "fontFamily",
//       "fontColor",
//       "fontBackgroundColor",
//       "|",
//       "alignment",
//       "|",
//       "link",
//       "insertTable",
//       "blockQuote",
//       "|",
//       "bulletedList",
//       "numberedList",
//       "|",
//       "undo",
//       "redo",
//     ],
//   },
//   fontFamily: {
//     options: [
//       "default",
//       "Arial, Helvetica, sans-serif",
//       "Courier New, Courier, monospace",
//       "Georgia, serif",
//       "Times New Roman, Times, serif",
//       "Trebuchet MS, Helvetica, sans-serif",
//       "Verdana, Geneva, sans-serif",
//     ],
//   },
//   fontSize: {
//     options: [10, 12, 14, "default", 18, 20, 22, 24],
//   },
//   placeholder: "Add your description here...",
//   link: {
//     addTargetToExternalLinks: true,
//     defaultProtocol: "https://",
//   },
//   image: {
//     toolbar: [
//       "imageTextAlternative",
//       "toggleImageCaption",
//       "imageStyle:inline",
//       "imageStyle:block",
//       "imageStyle:side",
//     ],
//   },
// };

interface AddBestPracticeModalProps {
  open: boolean;
  onClose: () => void;
  newPractice: {
    title: string;
    interest: string;
    profession: string;
    file?: File | null;
    description: string;
  };
  profession?: Array<{ id: string; title: string }>;
  interest?: Array<{ id: string; name: string }>;
  tags: string[];
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  removeTag: (idx: number) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleRemoveFile: () => void;
  isSubmitting: boolean;
}

// Validation interface
interface ValidationErrors {
  title?: string;
  file?: string;
  description?: string;
  tags?: string;
  interestOrProfession?: string;
  general?: string;
}

export default function AddBestPracticeModal({
  open,
  onClose,
  newPractice,
  profession,
  interest,
  tags,
  inputValue,
  setInputValue,
  removeTag,
  handleTagKeyDown,
  handleInputChange,
  handleFileChange,
  handleRemoveFile,
  handleSubmit,
  isSubmitting,
}: AddBestPracticeModalProps) {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [touched, setTouched] = useState({
    title: false,
    file: false,
    description: false,
    interestOrProfession: false,
    tags: false,
  });

  // Reset validation when modal opens/closes
  useEffect(() => {
    if (open) {
      setValidationErrors({});
      setTouched({
        title: false,
        file: false,
        description: false,
        interestOrProfession: false,
        tags: false,
      });
    }
  }, [open]);

  // Validation functions
  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (value.trim().length < 3)
          return "Title must be at least 3 characters long";
        if (value.trim().length > 100)
          return "Title must be less than 100 characters";
        return undefined;

      case "file":
        if (!value) return "Image is required";
        if (value) {
          // Check file type
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!allowedTypes.includes(value.type)) {
            return "Only JPEG, JPG, and PNG formats are allowed";
          }
          // Check file size (2MB)
          if (value.size > 2 * 1024 * 1024) {
            return "File size must be less than 2MB";
          }
        }
        return undefined;

      case "description":
        // Remove HTML tags and check for actual content
        const textContent = value.replace(/<[^>]*>/g, "").trim();
        if (!textContent) return "Description is required";
        if (textContent.length < 10)
          return "Description must be at least 10 characters long";
        if (textContent.length > 5000)
          return "Description must be less than 5000 characters";
        return undefined;

      case "interestOrProfession":
        // Check if at least one of interest or profession is selected
        if (!newPractice.interest.trim() && !newPractice.profession.trim()) {
          return "Please select either an Interest or a Profession";
        }
        return undefined;

      case "tags":
        if (tags.length === 0) return "At least one tag is required";
        if (tags.length > 10) return "Maximum 10 tags allowed";
        // Validate individual tags
        for (const tag of tags) {
          if (tag.length < 2)
            return "Each tag must be at least 2 characters long";
          if (tag.length > 20)
            return "Each tag must be less than 20 characters";
          if (!/^[a-zA-Z0-9\s\-_]+$/.test(tag)) {
            return "Tags can only contain letters, numbers, spaces, hyphens, and underscores";
          }
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    errors.title = validateField("title", newPractice.title);
    errors.file = validateField("file", newPractice.file);
    errors.description = validateField("description", newPractice.description);
    errors.interestOrProfession = validateField("interestOrProfession", null); // Pass null since we check both fields
    errors.tags = validateField("tags", tags);

    // Filter out undefined errors
    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([_, value]) => value !== undefined)
    );

    setValidationErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  // Enhanced handleSubmit with validation
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      title: true,
      file: true,
      description: true,
      interestOrProfession: true,
      tags: true,
    });

    if (validateForm()) {
      handleSubmit(e);
    } else {
      // Scroll to first error
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  // Enhanced handleInputChange with validation
  const handleInputChangeWithValidation = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    handleInputChange(e);

    // Validate field on change if it's been touched
    const fieldName = e.target.name;
    if (touched[fieldName as keyof typeof touched]) {
      const error = validateField(fieldName, e.target.value);
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }

    // If interest or profession changes, validate the interestOrProfession field
    if (
      (fieldName === "interest" || fieldName === "profession") &&
      touched.interestOrProfession
    ) {
      const error = validateField("interestOrProfession", null);
      setValidationErrors((prev) => ({
        ...prev,
        interestOrProfession: error,
      }));
    }
  };

  // Enhanced handleFileChange with validation
  const handleFileChangeWithValidation = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileChange(e);

    if (touched.file) {
      const file = e.target.files?.[0];
      const error = validateField("file", file);
      setValidationErrors((prev) => ({
        ...prev,
        file: error,
      }));
    }
  };

  // Handle blur events for validation
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let value: any;
    switch (field) {
      case "title":
        value = newPractice.title;
        break;
      case "file":
        value = newPractice.file;
        break;
      case "description":
        value = newPractice.description;
        break;
      case "interestOrProfession":
        // For interestOrProfession, we don't need a specific value
        value = null;
        break;
      default:
        return;
    }

    const error = validateField(field, value);
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  if (!open) return null;

  // Create object URL for image preview
  const imagePreviewUrl = newPractice.file
    ? URL.createObjectURL(newPractice.file)
    : null;

  const handleRemoveImage = () => {
    // Clear the file input
    const fileInput = document.getElementById(
      "uploadFile1"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    // Call the remove file function
    handleRemoveFile();

    // Clean up object URL
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative z-10 w-full max-w-3xl bg-white rounded-[25px] shadow-lg px-[45px] py-[30px] max-h-[95vh] overflow-y-auto scrollbar-hide">
        {/* Close Button */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-1/2 right-0 -translate-y-1/2 text-2xl text-[#9EA8B6] hover:text-gray-800"
          >
            ✕
          </button>
          <h2 className="text-2xl font-medium text-[32px] text-center mb-6">
            Create New Best Practice
          </h2>
        </div>

        {/* Upload Section - Conditionally render based on whether file is selected */}
        {!newPractice.file ? (
          // Original upload section when no file is selected
          <div
            className={`mt-2 text-center py-6 px-4 rounded-[26px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer mb-4 ${
              validationErrors.file
                ? "border-red-500 bg-red-50"
                : "border-[#CBD0DC]"
            }`}
            data-error={!!validationErrors.file}
          >
            <div className="pb-4 flex flex-col items-center">
              <img src={cloud} alt="Upload" className="w-12" />
              <h4 className="pt-2 text-base font-medium text-[#292D32]">
                Choose your image <span className="text-red-600">*</span>
              </h4>
              <h4 className="pt-2 font-normal text-sm text-[#A9ACB4]">
                JPEG, PNG formats, up to 2MB
              </h4>
            </div>

            <div className="">
              <input
                type="file"
                id="uploadFile1"
                className="hidden"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChangeWithValidation}
                onBlur={() => handleBlur("file")}
              />
              <label
                htmlFor="uploadFile1"
                className="block px-[33px] py-4 rounded-full text-[#54575C] text-base tracking-wider font-medium border border-[#CBD0DC] outline-none cursor-pointer"
              >
                Browse Files
              </label>
            </div>
            {validationErrors.file && (
              <p className="text-red-600 text-sm mt-2">
                {validationErrors.file}
              </p>
            )}
          </div>
        ) : (
          // Image preview section when file is selected - Takes full upload section
          <div
            className={`mt-2 rounded-[26px] border-2 border-dashed mb-4 relative overflow-hidden ${
              validationErrors.file ? "border-red-500" : "border-[#CBD0DC]"
            }`}
            data-error={!!validationErrors.file}
          >
            {/* Image Preview - Full section */}
            {imagePreviewUrl && (
              <div className="relative w-full h-64">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />

                {/* Cross button to remove image */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-xl text-gray-700 hover:text-red-600 transition-all duration-200 shadow-md"
                >
                  ✕
                </button>

                {/* Hidden file input for change functionality on double click */}
                <input
                  type="file"
                  id="uploadFile1"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChangeWithValidation}
                  onBlur={() => handleBlur("file")}
                />

                {/* Double click instruction (optional) */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
                  Double click to change image
                </div>
              </div>
            )}
            {validationErrors.file && (
              <p className="text-red-600 text-sm mt-2 p-2 bg-red-50">
                {validationErrors.file}
              </p>
            )}
          </div>
        )}

        {/* Form Section */}
        <form
          onSubmit={handleFormSubmit}
          onKeyDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest(".ck") && e.key === "Enter") return;
            if (e.key === "Enter" && target.tagName !== "TEXTAREA")
              e.preventDefault();
          }}
          className="space-y-4"
          noValidate
        >
          {/* Title + Interest */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="title"
                className="block text-[15px] font-normal text-black"
              >
                Title of Best Practice <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newPractice.title}
                onChange={handleInputChangeWithValidation}
                onBlur={() => handleBlur("title")}
                placeholder="Enter Title"
                className={`w-full px-[10px] py-3 border rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm ${
                  validationErrors.title
                    ? "border-red-500 bg-red-50"
                    : "border-[#CBD0DC]"
                }`}
                required
                data-error={!!validationErrors.title}
              />
              {validationErrors.title && (
                <p className="text-red-600 text-sm">{validationErrors.title}</p>
              )}
            </div>

            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="interest"
                className="block text-[15px] font-normal text-black"
              >
                Interest
              </label>
              <select
                id="interest"
                name="interest"
                value={newPractice.interest}
                onChange={handleInputChangeWithValidation}
                onBlur={() => handleBlur("interestOrProfession")}
                className={`w-full px-[10px] py-3 border rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.interestOrProfession
                    ? "border-red-500 bg-red-50"
                    : "border-[#CBD0DC]"
                }`}
                data-error={!!validationErrors.interestOrProfession}
              >
                <option value="">Select your Interest</option>
                {interest?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Profession + Tags */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="profession"
                className="block text-[15px] font-normal text-black"
              >
                Profession
              </label>
              <select
                id="profession"
                name="profession"
                value={newPractice.profession}
                onChange={handleInputChangeWithValidation}
                onBlur={() => handleBlur("interestOrProfession")}
                className={`w-full px-[10px] py-3 border rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  validationErrors.interestOrProfession
                    ? "border-red-500 bg-red-50"
                    : "border-[#CBD0DC]"
                }`}
                data-error={!!validationErrors.interestOrProfession}
              >
                <option value="">Select your Profession</option>
                {profession?.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.title}
                  </option>
                ))}
              </select>
              {validationErrors.interestOrProfession && (
                <p className="text-red-600 text-sm">
                  {validationErrors.interestOrProfession}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="tags"
                className="block text-[15px] font-normal text-black"
              >
                Tags <span className="text-red-600">*</span>
              </label>
              <div
                className={`w-full border bg-white px-3 py-2 rounded ${
                  validationErrors.tags
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                data-error={!!validationErrors.tags}
              >
                <div className="flex flex-wrap gap-2 mb-1">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center bg-[#f3f1ff] text-[#6269FF] px-3 py-1 rounded-full text-[13px]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx)}
                        className="ml-1 text-[#6269FF] hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  id="tags"
                  type="text"
                  className={`w-full text-sm bg-white focus:outline-none ${
                    validationErrors.tags
                      ? "placeholder-red-300"
                      : "placeholder-gray-400"
                  }`}
                  placeholder="Add tags (e.g. therapy, online, free-consult)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => setTouched((prev) => ({ ...prev, tags: true }))}
                />
              </div>
              {validationErrors.tags && (
                <p className="text-red-600 text-sm">{validationErrors.tags}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="description"
              className="block text-[15px] font-normal text-black"
            >
              Description <span className="text-red-600">*</span>
            </label>
            <div
              className={`ckeditor-container ${
                validationErrors.description
                  ? "border border-red-500 rounded"
                  : ""
              }`}
              data-error={!!validationErrors.description}
            >
              <CustomRichTextEditor
                value={newPractice.description}
                onChange={(data: any) => {
                  handleInputChange({
                    target: {
                      name: "description",
                      value: data,
                    },
                  } as React.ChangeEvent<HTMLTextAreaElement>);
                  if (touched.description) {
                    const error = validateField("description", data);
                    setValidationErrors((prev) => ({
                      ...prev,
                      description: error,
                    }));
                  }
                }}
                onBlur={() => handleBlur("description")}
                placeholder="Add your description here..."
                error={!!validationErrors.description}
              />
            </div>
            {validationErrors.description && (
              <p className="text-red-600 text-sm">
                {validationErrors.description}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-[104px] h-[39px] rounded-[100px] text-[12px] font-medium flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
