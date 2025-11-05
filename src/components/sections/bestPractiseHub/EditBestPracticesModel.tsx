import cloud from "../../../assets/cloud-add.svg";
import Button from "../../ui/Button";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Base64 upload adapter (same as in AddBestPracticeModal)
class Base64UploadAdapter {
  private loader: any;
  private reader: FileReader;

  constructor(loader: any) {
    this.loader = loader;
    this.reader = new FileReader();
  }

  upload() {
    return new Promise((resolve, reject) => {
      this.reader.addEventListener('load', () => {
        resolve({ default: this.reader.result });
      });

      this.reader.addEventListener('error', err => {
        reject(err);
      });

      this.reader.addEventListener('abort', () => {
        reject();
      });

      this.loader.file.then((file: File) => {
        this.reader.readAsDataURL(file);
      });
    });
  }

  abort() {
    this.reader.abort();
  }
}

function Base64UploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new Base64UploadAdapter(loader);
  };
}

const editorConfig = {
  extraPlugins: [Base64UploadAdapterPlugin],
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "subscript",
      "superscript",
      "code",
      "|",
      "fontSize",
      "fontFamily",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "alignment",
      "|",
      "link",
      "insertImage",
      "mediaEmbed",
      "insertTable",
      "blockQuote",
      "codeBlock",
      "|",
      "bulletedList",
      "numberedList",
      "todoList",
      "|",
      "outdent",
      "indent",
      "|",
      "specialCharacters",
      "horizontalLine",
      "|",
      "removeFormat",
      "highlight",
      "|",
      "undo",
      "redo",
    ],
    shouldNotGroupWhenFull: false,
  },
  fontFamily: {
    options: [
      "default",
      "Arial, Helvetica, sans-serif",
      "Courier New, Courier, monospace",
      "Georgia, serif",
      "Times New Roman, Times, serif",
      "Trebuchet MS, Helvetica, sans-serif",
      "Verdana, Geneva, sans-serif",
    ],
    supportAllValues: true,
  },
  fontSize: {
    options: [10, 12, 14, "default", 18, 20, 22, 24],
    supportAllValues: true,
  },
  placeholder: "Add your description here...",
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
  },
  image: {
    toolbar: [
      'imageTextAlternative',
      'toggleImageCaption',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side'
    ]
  }
};

interface EditBestPracticeModalProps {
  open: boolean;
  onClose: () => void;
  currentPractice: any;
  setCurrentPractice: (value: any) => void;
  profession: Array<{ id: string; title: string }>;
  interest: Array<{ id: string; name: string }>;
  tags: string[];
  editInputValue: string;
  setEditInputValue: React.Dispatch<React.SetStateAction<string>>;
  removeTag: (idx: number) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export default function EditBestPracticeModal({
  open,
  onClose,
  currentPractice,
  setCurrentPractice,
  profession,
  interest,
  tags,
  editInputValue,
  setEditInputValue,
  removeTag,
  handleTagKeyDown,
  handleFileChange,
  handleSubmit,
  isSubmitting,
}: EditBestPracticeModalProps) {

  // Create object URL for image preview
  const imagePreviewUrl = currentPractice?.file 
    ? (typeof currentPractice.file === 'string' 
        ? currentPractice.file 
        : URL.createObjectURL(currentPractice.file))
    : null;

  const handleRemoveImage = () => {
    // Clear the file input
    const fileInput = document.getElementById('editUploadFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    // Remove file from current practice
    setCurrentPractice({
      ...currentPractice,
      file: null,
    });
    
    // Clean up object URL if it was created from a new file
    if (currentPractice?.file && typeof currentPractice.file !== 'string') {
      URL.revokeObjectURL(imagePreviewUrl!);
    }
  };

  if (!open) return null;

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
            Edit Best Practice
          </h2>
        </div>

        {/* Upload Section - Conditionally render based on whether file is selected */}
        {!currentPractice?.file ? (
          // Original upload section when no file is selected
          <div className="mt-2 text-center py-6 px-4 rounded-[26px] border-2 border-[#CBD0DC] border-dashed flex flex-col items-center justify-center cursor-pointer mb-6">
            <div className="pb-4 flex flex-col items-center">
              <img src={cloud} alt="Upload" className="w-12" />
              <h4 className="pt-2 text-base font-medium text-[#292D32]">
                Change your image <span className="text-red-600">*</span>
              </h4>
              <h4 className="pt-2 font-normal text-sm text-[#A9ACB4]">
                JPEG, PNG formats, up to 2MB
              </h4>
            </div>

            <div>
              <input
                type="file"
                id="editUploadFile"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label
                htmlFor="editUploadFile"
                className="block px-[33px] py-4 rounded-full text-[#54575C] text-base tracking-wider font-medium border border-[#CBD0DC] outline-none cursor-pointer"
              >
                Browse Files
              </label>
            </div>
          </div>
        ) : (
          // Image preview section when file is selected - Takes full upload section
          <div className="mt-2 rounded-[26px] border-2 border-[#CBD0DC] border-dashed mb-6 relative overflow-hidden">
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

                {/* Hidden file input for change functionality */}
                <input
                  type="file"
                  id="editUploadFile"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {/* Double click instruction (optional) */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200">
                  Double click to change image
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}
        onKeyDown={(e) => {
            // Allow Enter key inside CKEditor only
            const target = e.target as HTMLElement;
            if (target.closest(".ck") && e.key === "Enter") {
              return; // Let CKEditor handle Enter
            }

            // Prevent Enter from submitting in text fields
            if (e.key === "Enter" && target.tagName !== "TEXTAREA") {
              e.preventDefault();
            }
          }}
        className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Title */}
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
                value={currentPractice?.title || ""}
                onChange={(e) =>
                  setCurrentPractice({
                    ...currentPractice,
                    title: e.target.value,
                  })
                }
                placeholder="Enter Title"
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder:text-[#6E7179] placeholder:text-xs placeholder:font-normal"
                required
              />
            </div>

            {/* Category (Interest) */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="interest"
                className="block text-[15px] font-normal text-black"
              >
                Interest
              </label>
              <select
                id="interest"
                value={currentPractice?.interest || ""}
                onChange={(e) =>
                  setCurrentPractice({
                    ...currentPractice,
                    interest: e.target.value,
                  })
                }
                className={`w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 text-sm font-normal
                ${currentPractice?.interest ? "text-black" : "text-[#6E7179]"}`}
              >
                <option value="">Select your Interest</option>
                {interest.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Profession */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="profession"
                className="block text-[15px] font-normal text-black"
              >
                Profession
              </label>

              <div className="relative">
                <select
                  id="profession"
                  value={currentPractice?.profession_data?.id || ""}
                  onChange={(e) =>
                    setCurrentPractice({
                      ...currentPractice,
                      profession: e.target.value,
                    })
                  }
                  className={`w-full appearance-none px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none 
         focus:ring-2 focus:ring-indigo-500 text-sm font-normal
         ${currentPractice?.profession_data ? "text-black" : "text-[#6E7179]"}`}
                >
                  <option value="">Select your Profession</option>
                  {profession.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.title}
                    </option>
                  ))}
                </select>

                {/* custom arrow to match design and keep select box height */}
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7179]"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-[5px]">
              <label
                htmlFor="tags"
                className="block text-[15px] font-normal text-black"
              >
                Tags
              </label>
              <div className="w-full border border-gray-300 bg-white px-3 py-2">
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
                  className="w-full text-sm bg-white focus:outline-none placeholder-gray-400"
                  placeholder="Add tags (e.g. therapy, online, free-consult)"
                  value={editInputValue}
                  onChange={(e) => setEditInputValue(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
            </div>
          </div>

          {/* Description with CKEditor */}
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="description"
              className="block text-[15px] font-normal text-black"
            >
              Description <span className="text-red-600">*</span>
            </label>
            <div className="ckeditor-container">
              <CKEditor
                editor={ClassicEditor as any}
                config={editorConfig}
                data={currentPractice?.description || ""}
                onChange={(_event, editor) => {
                  const data = editor.getData();
                  setCurrentPractice({
                    ...currentPractice,
                    description: data,
                  });
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-[104px] h-[39px] rounded-[100px] p-0 font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}