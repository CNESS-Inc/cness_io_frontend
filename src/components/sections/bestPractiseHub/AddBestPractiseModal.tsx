import cloud from "../../../assets/cloud-add.svg";
import Button from "../../ui/Button";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { getCroppedImg } from "../../ui/cropImage";

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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  

  const handleSubmitWithCrop = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (imageSrc && croppedAreaPixels) {
    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
    newPractice.file = croppedFile; // 👈 replace with cropped file
  }

  handleSubmit(e); // call your original submit logic
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
              setImageSrc(reader.result as string); // 👈 displays preview
              handleFileChange(e); // keeps your backend form data logic intact
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      <label
        htmlFor="uploadFile1"
        className="block px-[33px] py-4 rounded-full text-[#54575C] text-base tracking-wider font-medium border border-[#CBD0DC] outline-none cursor-pointer"
      >
        Browse Files
      </label>

      {newPractice.file && (
        <p className="mt-2 text-sm text-gray-700">
          Selected: {newPractice.file.name}
        </p>
      )}
    </>
  ) : (
    <div className="relative w-full h-[300px] bg-gray-100 rounded-[20px] overflow-hidden">
     <Cropper
  image={imageSrc}
  crop={crop}
  zoom={zoom}
  aspect={16 / 5} // Banner aspect ratio
  onCropChange={setCrop}
  onZoomChange={setZoom}
  onCropComplete={onCropComplete}
  zoomWithScroll={true}
  minZoom={0.4} // allow zooming out more
  maxZoom={3}
  restrictPosition={false} // 👈 KEY FIX — allows free dragging
  objectFit="horizontal-cover" // 👈 gives you more space for side images
  showGrid={false}
/>
      {/* Zoom Slider & Reset Button */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 px-3 py-1 rounded-full">
      <input
  type="range"
  min={0.4}
  max={3}
  step={0.05}
  value={zoom}
  onChange={(e) => setZoom(Number(e.target.value))}
  className="w-36"
/>
        <button
          type="button"
          onClick={() => setImageSrc(null)}
          className="text-sm text-red-500 font-medium underline"
        >
          Change Image
        </button>
      </div>
    </div>
  )}
</div>

        {/* Form Section */}
        <form onSubmit={handleSubmitWithCrop} className="space-y-4">
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
                onChange={handleInputChange}
                placeholder="Enter Title"
                className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder:text-[#6E7179] placeholder:text-xs placeholder:font-normal"
                required
              />
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
                onChange={handleInputChange}
                className={`w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 text-sm font-normal
                ${newPractice.interest ? "text-black" : "text-[#6E7179]"}`}
              >
                <option value="">Select your Interest</option>
                {interest &&
                  interest.map((cat) => (
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
                onChange={handleInputChange}
                className={`w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 text-sm font-normal
                ${newPractice.profession ? "text-black" : "text-[#6E7179]"}`}
              >
                <option value="">Select your Profession</option>
                {profession &&
                  profession.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.title}
                    </option>
                  ))}
              </select>
            </div>

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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
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
            <textarea
              id="description"
              name="description"
              rows={3}
              value={newPractice.description}
              onChange={handleInputChange}
              className="w-full px-[10px] py-3 border border-[#CBD0DC] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder:text-[#6E7179] placeholder:text-xs placeholder:font-normal"
              placeholder="Add Notes..."
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-[104px] h-[39px] rounded-[100px] p-0 font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none flex items-center justify-center"
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
