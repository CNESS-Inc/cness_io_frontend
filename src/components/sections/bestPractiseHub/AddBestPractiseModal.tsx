import cloud from "../../../assets/cloud-add.svg";
import Button from "../../ui/Button";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { getCroppedImg } from "../../ui/cropImage";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// Base64 upload adapter
class Base64UploadAdapter {
  private loader: any;
  private reader: FileReader;

  constructor(loader: any) {
    this.loader = loader;
    this.reader = new FileReader();
  }

  upload() {
    return new Promise((resolve, reject) => {
      this.reader.addEventListener("load", () => {
        resolve({ default: this.reader.result });
      });
      this.reader.addEventListener("error", (err) => reject(err));
      this.reader.addEventListener("abort", () => reject());
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
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
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
  },
  fontSize: {
    options: [10, 12, 14, "default", 18, 20, 22, 24],
  },
  placeholder: "Add your description here...",
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
  },
  image: {
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
    ],
  },
};

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
  isSubmitting: boolean;
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
  handleSubmit,
  isSubmitting,
}: AddBestPracticeModalProps) {
  if (!open) return null;

  // 🧠 Local state for image crop/preview
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmitWithCrop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageSrc && croppedAreaPixels) {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      newPractice.file = croppedFile;
    }
    handleSubmit(e);
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

        {/* ✅ Always available hidden file input */}
        <input
          type="file"
          id="uploadFile1"
          className="hidden"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setImageSrc(reader.result as string);
                handleFileChange(e);
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* Upload + Crop Section */}
        <div className="mt-2 text-center py-6 px-4 rounded-[26px] border-2 border-[#CBD0DC] border-dashed flex flex-col items-center justify-center cursor-pointer mb-6">
          {!imageSrc ? (
            <>
              <div className="pb-4 flex flex-col items-center">
                <img src={cloud} alt="Upload" className="w-12" />
                <h4 className="pt-2 text-base font-medium text-[#292D32]">
                  Choose your image <span className="text-red-600">*</span>
                </h4>
                <h4 className="pt-2 font-normal text-sm text-[#A9ACB4]">
                  JPEG, PNG formats, up to 2MB
                </h4>
              </div>

              <label
                htmlFor="uploadFile1"
                className="block px-[33px] py-4 rounded-full text-[#54575C] text-base tracking-wider font-medium border border-[#CBD0DC] outline-none cursor-pointer hover:bg-gray-50"
              >
                Browse Files
              </label>

              {newPractice.file && (
                <p className="mt-2 text-sm text-gray-700">
                  Selected:{" "}
                  {newPractice.file.name.replace(/(\.jpg|\.jpeg|\.png){2,}$/i, "$1")}
                </p>
              )}
            </>
          ) : (
            <div className="relative w-full h-[320px] bg-gray-100 rounded-[20px] overflow-hidden shadow-md">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 5}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                zoomWithScroll
                minZoom={0.4}
                maxZoom={3}
                restrictPosition={false}
                objectFit="cover"
                showGrid={false}
              />
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Zoom</span>
                  <input
                    type="range"
                    min={0.4}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-32 accent-[#6269FF]"
                  />
                </div>
                <div className="hidden sm:block w-px h-5 bg-gray-300" />

                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("uploadFile1") as HTMLInputElement;
                    if (input) input.value = ""; // allow reselecting same file
                    input?.click();
                  }}
                  className="flex items-center gap-2 text-xs font-medium text-[#6269FF] hover:text-[#4E57E0] transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25m0 0L18 7.5m-2.25-2.25L13.5 7.5m4.5 4.5v4.25a2.25 2.25 0 01-2.25 2.25h-9A2.25 2.25 0 014.5 16V8.25A2.25 2.25 0 016.75 6H12"
                    />
                  </svg>
                  Change Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmitWithCrop}
          onKeyDown={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest(".ck") && e.key === "Enter") return;
            if (e.key === "Enter" && target.tagName !== "TEXTAREA")
              e.preventDefault();
          }}
          className="space-y-4"
        >
          {/* Title + Interest */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="title" className="block text-[15px] font-normal text-black">
                Title of Best Practice <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newPractice.title}
                onChange={handleInputChange}
                placeholder="Enter Title"
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <label htmlFor="interest" className="block text-[15px] font-normal text-black">
                Interest
              </label>
              <select
                id="interest"
                name="interest"
                value={newPractice.interest}
                onChange={handleInputChange}
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              <label htmlFor="profession" className="block text-[15px] font-normal text-black">
                Profession
              </label>
              <select
                id="profession"
                name="profession"
                value={newPractice.profession}
                onChange={handleInputChange}
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select your Profession</option>
                {profession?.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-[5px]">
              <label htmlFor="tags" className="block text-[15px] font-normal text-black">
                Tags
              </label>
              <div className="w-full border border-gray-300 bg-white px-3 py-2 rounded">
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="description" className="block text-[15px] font-normal text-black">
              Description <span className="text-red-600">*</span>
            </label>
            <div className="ckeditor-container">
              <CKEditor
                editor={ClassicEditor as any}
                config={editorConfig}
                data={newPractice.description}
                onChange={(_event, editor) => {
                  const data = editor.getData();
                  handleInputChange({
                    target: {
                      name: "description",
                      value: data,
                    },
                  } as React.ChangeEvent<HTMLTextAreaElement>);
                }}
              />
            </div>
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
